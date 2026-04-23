import { describe, it, expect } from "vitest";
import { MOTION, fadeRise, staggerContainer } from "./tokens";

describe("MOTION tokens", () => {
  it("enter duration matches master-plan spec (240ms)", () => {
    expect(MOTION.enter.duration).toBe(0.24);
  });

  it("exit duration matches master-plan spec (180ms)", () => {
    expect(MOTION.exit.duration).toBe(0.18);
  });

  it("stagger matches master-plan spec (40ms)", () => {
    expect(MOTION.stagger).toBe(0.04);
  });

  it("ease-out cubic-bezier matches token value", () => {
    expect(MOTION.enter.ease).toEqual([0.16, 1, 0.3, 1]);
  });

  it("ease-in cubic-bezier matches token value", () => {
    expect(MOTION.exit.ease).toEqual([0.7, 0, 0.84, 0]);
  });

  it("viewport trigger is once + bottom-margin bleed", () => {
    expect(MOTION.viewport).toEqual({ once: true, margin: "0px 0px -15% 0px" });
  });

  it("spring preset is tuned (stiffness 340, damping 28)", () => {
    expect(MOTION.spring.type).toBe("spring");
    expect(MOTION.spring.stiffness).toBe(340);
    expect(MOTION.spring.damping).toBe(28);
  });
});

describe("fadeRise variant", () => {
  it("starts at opacity 0 with 8px rise offset", () => {
    expect(fadeRise.initial).toEqual({ opacity: 0, y: 8 });
  });

  it("animates to full visibility at rest position", () => {
    expect(fadeRise.animate).toEqual({ opacity: 1, y: 0 });
  });

  it("uses the enter transition token", () => {
    expect(fadeRise.transition).toBe(MOTION.enter);
  });
});

describe("staggerContainer", () => {
  it("wires staggerChildren to the motion token", () => {
    expect(staggerContainer.animate.transition.staggerChildren).toBe(MOTION.stagger);
  });
});
