/**
 * PDF renderer for the Project Scoping Assistant (Prompt 19 PR-B).
 *
 * `renderScopePdf(summary)` takes a validated `ScopeSummary` and returns the
 * PDF bytes as a `Uint8Array`. The /api/ai/scoping/pdf route streams those
 * bytes back to the browser as `application/pdf`.
 *
 * Library: pdf-lib (pure JS, no native deps). Fonts are PDF-standard
 * (Helvetica family) — no font embedding required so the artifact is small
 * and reproducible across runtimes.
 *
 * Layout: US Letter, single column, ~9pt body, multi-page when the scope
 * overflows. The renderer auto-paginates on a per-section basis (no
 * mid-paragraph splits — each section either fits on the current page or
 * starts a new one).
 *
 * Footer disclaimer is mandatory per Prompt 19 hard guardrail #2 — every
 * generated artifact must carry "informational only / not a quote / not a
 * regulatory commitment" plus the /contact handoff URL.
 */
import {
  PDFDocument,
  PDFPage,
  PDFFont,
  StandardFonts,
  rgb,
  type Color,
} from "pdf-lib";

import type { ScopeSummary } from "./types";

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                           */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 612; // US Letter pt
const PAGE_HEIGHT = 792;
const MARGIN_X = 56;
const MARGIN_TOP = 64;
const MARGIN_BOTTOM = 72; // leave room for the footer
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const COLOR = {
  navy: rgb(0.04, 0.114, 0.2),
  primary: rgb(0.13, 0.32, 0.55),
  fg: rgb(0.07, 0.1, 0.15),
  body: rgb(0.2, 0.27, 0.35),
  muted: rgb(0.42, 0.47, 0.54),
  divider: rgb(0.85, 0.88, 0.92),
  warn: rgb(0.72, 0.52, 0.04),
  danger: rgb(0.64, 0.23, 0.23),
};

const SIZE = {
  brand: 9,
  title: 22,
  subtitle: 11,
  h2: 12,
  body: 10,
  small: 8.5,
};

const LINE = {
  body: 13.5,
  bullet: 13.5,
  h2: 16,
  sectionGap: 10,
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

interface DocCtx {
  doc: PDFDocument;
  page: PDFPage;
  /** Current y cursor on the active page (decreases as we draw down). */
  cursor: number;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
    italic: PDFFont;
  };
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

/** Draw a footer + reset the cursor onto a freshly added page. */
function newPage(ctx: DocCtx): void {
  drawFooter(ctx);
  const page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.page = page;
  ctx.cursor = PAGE_HEIGHT - MARGIN_TOP;
}

/**
 * Ensure at least `needed` pt is available below the cursor. If not, start
 * a new page. Used at the start of each section so we never split a section
 * heading from its first line of body copy.
 */
function ensureSpace(ctx: DocCtx, needed: number): void {
  if (ctx.cursor - needed < MARGIN_BOTTOM) {
    newPage(ctx);
  }
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
    "Informational only — not a quote, not a regulatory commitment.",
    {
      x: MARGIN_X,
      y,
      size: SIZE.small,
      font: ctx.fonts.italic,
      color: COLOR.muted,
    },
  );
  ctx.page.drawText("propharmex.com/contact", {
    x:
      PAGE_WIDTH -
      MARGIN_X -
      ctx.fonts.regular.widthOfTextAtSize(
        "propharmex.com/contact",
        SIZE.small,
      ),
    y,
    size: SIZE.small,
    font: ctx.fonts.regular,
    color: COLOR.primary,
  });
}

function drawHeading(
  ctx: DocCtx,
  text: string,
  opts: { size?: number; color?: Color; bold?: boolean } = {},
): void {
  const size = opts.size ?? SIZE.h2;
  const font = opts.bold === false ? ctx.fonts.regular : ctx.fonts.bold;
  const color = opts.color ?? COLOR.navy;
  ensureSpace(ctx, LINE.h2 + LINE.body);
  ctx.page.drawText(text.toUpperCase(), {
    x: MARGIN_X,
    y: ctx.cursor,
    size,
    font,
    color,
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
    if (ctx.cursor < MARGIN_BOTTOM) {
      newPage(ctx);
    }
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
      if (ctx.cursor < MARGIN_BOTTOM) {
        newPage(ctx);
      }
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
  // Brand line
  ctx.page.drawText("PROPHARMEX  /  PROJECT SCOPING ASSISTANT", {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.brand,
    font: ctx.fonts.bold,
    color: COLOR.primary,
  });
  ctx.cursor -= 18;

  // Title
  ctx.page.drawText("Draft project scope", {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.title,
    size: SIZE.title,
    font: ctx.fonts.bold,
    color: COLOR.navy,
  });
  ctx.cursor -= SIZE.title + 8;

  // Subtitle / date
  const today = new Date().toISOString().slice(0, 10);
  ctx.page.drawText(`AI-assisted, generated ${today}`, {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.subtitle,
    size: SIZE.subtitle,
    font: ctx.fonts.italic,
    color: COLOR.muted,
  });
  ctx.cursor -= SIZE.subtitle + 6;

  // Divider
  ctx.page.drawLine({
    start: { x: MARGIN_X, y: ctx.cursor },
    end: { x: PAGE_WIDTH - MARGIN_X, y: ctx.cursor },
    thickness: 0.5,
    color: COLOR.divider,
  });
  ctx.cursor -= 18;
}

function drawObjectives(ctx: DocCtx, objectives: string): void {
  drawHeading(ctx, "Objectives");
  drawParagraph(ctx, objectives);
  drawSectionGap(ctx);
}

function drawDosageForms(ctx: DocCtx, dosageForms: string[]): void {
  drawHeading(ctx, "Dosage forms");
  drawParagraph(ctx, dosageForms.join(" · "));
  drawSectionGap(ctx);
}

function drawDevelopmentStage(ctx: DocCtx, stage: string): void {
  drawHeading(ctx, "Stage");
  drawParagraph(ctx, humanizeStage(stage));
  drawSectionGap(ctx);
}

function drawDeliverables(ctx: DocCtx, deliverables: string[]): void {
  drawHeading(ctx, "Deliverables");
  drawBullets(ctx, deliverables);
  drawSectionGap(ctx);
}

function drawAssumptions(ctx: DocCtx, assumptions: string[]): void {
  if (assumptions.length === 0) return;
  drawHeading(ctx, "Assumptions");
  drawBullets(ctx, assumptions);
  drawSectionGap(ctx);
}

function drawRisks(ctx: DocCtx, risks: ScopeSummary["risks"]): void {
  if (risks.length === 0) return;
  drawHeading(ctx, "Risks");
  for (const r of risks) {
    const tag = r.severity.toUpperCase();
    const tagColor =
      r.severity === "high"
        ? COLOR.danger
        : r.severity === "medium"
          ? COLOR.warn
          : COLOR.muted;
    const tagWidth = ctx.fonts.bold.widthOfTextAtSize(tag, SIZE.small);
    const lines = wrapText(
      r.description,
      ctx.fonts.regular,
      SIZE.body,
      CONTENT_WIDTH - tagWidth - 14,
    );
    for (let i = 0; i < lines.length; i++) {
      if (ctx.cursor < MARGIN_BOTTOM) {
        newPage(ctx);
      }
      const line = lines[i];
      if (line === undefined) continue;
      if (i === 0) {
        ctx.page.drawText(tag, {
          x: MARGIN_X,
          y: ctx.cursor,
          size: SIZE.small,
          font: ctx.fonts.bold,
          color: tagColor,
        });
      }
      ctx.page.drawText(line, {
        x: MARGIN_X + tagWidth + 8,
        y: ctx.cursor,
        size: SIZE.body,
        font: ctx.fonts.regular,
        color: COLOR.body,
      });
      ctx.cursor -= LINE.body;
    }
    ctx.cursor -= 4;
  }
  drawSectionGap(ctx);
}

function drawPhases(ctx: DocCtx, phases: ScopeSummary["phases"]): void {
  drawHeading(ctx, "Phases");
  phases.forEach((p, i) => {
    ensureSpace(ctx, LINE.body * 2);
    const num = `${i + 1}.`;
    const numWidth = ctx.fonts.bold.widthOfTextAtSize(num, SIZE.body);
    const dur = `${p.durationWeeks} ${p.durationWeeks === 1 ? "wk" : "wks"}`;
    const durWidth = ctx.fonts.regular.widthOfTextAtSize(dur, SIZE.small);
    ctx.page.drawText(num, {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.body,
      font: ctx.fonts.bold,
      color: COLOR.primary,
    });
    ctx.page.drawText(p.name, {
      x: MARGIN_X + numWidth + 6,
      y: ctx.cursor,
      size: SIZE.body,
      font: ctx.fonts.bold,
      color: COLOR.navy,
    });
    ctx.page.drawText(dur, {
      x: PAGE_WIDTH - MARGIN_X - durWidth,
      y: ctx.cursor,
      size: SIZE.small,
      font: ctx.fonts.regular,
      color: COLOR.muted,
    });
    ctx.cursor -= LINE.body;
    drawBullets(
      ctx,
      p.milestones.map((m) => m),
    );
    ctx.cursor -= 4;
  });
  drawSectionGap(ctx);
}

function drawTimeline(ctx: DocCtx, timeline: ScopeSummary["ballparkTimelineWeeks"]): void {
  drawHeading(ctx, "Ballpark timeline");
  const text =
    timeline.min === timeline.max
      ? `${timeline.min} weeks`
      : `${timeline.min}–${timeline.max} weeks`;
  drawParagraph(ctx, text, { font: ctx.fonts.bold, color: COLOR.fg });
  drawSectionGap(ctx);
}

function drawRecommendedServices(
  ctx: DocCtx,
  services: ScopeSummary["recommendedServices"],
): void {
  drawHeading(ctx, "Recommended Propharmex services");
  drawParagraph(ctx, services.map(humanizePillar).join(" · "));
  drawSectionGap(ctx);
}

/* -------------------------------------------------------------------------- */
/*  Humanizers (mirror the client-side ones in ScopePreviewCard.tsx)           */
/* -------------------------------------------------------------------------- */

function humanizeStage(stage: string): string {
  switch (stage) {
    case "preformulation":
      return "Pre-formulation";
    case "formulation":
      return "Formulation";
    case "method-development":
      return "Method development";
    case "stability":
      return "Stability";
    case "clinical-supplies":
      return "Clinical supplies";
    case "scaleup":
      return "Scale-up";
    case "commercial":
      return "Commercial";
    default:
      return stage;
  }
}

function humanizePillar(pillar: string): string {
  switch (pillar) {
    case "development":
      return "Development";
    case "analytical":
      return "Analytical";
    case "regulatory":
      return "Regulatory";
    case "distribution":
      return "Distribution";
    case "quality":
      return "Quality";
    default:
      return pillar;
  }
}

/* -------------------------------------------------------------------------- */
/*  Public                                                                     */
/* -------------------------------------------------------------------------- */

export async function renderScopePdf(
  summary: ScopeSummary,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Propharmex — Project scope");
  doc.setAuthor("Propharmex");
  doc.setSubject("AI-assisted draft project scope");
  doc.setProducer("Propharmex Project Scoping Assistant");
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
  drawObjectives(ctx, summary.objectives);
  drawDosageForms(ctx, summary.dosageForms);
  drawDevelopmentStage(ctx, summary.developmentStage);
  drawDeliverables(ctx, summary.deliverables);
  drawAssumptions(ctx, summary.assumptions);
  drawRisks(ctx, summary.risks);
  drawPhases(ctx, summary.phases);
  drawTimeline(ctx, summary.ballparkTimelineWeeks);
  drawRecommendedServices(ctx, summary.recommendedServices);

  // Final-page footer.
  drawFooter(ctx);

  return doc.save();
}
