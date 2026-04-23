#!/usr/bin/env node
/**
 * Prompt 7 deliverable: one-off generator for the Propharmex company
 * one-pager DOCX. Reads the same content dictionary the /about page reads
 * (apps/web/content/about.ts) so the web page and the printable one-pager
 * never drift.
 *
 * Run once:
 *   pnpm --filter @propharmex/web exec node ../../scripts/about/generate-company-overview-docx.mjs
 *
 * Output:
 *   apps/web/public/downloads/propharmex-company-overview.docx
 *
 * Regeneration policy (per Prompt 7 decision, option A):
 *   The DOCX is generated ONCE and committed to the repo. Re-run this script
 *   only when the ABOUT content dictionary materially changes — then commit
 *   the regenerated binary alongside the content diff.
 *
 * Dependencies (installed on demand by this script):
 *   - docx ^9 (MIT) — declarative DOCX authoring
 *
 * Notes:
 *   - Uses US Letter (12240 x 15840 DXA) with 1" margins.
 *   - Arial for body, bold Arial for headings (universally supported).
 *   - No manual unicode bullets — every list uses docx numbering config per
 *     the skill rules in .claude/skills (see also docx skill guidance).
 *   - Keeps the printable document to a single physical page when possible;
 *     a second page is acceptable if the timeline runs long.
 */
import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tsImport } from "tsx/esm/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..", "..");
const contentPath = resolve(
  repoRoot,
  "apps",
  "web",
  "content",
  "about.ts",
);
const outDir = resolve(repoRoot, "apps", "web", "public", "downloads");
const outPath = resolve(outDir, "propharmex-company-overview.docx");

async function loadContent() {
  // We import the TS content dictionary via tsx's on-the-fly TypeScript
  // loader so the DOCX and the web page read the same source of truth.
  // tsImport expects a specifier (relative path), not a file:// URL —
  // passing the URL bypasses its loader and returns an empty module.
  const specifier = "../../apps/web/content/about.ts";
  const mod = await tsImport(specifier, import.meta.url);
  // tsx transpiles .ts to CJS in a monorepo without "type":"module", so the
  // named exports end up under .default (or .["module.exports"]).
  const exports =
    mod.ABOUT !== undefined
      ? mod
      : (mod.default ?? mod["module.exports"] ?? {});
  if (!exports.ABOUT || !exports.LEADERS) {
    throw new Error(
      `tsImport returned empty exports from ${contentPath}. Top-level keys: ${Object.keys(
        mod,
      ).join(", ") || "(none)"}; unwrapped keys: ${Object.keys(exports).join(", ") || "(none)"}`,
    );
  }
  return { ABOUT: exports.ABOUT, LEADERS: exports.LEADERS };
}

async function main() {
  const { ABOUT, LEADERS } = await loadContent();

  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    LevelFormat,
    BorderStyle,
    PageOrientation,
  } = await import("docx");

  const FONT = "Arial";
  const COLOR_PRIMARY = "0E4C5A"; // matches --color-primary-700 teal
  const COLOR_MUTED = "5A6C75";

  const styles = {
    default: {
      document: { run: { font: FONT, size: 20 } }, // 10pt base
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: FONT, color: "111418" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 22, bold: true, font: FONT, color: COLOR_PRIMARY },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 1 },
      },
      {
        id: "Eyebrow",
        name: "Eyebrow",
        basedOn: "Normal",
        next: "Normal",
        run: {
          size: 16,
          bold: true,
          font: FONT,
          color: COLOR_PRIMARY,
          characterSpacing: 24,
        },
        paragraph: { spacing: { after: 60 } },
      },
      {
        id: "Muted",
        name: "Muted",
        basedOn: "Normal",
        next: "Normal",
        run: { size: 16, font: FONT, color: COLOR_MUTED },
        paragraph: { spacing: { after: 60 } },
      },
    ],
  };

  const numbering = {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 260 } } },
          },
        ],
      },
    ],
  };

  const body = [];

  // Title block
  body.push(
    new Paragraph({
      style: "Eyebrow",
      children: [new TextRun("Propharmex — company overview")],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun(ABOUT.founding.headline)],
    }),
    new Paragraph({
      children: [new TextRun({ text: ABOUT.founding.lede })],
      spacing: { after: 120 },
    }),
  );

  // Founding body
  for (const paragraph of ABOUT.founding.body) {
    body.push(
      new Paragraph({
        children: [new TextRun(paragraph)],
        spacing: { after: 100 },
      }),
    );
  }

  // Mission / Vision
  body.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(ABOUT.mvv.mission.label)],
    }),
    new Paragraph({ children: [new TextRun(ABOUT.mvv.mission.body)] }),
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(ABOUT.mvv.vision.label)],
    }),
    new Paragraph({ children: [new TextRun(ABOUT.mvv.vision.body)] }),
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun("Values")],
    }),
  );

  for (const value of ABOUT.mvv.values) {
    body.push(
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [
          new TextRun({ text: `${value.title} `, bold: true }),
          new TextRun({ text: value.body }),
        ],
      }),
    );
  }

  // Footprint
  body.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(ABOUT.footprint.heading)],
    }),
    new Paragraph({ children: [new TextRun(ABOUT.footprint.lede)] }),
  );

  for (const node of ABOUT.footprint.nodes) {
    body.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${node.city}, ${node.country} — `, bold: true }),
          new TextRun({ text: node.role }),
        ],
        spacing: { before: 80, after: 40 },
      }),
    );
    for (const h of node.highlights) {
      body.push(
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: [new TextRun(h)],
        }),
      );
    }
  }

  // Timeline (compact)
  body.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(ABOUT.timeline.heading)],
    }),
  );
  for (const event of ABOUT.timeline.events) {
    body.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${event.year}  `, bold: true, color: COLOR_PRIMARY }),
          new TextRun({ text: `${event.title} `, bold: true }),
          new TextRun({ text: event.body }),
        ],
        spacing: { after: 60 },
      }),
    );
  }

  // Leadership
  body.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun("Leadership")],
    }),
    new Paragraph({ children: [new TextRun(ABOUT.leadershipPreview.intro)] }),
  );
  for (const leader of LEADERS) {
    body.push(
      new Paragraph({
        spacing: { before: 80, after: 20 },
        children: [
          new TextRun({ text: `${leader.name} — `, bold: true }),
          new TextRun({ text: `${leader.role} (${leader.location})` }),
        ],
      }),
      new Paragraph({
        style: "Muted",
        children: [new TextRun(leader.credential)],
      }),
    );
    if (leader.stub) {
      body.push(
        new Paragraph({
          style: "Muted",
          children: [
            new TextRun({
              text:
                "Profile in preparation — vetted biography will replace this placeholder.",
              italics: true,
            }),
          ],
        }),
      );
    }
  }

  // Footer line
  body.push(
    new Paragraph({
      border: {
        top: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: COLOR_PRIMARY,
          space: 1,
        },
      },
      spacing: { before: 200 },
      children: [
        new TextRun({
          text: "Propharmex — Mississauga, Ontario · Hyderabad, Telangana · propharmex.com",
          color: COLOR_MUTED,
          size: 16,
        }),
      ],
    }),
  );

  const doc = new Document({
    creator: "Propharmex",
    title: "Propharmex company overview",
    description: "Printable one-pager generated from the /about content source.",
    styles,
    numbering,
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children: body,
      },
    ],
  });

  await fs.mkdir(outDir, { recursive: true });
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outPath, buffer);
  process.stdout.write(`Wrote ${outPath} (${buffer.byteLength} bytes)\n`);
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(1);
});
