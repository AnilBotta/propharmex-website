/**
 * Public surface of the del-readiness subpackage.
 *
 *   import { delReadiness } from "@propharmex/lib";
 *   delReadiness.DEFAULT_RUBRIC
 *   delReadiness.computeScore(rubric, answers)
 *
 * Or directly:
 *   import { DEFAULT_RUBRIC, AssessmentSchema } from "@propharmex/lib/del-readiness";
 */
export {
  CATEGORY_IDS,
  CategoryIdSchema,
  RubricCategorySchema,
  QuestionOptionSchema,
  ShowWhenSchema,
  RubricQuestionSchema,
  RubricSchema,
  AnswerMapSchema,
  TrafficLightSchema,
  CategoryScoreSchema,
  GapSchema,
  RemediationItemSchema,
  AssessmentSchema,
  AssessmentRecommendationSchema,
  type CategoryId,
  type RubricCategory,
  type QuestionOption,
  type ShowWhen,
  type RubricQuestion,
  type Rubric,
  type AnswerMap,
  type TrafficLight,
  type CategoryScore,
  type Gap,
  type RemediationItem,
  type Assessment,
  type AssessmentRecommendation,
} from "./types";

export { DEFAULT_RUBRIC } from "./rubric";

export { computeScore, applicableCategories, buildAssessment } from "./score";

export { renderDelReadinessPdf } from "./pdf";
