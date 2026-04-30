"""
Generate the launch checklist PDF as docs/launch-checklist.pdf.

Source of truth: docs/launch-checklist.md.
Output: docs/launch-checklist.pdf — the customer-facing copy that
ops, engineering, and legal countersign before cutover.

This is a one-shot generator. Editorial changes happen in the
markdown; the PDF is regenerated. Hard-coded structure asserts
catch content-drift between the two.

Run:
    py scripts/generate-launch-checklist-pdf.py

Requirements:
    py -m pip install reportlab==4.2.5

Mirrors scripts/generate-acr-docx.py and scripts/generate-handoff-docx.py
on the markdown-parsing front end + structure-assert posture; differs
only in the rendering back end (reportlab platypus rather than
python-docx). Brand palette duplicated from
packages/config/design-tokens.css — keep in sync if the brand shifts.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import (
        BaseDocTemplate,
        Frame,
        HRFlowable,
        ListFlowable,
        ListItem,
        PageBreak,
        PageTemplate,
        Paragraph,
        Spacer,
        Table,
        TableStyle,
    )
except ImportError as exc:
    print(
        "Missing dependency. Install with:\n  py -m pip install reportlab==4.2.5",
        file=sys.stderr,
    )
    raise SystemExit(1) from exc


# Brand tokens duplicated from packages/config/design-tokens.css. Keep
# in sync if the brand palette ever shifts.
BRAND_PRIMARY_HEX = "#0E4C5A"
BRAND_FG_HEX = "#1F2933"
BRAND_MUTED_HEX = "#5F6573"
BRAND_TABLE_HEADER_BG_HEX = "#EBF4F6"
BRAND_BORDER_HEX = "#D6D8DD"


REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PATH = REPO_ROOT / "docs" / "launch-checklist.md"
OUTPUT_PATH = REPO_ROOT / "docs" / "launch-checklist.pdf"


# ---------------------------------------------------------------------------
# Markdown parsing — same minimal subset as the .docx generators.
# ---------------------------------------------------------------------------

HEADING_RE = re.compile(r"^(#{1,4})\s+(.*)$")
TABLE_ROW_RE = re.compile(r"^\|(.+)\|\s*$")
TABLE_DIVIDER_RE = re.compile(r"^\|[\s\-:|]+\|\s*$")
LIST_RE = re.compile(r"^[-*]\s+(.*)$")
HR_RE = re.compile(r"^---\s*$")


def strip_markdown(text: str) -> str:
    """Strip a tiny subset of inline markdown — enough for table cells + body."""
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = text.replace("&rsquo;", "’").replace("&apos;", "'")
    return text.strip()


def pdf_safe(text: str) -> str:
    """
    Escape HTML-significant characters so ReportLab's mini-XML Paragraph
    parser doesn't try to interpret literal '<link rel="canonical">' or
    similar markdown-content as real markup. Order matters: escape '&'
    first to avoid double-encoding the '&' we just emitted.
    """
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def split_table_row(line: str) -> list[str]:
    inner = line.strip().strip("|")
    cells = [c.strip() for c in inner.split("|")]
    return [strip_markdown(c) for c in cells]


def parse_markdown(md_text: str) -> list[tuple[str, object]]:
    blocks: list[tuple[str, object]] = []
    lines = md_text.splitlines()
    i = 0

    def flush_paragraph(buf: list[str]) -> None:
        if buf:
            text = strip_markdown(" ".join(buf).strip())
            if text:
                blocks.append(("paragraph", text))

    paragraph_buf: list[str] = []

    while i < len(lines):
        line = lines[i]

        m = HEADING_RE.match(line)
        if m:
            flush_paragraph(paragraph_buf)
            paragraph_buf = []
            level = len(m.group(1))
            blocks.append(("heading", (level, strip_markdown(m.group(2)))))
            i += 1
            continue

        if HR_RE.match(line):
            flush_paragraph(paragraph_buf)
            paragraph_buf = []
            blocks.append(("hr", None))
            i += 1
            continue

        if TABLE_ROW_RE.match(line) and i + 1 < len(lines) and TABLE_DIVIDER_RE.match(lines[i + 1]):
            flush_paragraph(paragraph_buf)
            paragraph_buf = []
            rows: list[list[str]] = []
            rows.append(split_table_row(line))
            i += 2  # skip header + divider
            while i < len(lines) and TABLE_ROW_RE.match(lines[i]):
                rows.append(split_table_row(lines[i]))
                i += 1
            blocks.append(("table", rows))
            continue

        m = LIST_RE.match(line)
        if m:
            flush_paragraph(paragraph_buf)
            paragraph_buf = []
            items: list[str] = []
            while i < len(lines):
                m2 = LIST_RE.match(lines[i])
                if not m2:
                    break
                items.append(strip_markdown(m2.group(1)))
                i += 1
            blocks.append(("list", items))
            continue

        if line.strip() == "":
            flush_paragraph(paragraph_buf)
            paragraph_buf = []
            i += 1
            continue

        paragraph_buf.append(line.strip())
        i += 1

    flush_paragraph(paragraph_buf)
    return blocks


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=colors.HexColor(BRAND_PRIMARY_HEX),
            spaceBefore=6,
            spaceAfter=12,
            alignment=TA_LEFT,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor(BRAND_PRIMARY_HEX),
            spaceBefore=14,
            spaceAfter=6,
            alignment=TA_LEFT,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor(BRAND_PRIMARY_HEX),
            spaceBefore=8,
            spaceAfter=4,
            alignment=TA_LEFT,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor(BRAND_FG_HEX),
            spaceAfter=6,
            alignment=TA_LEFT,
        ),
        "table_header": ParagraphStyle(
            "table_header",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor(BRAND_PRIMARY_HEX),
            alignment=TA_LEFT,
        ),
        "table_body": ParagraphStyle(
            "table_body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor(BRAND_FG_HEX),
            alignment=TA_LEFT,
        ),
        "list_item": ParagraphStyle(
            "list_item",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor(BRAND_FG_HEX),
            alignment=TA_LEFT,
        ),
    }


def build_table(rows: list[list[str]], styles: dict[str, ParagraphStyle]) -> Table:
    """Wrap each cell in a Paragraph so reportlab applies fonts + wraps text."""
    if not rows:
        return Spacer(1, 0)

    body: list[list[Paragraph]] = []
    for r_idx, row in enumerate(rows):
        styled_row: list[Paragraph] = []
        for cell in row:
            style = styles["table_header"] if r_idx == 0 else styles["table_body"]
            # Escape FIRST, then re-introduce <br/> for any literal newlines
            # in the source. Order matters — pdf_safe would otherwise turn
            # the <br/> we add into &lt;br/&gt;.
            safe = pdf_safe(cell).replace("\n", "<br/>")
            styled_row.append(Paragraph(safe, style))
        body.append(styled_row)

    table = Table(body, repeatRows=1, hAlign="LEFT")

    style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(BRAND_TABLE_HEADER_BG_HEX)),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor(BRAND_BORDER_HEX)),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]
    )
    table.setStyle(style)
    return table


def render_pdf(blocks: list[tuple[str, object]]) -> None:
    styles = make_styles()

    page_width, page_height = LETTER
    left = right = 0.8 * inch
    top = bottom = 0.75 * inch
    frame = Frame(
        left,
        bottom,
        page_width - left - right,
        page_height - top - bottom,
        id="content",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        showBoundary=0,
    )

    doc = BaseDocTemplate(
        str(OUTPUT_PATH),
        pagesize=LETTER,
        leftMargin=left,
        rightMargin=right,
        topMargin=top,
        bottomMargin=bottom,
        title="Propharmex launch checklist",
        author="Propharmex engineering",
    )
    doc.addPageTemplates([PageTemplate(id="default", frames=[frame])])

    story = []

    for kind, payload in blocks:
        if kind == "heading":
            level, text = payload  # type: ignore[misc]
            style_name = "h1" if level == 1 else "h2" if level == 2 else "h3"
            story.append(Paragraph(pdf_safe(text), styles[style_name]))
        elif kind == "paragraph":
            story.append(Paragraph(pdf_safe(payload), styles["body"]))  # type: ignore[arg-type]
        elif kind == "list":
            items = [
                ListItem(Paragraph(pdf_safe(text), styles["list_item"]), leftIndent=8)
                for text in payload  # type: ignore[union-attr]
            ]
            story.append(ListFlowable(items, bulletType="bullet", start="•"))
            story.append(Spacer(1, 4))
        elif kind == "table":
            story.append(Spacer(1, 2))
            story.append(build_table(payload, styles))  # type: ignore[arg-type]
            story.append(Spacer(1, 6))
        elif kind == "hr":
            story.append(Spacer(1, 4))
            story.append(
                HRFlowable(
                    width="100%",
                    thickness=0.4,
                    color=colors.HexColor(BRAND_BORDER_HEX),
                    spaceBefore=4,
                    spaceAfter=4,
                )
            )

    doc.build(story)


# ---------------------------------------------------------------------------
# Structure asserts — catch silent content-drift
# ---------------------------------------------------------------------------


def assert_structure(blocks: list[tuple[str, object]]) -> None:
    headings = [
        (level, text)
        for kind, payload in blocks
        if kind == "heading"
        for (level, text) in [payload]  # type: ignore[misc]
    ]
    h1s = [t for (lvl, t) in headings if lvl == 1]
    h2s = [t for (lvl, t) in headings if lvl == 2]

    assert len(h1s) == 1, f"Expected exactly 1 H1, got {len(h1s)}: {h1s}"
    assert h1s[0].startswith("Launch checklist"), (
        f"H1 should be the launch-checklist title, got: {h1s[0]!r}"
    )

    expected_h2_prefixes = [
        "1. Purpose and scope",
        "2. Pre-launch gates",
        "3. Staging sign-off",
        "4. Launch-day sequence",
        "5. Rollback plan",
        "6. Post-launch tasks",
        "7. Out of scope",
        "8. Sign-off",
        "9. Revision history",
    ]
    for prefix in expected_h2_prefixes:
        assert any(h.startswith(prefix) for h in h2s), (
            f"Missing expected H2 starting with {prefix!r}. Got H2s: {h2s}"
        )

    tables = [payload for kind, payload in blocks if kind == "table"]
    assert len(tables) >= 12, (
        f"Expected at least 12 tables (CI gates, content, DNS+TLS, email, AI, "
        f"observability, SEO, a11y, legal, launch-day sequence, post-launch, "
        f"sign-off, revision history). Got {len(tables)}."
    )


def main() -> None:
    if not SOURCE_PATH.exists():
        print(f"Source not found: {SOURCE_PATH}", file=sys.stderr)
        raise SystemExit(1)

    md_text = SOURCE_PATH.read_text(encoding="utf-8")
    blocks = parse_markdown(md_text)
    assert_structure(blocks)
    render_pdf(blocks)
    rel = OUTPUT_PATH.relative_to(REPO_ROOT)
    print(f"Wrote {rel} - {len(blocks)} blocks rendered.")


if __name__ == "__main__":
    main()
