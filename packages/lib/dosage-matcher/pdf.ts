/**
 * PDF renderer for the Dosage Form Capability Matcher (Prompt 21 PR-B).
 *
 * `renderDosageMatcherPdf(recommendation)` takes a server-enriched
 * `Recommendation` and returns the PDF bytes as a `Uint8Array`. The
 * /api/ai/dosage-matcher/pdf route streams those bytes back to the
 * browser as `application/pdf`.
 *
 * Layout: US Letter, single column, ~10pt body, multi-page when the
 * comparison overflows. Sections:
 *
 *   1. Branded header: PROPHARMEX / DOSAGE FORM CAPABILITY MATCHER
 *   2. Inferred requirements (capability pills + considerations)
 *   3. One section per recommended form, with:
 *      - rank, dosage form name, fit-tier chip, coverage bar
 *      - rationale paragraph
 *      - capabilities split (covered vs missing)
 *      - mismatch flags (if any)
 *      - prioritized next steps
 *      - relevant case study titles (if any)
 *   4. Footer disclaimer (mandatory per Prompt 21 hard guardrail —
 *      "informational only / confirm fit with our scientists")
 *
 * Mirrors `packages/lib/del-readiness/pdf.ts` byte-for-byte on the
 * scaffolding layer (page constants, font embedding, footer drawer,
 * wrapText helper). Code is duplicated rather than shared because the
 * section layouts are content-specific and a shared abstraction would
 * obscure both renderers.
 */
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type Color,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import type { FitTier, Recommendation } from "./types";

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                           */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 56;
const MARGIN_TOP = 64;
const MARGIN_BOTTOM = 72;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const COLOR = {
  navy: rgb(0.04, 0.114, 0.2),
  primary: rgb(0.13, 0.32, 0.55),
  fg: rgb(0.07, 0.1, 0.15),
  body: rgb(0.2, 0.27, 0.35),
  muted: rgb(0.42, 0.47, 0.54),
  divider: rgb(0.85, 0.88, 0.92),
  green: rgb(0.086, 0.471, 0.353),
  yellow: rgb(0.722, 0.525, 0.043),
  red: rgb(0.635, 0.231, 0.231),
  scoreTrack: rgb(0.92, 0.94, 0.97),
};

const SIZE = {
  brand: 9,
  title: 22,
  subtitle: 11,
  rank: 9,
  formName: 16,
  h2: 12,
  body: 10,
  small: 8.5,
};

const LINE = {
  body: 13.5,
  bullet: 13.5,
  h2: 16,
  sectionGap: 14,
};

/* -------------------------------------------------------------------------- */
/*  Humanizers                                                                 */
/* -------------------------------------------------------------------------- */

const DOSAGE_FORM_LABEL: Record<string, string> = {
  "oral-solid": "Oral solid (tablet)",
  "oral-liquid": "Oral liquid",
  topical: "Topical",
  "injectable-lyo": "Injectable — lyophilised",
  "injectable-liquid": "Injectable — liquid",
  ophthalmic: "Ophthalmic",
  inhalation: "Inhalation",
  transdermal: "Transdermal",
  suppository: "Suppository",
  otic: "Otic",
  nasal: "Nasal",
  "soft-gel": "Soft gel",
  "hard-cap": "Hard capsule",
};

const CAPABILITY_LABEL: Record<string, string> = {
  formulation: "Formulation",
  analytical: "Analytical",
  stability: "Stability",
  "process-validation": "Process validation",
  "scale-up": "Scale-up",
  "regulatory-us": "Regulatory — US",
  "regulatory-ca": "Regulatory — CA",
  "regulatory-eu": "Regulatory — EU",
  "regulatory-in": "Regulatory — IN",
  commercial: "Commercial",
};

function humanizeDosageForm(id: string): string {
  return DOSAGE_FORM_LABEL[id] ?? id;
}

function humanizeCapability(id: string): string {
  return CAPABILITY_LABEL[id] ?? id;
}

function fitTierLabel(tier: FitTier): string {
  if (tier === "high") return "HIGH FIT";
  if (tier === "medium") return "MEDIUM FIT";
  return "LOW FIT";
}

function fitTierColor(tier: FitTier): Color {
  if (tier === "high") return COLOR.green;
  if (tier === "medium") return COLOR.yellow;
  return COLOR.muted;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

interface DocCtx {
  doc: PDFDocument;
  page: PDFPage;
  cursor: number;
  fonts: { regular: PDFFont; bold: PDFFont; italic: PDFFont };
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const w = font.widthOfTextAtSize(test, size);
    if (w > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function newPage(ctx: DocCtx): void {
  drawFooter(ctx);
  const page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.page = page;
  ctx.cursor = PAGE_HEIGHT - MARGIN_TOP;
}

function ensureSpace(ctx: DocCtx, needed: number): void {
  if (ctx.cursor - needed < MARGIN_BOTTOM) newPage(ctx);
}

function drawFooter(ctx: DocCtx): void {
  const y = MARGIN_BOTTOM - 28;
  ctx.page.drawLine({
    start: { x: MARGIN_X, y: y + 18 },
    end: { x: PAGE_WIDTH - MARGIN_X, y: y + 18 },
    thickness: 0.5,
    color: COLOR.divider,
  });
  ctx.page.drawText(
    "Informational only. AI-assisted matching against published capabilities — not a regulatory or clinical recommendation.",
    {
      x: MARGIN_X,
      y,
      size: SIZE.small,
      font: ctx.fonts.italic,
      color: COLOR.muted,
    },
  );
  const url = "propharmex.com/contact";
  ctx.page.drawText(url, {
    x:
      PAGE_WIDTH -
      MARGIN_X -
      ctx.fonts.regular.widthOfTextAtSize(url, SIZE.small),
    y,
    size: SIZE.small,
    font: ctx.fonts.regular,
    color: COLOR.primary,
  });
}

function drawHeading(ctx: DocCtx, text: string): void {
  ensureSpace(ctx, LINE.h2 + LINE.body);
  ctx.page.drawText(text.toUpperCase(), {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.h2,
    font: ctx.fonts.bold,
    color: COLOR.navy,
  });
  ctx.cursor -= LINE.h2;
}

function drawParagraph(
  ctx: DocCtx,
  text: string,
  opts: { size?: number; color?: Color; font?: PDFFont } = {},
): void {
  const size = opts.size ?? SIZE.body;
  const font = opts.font ?? ctx.fonts.regular;
  const color = opts.color ?? COLOR.body;
  const lines = wrapText(text, font, size, CONTENT_WIDTH);
  for (const line of lines) {
    if (ctx.cursor < MARGIN_BOTTOM) newPage(ctx);
    ctx.page.drawText(line, {
      x: MARGIN_X,
      y: ctx.cursor,
      size,
      font,
      color,
    });
    ctx.cursor -= LINE.body;
  }
}

function drawBullets(ctx: DocCtx, items: string[]): void {
  for (const item of items) {
    const lines = wrapText(
      item,
      ctx.fonts.regular,
      SIZE.body,
      CONTENT_WIDTH - 14,
    );
    for (let i = 0; i < lines.length; i++) {
      if (ctx.cursor < MARGIN_BOTTOM) newPage(ctx);
      const line = lines[i];
      if (line === undefined) continue;
      if (i === 0) {
        ctx.page.drawText("•", {
          x: MARGIN_X,
          y: ctx.cursor,
          size: SIZE.body,
          font: ctx.fonts.bold,
          color: COLOR.primary,
        });
      }
      ctx.page.drawText(line, {
        x: MARGIN_X + 14,
        y: ctx.cursor,
        size: SIZE.body,
        font: ctx.fonts.regular,
        color: COLOR.body,
      });
      ctx.cursor -= LINE.bullet;
    }
  }
}

function drawSectionGap(ctx: DocCtx): void {
  ctx.cursor -= LINE.sectionGap;
}

/* -------------------------------------------------------------------------- */
/*  Section renderers                                                          */
/* -------------------------------------------------------------------------- */

function drawHeader(ctx: DocCtx): void {
  ctx.page.drawText("PROPHARMEX  /  DOSAGE FORM CAPABILITY MATCHER", {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.brand,
    font: ctx.fonts.bold,
    color: COLOR.primary,
  });
  ctx.cursor -= 18;

  ctx.page.drawText("Capability comparison", {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.title,
    size: SIZE.title,
    font: ctx.fonts.bold,
    color: COLOR.navy,
  });
  ctx.cursor -= SIZE.title + 8;

  const today = new Date().toISOString().slice(0, 10);
  ctx.page.drawText(`AI-assisted match, generated ${today}`, {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.subtitle,
    size: SIZE.subtitle,
    font: ctx.fonts.italic,
    color: COLOR.muted,
  });
  ctx.cursor -= SIZE.subtitle + 6;

  ctx.page.drawLine({
    start: { x: MARGIN_X, y: ctx.cursor },
    end: { x: PAGE_WIDTH - MARGIN_X, y: ctx.cursor },
    thickness: 0.5,
    color: COLOR.divider,
  });
  ctx.cursor -= 18;
}

function drawInferredRequirements(
  ctx: DocCtx,
  recommendation: Recommendation,
): void {
  drawHeading(ctx, "Inferred requirements");
  const caps = recommendation.inferredRequirements.capabilities
    .map((c) => humanizeCapability(c))
    .join(" · ");
  drawParagraph(ctx, `Required capabilities: ${caps}`, {
    font: ctx.fonts.bold,
    color: COLOR.fg,
  });
  drawParagraph(
    ctx,
    recommendation.inferredRequirements.dosageFormConsiderations,
  );
  drawSectionGap(ctx);
}

function drawCoverageBar(
  ctx: DocCtx,
  pct: number,
  tier: FitTier,
): void {
  const barY = ctx.cursor;
  const barWidth = CONTENT_WIDTH;
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: barY,
    width: barWidth,
    height: 5,
    color: COLOR.scoreTrack,
  });
  const fillWidth = Math.max(
    0,
    Math.min(barWidth, (pct / 100) * barWidth),
  );
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: barY,
    width: fillWidth,
    height: 5,
    color: fitTierColor(tier),
  });
  ctx.cursor -= 14;
}

function drawMatchSection(
  ctx: DocCtx,
  match: Recommendation["matches"][number],
  rank: number,
): void {
  ensureSpace(ctx, SIZE.formName + LINE.body * 4);

  // #N rank badge.
  ctx.page.drawText(`#${rank}`, {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.rank,
    font: ctx.fonts.bold,
    color: COLOR.muted,
  });
  ctx.cursor -= 12;

  // Form name + fit-tier chip on the right.
  const name = humanizeDosageForm(match.dosageForm);
  ctx.page.drawText(name, {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.formName,
    size: SIZE.formName,
    font: ctx.fonts.bold,
    color: COLOR.fg,
  });

  const tierLabel = fitTierLabel(match.fitTier);
  const tierWidth =
    ctx.fonts.bold.widthOfTextAtSize(tierLabel, SIZE.brand) + 16;
  const chipX = PAGE_WIDTH - MARGIN_X - tierWidth;
  const chipY = ctx.cursor - SIZE.formName + 1;
  ctx.page.drawRectangle({
    x: chipX,
    y: chipY,
    width: tierWidth,
    height: 16,
    color: fitTierColor(match.fitTier),
    opacity: 0.12,
    borderColor: fitTierColor(match.fitTier),
    borderWidth: 1,
  });
  ctx.page.drawText(tierLabel, {
    x: chipX + 8,
    y: chipY + 4,
    size: SIZE.brand,
    font: ctx.fonts.bold,
    color: fitTierColor(match.fitTier),
  });

  ctx.cursor -= SIZE.formName + 8;

  // Coverage line + bar.
  ctx.page.drawText(
    `Capability coverage: ${match.capabilityCoveragePct}%`,
    {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.small,
      font: ctx.fonts.bold,
      color: COLOR.muted,
    },
  );
  ctx.cursor -= 8;
  drawCoverageBar(ctx, match.capabilityCoveragePct, match.fitTier);

  // Rationale.
  ctx.page.drawText("Rationale", {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.small,
    font: ctx.fonts.bold,
    color: COLOR.muted,
  });
  ctx.cursor -= 12;
  drawParagraph(ctx, match.rationale);
  ctx.cursor -= 4;

  // Capabilities split.
  if (
    match.capabilitiesCovered.length > 0 ||
    match.capabilitiesMissing.length > 0
  ) {
    if (match.capabilitiesCovered.length > 0) {
      drawParagraph(
        ctx,
        `Covered: ${match.capabilitiesCovered.map(humanizeCapability).join(", ")}`,
        { color: COLOR.body },
      );
    }
    if (match.capabilitiesMissing.length > 0) {
      drawParagraph(
        ctx,
        `Not in our scope for this form: ${match.capabilitiesMissing.map(humanizeCapability).join(", ")}`,
        { color: COLOR.muted, font: ctx.fonts.italic },
      );
    }
    ctx.cursor -= 4;
  }

  // Mismatch flags.
  if (match.mismatchFlags.length > 0) {
    ctx.page.drawText("Things to confirm", {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.small,
      font: ctx.fonts.bold,
      color: COLOR.yellow,
    });
    ctx.cursor -= 12;
    drawBullets(ctx, match.mismatchFlags);
    ctx.cursor -= 4;
  }

  // Suggested next steps.
  if (match.suggestedNextSteps.length > 0) {
    ctx.page.drawText("Suggested next steps", {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.small,
      font: ctx.fonts.bold,
      color: COLOR.muted,
    });
    ctx.cursor -= 12;
    drawBullets(ctx, match.suggestedNextSteps);
    ctx.cursor -= 4;
  }

  // Case studies (if any).
  if (match.relevantCaseStudyTitles.length > 0) {
    ctx.page.drawText("Case studies the model surfaced", {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.small,
      font: ctx.fonts.bold,
      color: COLOR.muted,
    });
    ctx.cursor -= 12;
    for (const title of match.relevantCaseStudyTitles) {
      drawParagraph(ctx, title, { font: ctx.fonts.italic, color: COLOR.muted });
    }
  }

  drawSectionGap(ctx);
}

/* -------------------------------------------------------------------------- */
/*  Public                                                                     */
/* -------------------------------------------------------------------------- */

export async function renderDosageMatcherPdf(
  recommendation: Recommendation,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Propharmex — Dosage Form Capability Match");
  doc.setAuthor("Propharmex");
  doc.setSubject(
    "AI-assisted dosage-form match against published Propharmex capabilities",
  );
  doc.setProducer("Propharmex Dosage Form Capability Matcher");
  doc.setCreationDate(new Date());

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const firstPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const ctx: DocCtx = {
    doc,
    page: firstPage,
    cursor: PAGE_HEIGHT - MARGIN_TOP,
    fonts: { regular, bold, italic },
  };

  drawHeader(ctx);
  drawInferredRequirements(ctx, recommendation);

  drawHeading(ctx, "Recommended dosage forms");
  recommendation.matches.forEach((m, i) => {
    drawMatchSection(ctx, m, i + 1);
  });

  drawFooter(ctx);

  return doc.save();
}
