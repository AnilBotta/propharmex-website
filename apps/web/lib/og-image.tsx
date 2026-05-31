import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_CONTENT_TYPE = "image/png";

const BRAND_PRIMARY = "#0E4C5A";
const BRAND_PRIMARY_700 = "#0A3742";
const BRAND_BG = "#FAFAF7";
const BRAND_FG = "#0F1417";
const BRAND_SLATE = "#4B5560";
const BRAND_LINE = "#D9DDD9";

interface PropharmexOgImageOptions {
  eyebrow: string;
  title: string;
  description: string;
  footer?: string;
}

export function renderPropharmexOgImage({
  eyebrow,
  title,
  description,
  footer = "Canada-headquartered pharmaceutical services",
}: PropharmexOgImageOptions) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BRAND_BG,
        backgroundImage: `linear-gradient(135deg, ${BRAND_BG} 0%, #F0EBE0 100%)`,
        padding: "64px 88px",
        fontFamily: "-apple-system, system-ui, 'Segoe UI', sans-serif",
        color: BRAND_FG,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: BRAND_PRIMARY,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BRAND_BG,
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          P
        </div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: 650,
            color: BRAND_PRIMARY_700,
          }}
        >
          Propharmex
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        <div
          style={{
            color: BRAND_PRIMARY,
            display: "flex",
            fontSize: "20px",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            color: BRAND_FG,
            display: "flex",
            fontSize: "54px",
            fontWeight: 650,
            lineHeight: 1.12,
            maxWidth: "980px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: BRAND_SLATE,
            display: "flex",
            fontSize: "25px",
            lineHeight: 1.35,
            maxWidth: "900px",
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: `1px solid ${BRAND_LINE}`,
          color: BRAND_SLATE,
          display: "flex",
          fontSize: "20px",
          justifyContent: "space-between",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex" }}>{footer}</div>
        <div
          style={{
            color: BRAND_PRIMARY_700,
            display: "flex",
            fontWeight: 700,
          }}
        >
          propharmex.com
        </div>
      </div>
    </div>,
    OG_IMAGE_SIZE
  );
}
