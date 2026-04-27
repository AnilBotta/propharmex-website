// @ts-check
/**
 * generate-whitepaper.mjs — produces /public/downloads/canadian-cdmo-operating-model.pdf
 *
 * Generator for the gated lead-magnet whitepaper "The Canadian CDMO operating
 * model" — a ~10-page field guide for sponsors evaluating CDMO partners that
 * operate a Canadian DEL site with offshore development depth under one
 * quality system.
 *
 * Run with:  pnpm --filter web generate:whitepaper
 *
 * Replaces the prior 4-page "two-hub operating model" deck. Positioning was
 * retired in PR #23 (2026-04-27) and the deeper Canadian-anchored rewrite was
 * scheduled as the Commit-8 follow-up. New file path; the old PDF is removed
 * once this generator runs.
 *
 * Library: pdf-lib (pure JS, no native deps). Fonts are PDF-standard
 * (Helvetica family) — no font embedding required so the artifact is small
 * and reproducible across machines.
 *
 * Voice: matches the brand-voice-guardian conventions in
 * apps/web/content/insights.ts and the lexicon at
 * docs/positioning-canadian-anchor.md (Sections 4 and 5).
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, "..", "public", "downloads");
const OUT_PATH = path.join(OUT_DIR, "canadian-cdmo-operating-model.pdf");

const TITLE = "The Canadian CDMO operating model";
const SUBTITLE =
  "How a Health Canada DEL site and an offshore development centre operate under one quality system. A field guide for sponsors evaluating CDMO partners.";

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                          */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 612; // US Letter pt
const PAGE_HEIGHT = 792;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR = {
  navy: rgb(0.04, 0.114, 0.2),
  navyMid: rgb(0.09, 0.18, 0.31),
  primary: rgb(0.13, 0.32, 0.55),
  fg: rgb(0.07, 0.1, 0.15),
  body: rgb(0.2, 0.27, 0.35),
  muted: rgb(0.42, 0.47, 0.54),
  divider: rgb(0.85, 0.88, 0.92),
  paper: rgb(1, 1, 1),
  paperWarm: rgb(0.98, 0.985, 0.99),
  white: rgb(1, 1, 1),
  whiteBlue: rgb(0.85, 0.9, 0.96),
  whiteSoft: rgb(0.7, 0.78, 0.88),
};

const SIZE = {
  brand: 11,
  cover: 30,
  coverSub: 14,
  h1: 22,
  h2: 13,
  h3: 11,
  body: 10.5,
  caption: 9,
  small: 8.5,
};

const LINE = {
  body: 14.5,
  bullet: 14.5,
  h2: 18,
  h3: 15,
};

const PAGE_COUNT = 10;

/* -------------------------------------------------------------------------- */
/*  Text helpers                                                              */
/* -------------------------------------------------------------------------- */

/**
 * @param {string} text
 * @param {import("pdf-lib").PDFFont} font
 * @param {number} size
 * @param {number} maxWidth
 * @returns {string[]}
 */
function wrapText(text, font, size, maxWidth) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
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

/**
 * @param {import("pdf-lib").PDFPage} page
 * @param {string} text
 * @param {{ x: number; y: number; size: number; font: import("pdf-lib").PDFFont; color: import("pdf-lib").Color }} opts
 */
function drawLine(page, text, opts) {
  page.drawText(text, opts);
}

/**
 * @param {import("pdf-lib").PDFPage} page
 * @param {string} text
 * @param {{ x: number; y: number; size: number; font: import("pdf-lib").PDFFont; color: import("pdf-lib").Color; maxWidth: number; lineHeight: number }} opts
 * @returns {number}
 */
function drawParagraph(page, text, opts) {
  const lines = wrapText(text, opts.font, opts.size, opts.maxWidth);
  let y = opts.y;
  for (const line of lines) {
    drawLine(page, line, {
      x: opts.x,
      y,
      size: opts.size,
      font: opts.font,
      color: opts.color,
    });
    y -= opts.lineHeight;
  }
  return y;
}

/**
 * @param {import("pdf-lib").PDFPage} page
 * @param {string[]} items
 * @param {{ x: number; y: number; font: import("pdf-lib").PDFFont; size: number; color: import("pdf-lib").Color; lineHeight: number; maxWidth: number; bulletColor: import("pdf-lib").Color }} opts
 * @returns {number}
 */
function drawBullets(page, items, opts) {
  let y = opts.y;
  const indent = 14;
  for (const item of items) {
    page.drawCircle({
      x: opts.x + 3,
      y: y + 3,
      size: 1.6,
      color: opts.bulletColor,
    });
    const lines = wrapText(item, opts.font, opts.size, opts.maxWidth - indent);
    for (let i = 0; i < lines.length; i++) {
      drawLine(page, /** @type {string} */ (lines[i]), {
        x: opts.x + indent,
        y,
        size: opts.size,
        font: opts.font,
        color: opts.color,
      });
      y -= opts.lineHeight;
    }
    y -= 4;
  }
  return y;
}

/**
 * @param {import("pdf-lib").PDFPage} page
 * @param {{ x: number; y: number; width: number; color: import("pdf-lib").Color }} opts
 */
function drawDivider(page, opts) {
  page.drawRectangle({
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: 0.6,
    color: opts.color,
  });
}

/**
 * Draw the standard interior-page section header: eyebrow + title + subtitle + divider.
 * Returns the y cursor below the divider, ready for body content.
 * @param {import("pdf-lib").PDFPage} page
 * @param {{ eyebrow: string; title: string; subtitle?: string; fontReg: import("pdf-lib").PDFFont; fontBold: import("pdf-lib").PDFFont; fontItalic: import("pdf-lib").PDFFont; startY: number }} opts
 * @returns {number}
 */
function drawSectionHeader(page, opts) {
  let y = opts.startY;
  drawLine(page, opts.eyebrow, {
    x: MARGIN,
    y,
    size: SIZE.brand,
    font: opts.fontBold,
    color: COLOR.primary,
  });
  y -= 22;
  drawLine(page, opts.title, {
    x: MARGIN,
    y,
    size: SIZE.h1,
    font: opts.fontBold,
    color: COLOR.fg,
  });
  if (opts.subtitle) {
    y -= 8;
    drawLine(page, opts.subtitle, {
      x: MARGIN,
      y,
      size: SIZE.coverSub,
      font: opts.fontItalic,
      color: COLOR.muted,
    });
  }
  y -= 24;
  drawDivider(page, {
    x: MARGIN,
    y,
    width: CONTENT_WIDTH,
    color: COLOR.divider,
  });
  y -= 22;
  return y;
}

/**
 * Sub-heading inside a section (e.g. "What this site does").
 * @param {import("pdf-lib").PDFPage} page
 * @param {string} text
 * @param {{ y: number; fontBold: import("pdf-lib").PDFFont }} opts
 * @returns {number} y cursor below the subheading
 */
function drawSubheading(page, text, opts) {
  drawLine(page, text, {
    x: MARGIN,
    y: opts.y,
    size: SIZE.h2,
    font: opts.fontBold,
    color: COLOR.fg,
  });
  return opts.y - LINE.h2;
}

/**
 * Primary-source callout box. Returns y cursor below the box.
 * @param {import("pdf-lib").PDFPage} page
 * @param {{ y: number; heading: string; body: string; sourceLines: string[]; fontReg: import("pdf-lib").PDFFont; fontBold: import("pdf-lib").PDFFont }} opts
 * @returns {number}
 */
function drawPrimarySourceCallout(page, opts) {
  // Compute height: heading (12) + gap (6) + body lines + sources lines + padding
  const bodyLines = wrapText(opts.body, opts.fontReg, SIZE.body, CONTENT_WIDTH - 28);
  const sourceLineCount = opts.sourceLines.length;
  const innerHeight = 14 + bodyLines.length * LINE.body + sourceLineCount * 12 + 14;
  const calloutHeight = innerHeight + 14;
  const y = opts.y;
  page.drawRectangle({
    x: MARGIN,
    y: y - calloutHeight,
    width: CONTENT_WIDTH,
    height: calloutHeight,
    color: COLOR.paperWarm,
    borderWidth: 0.6,
    borderColor: COLOR.primary,
  });
  drawLine(page, opts.heading, {
    x: MARGIN + 14,
    y: y - 18,
    size: SIZE.small,
    font: opts.fontBold,
    color: COLOR.primary,
  });
  let cursor = drawParagraph(page, opts.body, {
    x: MARGIN + 14,
    y: y - 32,
    size: SIZE.body,
    font: opts.fontReg,
    color: COLOR.body,
    maxWidth: CONTENT_WIDTH - 28,
    lineHeight: LINE.body,
  });
  cursor -= 4;
  for (const sourceLine of opts.sourceLines) {
    drawLine(page, sourceLine, {
      x: MARGIN + 14,
      y: cursor,
      size: SIZE.small,
      font: opts.fontReg,
      color: COLOR.muted,
    });
    cursor -= 12;
  }
  return y - calloutHeight - 14;
}

/* -------------------------------------------------------------------------- */
/*  Page footer (every interior page)                                         */
/* -------------------------------------------------------------------------- */

/**
 * @param {import("pdf-lib").PDFPage} page
 * @param {import("pdf-lib").PDFFont} font
 * @param {number} pageNum
 * @param {number} pageCount
 */
function drawFooter(page, font, pageNum, pageCount) {
  const y = 32;
  drawLine(page, `Propharmex - ${TITLE}`, {
    x: MARGIN,
    y,
    size: SIZE.small,
    font,
    color: COLOR.muted,
  });
  drawLine(page, `${pageNum} of ${pageCount}`, {
    x: PAGE_WIDTH - MARGIN - 50,
    y,
    size: SIZE.small,
    font,
    color: COLOR.muted,
  });
}

/* -------------------------------------------------------------------------- */
/*  Page builders                                                             */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {{
 *   pdf: import("pdf-lib").PDFDocument;
 *   fontReg: import("pdf-lib").PDFFont;
 *   fontBold: import("pdf-lib").PDFFont;
 *   fontItalic: import("pdf-lib").PDFFont;
 * }} Ctx
 */

/**
 * Page 1 — Cover.
 * @param {Ctx} ctx
 */
function buildCover(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const bandHeight = 360;
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - bandHeight,
    width: PAGE_WIDTH,
    height: bandHeight,
    color: COLOR.navy,
  });

  drawLine(page, "PROPHARMEX", {
    x: MARGIN,
    y: PAGE_HEIGHT - 70,
    size: SIZE.brand,
    font: ctx.fontBold,
    color: COLOR.white,
  });
  drawLine(page, "Whitepaper - Field guide", {
    x: MARGIN,
    y: PAGE_HEIGHT - 88,
    size: SIZE.small,
    font: ctx.fontReg,
    color: COLOR.whiteSoft,
  });

  const titleLines = wrapText(TITLE, ctx.fontBold, SIZE.cover, CONTENT_WIDTH);
  let titleY = PAGE_HEIGHT - 170;
  for (const line of titleLines) {
    drawLine(page, line, {
      x: MARGIN,
      y: titleY,
      size: SIZE.cover,
      font: ctx.fontBold,
      color: COLOR.white,
    });
    titleY -= 36;
  }

  drawParagraph(page, SUBTITLE, {
    x: MARGIN,
    y: titleY - 14,
    size: SIZE.coverSub,
    font: ctx.fontReg,
    color: COLOR.whiteBlue,
    maxWidth: CONTENT_WIDTH - 30,
    lineHeight: 19,
  });

  // Body band — meta info under the navy band
  let y = PAGE_HEIGHT - bandHeight - 50;
  drawLine(page, "INSIDE", {
    x: MARGIN,
    y,
    size: SIZE.brand,
    font: ctx.fontBold,
    color: COLOR.primary,
  });
  y -= 18;
  drawDivider(page, { x: MARGIN, y: y + 4, width: 40, color: COLOR.primary });
  y -= 6;

  drawBullets(
    page,
    [
      "Why this guide exists - and the three CDMO archetypes sponsors choose between.",
      "What lives at the DEL site, what lives at the development centre, and what the regulator sees.",
      "How a real engagement flows across both sites under one quality system.",
      "Where the operational seams are - timezone, customs, editorial split - and how we manage them.",
      "A decision framework: when this model is the right answer, and when a single-site partner is a better fit.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );

  // Footer hint at the very bottom of the cover (no page number on cover)
  drawLine(page, "10 pages - For sponsors evaluating CDMO partners", {
    x: MARGIN,
    y: 56,
    size: SIZE.small,
    font: ctx.fontItalic,
    color: COLOR.muted,
  });
}

/**
 * Page 2 — Executive summary.
 * @param {Ctx} ctx
 */
function buildExecSummary(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "EXECUTIVE SUMMARY",
    title: "What Propharmex actually is, in 300 words.",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "Propharmex is a Canadian pharmaceutical services company. We operate from a Mississauga, Ontario site under a Health Canada Drug Establishment Licence - fabrication, packaging, labelling, testing, import, wholesale, and 3PL distribution - and from an Indian development centre in Hyderabad providing formulation, method development, analytical services, and stability work. Both sites run under one quality system, anchored at the DEL.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawParagraph(
    page,
    "Our clients are drug developers worldwide: US generic sponsors filing ANDAs, EU innovators with branded programmes, contract manufacturers needing a Canadian regulatory surface, multilateral procurement agencies, and a small number of NGO programmes. We do not offer a bridge service or an intermediary role. The corporate body is Canadian; the development centre supports Canadian programmes from the bench up.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawParagraph(
    page,
    "This guide is for sponsors evaluating CDMO partners and trying to understand how an integrated regulatory + analytical + development surface actually operates day to day. It walks through what each site holds, how a real engagement flows from scope to filing, the structural commitment behind a single quality system, where the operational seams genuinely live, and a decision framework for when this model is the right answer for a programme - and when a single-site, single-region partner is a better fit.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  drawParagraph(
    page,
    "It is anti-hype on purpose. There is no claim here that does not show its primary source.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontItalic,
      color: COLOR.muted,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );

  drawFooter(page, ctx.fontReg, 2, PAGE_COUNT);
}

/**
 * Page 3 — Why this guide exists.
 * @param {Ctx} ctx
 */
function buildWhyThisExists(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "01 - CONTEXT",
    title: "Why this guide exists",
    subtitle: "Three CDMO archetypes, one Canadian-anchored answer",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "When sponsors evaluate CDMO partners, the sales conversations tend to gloss over a question that matters more than any technical capability deck: who carries the regulatory weight, and where does the licence actually live?",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawParagraph(
    page,
    "It matters because Canadian market entry, US ANDA work, and globally-sourced clinical supply all eventually touch a regulator. The dossier the regulator opens has to map back to a real establishment licence, a real quality system, and real release-bench testing - not a network of subcontractors stitched together by a project manager. When the chain breaks at the seams, the dossier breaks with it.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 14;

  y = drawSubheading(page, "Three archetypes sponsors choose between", {
    y,
    fontBold: ctx.fontBold,
  });
  y = drawBullets(
    page,
    [
      "Single-site CDMO in the sponsor's primary market - operationally simple, geographically limited, often capacity-constrained for analytical or development depth.",
      "Franchised network - a parent brand with regional affiliates that share a logo but not a quality system. Fast to engage, painful at audit time when the regulator wants to trace the document chain.",
      "Integrated multi-site CDMO - one corporate body, one quality system, distinct sites with declared operational roles. More moving parts, less subcontractor risk, easier audit trail.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );
  y -= 8;

  y = drawSubheading(page, "Where Propharmex sits", { y, fontBold: ctx.fontBold });
  y = drawParagraph(
    page,
    "Propharmex is the third archetype, anchored Canadian. Our Mississauga site is the regulatory authority and Canadian release surface. Our Hyderabad development centre supplies analytical and development depth. The same SOP set governs both. The same change-control system tracks both. The same data-integrity controls (ALCOA+) apply to both.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  drawParagraph(
    page,
    "This guide describes that arrangement honestly - including the parts that are not friction-free. The aim is to help a sponsor recognize whether the model fits their programme. A misfit caught early is easier to recover from than a misfit caught at the regulator's window.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontItalic,
      color: COLOR.muted,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );

  drawFooter(page, ctx.fontReg, 3, PAGE_COUNT);
}

/**
 * Page 4 — The DEL site.
 * @param {Ctx} ctx
 */
function buildDelSite(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "02 - SITE PROFILE",
    title: "The DEL site",
    subtitle: "Regulatory authority, release, and 3PL",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "The Mississauga site holds a Health Canada Drug Establishment Licence under Part C, Division 1A of the Food and Drug Regulations and is administered to GUI-0002. The licence authorizes specific activities - fabrication, packaging, labelling, testing, import, distribution, wholesale - on specific dosage-form and product categories at the specific site. It is verifiable today on the Health Canada Drug Product Database.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawParagraph(
    page,
    "The DEL is the foundation under everything else on this page set. A sponsor evaluating us can confirm we hold a Canadian establishment licence before any document changes hands; the alternative - a CDMO that promises Canadian capability against a paper application - is a 250 calendar-day Health Canada wait the sponsor cannot afford on most timelines.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 14;

  y = drawSubheading(page, "What this site does", { y, fontBold: ctx.fontBold });
  y = drawBullets(
    page,
    [
      "Holds the Drug Establishment Licence and acts as Canadian agent for foreign sponsors entering the Canadian market - owning the relationship with Health Canada through application, inspection, amendment, and renewal.",
      "Operates the master quality system for the firm. SOPs versioned centrally; deviations and CAPAs flow through a single ledger; document control is single-source-of-truth; ALCOA+ data integrity applies across both sites identically.",
      "Performs Canadian-market release for all Canadian-bound product, including QP-equivalent release where the regulatory pathway requires it. Canadian release is exercised under the DEL - no third-party intermediary.",
      "Operates the third-party logistics footprint co-located with the DEL: cold-chain (2-8 degrees C) and controlled-ambient lanes for Canada, the US, and Caribbean destinations; controlled-substance vault; recall infrastructure that meets Health Canada Division 2 expectations.",
      "Hosts Canadian regulator inspections directly. Maintained inspection-ready continuously rather than assembled into a package after the fact.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );
  y -= 4;

  drawPrimarySourceCallout(page, {
    y,
    heading: "PRIMARY SOURCE",
    body: "Drug Establishment Licence verifiable on the Health Canada Drug Product Database, as of 2026-04-27.",
    sourceLines: ["https://health-products.canada.ca/dpd-bdpp/"],
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
  });

  drawFooter(page, ctx.fontReg, 4, PAGE_COUNT);
}

/**
 * Page 5 — The development centre.
 * @param {Ctx} ctx
 */
function buildDevelopmentCentre(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "03 - SITE PROFILE",
    title: "The development centre",
    subtitle: "Analytical depth, formulation across seven dosage forms",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "Our Indian development centre in Hyderabad is the development and analytical bench. It is not a manufacturing network and we do not describe it as one. The centre runs:",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawBullets(
    page,
    [
      "Formulation development across seven dosage forms - solid oral, liquid oral, topical/semisolid, sterile injectables, inhalation, ophthalmic, transdermal/modified-release. Each form has its own development pod with formulators, analysts, and a regulatory liaison configured around it.",
      "Analytical method development and validation against ICH Q2(R2) - specificity, linearity, accuracy, precision, range, detection and quantitation limits, robustness. Methods are designed to travel: the validated method that lands in Module 3 is the method the release lab runs against.",
      "Stability programme conduct under ICH Q1A(R2). Zone II (25 degrees C / 60 percent RH) and zone IVb (30 degrees C / 75 percent RH) chambers run continuously, with photostability under ICH Q1B where applicable.",
      "Tech-transfer execution into the release site under our DEL or into a sponsor's nominated commercial site. Transfer protocols and equivalence criteria are written before the method moves; closeout reports travel with the method.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );
  y -= 4;

  y = drawSubheading(page, "Continuity, not project teams", { y, fontBold: ctx.fontBold });
  y = drawParagraph(
    page,
    "The development bench runs continuously, not episodically. A sponsor engagement does not stand up a project team from scratch - it is allocated to a development pod with formulation, analytical, and regulatory representation already configured. That continuity is the depth.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;

  y = drawSubheading(page, "WHO-GMP alignment", { y, fontBold: ctx.fontBold });
  y = drawParagraph(
    page,
    "The development centre operates under WHO-GMP principles - material qualification, method qualification, cleaning controls, ongoing process verification - governed under the same SOP set that binds the DEL-anchored quality manual. Documentation is available to qualified partners under NDA.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 4;

  drawPrimarySourceCallout(page, {
    y,
    heading: "PRIMARY SOURCES",
    body: "ICH Q2(R2) Validation of analytical procedures; ICH Q1A(R2) Stability testing; ICH Q1B Photostability testing.",
    sourceLines: ["https://www.ich.org/page/quality-guidelines"],
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
  });

  drawFooter(page, ctx.fontReg, 5, PAGE_COUNT);
}

/**
 * Page 6 — One quality system.
 * @param {Ctx} ctx
 */
function buildOneQualitySystem(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "04 - QUALITY SYSTEM",
    title: "One quality system, end to end",
    subtitle: "What anchored at the DEL means at the operational level",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "The structural commitment behind the operating model is a single quality management system anchored at our Mississauga DEL site under the Canadian Food and Drug Regulations Part C, Division 1A. The Indian development centre operates as a controlled secondary site under the same QMS - unified procedures, harmonized SOPs, audit-trailed change control, and a single document stream.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawParagraph(
    page,
    "The framework we operate against is consistent with ICH Q10 (Pharmaceutical Quality System). Q10 does not prescribe how a multi-site CDMO should be structured; it does set the expectation that the quality system covers the product lifecycle across whatever organizational structure the firm chooses. Our choice is a single master system rather than parallel systems linked by a quality agreement.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 14;

  y = drawSubheading(page, "Why this matters at the operational level", {
    y,
    fontBold: ctx.fontBold,
  });
  y = drawBullets(
    page,
    [
      "When a sponsor's auditor or a regulator requests a document, the answer is the same regardless of which site executed the work. The document either exists in the controlled register or it does not - no site-A-said, site-B-said reconciliation.",
      "When a deviation occurs at the development centre, it lands in the same ledger as a deviation at the DEL site. Trending is on a single dataset; CAPA closure is on a single workflow; annual product review pulls from a unified record.",
      "When release-method validation completes, the method registers under the release-testing QMS through a documented transfer protocol - not a method re-authoring pass. Dossier methods and release methods are the same methods.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );
  y -= 4;

  y = drawSubheading(page, "Inspection posture", { y, fontBold: ctx.fontBold });
  y = drawParagraph(
    page,
    "Health Canada inspections of the DEL site are hosted directly. Foreign-regulator inspections of the development centre - when applicable - are coordinated through the same inspection-readiness framework. Both sites are maintained inspection-ready continuously with annual self-assessment against GUI-0002 and risk-ranked internal audit cycles.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 4;

  drawPrimarySourceCallout(page, {
    y,
    heading: "PRIMARY SOURCES",
    body: "ICH Q10 Pharmaceutical Quality System; Health Canada GUI-0002 (Good Manufacturing Practices guide).",
    sourceLines: [
      "https://www.ich.org/page/quality-guidelines",
      "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/gmp-guidelines-0001.html",
    ],
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
  });

  drawFooter(page, ctx.fontReg, 6, PAGE_COUNT);
}

/**
 * Page 7 — How an engagement actually flows.
 * @param {Ctx} ctx
 */
function buildEngagementFlow(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "05 - WORKED EXAMPLE",
    title: "How an engagement actually flows",
    subtitle: "Five stages, one PMO, one quality record",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "A representative engagement: a US-based generic sponsor planning a Canadian and US filing on a sterile injectable, with a parallel Type II Drug Master File for the API. The programme moves through a defined sequence under one PMO and one quality system.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 12;

  /** @type {{ stage: string; title: string; body: string }[]} */
  const stages = [
    {
      stage: "STAGE 1",
      title: "Scope and quality plan",
      body: "Scope and quality plan finalized at the DEL site, documented in a Canadian Quality Agreement that sets data ownership, audit rights, the release path, regulatory representation, and change-control authority. This is the document the sponsor's quality lead reviews first - it determines who owns what for the next 18 to 36 months.",
    },
    {
      stage: "STAGE 2",
      title: "Development and analytical execution",
      body: "Formulation and analytical work executed at the development centre. Method development and validation under ICH Q2(R2); stability initiated under the appropriate climatic zone. The analytical record that emerges is the record that lands in Module 3 of the CTD - it is not re-authored later.",
    },
    {
      stage: "STAGE 3",
      title: "Tech-transfer and method qualification",
      body: "Tech-transfer package authored, reviewed against the DEL-anchored quality system, frozen for execution. Methods, specifications, and batch records move into the release-testing QMS through a documented transfer protocol with pre-agreed equivalence criteria. The receiving lab runs comparative testing rather than re-optimizing.",
    },
    {
      stage: "STAGE 4",
      title: "Manufacture and release",
      body: "Manufacturing executed at the designated commercial site (sometimes ours, often a sponsor-nominated site under a tripartite quality agreement). Release testing run on the cross-validated method. Canadian release performed under our DEL for any Canadian-bound product.",
    },
    {
      stage: "STAGE 5",
      title: "Filing and post-approval",
      body: "Filing authored across the team - analytical and CMC sections drafted by the development pod, US/Canadian regulatory editorial finalized under the DEL. Submitted by the sponsor or by Propharmex as Canadian agent. Post-approval lifecycle work runs under the same single quality record.",
    },
  ];

  for (const s of stages) {
    drawLine(page, s.stage, {
      x: MARGIN,
      y,
      size: SIZE.small,
      font: ctx.fontBold,
      color: COLOR.primary,
    });
    drawLine(page, s.title, {
      x: MARGIN + 60,
      y,
      size: SIZE.h3,
      font: ctx.fontBold,
      color: COLOR.fg,
    });
    y -= 14;
    y = drawParagraph(page, s.body, {
      x: MARGIN + 60,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH - 60,
      lineHeight: LINE.body,
    });
    y -= 8;
  }

  drawParagraph(
    page,
    "What this sequence is not is a hand-off chain. It is a single project under one PMO, with a single project record visible to the sponsor end to end.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontItalic,
      color: COLOR.muted,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );

  drawFooter(page, ctx.fontReg, 7, PAGE_COUNT);
}

/**
 * Page 8 — Operational seams.
 * @param {Ctx} ctx
 */
function buildOperationalSeams(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "06 - HONEST ACCOUNTING",
    title: "Where the operational seams are",
    subtitle: "Friction we name so it is not a surprise",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "The operating model is not friction-free. The places it has to work hardest are the same places any multi-site operation has to work hardest - just with a longer flight time when an in-person resolution is needed. We name them so they are not surprises.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 14;

  y = drawSubheading(page, "Timezone overlap is roughly 90 minutes", {
    y,
    fontBold: ctx.fontBold,
  });
  y = drawParagraph(
    page,
    "On a standard business day, the DEL site and the development centre share a working window of about 90 minutes (early morning Eastern, evening India Standard Time). Active-phase projects use that window for stand-ups; everything else runs asynchronously with documented hand-offs. The discipline that makes asynchronous work tractable - clear written hand-offs, no ambiguous decisions in chat threads, time-stamped status records - is the same discipline that produces a clean inspection trail.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;

  y = drawSubheading(page, "Sample shipment crosses customs in both directions", {
    y,
    fontBold: ctx.fontBold,
  });
  y = drawParagraph(
    page,
    "Method-development samples, reference standards, retain samples, and stability pulls all cross customs. Cold-chain integrity, courier qualification, and lead-time buffers are first-class operational concerns. The customs documentation chain is its own QMS workstream - pre-cleared brokers, controlled-substance handling where applicable, declared dual-use materials handled per export-control regulations.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;

  y = drawSubheading(page, "Regulatory editorial split needs disciplined version control", {
    y,
    fontBold: ctx.fontBold,
  });
  y = drawParagraph(
    page,
    "Analytical and CMC content is drafted at the development centre; regional editorial and Module 1 packaging is finalized under the DEL. The split needs disciplined version control to avoid email-attachment drift. We use a single dossier-staging environment so the latest draft is always the same draft regardless of which site is touching it.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  drawParagraph(
    page,
    "These are not features. They are the cost of running two sites instead of one. The reason to absorb that cost is the depth and authority that comes from each side - and for the right sponsors and the right work, the math works.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontItalic,
      color: COLOR.muted,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );

  drawFooter(page, ctx.fontReg, 8, PAGE_COUNT);
}

/**
 * Page 9 — Decision framework.
 * @param {Ctx} ctx
 */
function buildDecisionFramework(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "07 - DECISION FRAMEWORK",
    title: "When this model is the right answer",
    subtitle: "And when a single-site partner is a better fit",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  drawLine(page, "It IS the right answer when:", {
    x: MARGIN,
    y,
    size: SIZE.h2,
    font: ctx.fontBold,
    color: COLOR.fg,
  });
  y -= LINE.h2;
  y = drawBullets(
    page,
    [
      "You need Canadian regulatory authority - DEL holder, Canadian agent, ongoing Health Canada relationship - AND analytical or development depth in the same engagement, with global filing reach.",
      "Your filing strategy spans multiple agencies and you want one CMC and one analytical record referenced by all of them rather than parallel records that need reconciling.",
      "You would otherwise be running a multi-vendor programme - one Canadian regulatory consultant, one offshore analytical lab, a separate Canadian 3PL - and you want the consolidation under one quality system.",
      "You value document and data continuity across the development-to-release pipeline more than lowest-bidder pricing on each individual workstream.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );
  y -= 8;

  drawLine(page, "It is NOT the right answer when:", {
    x: MARGIN,
    y,
    size: SIZE.h2,
    font: ctx.fontBold,
    color: COLOR.fg,
  });
  y -= LINE.h2;
  y = drawBullets(
    page,
    [
      "You need single-site, single-region work where neither Canadian regulatory authority nor offshore analytical depth meaningfully adds value to the programme.",
      "You are optimizing strictly on per-unit manufacturing cost on a commodity product that does not need development or regulatory bandwidth from a CDMO partner.",
      "Your timeline forecloses any cross-site coordination - same-room, same-shift execution is the binding constraint and you will accept regulatory and analytical limitations to keep it.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.muted,
    },
  );
  y -= 8;

  y = drawSubheading(page, "Three questions to ask any CDMO partner", {
    y,
    fontBold: ctx.fontBold,
  });
  y = drawBullets(
    page,
    [
      "Show me the Drug Establishment Licence on the regulator's public register. Canadian regulatory authority is on the register today or it is not - there is no in-between.",
      "When the analytical method moves from your development bench to your release lab, who authors the transfer protocol - and what is the document trail? Smooth answers expose either real continuity or a multi-vendor reconciliation problem.",
      "Walk me through your last regulatory inspection observation. What was the CAPA closure path? The character of the QMS shows up in how a CDMO talks about inspections - defensive, vague, or specific and structured.",
    ],
    {
      x: MARGIN,
      y,
      font: ctx.fontReg,
      size: SIZE.body,
      color: COLOR.body,
      lineHeight: LINE.bullet,
      maxWidth: CONTENT_WIDTH,
      bulletColor: COLOR.primary,
    },
  );

  drawFooter(page, ctx.fontReg, 9, PAGE_COUNT);
}

/**
 * Page 10 — CTA + disclaimer.
 * @param {Ctx} ctx
 */
function buildCtaPage(ctx) {
  const page = ctx.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawSectionHeader(page, {
    eyebrow: "08 - NEXT STEP",
    title: "Talk to the team",
    subtitle: "We start most conversations by reading the dossier draft.",
    fontReg: ctx.fontReg,
    fontBold: ctx.fontBold,
    fontItalic: ctx.fontItalic,
    startY: PAGE_HEIGHT - 70,
  });

  y = drawParagraph(
    page,
    "If a Canadian filing, a tech-transfer scope, an ANDA programme with a Canadian agent need, or a Type II DMF cross-reference is on your roadmap, a 30-minute discovery call clarifies fit before either side spends real time on a proposal.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 10;
  y = drawParagraph(
    page,
    "We start most conversations by reading the dossier draft or the regulatory engagement letter, not the marketing deck. The shape of the work is in the documents the sponsor already has.",
    {
      x: MARGIN,
      y,
      size: SIZE.body,
      font: ctx.fontReg,
      color: COLOR.body,
      maxWidth: CONTENT_WIDTH,
      lineHeight: LINE.body,
    },
  );
  y -= 14;

  // CTA box
  const ctaHeight = 100;
  page.drawRectangle({
    x: MARGIN,
    y: y - ctaHeight,
    width: CONTENT_WIDTH,
    height: ctaHeight,
    color: COLOR.navy,
  });
  drawLine(page, "DISCOVERY CALL", {
    x: MARGIN + 18,
    y: y - 22,
    size: SIZE.small,
    font: ctx.fontBold,
    color: COLOR.whiteSoft,
  });
  drawLine(page, "30 minutes. Clarifies fit before", {
    x: MARGIN + 18,
    y: y - 44,
    size: SIZE.coverSub,
    font: ctx.fontBold,
    color: COLOR.white,
  });
  drawLine(page, "either side spends real time on a proposal.", {
    x: MARGIN + 18,
    y: y - 62,
    size: SIZE.coverSub,
    font: ctx.fontBold,
    color: COLOR.white,
  });
  drawLine(page, "https://propharmex.com/contact?source=whitepaper-canadian-cdmo", {
    x: MARGIN + 18,
    y: y - 84,
    size: SIZE.body,
    font: ctx.fontReg,
    color: COLOR.whiteBlue,
  });

  y -= ctaHeight + 18;

  // Sources block
  drawLine(page, "PRIMARY SOURCES REFERENCED IN THIS GUIDE", {
    x: MARGIN,
    y,
    size: SIZE.small,
    font: ctx.fontBold,
    color: COLOR.primary,
  });
  y -= 14;
  /** @type {string[]} */
  const sources = [
    "Health Canada Drug Product Database - https://health-products.canada.ca/dpd-bdpp/",
    "Health Canada GUI-0002 (Good Manufacturing Practices guide)",
    "USFDA 21 CFR Part 314",
    "ICH Q2(R2), Q10, Q1A(R2), Q1B - https://www.ich.org/page/quality-guidelines",
    "WHO TRS Annex 2 (WHO-GMP)",
  ];
  for (const s of sources) {
    drawLine(page, "- " + s, {
      x: MARGIN,
      y,
      size: SIZE.small,
      font: ctx.fontReg,
      color: COLOR.muted,
    });
    y -= 12;
  }

  // Disclaimer at the bottom
  drawParagraph(
    page,
    "This whitepaper describes Propharmex's current operating model and is informational only. Specific engagement scope, regulatory pathways, and timelines depend on the sponsor, the molecule, the filing strategy, and the agency involved. The Health Canada DEL we hold authorizes specific activities on specific dosage-form and product categories at our Mississauga site; it does not constitute regulatory approval of any product the site handles. For advice tailored to your programme, contact our team or a qualified regulatory professional.",
    {
      x: MARGIN,
      y: 95,
      size: SIZE.caption,
      font: ctx.fontItalic,
      color: COLOR.muted,
      maxWidth: CONTENT_WIDTH,
      lineHeight: 12,
    },
  );

  drawFooter(page, ctx.fontReg, 10, PAGE_COUNT);
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const pdf = await PDFDocument.create();
  pdf.setTitle(TITLE);
  pdf.setAuthor("Propharmex");
  pdf.setSubject(
    "How a Canadian DEL site and an offshore development centre operate under one quality system",
  );
  pdf.setKeywords([
    "CDMO",
    "Canadian-anchored",
    "Health Canada DEL",
    "WHO-GMP",
    "ICH Q10",
    "Pharmaceutical services",
  ]);
  pdf.setProducer("Propharmex Editorial - pdf-lib");
  pdf.setCreator("Propharmex generate-whitepaper.mjs");
  pdf.setCreationDate(new Date());

  const fontReg = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  /** @type {Ctx} */
  const ctx = { pdf, fontReg, fontBold, fontItalic };

  buildCover(ctx);
  buildExecSummary(ctx);
  buildWhyThisExists(ctx);
  buildDelSite(ctx);
  buildDevelopmentCentre(ctx);
  buildOneQualitySystem(ctx);
  buildEngagementFlow(ctx);
  buildOperationalSeams(ctx);
  buildDecisionFramework(ctx);
  buildCtaPage(ctx);

  const bytes = await pdf.save();
  await writeFile(OUT_PATH, bytes);
  // eslint-disable-next-line no-console
  console.log(
    `[generate-whitepaper] wrote ${bytes.length.toLocaleString()} bytes to ${OUT_PATH}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[generate-whitepaper] failed:", err);
  process.exit(1);
});
