import { describe, expect, it } from "vitest";

import { classifyDevice } from "./device";

describe("classifyDevice", () => {
  it("returns desktop when no UA is provided", () => {
    expect(classifyDevice(undefined)).toBe("desktop");
    expect(classifyDevice(null)).toBe("desktop");
    expect(classifyDevice("")).toBe("desktop");
  });

  it("classifies common iPhone UA as mobile", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(classifyDevice(ua)).toBe("mobile");
  });

  it("classifies Android phone UA as mobile", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36";
    expect(classifyDevice(ua)).toBe("mobile");
  });

  it("classifies Android tablet (no Mobile token) as tablet", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 14; Pixel Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
    expect(classifyDevice(ua)).toBe("tablet");
  });

  it("classifies legacy iPad UA as tablet", () => {
    const ua =
      "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    expect(classifyDevice(ua)).toBe("tablet");
  });

  it("classifies modern iPadOS (masquerading as Mac) as tablet via touch points", () => {
    // iPad Safari 13+ reports Mac UA — fall back to platform + touch.
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
    expect(
      classifyDevice(ua, { platform: "MacIntel", maxTouchPoints: 5 }),
    ).toBe("tablet");
  });

  it("classifies Mac with no touch as desktop", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
    expect(
      classifyDevice(ua, { platform: "MacIntel", maxTouchPoints: 0 }),
    ).toBe("desktop");
  });

  it("classifies Windows Chrome desktop as desktop", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
    expect(classifyDevice(ua)).toBe("desktop");
  });
});
