import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Propharmex — Canadian pharmaceutical services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_PRIMARY = "#0E4C5A";
const BRAND_PRIMARY_700 = "#0A3742";
const BRAND_BG = "#FAFAF7";
const BRAND_FG = "#0F1417";
const BRAND_SLATE = "#4B5560";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: `linear-gradient(135deg, ${BRAND_BG} 0%, #F0EBE0 100%)`,
          padding: "72px 96px",
          fontFamily:
            "-apple-system, system-ui, 'Segoe UI', sans-serif",
          color: BRAND_FG,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: BRAND_PRIMARY,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND_BG,
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: BRAND_PRIMARY_700,
            }}
          >
            Propharmex
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: BRAND_FG,
              maxWidth: "880px",
            }}
          >
            Pharmaceutical development, analytical, regulatory, distribution.
          </div>
          <div
            style={{
              fontSize: "28px",
              lineHeight: 1.4,
              color: BRAND_SLATE,
              maxWidth: "820px",
            }}
          >
            Canadian-anchored under Health Canada Drug Establishment Licence.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: BRAND_SLATE,
            fontSize: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span>Mississauga, ON</span>
            <span style={{ color: "#C7CCD2" }}>·</span>
            <span>Hyderabad, IN</span>
          </div>
          <div style={{ color: BRAND_PRIMARY_700, fontWeight: 600 }}>
            propharmex.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
