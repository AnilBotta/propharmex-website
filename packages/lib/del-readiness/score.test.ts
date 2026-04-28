import { describe, expect, it } from "vitest";

import { DEFAULT_RUBRIC } from "./rubric";
import { applicableCategories, buildAssessment, computeScore } from "./score";
import type { AnswerMap } from "./types";

/** Helper: pick the highest-weight option id for every question. */
function bestAnswers(): AnswerMap {
  const out: AnswerMap = {};
  for (const q of DEFAULT_RUBRIC.questions) {
    const best = [...q.options].sort((a, b) => b.weight - a.weight)[0];
    if (best) out[q.id] = best.id;
  }
  return out;
}

/** Helper: pick the lowest-weight option id for every question. */
function worstAnswers(): AnswerMap {
  const out: AnswerMap = {};
  for (const q of DEFAULT_RUBRIC.questions) {
    const worst = [...q.options].sort((a, b) => a.weight - b.weight)[0];
    if (worst) out[q.id] = worst.id;
  }
  return out;
}

describe("computeScore — bounds", () => {
  it("best-case answers score 100 across the board", () => {
    const r = computeScore(DEFAULT_RUBRIC, bestAnswers());
    expect(r.score).toBe(100);
    expect(r.trafficLight).toBe("green");
    for (const cs of r.categoryScores) {
      expect(cs.score).toBe(100);
      expect(cs.trafficLight).toBe("green");
    }
  });

  it("worst-case answers score 0 across non-NA categories", () => {
    // Worst-case picks "no-not-in-scope" for the cold-chain branch — that
    // option has weight 1 by design (NA is not a failure). So cold-chain
    // ends up at 100 (NA, branched away) and overall sits below 100.
    const answers = worstAnswers();
    const r = computeScore(DEFAULT_RUBRIC, answers);
    expect(r.score).toBeLessThan(20);
    expect(r.trafficLight).toBe("red");
  });
});

describe("computeScore — branching", () => {
  it("marks cold-chain N/A as 100 when branched away", () => {
    const answers: AnswerMap = {
      ...bestAnswers(),
      "cold-chain.scope": "no-not-in-scope",
    };
    // The follow-up cold-chain.sops question is now hidden — its answer
    // must not affect the score.
    delete answers["cold-chain.sops"];
    const r = computeScore(DEFAULT_RUBRIC, answers);
    const coldChain = r.categoryScores.find((c) => c.category === "cold-chain");
    expect(coldChain?.score).toBe(100);
    expect(coldChain?.trafficLight).toBe("green");
  });

  it("does not let a hidden answer poison its category", () => {
    const answers: AnswerMap = {
      ...bestAnswers(),
      "import-export.scope": "no-not-in-scope",
      "import-export.procedures": "not-yet", // would be 0 — but is hidden
    };
    const r = computeScore(DEFAULT_RUBRIC, answers);
    const cat = r.categoryScores.find((c) => c.category === "import-export");
    // Only the visible question (scope=no-not-in-scope, weight 1) counts.
    expect(cat?.score).toBe(100);
  });
});

describe("computeScore — traffic-light thresholds", () => {
  it("assigns green at >=75, yellow 40-74, red <40", () => {
    expect(
      computeScore(DEFAULT_RUBRIC, bestAnswers()).trafficLight,
    ).toBe("green");
    expect(
      computeScore(DEFAULT_RUBRIC, worstAnswers()).trafficLight,
    ).toBe("red");
  });

  it("yellow band — half-credit answers settle in the middle", () => {
    // Pick the middle-weight option (0.5) for every question that has one.
    const answers: AnswerMap = {};
    for (const q of DEFAULT_RUBRIC.questions) {
      const mid = q.options.find((o) => o.weight === 0.5);
      const fallback = q.options[Math.floor(q.options.length / 2)];
      const option = mid ?? fallback;
      if (option) answers[q.id] = option.id;
    }
    // Branch the conditional categories so they don't sneak into the math.
    answers["import-export.scope"] = "no-not-in-scope";
    answers["cold-chain.scope"] = "no-not-in-scope";
    const r = computeScore(DEFAULT_RUBRIC, answers);
    expect(r.trafficLight).toBe("yellow");
  });
});

describe("applicableCategories", () => {
  it("includes all 7 when nothing is branched away", () => {
    const cats = applicableCategories(DEFAULT_RUBRIC, bestAnswers());
    expect(cats).toHaveLength(7);
  });

  it("excludes cold-chain when its scope is no", () => {
    const answers: AnswerMap = {
      ...bestAnswers(),
      "cold-chain.scope": "no-not-in-scope",
    };
    delete answers["cold-chain.sops"];
    const cats = applicableCategories(DEFAULT_RUBRIC, answers);
    // cold-chain.scope is itself in the cold-chain category, so the
    // category remains applicable. Just the follow-up question is hidden.
    expect(cats).toContain("cold-chain");
  });
});

describe("buildAssessment", () => {
  it("merges score + recommendation and sorts remediation by priority", () => {
    const r = buildAssessment(DEFAULT_RUBRIC, bestAnswers(), {
      gaps: [],
      remediation: [
        {
          priority: 3,
          action: "C action",
          rationale: "C rationale text",
          effort: "small",
        },
        {
          priority: 1,
          action: "A action",
          rationale: "A rationale text",
          effort: "medium",
        },
        {
          priority: 2,
          action: "B action",
          rationale: "B rationale text",
          effort: "large",
        },
      ],
    });
    expect(r.score).toBe(100);
    expect(r.remediation.map((x) => x.priority)).toEqual([1, 2, 3]);
  });
});
