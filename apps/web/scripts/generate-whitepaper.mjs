// @ts-check
/**
 * generate-whitepaper.mjs - produces the live ICH Q2(R2) gated whitepaper.
 *
 * Run with: pnpm --filter web generate:whitepaper
 *
 * The generated PDF is intentionally informational. It uses ICH primary-source
 * posture, includes an as-of date and disclaimer, and avoids retired
 * study-execution positioning outside analytical-method review.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SLUG = "analytical-method-validation-readiness-ich-q2-r2";
const OUT_DIR = path.resolve(__dirname, "..", "public", "downloads", "whitepapers");
const OUT_PATH = path.join(OUT_DIR, `${SLUG}.pdf`);

const TITLE = "Analytical Method Validation Readiness Under ICH Q2(R2)";
const SUBTITLE =
  "A source-anchored briefing for sponsors reviewing analytical validation packages, Q14 development records, and filing-readiness documentation.";
const DISCLAIMER =
  "This content is informational and reflects Propharmex's understanding of ICH Q2(R2) and ICH Q14 as of 2026-06-02. It is not regulatory advice and does not guarantee any filing outcome.";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR = {
  primary: rgb(0.055, 0.298, 0.353),
  primaryDark: rgb(0.065, 0.196, 0.231),
  amber: rgb(0.788, 0.604, 0.294),
  fg: rgb(0.12, 0.16, 0.22),
  muted: rgb(0.36, 0.42, 0.49),
  border: rgb(0.85, 0.88, 0.91),
  surface: rgb(0.94, 0.97, 0.98),
  white: rgb(1, 1, 1),
};

const pages = [
  {
    title: "Executive Summary",
    body: [
      "ICH Q2(R2) moves analytical procedure validation into a clearer lifecycle context. For sponsors, the practical work is not simply running validation tests. It is showing that protocol design, acceptance criteria, development records, and the final analytical procedure description tell one coherent story.",
      "Review validation packages against intended use, not as generic method files.",
      "Connect Q14 development rationale to Q2(R2) validation evidence where the method is new or materially revised.",
      "Predefine acceptance criteria and keep the chain from specification to validation criterion visible.",
      "Treat robustness, reportable range, and stability-indicating evidence as common review-risk areas.",
      "Keep regulatory conclusions qualified; region-specific filing decisions require dossier-specific review.",
    ],
    callout:
      "Recommended use: treat this briefing as a readiness checklist before dossier authoring, deficiency response work, or external analytical package review.",
  },
  {
    title: "Source Posture and Scope",
    body: [
      "The primary source for this briefing is ICH Q2(R2), Validation of Analytical Procedures, final version adopted at Step 4 in November 2023, with the ICH-published error-correction PDF available in 2025. Q14, Analytical Procedure Development, is used as the companion lifecycle source.",
      "This briefing does not interpret a specific regulator's regional implementation position, does not assess a product dossier, and does not advise whether a submitted package needs an amendment.",
      "In scope: release and stability analytical procedures for commercial drug substances and products; validation evidence for assay, potency, purity, impurity, identity, and other quantitative or qualitative measurements; and documentation readiness across protocol, report, development rationale, control strategy, and submission narrative.",
      "Out of scope: human-study execution, study-sample operations, CRO-managed study work, product-specific regulatory advice, approval predictions, or unsupported licence/facility claims.",
    ],
  },
  {
    title: "Protocol and Intended Use",
    body: [
      "Q2(R2) centers validation on whether an analytical procedure is fit for its intended purpose. The first readiness question is therefore simple: can a reviewer understand what the procedure is intended to measure, in which matrix, over which range, and against which acceptance criteria?",
      "The validation protocol should identify the procedure, product, matrix, analyte, method category, and intended use.",
      "Each planned validation characteristic should be justified against the method type and intended measurement.",
      "Acceptance criteria should be predefined and justified, rather than back-filled after data review.",
      "Reference materials or suitably characterized materials should be identified and controlled.",
    ],
    callout:
      "Readiness signal: a protocol reviewer can trace every validation test to an intended-use statement and every acceptance criterion to a specification, method objective, or science-based rationale.",
  },
  {
    title: "Evidence and Lifecycle Alignment",
    body: [
      "Q14 makes development history more visible. It is not enough for a new method to pass validation if the development rationale, parameter choices, analytical target profile, and control strategy are scattered or inconsistent with the final procedure.",
      "Specificity or selectivity evidence should address likely interference for the product and method purpose.",
      "Accuracy and precision data should cover the reportable range with appropriate replication and statistical treatment.",
      "Range, lower-limit, and calibration decisions should be documented with the method's intended use in mind.",
      "Robustness factors should be deliberately selected and tied back to operating conditions or procedure controls.",
      "Development records should explain why final procedure parameters were selected and how known risks carry into validation controls.",
    ],
  },
  {
    title: "Documentation Checklist",
    body: [
      "Use this page as a first-pass review before a validation package moves into dossier authoring or external review. A missing item does not automatically mean non-compliance, but it should trigger a documented decision.",
      "Protocol: intended use, method category, validation characteristics, acceptance criteria, material controls, and statistical approach are explicit.",
      "Report: deviations, data exclusions, calculations, and final conclusions are traceable to the approved protocol.",
      "Q14 alignment: development rationale, analytical procedure control strategy, and parameter choices are cross-referenced where relevant.",
      "Submission narrative: CTD sections use the same method description, acceptance criteria, and validation conclusion language.",
      "Review log: any regional or product-specific interpretation is labelled as an internal decision, not a generic regulatory rule.",
    ],
    callout:
      "Propharmex use case: this checklist supports analytical package review, validation addendum scoping, method-transfer readiness review, and stability-method documentation review. It stays within analytical-method review and documentation support.",
  },
  {
    title: "Common Review Risks",
    body: [
      "Implicit acceptance criteria: validation reports sometimes show passing data without a clear chain to predefined criteria. The fix is usually documentation discipline: state criteria before execution and explain why they fit the intended use.",
      "Thin robustness rationale: a robustness section can be technically complete but still weak if factor selection looks arbitrary. A stronger package explains why selected variables matter and how results affect the procedure description.",
      "Development records disconnected from validation: for new or substantially revised methods, the analytical target, control strategy, and parameter ranges should be visible in the validation story.",
      "Overstated conclusions: a validation package can support suitability of a procedure for an intended purpose. It should not promise a regulator's conclusion, product approval, or a universal regional outcome.",
    ],
  },
  {
    title: "Sources and Disclaimer",
    body: [
      "Primary sources reviewed as of 2026-06-02:",
      "ICH. Validation of Analytical Procedures Q2(R2). Final version adopted 2023-11-01; ICH-published PDF and 2025 error-correction PDF. https://database.ich.org/sites/default/files/ICH_Q2%28R2%29_Guideline_2023_1130_ErrorCorrection_2025.pdf",
      "ICH. Analytical Procedure Development Q14. Final version adopted 2023; ICH-published PDF and 2025 error-correction PDF. https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf",
      "ICH Quality Guidelines index. https://www.ich.org/page/quality-guidelines",
      DISCLAIMER,
      "For an analytical package review, method-validation readiness discussion, or scoped documentation review, contact Propharmex at propharmex.com/contact?source=whitepaper-followup.",
    ],
  },
];

function wrapText(text, font, size, maxWidth) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawParagraph(page, text, opts) {
  const lines = wrapText(text, opts.font, opts.size, opts.maxWidth);
  let y = opts.y;
  for (const line of lines) {
    page.drawText(line, {
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

function drawFooter(page, pageNo, font) {
  page.drawLine({
    start: { x: MARGIN, y: 42 },
    end: { x: PAGE_WIDTH - MARGIN, y: 42 },
    thickness: 0.5,
    color: COLOR.border,
  });
  const text = `Propharmex | propharmex.com/insights/whitepapers/${SLUG} | ${pageNo}`;
  const width = font.widthOfTextAtSize(text, 7.5);
  page.drawText(text, {
    x: (PAGE_WIDTH - width) / 2,
    y: 25,
    size: 7.5,
    font,
    color: COLOR.muted,
  });
}

function drawCover(page, fonts) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLOR.primary });
  page.drawCircle({ x: PAGE_WIDTH * 0.86, y: PAGE_HEIGHT * 0.78, size: 145, color: COLOR.primaryDark });
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: 18, color: COLOR.amber });
  page.drawText("PROPHARMEX", { x: MARGIN, y: PAGE_HEIGHT - 70, size: 9, font: fonts.bold, color: COLOR.white });
  page.drawText("Whitepaper | Published 2026-06-02", {
    x: PAGE_WIDTH - MARGIN - 158,
    y: PAGE_HEIGHT - 70,
    size: 8,
    font: fonts.regular,
    color: COLOR.white,
  });
  let y = PAGE_HEIGHT - 125;
  y = drawParagraph(page, TITLE, {
    x: MARGIN,
    y,
    size: 30,
    font: fonts.bold,
    color: COLOR.white,
    maxWidth: CONTENT_WIDTH - 45,
    lineHeight: 36,
  });
  y -= 26;
  y = drawParagraph(page, SUBTITLE, {
    x: MARGIN,
    y,
    size: 13,
    font: fonts.regular,
    color: COLOR.white,
    maxWidth: CONTENT_WIDTH - 60,
    lineHeight: 19,
  });
  y -= 34;
  drawParagraph(page, DISCLAIMER, {
    x: MARGIN,
    y,
    size: 13,
    font: fonts.regular,
    color: COLOR.white,
    maxWidth: CONTENT_WIDTH - 60,
    lineHeight: 19,
  });
}

function drawContentPage(page, section, pageNo, fonts) {
  page.drawText(section.title, {
    x: MARGIN,
    y: PAGE_HEIGHT - 82,
    size: 20,
    font: fonts.bold,
    color: COLOR.primary,
  });
  let y = PAGE_HEIGHT - 122;
  for (const paragraph of section.body) {
    y = drawParagraph(page, paragraph, {
      x: MARGIN,
      y,
      size: 10,
      font: fonts.regular,
      color: COLOR.fg,
      maxWidth: CONTENT_WIDTH,
      lineHeight: 15,
    });
    y -= 9;
  }
  if (section.callout) {
    page.drawRectangle({
      x: MARGIN,
      y: y - 52,
      width: CONTENT_WIDTH,
      height: 58,
      color: COLOR.surface,
      borderColor: COLOR.border,
      borderWidth: 0.5,
    });
    drawParagraph(page, section.callout, {
      x: MARGIN + 12,
      y: y - 16,
      size: 9,
      font: fonts.regular,
      color: COLOR.fg,
      maxWidth: CONTENT_WIDTH - 24,
      lineHeight: 13,
    });
  }
  drawFooter(page, pageNo, fonts.regular);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };

  drawCover(pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]), fonts);
  for (let i = 0; i < pages.length; i += 1) {
    drawContentPage(pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]), pages[i], i + 1, fonts);
  }

  await writeFile(OUT_PATH, await pdf.save());
  console.log(`Generated ${OUT_PATH}`);
}

await main();
