// @ts-check
/**
 * generate-whitepaper.mjs — produces /public/downloads/two-hub-operating-model.pdf
 *
 * One-off generator script for the Prompt-15 whitepaper lead magnet.
 *
 * Run with:  pnpm --filter web generate:whitepaper
 *
 * This is the short ~4-page version called for in the Prompt 15 plan
 * (commits 7-8). Cover + executive summary, the Mississauga hub, the
 * Hyderabad hub, decision framework + CTA. Full 8-12-page version is a
 * future commit; the file path stays the same so the gated form on
 * /insights/whitepapers/two-hub-operating-model needs no change.
 *
 * Library: pdf-lib (pure JS, no native deps, works on Windows / Linux /
 * macOS). Fonts are PDF standard (Helvetica family) — no font embedding
 * required so the artifact is small and reproducible across machines.
 *
 * Authored copy and citation rules match the brand-voice-guardian
 * conventions used in apps/web/content/insights.ts.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, "..", "public", "downloads");
const OUT_PATH = path.join(OUT_DIR, "two-hub-operating-model.pdf");

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                          */
/* -------------------------------------------------------------------------- */

const PAGE_WIDTH = 612; // US Letter pt
const PAGE_HEIGHT = 792;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR = {
  // Mirror og-default.svg + the site's --color-primary palette
  navy: rgb(0.04, 0.114, 0.2), // #0a1d33
  navyMid: rgb(0.09, 0.18, 0.31), // #172e4f
  primary: rgb(0.13, 0.32, 0.55), // ~indigo-700
  fg: rgb(0.07, 0.1, 0.15),
  body: rgb(0.2, 0.27, 0.35),
  muted: rgb(0.42, 0.47, 0.54),
  divider: rgb(0.85, 0.88, 0.92),
  paper: rgb(1, 1, 1),
  paperWarm: rgb(0.98, 0.985, 0.99),
};

const SIZE = {
  brand: 11,
  cover: 32,
  coverSub: 14,
  h1: 22,
  h2: 14,
  body: 10.5,
  caption: 9,
  small: 8.5,
};

const LINE = {
  body: 14.5,
  bullet: 14.5,
  h2: 18,
};

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
 * Draw a single line of text at (x, y).
 * @param {import("pdf-lib").PDFPage} page
 * @param {string} text
 * @param {{ x: number; y: number; size: number; font: import("pdf-lib").PDFFont; color: import("pdf-lib").Color }} opts
 */
function drawLine(page, text, opts) {
  page.drawText(text, opts);
}

/**
 * Draw a wrapped paragraph; returns the new y cursor (below the paragraph).
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
 * Draw a bulleted list. Returns the new y cursor.
 * @param {import("pdf-lib").PDFPage} page
 * @param {string[]} items
 * @param {{ x: number; y: number; font: import("pdf-lib").PDFFont; size: number; color: import("pdf-lib").Color; lineHeight: number; maxWidth: number; bulletColor: import("pdf-lib").Color }} opts
 * @returns {number}
 */
function drawBullets(page, items, opts) {
  let y = opts.y;
  const indent = 14;
  for (const item of items) {
    // bullet glyph
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
    y -= 4; // small gap between items
  }
  return y;
}

/**
 * Draw a thin divider rule.
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
  drawLine(page, "Propharmex - The two-hub operating model", {
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
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const pdf = await PDFDocument.create();
  pdf.setTitle("The two-hub operating model");
  pdf.setAuthor("Propharmex");
  pdf.setSubject(
    "Canadian regulatory authority and Indian analytical depth under one quality system",
  );
  pdf.setKeywords([
    "CDMO",
    "Two-hub",
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

  const PAGE_COUNT = 4;

  /* ----------------------------------------------------------------------- */
  /*  Page 1 — Cover + Executive summary                                     */
  /* ----------------------------------------------------------------------- */
  {
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Top navy band — ~38% of page
    const bandHeight = 300;
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - bandHeight,
      width: PAGE_WIDTH,
      height: bandHeight,
      color: COLOR.navy,
    });

    // Brand mark
    drawLine(page, "PROPHARMEX", {
      x: MARGIN,
      y: PAGE_HEIGHT - 70,
      size: SIZE.brand,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    drawLine(page, "Whitepaper", {
      x: MARGIN,
      y: PAGE_HEIGHT - 88,
      size: SIZE.small,
      font: fontReg,
      color: rgb(0.7, 0.78, 0.88),
    });

    // Title — wrap manually inside band
    const titleLines = wrapText(
      "The two-hub operating model",
      fontBold,
      SIZE.cover,
      CONTENT_WIDTH,
    );
    let titleY = PAGE_HEIGHT - 160;
    for (const line of titleLines) {
      drawLine(page, line, {
        x: MARGIN,
        y: titleY,
        size: SIZE.cover,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      titleY -= 38;
    }

    // Subtitle
    drawParagraph(
      page,
      "Canadian regulatory authority + Indian analytical depth, under one quality system. A field guide for sponsors evaluating CDMO partners.",
      {
        x: MARGIN,
        y: titleY - 8,
        size: SIZE.coverSub,
        font: fontReg,
        color: rgb(0.85, 0.9, 0.96),
        maxWidth: CONTENT_WIDTH - 60,
        lineHeight: 19,
      },
    );

    // Executive summary heading
    let y = PAGE_HEIGHT - bandHeight - 40;
    drawLine(page, "EXECUTIVE SUMMARY", {
      x: MARGIN,
      y,
      size: SIZE.brand,
      font: fontBold,
      color: COLOR.primary,
    });
    y -= 18;
    drawDivider(page, {
      x: MARGIN,
      y: y + 4,
      width: 40,
      color: COLOR.primary,
    });
    y -= 6;

    y = drawParagraph(
      page,
      "Propharmex is a Canada-anchored pharmaceutical services company. We operate from two hubs - Mississauga, Ontario, where we hold a Health Canada Drug Establishment Licence and run 3PL distribution, and Hyderabad, Telangana, where we run pharmaceutical development and analytical services. Our clients are drug developers globally - US generic sponsors, EU innovators, multilateral procurement agencies, and a handful of NGO programs.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );
    y -= 10;
    y = drawParagraph(
      page,
      "There is no bridge service offering between the two countries. The two-hub structure is how the company operates, not a productized intermediary role. The value is the operational discipline of running a Canadian DEL site and an Indian analytical bench under one quality system - for a global client base that cares less about geography than about whether the work lands on time, lands clean, and lands in a form their regulator accepts.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );
    y -= 10;
    y = drawParagraph(
      page,
      "What follows is a 4-page field guide: what lives at each hub, how a real engagement flows across both, the quality-system commitment behind the model, and a decision framework for sponsors evaluating CDMO partners.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontItalic,
        color: COLOR.muted,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );

    drawFooter(page, fontReg, 1, PAGE_COUNT);
  }

  /* ----------------------------------------------------------------------- */
  /*  Page 2 — The Mississauga hub                                           */
  /* ----------------------------------------------------------------------- */
  {
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - 70;

    drawLine(page, "HUB 01", {
      x: MARGIN,
      y,
      size: SIZE.brand,
      font: fontBold,
      color: COLOR.primary,
    });
    y -= 22;
    drawLine(page, "The Mississauga hub", {
      x: MARGIN,
      y,
      size: SIZE.h1,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= 8;
    drawLine(page, "Regulatory authority and release", {
      x: MARGIN,
      y,
      size: SIZE.coverSub,
      font: fontItalic,
      color: COLOR.muted,
    });
    y -= 24;
    drawDivider(page, {
      x: MARGIN,
      y,
      width: CONTENT_WIDTH,
      color: COLOR.divider,
    });
    y -= 22;

    y = drawParagraph(
      page,
      "The Mississauga site is the regulatory anchor. It holds a Health Canada Drug Establishment Licence and operates the Canadian-side quality, regulatory, and release functions: QP release where required, Canadian agent representation for foreign sponsors, primary point of contact with Health Canada, and 3PL distribution into the Canadian market. The site's quality system is the master quality system for the firm - not a regional copy.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );
    y -= 14;

    drawLine(page, "What this hub does", {
      x: MARGIN,
      y,
      size: SIZE.h2,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= LINE.h2;
    y = drawBullets(
      page,
      [
        "Holds the Health Canada Drug Establishment Licence under GUI-0002. The licence determines what activities the site is authorized to perform; it does not constitute regulatory approval of any product the site handles.",
        "Acts as Canadian agent for foreign sponsors, owning the relationship with Health Canada through application, inspection, amendment, and renewal.",
        "Runs Canadian-market release for all Canadian-bound product, including QP release where the regulatory pathway requires it.",
        "Operates 3PL distribution into the Canadian market - cold chain, controlled substances handling, recall infrastructure, and Division 2 quality system requirements.",
      ],
      {
        x: MARGIN,
        y,
        font: fontReg,
        size: SIZE.body,
        color: COLOR.body,
        lineHeight: LINE.bullet,
        maxWidth: CONTENT_WIDTH,
        bulletColor: COLOR.primary,
      },
    );
    y -= 8;

    drawLine(page, "What lives in the master quality system", {
      x: MARGIN,
      y,
      size: SIZE.h2,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= LINE.h2;
    y = drawParagraph(
      page,
      "SOPs are versioned centrally; deviations and CAPAs track in a single ledger with site-of-occurrence tagging; document control is single-source-of-truth; data integrity controls (ALCOA+) apply equally to work executed in Mississauga and in Hyderabad. When a sponsor's auditor or a regulator requests a document, the answer is the same regardless of which site executed the work.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );

    // Primary source callout (regulatory)
    y -= 18;
    const calloutHeight = 64;
    page.drawRectangle({
      x: MARGIN,
      y: y - calloutHeight,
      width: CONTENT_WIDTH,
      height: calloutHeight,
      color: COLOR.paperWarm,
      borderWidth: 0.6,
      borderColor: COLOR.primary,
    });
    drawLine(page, "PRIMARY SOURCE", {
      x: MARGIN + 14,
      y: y - 18,
      size: SIZE.small,
      font: fontBold,
      color: COLOR.primary,
    });
    drawParagraph(
      page,
      "Propharmex's Drug Establishment Licence at the Mississauga site is verifiable through the Health Canada Drug Product Database (as of 2026-04-23).",
      {
        x: MARGIN + 14,
        y: y - 32,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH - 28,
        lineHeight: LINE.body,
      },
    );

    drawFooter(page, fontReg, 2, PAGE_COUNT);
  }

  /* ----------------------------------------------------------------------- */
  /*  Page 3 — The Hyderabad hub                                             */
  /* ----------------------------------------------------------------------- */
  {
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - 70;

    drawLine(page, "HUB 02", {
      x: MARGIN,
      y,
      size: SIZE.brand,
      font: fontBold,
      color: COLOR.primary,
    });
    y -= 22;
    drawLine(page, "The Hyderabad hub", {
      x: MARGIN,
      y,
      size: SIZE.h1,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= 8;
    drawLine(page, "Development bench and analytical depth", {
      x: MARGIN,
      y,
      size: SIZE.coverSub,
      font: fontItalic,
      color: COLOR.muted,
    });
    y -= 24;
    drawDivider(page, {
      x: MARGIN,
      y,
      width: CONTENT_WIDTH,
      color: COLOR.divider,
    });
    y -= 22;

    y = drawParagraph(
      page,
      "The Hyderabad site is the development and analytical hub. It runs formulation development across oral solids, oral liquids, sterile injectables, and topicals; analytical method development and validation; stability programs across ICH and WHO climatic zones; and tech-transfer execution into manufacturing partners. The site operates under WHO-GMP, with capability for sponsor or regulatory audits at standard cadence.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );
    y -= 14;

    drawLine(page, "Continuity, not project teams", {
      x: MARGIN,
      y,
      size: SIZE.h2,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= LINE.h2;
    y = drawParagraph(
      page,
      "The development bench in Hyderabad runs continuously, not episodically. A sponsor engagement does not stand up a project team from scratch - it is allocated to a development pod with formulation, analytical, and regulatory representation already configured. That continuity is the depth.",
      {
        x: MARGIN,
        y,
        size: SIZE.body,
        font: fontReg,
        color: COLOR.body,
        maxWidth: CONTENT_WIDTH,
        lineHeight: LINE.body,
      },
    );
    y -= 14;

    drawLine(page, "How an engagement flows across both", {
      x: MARGIN,
      y,
      size: SIZE.h2,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= LINE.h2;
    y = drawBullets(
      page,
      [
        "Scope and quality plan finalized at Mississauga, with a Canadian Quality Agreement that sets data ownership, audit rights, and release path.",
        "Formulation and analytical work executed at Hyderabad: formulation studies, method development, validation under ICH Q2(R2), stability initiated under appropriate climatic zone.",
        "Tech-transfer package authored at Hyderabad, reviewed against the Canadian quality system at Mississauga, frozen for execution.",
        "Manufacturing executed at the designated commercial site; Hyderabad runs release testing on a cross-validated method; Mississauga performs Canadian release for any Canadian-bound product.",
        "Filing authored cross-site - analytical and CMC sections drafted in Hyderabad with US/Canadian regulatory editorial in Mississauga.",
      ],
      {
        x: MARGIN,
        y,
        font: fontReg,
        size: SIZE.body,
        color: COLOR.body,
        lineHeight: LINE.bullet,
        maxWidth: CONTENT_WIDTH,
        bulletColor: COLOR.primary,
      },
    );

    drawFooter(page, fontReg, 3, PAGE_COUNT);
  }

  /* ----------------------------------------------------------------------- */
  /*  Page 4 — Decision framework + CTA                                      */
  /* ----------------------------------------------------------------------- */
  {
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - 70;

    drawLine(page, "DECISION FRAMEWORK", {
      x: MARGIN,
      y,
      size: SIZE.brand,
      font: fontBold,
      color: COLOR.primary,
    });
    y -= 22;
    drawLine(page, "When this model is the right answer", {
      x: MARGIN,
      y,
      size: SIZE.h1,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= 24;
    drawDivider(page, {
      x: MARGIN,
      y,
      width: CONTENT_WIDTH,
      color: COLOR.divider,
    });
    y -= 22;

    drawLine(page, "It IS the right answer when:", {
      x: MARGIN,
      y,
      size: SIZE.h2,
      font: fontBold,
      color: COLOR.fg,
    });
    y -= LINE.h2;
    y = drawBullets(
      page,
      [
        "You need Canadian regulatory authority (DEL holder, Canadian agent, Health Canada relationship) AND analytical or development depth in the same engagement.",
        "Your filing reach is global (US, Canada, EU, WHO-roster markets) rather than single-region.",
        "You would otherwise be running a multi-vendor program: one Canadian regulatory consultant, one Indian analytical lab, a separate Canadian 3PL - and you want the consolidation under one quality system.",
        "You value data and document continuity across the development-to-release pipeline more than you value lowest-bidder pricing on each individual workstream.",
      ],
      {
        x: MARGIN,
        y,
        font: fontReg,
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
      font: fontBold,
      color: COLOR.fg,
    });
    y -= LINE.h2;
    y = drawBullets(
      page,
      [
        "You need single-site, single-region work where neither Canadian nor Indian operations meaningfully add value.",
        "You are optimizing strictly on per-unit manufacturing cost on a commodity product.",
        "Your timeline forecloses any cross-site coordination; same-site execution is the constraint.",
      ],
      {
        x: MARGIN,
        y,
        font: fontReg,
        size: SIZE.body,
        color: COLOR.body,
        lineHeight: LINE.bullet,
        maxWidth: CONTENT_WIDTH,
        bulletColor: COLOR.muted,
      },
    );
    y -= 14;

    // CTA box
    const ctaHeight = 90;
    page.drawRectangle({
      x: MARGIN,
      y: y - ctaHeight,
      width: CONTENT_WIDTH,
      height: ctaHeight,
      color: COLOR.navy,
    });
    drawLine(page, "TALK TO THE TEAM", {
      x: MARGIN + 18,
      y: y - 22,
      size: SIZE.small,
      font: fontBold,
      color: rgb(0.7, 0.78, 0.88),
    });
    drawLine(page, "A 30-minute call clarifies fit before either", {
      x: MARGIN + 18,
      y: y - 40,
      size: SIZE.coverSub,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    drawLine(page, "side spends real time on a proposal.", {
      x: MARGIN + 18,
      y: y - 58,
      size: SIZE.coverSub,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    drawLine(page, "https://propharmex.com/contact?source=whitepaper-two-hub", {
      x: MARGIN + 18,
      y: y - 78,
      size: SIZE.body,
      font: fontReg,
      color: rgb(0.78, 0.86, 0.95),
    });

    // Disclaimer at bottom
    drawParagraph(
      page,
      "This whitepaper describes our current operating model and is informational only. Specific engagement scope, regulatory pathways, and timelines depend on the sponsor, the molecule, and the filing strategy. For advice tailored to your program, contact our team or a qualified regulatory professional.",
      {
        x: MARGIN,
        y: 95,
        size: SIZE.caption,
        font: fontItalic,
        color: COLOR.muted,
        maxWidth: CONTENT_WIDTH,
        lineHeight: 12,
      },
    );

    drawFooter(page, fontReg, 4, PAGE_COUNT);
  }

  /* ----------------------------------------------------------------------- */
  /*  Write                                                                  */
  /* ----------------------------------------------------------------------- */

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
