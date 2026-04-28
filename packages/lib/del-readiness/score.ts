/**
 * Deterministic scoring for the DEL Readiness Assessment.
 *
 * Why deterministic: the model is good at producing qualitative gap
 * analysis and remediation plans, but a non-deterministic 0–100 number
 * undermines trust on a regulatory tool. Scoring lives here so two users
 * with the same answers get the same number, and any disagreement is
 * about the rubric, not the model.
 *
 * Algorithm (per category):
 *   1. Filter rubric questions to those in this category
 *   2. Apply branching predicates against the user's answers — questions
 *      that fail their `showWhen` are excluded entirely (not zero-scored)
 *   3. For each remaining question, look up the chosen option's weight
 *      (0–1). Unanswered questions are treated as 0.
 *   4. Category raw score = Σ(option_weight × question_weight) /
 *                            Σ(question_weight) of *included* questions
 *   5. Category percent = round(raw × 100), clamped to 0–100
 *   6. Traffic light: ≥75 green, 40–74 yellow, <40 red
 *
 * Overall: weighted mean of category percents by category.weight.
 * Categories whose only path was branched away (sum of included question
 * weights = 0) contribute zero weight to the overall score — preserving
 * the relative weighting of the other categories.
 */
import {
  AnswerMapSchema,
  RubricSchema,
  type Assessment,
  type AnswerMap,
  type CategoryId,
  type CategoryScore,
  type Rubric,
  type RubricQuestion,
  type TrafficLight,
} from "./types";

interface ScoreOnly {
  score: number;
  trafficLight: TrafficLight;
  categoryScores: CategoryScore[];
}

/**
 * Apply the question's `showWhen` predicate against the answer map.
 * Returns true if the question should be included in scoring.
 */
function isVisible(question: RubricQuestion, answers: AnswerMap): boolean {
  if (!question.showWhen) return true;
  const dep = answers[question.showWhen.questionId];
  if (!dep) return false;
  return question.showWhen.equalsAny.includes(dep);
}

function trafficLightFor(percent: number): TrafficLight {
  if (percent >= 75) return "green";
  if (percent >= 40) return "yellow";
  return "red";
}

export function computeScore(rubric: Rubric, answers: AnswerMap): ScoreOnly {
  // Validate inputs at the boundary so a bad rubric never corrupts a score.
  RubricSchema.parse(rubric);
  AnswerMapSchema.parse(answers);

  const categoryScores: CategoryScore[] = [];
  let weightedSum = 0;
  let weightTotal = 0;

  for (const cat of rubric.categories) {
    const catQuestions = rubric.questions.filter(
      (q) => q.category === cat.id && isVisible(q, answers),
    );

    if (catQuestions.length === 0) {
      // The whole category was branched away (e.g. cold-chain not in
      // scope). Record it as 100 (not penalized) and exclude from the
      // overall weighting — the user said "not applicable", not "fail".
      categoryScores.push({
        category: cat.id,
        score: 100,
        trafficLight: "green",
      });
      continue;
    }

    let num = 0;
    let den = 0;
    for (const q of catQuestions) {
      const chosenOptionId = answers[q.id];
      const chosenOption = q.options.find((o) => o.id === chosenOptionId);
      const optionWeight = chosenOption?.weight ?? 0;
      num += optionWeight * q.weight;
      den += q.weight;
    }

    const raw = den > 0 ? num / den : 0;
    const percent = Math.max(0, Math.min(100, Math.round(raw * 100)));

    categoryScores.push({
      category: cat.id,
      score: percent,
      trafficLight: trafficLightFor(percent),
    });

    weightedSum += percent * cat.weight;
    weightTotal += cat.weight;
  }

  // If every category branched away (impossible in practice but handled),
  // fall back to 100 — there's nothing to assess.
  const overall = weightTotal > 0
    ? Math.round(weightedSum / weightTotal)
    : 100;

  return {
    score: overall,
    trafficLight: trafficLightFor(overall),
    categoryScores,
  };
}

/**
 * Helper: which categories are *applicable* to this user's answers (i.e.
 * not entirely branched away)? Used by the route to scope the model's
 * remediation suggestions.
 */
export function applicableCategories(
  rubric: Rubric,
  answers: AnswerMap,
): CategoryId[] {
  const out: CategoryId[] = [];
  for (const cat of rubric.categories) {
    const visible = rubric.questions.some(
      (q) => q.category === cat.id && isVisible(q, answers),
    );
    if (visible) out.push(cat.id);
  }
  return out;
}

/**
 * Combine the deterministic score with the model-generated gaps +
 * remediation into the final Assessment payload sent to the client.
 */
export function buildAssessment(
  rubric: Rubric,
  answers: AnswerMap,
  recommendation: { gaps: Assessment["gaps"]; remediation: Assessment["remediation"] },
): Assessment {
  const score = computeScore(rubric, answers);
  // Sort remediation by priority ascending — display contract.
  const remediation = [...recommendation.remediation].sort(
    (a, b) => a.priority - b.priority,
  );
  return {
    rubricVersion: rubric.version,
    score: score.score,
    trafficLight: score.trafficLight,
    categoryScores: score.categoryScores,
    gaps: recommendation.gaps,
    remediation,
  };
}
