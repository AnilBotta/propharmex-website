import { describe, expect, it } from "vitest";

import { readCookieFromHeader, readRegionFromCookie } from "./region-cookie";

describe("readCookieFromHeader", () => {
  it("returns undefined when the cookie is absent", () => {
    expect(readCookieFromHeader("foo=bar; baz=qux", "px-region")).toBeUndefined();
  });

  it("reads a present cookie value", () => {
    expect(readCookieFromHeader("px-region=CA", "px-region")).toBe("CA");
  });

  it("decodes URL-encoded cookie values", () => {
    expect(readCookieFromHeader("px-region=CA%20X", "px-region")).toBe("CA X");
  });

  it("handles multiple cookies and trims whitespace", () => {
    expect(
      readCookieFromHeader(
        "session=abc;  px-region=US  ;  other=zzz",
        "px-region",
      ),
    ).toBe("US");
  });

  it("returns undefined on empty header", () => {
    expect(readCookieFromHeader("", "px-region")).toBeUndefined();
  });
});

describe("readRegionFromCookie", () => {
  it("returns the region when the cookie value is canonical", () => {
    expect(readRegionFromCookie("px-region=CA")).toBe("CA");
    expect(readRegionFromCookie("px-region=US")).toBe("US");
    expect(readRegionFromCookie("px-region=IN")).toBe("IN");
    expect(readRegionFromCookie("px-region=GLOBAL")).toBe("GLOBAL");
  });

  it("returns undefined when the cookie value is not in the schema", () => {
    expect(readRegionFromCookie("px-region=mars")).toBeUndefined();
    // Lowercase is not a valid region per the Prompt 22 schema.
    expect(readRegionFromCookie("px-region=ca")).toBeUndefined();
  });

  it("returns undefined when the cookie is missing entirely", () => {
    expect(readRegionFromCookie("session=abc")).toBeUndefined();
  });
});
