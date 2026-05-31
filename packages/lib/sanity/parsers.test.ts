import { describe, expect, it } from "vitest";

import { sopCapabilitiesQuery } from "./queries";
import { zSopCapability } from "./parsers";

describe("zSopCapability", () => {
  it("accepts the current SOP capability Sanity projection", () => {
    const parsed = zSopCapability.parse({
      _id: "sop-oral-solid",
      _type: "sopCapability",
      title: "Oral solid",
      slug: "oral-solid",
      dosageForm: "oral-solid",
      capabilities: ["formulation", "analytical", "stability"],
      batchSizeMinKg: 1,
      batchSizeMaxKg: 25,
      facilitiesRef: [
        {
          _id: "facility-mississauga",
          title: "Mississauga, Ontario",
          slug: "mississauga-ontario",
          address: {
            locality: "Mississauga",
            region: "ON",
            country: "CA",
          },
        },
      ],
      notes: [
        {
          _key: "note-1",
          _type: "block",
          children: [
            {
              _key: "span-1",
              _type: "span",
              text: "Development, analytical, and stability support.",
            },
          ],
        },
      ],
      region: ["ca", "us"],
      ragEligible: true,
    });

    expect(parsed.slug).toBe("oral-solid");
    expect(parsed.capabilities).toEqual(["formulation", "analytical", "stability"]);
    expect(parsed.facilitiesRef[0]?.slug).toBe("mississauga-ontario");
    expect(parsed.notes).toHaveLength(1);
  });
});

describe("sopCapabilitiesQuery", () => {
  it("projects the fields defined by the current SOP capability schema", () => {
    expect(sopCapabilitiesQuery).toContain("capabilities");
    expect(sopCapabilitiesQuery).toContain("batchSizeMinKg");
    expect(sopCapabilitiesQuery).toContain("batchSizeMaxKg");
    expect(sopCapabilitiesQuery).toContain("facilitiesRef[]->{ _id, title");
    expect(sopCapabilitiesQuery).toContain("notes");

    expect(sopCapabilitiesQuery).not.toContain("equipment");
    expect(sopCapabilitiesQuery).not.toContain("applicableServices");
    expect(sopCapabilitiesQuery).not.toContain("regulatoryAnchors");
  });
});
