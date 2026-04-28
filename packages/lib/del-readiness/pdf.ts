/**
 * PDF renderer for the DEL Readiness Assessment (Prompt 20 PR-B).
 *
 * `renderDelReadinessPdf(assessment, rubric)` takes a finalized
 * `Assessment` and the canonical `Rubric` and returns the PDF bytes as a
 * `Uint8Array`. The /api/ai/del-readiness/pdf route streams those bytes
 * back to the browser as `application/pdf`.
 *
 * Layout: US Letter, single column, ~10pt body, multi-page when the
 * assessment overflows. Sections:
 *
 *   1. Branded header: PROPHARMEX / DEL READINESS ASSESSMENT
 *   2. Score block: numeric (large), traffic-light label, score bar
 *   3. Per-category breakdown (label · score · traffic-light)
 *   4. Gaps (one paragraph each, with category badge)
 *   5. Prioritized remediation (numbered, with effort badge)
 *   6. Footer disclaimer (mandatory per Prompt 20 hard guardrail #2)
 *
 * Mirrors the `packages/lib/scoping/pdf.ts` shape — same library
 * (`pdf-lib`), same constants, same auto-pagination strategy. Code is
 * deliberately duplicated rather than shared because the layout
 * decisions are content-specific and a shared abstraction would
 * obscure both.
 */
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type Color,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import type { Assessment, Rubric, TrafficLight } from "./types";

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                           */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 612; // US Letter pt
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
  // Traffic-light colours mirror packages/config/design-tokens.css —
  // --color-success, --color-warn, --color-danger.
  green: rgb(0.086, 0.471, 0.353),
  yellow: rgb(0.722, 0.525, 0.043),
  red: rgb(0.635, 0.231, 0.231),
  scoreTrack: rgb(0.92, 0.94, 0.97),
};

const SIZE = {
  brand: 9,
  title: 22,
  subtitle: 11,
  scoreBig: 48,
  scoreUnit: 14,
  h2: 12,
  body: 10,
  small: 8.5,
};

const LINE = {
  body: 13.5,
  bullet: 13.5,
  h2: 16,
  sectionGap: 12,
};

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
    "Informational only. Not a regulatory decision. Not a Health Canada pre-inspection outcome.",
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

function trafficLightColor(level: TrafficLight): Color {
  if (level === "green") return COLOR.green;
  if (level === "yellow") return COLOR.yellow;
  return COLOR.red;
}

function trafficLightLabel(level: TrafficLight): string {
  if (level === "green") return "ON TRACK";
  if (level === "yellow") return "MATERIAL GAPS";
  return "SIGNIFICANT WORK AHEAD";
}

function effortLabel(effort: "small" | "medium" | "large"): string {
  if (effort === "small") return "SMALL EFFORT";
  if (effort === "medium") return "MEDIUM EFFORT";
  return "LARGE EFFORT";
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

function drawSectionGap(ctx: DocCtx): void {
  ctx.cursor -= LINE.sectionGap;
}

/* -------------------------------------------------------------------------- */
/*  Section renderers                                                          */
/* -------------------------------------------------------------------------- */

function drawHeader(ctx: DocCtx): void {
  ctx.page.drawText("PROPHARMEX  /  DEL READINESS ASSESSMENT", {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.brand,
    font: ctx.fonts.bold,
    color: COLOR.primary,
  });
  ctx.cursor -= 18;

  ctx.page.drawText("Health Canada DEL Readiness", {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.title,
    size: SIZE.title,
    font: ctx.fonts.bold,
    color: COLOR.navy,
  });
  ctx.cursor -= SIZE.title + 8;

  const today = new Date().toISOString().slice(0, 10);
  ctx.page.drawText(`Self-assessment, generated ${today}`, {
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

function drawScoreBlock(ctx: DocCtx, assessment: Assessment): void {
  ensureSpace(ctx, SIZE.scoreBig + 40);

  // "OVERALL READINESS"
  ctx.page.drawText("OVERALL READINESS", {
    x: MARGIN_X,
    y: ctx.cursor,
    size: SIZE.brand,
    font: ctx.fonts.bold,
    color: COLOR.muted,
  });
  ctx.cursor -= 14;

  // Big number + "/ 100"
  const scoreText = String(assessment.score);
  ctx.page.drawText(scoreText, {
    x: MARGIN_X,
    y: ctx.cursor - SIZE.scoreBig,
    size: SIZE.scoreBig,
    font: ctx.fonts.bold,
    color: COLOR.navy,
  });
  const scoreWidth = ctx.fonts.bold.widthOfTextAtSize(scoreText, SIZE.scoreBig);
  ctx.page.drawText("/ 100", {
    x: MARGIN_X + scoreWidth + 8,
    y: ctx.cursor - SIZE.scoreBig + 4,
    size: SIZE.scoreUnit,
    font: ctx.fonts.regular,
    color: COLOR.muted,
  });
  // Traffic-light chip on the right.
  const chipLabel = trafficLightLabel(assessment.trafficLight);
  const chipWidth =
    ctx.fonts.bold.widthOfTextAtSize(chipLabel, SIZE.brand) + 16;
  const chipX = PAGE_WIDTH - MARGIN_X - chipWidth;
  const chipY = ctx.cursor - 24;
  ctx.page.drawRectangle({
    x: chipX,
    y: chipY,
    width: chipWidth,
    height: 18,
    borderColor: trafficLightColor(assessment.trafficLight),
    borderWidth: 1,
    color: trafficLightColor(assessment.trafficLight),
    opacity: 0.12,
  });
  ctx.page.drawText(chipLabel, {
    x: chipX + 8,
    y: chipY + 5,
    size: SIZE.brand,
    font: ctx.fonts.bold,
    color: trafficLightColor(assessment.trafficLight),
  });

  ctx.cursor -= SIZE.scoreBig + 4;

  // Score bar
  const barY = ctx.cursor;
  const barWidth = CONTENT_WIDTH;
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: barY,
    width: barWidth,
    height: 6,
    color: COLOR.scoreTrack,
  });
  const fillWidth = Math.max(
    0,
    Math.min(barWidth, (assessment.score / 100) * barWidth),
  );
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: barY,
    width: fillWidth,
    height: 6,
    color: trafficLightColor(assessment.trafficLight),
  });
  ctx.cursor -= 18;

  drawSectionGap(ctx);
}

function drawCategoryBreakdown(
  ctx: DocCtx,
  assessment: Assessment,
  rubric: Rubric,
): void {
  drawHeading(ctx, "By category");
  for (const cs of assessment.categoryScores) {
    ensureSpace(ctx, LINE.body + 8);
    const label =
      rubric.categories.find((c) => c.id === cs.category)?.label ?? cs.category;

    // Label on the left.
    ctx.page.drawText(label, {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.body,
      font: ctx.fonts.bold,
      color: COLOR.fg,
    });

    // Score on the right.
    const scoreStr = `${cs.score} / 100`;
    const scoreWidth = ctx.fonts.regular.widthOfTextAtSize(
      scoreStr,
      SIZE.body,
    );
    const tlLabel = trafficLightLabel(cs.trafficLight);
    const tlWidth = ctx.fonts.bold.widthOfTextAtSize(tlLabel, SIZE.small);
    ctx.page.drawText(tlLabel, {
      x: PAGE_WIDTH - MARGIN_X - tlWidth,
      y: ctx.cursor,
      size: SIZE.small,
      font: ctx.fonts.bold,
      color: trafficLightColor(cs.trafficLight),
    });
    ctx.page.drawText(scoreStr, {
      x: PAGE_WIDTH - MARGIN_X - tlWidth - 12 - scoreWidth,
      y: ctx.cursor,
      size: SIZE.body,
      font: ctx.fonts.regular,
      color: COLOR.muted,
    });
    ctx.cursor -= LINE.body;

    // Mini bar
    const miniY = ctx.cursor + 4;
    ctx.page.drawRectangle({
      x: MARGIN_X,
      y: miniY,
      width: CONTENT_WIDTH,
      height: 3,
      color: COLOR.scoreTrack,
    });
    ctx.page.drawRectangle({
      x: MARGIN_X,
      y: miniY,
      width: Math.max(0, Math.min(CONTENT_WIDTH, (cs.score / 100) * CONTENT_WIDTH)),
      height: 3,
      color: trafficLightColor(cs.trafficLight),
    });
    ctx.cursor -= 8;
  }
  drawSectionGap(ctx);
}

function drawGaps(
  ctx: DocCtx,
  assessment: Assessment,
  rubric: Rubric,
): void {
  if (assessment.gaps.length === 0) {
    drawHeading(ctx, "Gaps surfaced");
    drawParagraph(
      ctx,
      "No material gaps surfaced. Your answers indicate the foundational DEL prerequisites are in place — talk to our regulatory team about scoping a confirmation pass.",
    );
    drawSectionGap(ctx);
    return;
  }
  drawHeading(ctx, "Gaps surfaced");
  for (const g of assessment.gaps) {
    ensureSpace(ctx, LINE.body * 2 + 8);
    const catLabel =
      rubric.categories.find((c) => c.id === g.category)?.label ?? g.category;
    // Headline + category badge on the right
    const catWidth = ctx.fonts.bold.widthOfTextAtSize(
      catLabel.toUpperCase(),
      SIZE.small,
    );
    const headlineLines = wrapText(
      g.headline,
      ctx.fonts.bold,
      SIZE.body,
      CONTENT_WIDTH - catWidth - 12,
    );
    for (let i = 0; i < headlineLines.length; i++) {
      if (ctx.cursor < MARGIN_BOTTOM) newPage(ctx);
      const line = headlineLines[i];
      if (line === undefined) continue;
      ctx.page.drawText(line, {
        x: MARGIN_X,
        y: ctx.cursor,
        size: SIZE.body,
        font: ctx.fonts.bold,
        color: COLOR.fg,
      });
      if (i === 0) {
        ctx.page.drawText(catLabel.toUpperCase(), {
          x: PAGE_WIDTH - MARGIN_X - catWidth,
          y: ctx.cursor,
          size: SIZE.small,
          font: ctx.fonts.bold,
          color: COLOR.muted,
        });
      }
      ctx.cursor -= LINE.body;
    }
    drawParagraph(ctx, g.description);
    ctx.cursor -= 4;
  }
  drawSectionGap(ctx);
}

function drawRemediation(ctx: DocCtx, assessment: Assessment): void {
  if (assessment.remediation.length === 0) {
    drawHeading(ctx, "Prioritized next steps");
    drawParagraph(
      ctx,
      "Nothing to action right now. If a regulator asked for documentation today, your starting position is strong.",
    );
    drawSectionGap(ctx);
    return;
  }
  drawHeading(ctx, "Prioritized next steps");
  for (const r of assessment.remediation) {
    ensureSpace(ctx, LINE.body * 3);
    // Priority badge + action
    const priority = `${r.priority}.`;
    const priorityWidth = ctx.fonts.bold.widthOfTextAtSize(priority, SIZE.body);
    ctx.page.drawText(priority, {
      x: MARGIN_X,
      y: ctx.cursor,
      size: SIZE.body,
      font: ctx.fonts.bold,
      color: COLOR.primary,
    });
    const effort = effortLabel(r.effort);
    const effortWidth = ctx.fonts.bold.widthOfTextAtSize(effort, SIZE.small);
    const actionLines = wrapText(
      r.action,
      ctx.fonts.bold,
      SIZE.body,
      CONTENT_WIDTH - priorityWidth - 8 - effortWidth - 12,
    );
    for (let i = 0; i < actionLines.length; i++) {
      if (ctx.cursor < MARGIN_BOTTOM) newPage(ctx);
      const line = actionLines[i];
      if (line === undefined) continue;
      ctx.page.drawText(line, {
        x: MARGIN_X + priorityWidth + 6,
        y: ctx.cursor,
        size: SIZE.body,
        font: ctx.fonts.bold,
        color: COLOR.fg,
      });
      if (i === 0) {
        ctx.page.drawText(effort, {
          x: PAGE_WIDTH - MARGIN_X - effortWidth,
          y: ctx.cursor,
          size: SIZE.small,
          font: ctx.fonts.bold,
          color: COLOR.muted,
        });
      }
      ctx.cursor -= LINE.body;
    }
    drawParagraph(ctx, r.rationale);
    ctx.cursor -= 4;
  }
  drawSectionGap(ctx);
}

/* -------------------------------------------------------------------------- */
/*  Public                                                                     */
/* -------------------------------------------------------------------------- */

export async function renderDelReadinessPdf(
  assessment: Assessment,
  rubric: Rubric,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Propharmex — DEL Readiness Assessment");
  doc.setAuthor("Propharmex");
  doc.setSubject("AI-assisted Health Canada DEL readiness self-assessment");
  doc.setProducer("Propharmex DEL Readiness Assessment");
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
  drawScoreBlock(ctx, assessment);
  drawCategoryBreakdown(ctx, assessment, rubric);
  drawGaps(ctx, assessment, rubric);
  drawRemediation(ctx, assessment);

  drawFooter(ctx);

  return doc.save();
}
