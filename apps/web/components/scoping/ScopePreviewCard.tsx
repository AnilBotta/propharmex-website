"use client";

/**
 * ScopePreviewCard — renders a structured `ScopeSummary` with inline-editable
 * sections.
 *
 * State model: the card is fully controlled. The parent (ScopingSurface)
 * owns `previewScope`, the user can edit any section in place, and the
 * parent receives every change via `onChange`. PR-B reads `previewScope`
 * back out of the parent when the user clicks Submit / Download.
 *
 * Edit affordance: each section has a small Edit button. Clicking flips
 * that section into a textarea (for free-text fields) or a select (for
 * the stage). Save commits, Cancel reverts. Only one section is editable
 * at a time — keeps the JS state simple and the visual reading flow
 * uninterrupted.
 *
 * PR-A renders the action buttons (Send / Download) as DISABLED with a
 * tooltip — PR-B wires them. The card itself is fully functional today,
 * which lets us ship the page end-to-end and let PR-B be a pure
 * additive diff.
 */
import { useState } from "react";
import { Pencil, Download, Send } from "lucide-react";

import type { ScopeSummary } from "@propharmex/lib/scoping";
import {
  DEVELOPMENT_STAGES,
  SERVICE_PILLARS,
} from "@propharmex/lib/scoping";

import { SCOPING } from "../../content/scoping";

interface Props {
  scope: ScopeSummary | null;
  onChange: (next: ScopeSummary) => void;
}

type EditingSection =
  | null
  | "objectives"
  | "dosageForms"
  | "developmentStage"
  | "deliverables"
  | "assumptions"
  | "risks"
  | "phases"
  | "ballparkTimelineWeeks"
  | "recommendedServices";

export function ScopePreviewCard({ scope, onChange }: Props) {
  const [editing, setEditing] = useState<EditingSection>(null);

  if (!scope) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_4px_12px_-4px_rgba(15,32,80,0.08)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-4 py-3">
        <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-primary-900)]">
          Draft scope
        </h2>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
          Editable — review before sending
        </p>
      </header>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <Section
          label={SCOPING.preview.sectionLabels.objectives}
          editing={editing === "objectives"}
          onEdit={() => setEditing("objectives")}
          onCancel={() => setEditing(null)}
        >
          {editing === "objectives" ? (
            <FreeTextEditor
              initial={scope.objectives}
              onSave={(next) => {
                onChange({ ...scope, objectives: next });
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
              rows={4}
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-fg)]">
              {scope.objectives}
            </p>
          )}
        </Section>

        <Section
          label={SCOPING.preview.sectionLabels.dosageForms}
          editing={editing === "dosageForms"}
          onEdit={() => setEditing("dosageForms")}
          onCancel={() => setEditing(null)}
        >
          {editing === "dosageForms" ? (
            <ListEditor
              initial={scope.dosageForms}
              onSave={(next) => {
                onChange({ ...scope, dosageForms: next });
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <ChipList items={scope.dosageForms} />
          )}
        </Section>

        <Section
          label={SCOPING.preview.sectionLabels.developmentStage}
          editing={editing === "developmentStage"}
          onEdit={() => setEditing("developmentStage")}
          onCancel={() => setEditing(null)}
        >
          {editing === "developmentStage" ? (
            <select
              defaultValue={scope.developmentStage}
              onChange={(e) => {
                onChange({
                  ...scope,
                  developmentStage:
                    e.target.value as ScopeSummary["developmentStage"],
                });
                setEditing(null);
              }}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none"
            >
              {DEVELOPMENT_STAGES.map((s) => (
                <option key={s} value={s}>
                  {humanizeStage(s)}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-[var(--color-fg)]">
              {humanizeStage(scope.developmentStage)}
            </p>
          )}
        </Section>

        <Section
          label={SCOPING.preview.sectionLabels.deliverables}
          editing={editing === "deliverables"}
          onEdit={() => setEditing("deliverables")}
          onCancel={() => setEditing(null)}
        >
          {editing === "deliverables" ? (
            <ListEditor
              initial={scope.deliverables}
              onSave={(next) => {
                onChange({ ...scope, deliverables: next });
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <BulletList items={scope.deliverables} />
          )}
        </Section>

        {scope.assumptions.length > 0 || editing === "assumptions" ? (
          <Section
            label={SCOPING.preview.sectionLabels.assumptions}
            editing={editing === "assumptions"}
            onEdit={() => setEditing("assumptions")}
            onCancel={() => setEditing(null)}
          >
            {editing === "assumptions" ? (
              <ListEditor
                initial={scope.assumptions}
                onSave={(next) => {
                  onChange({ ...scope, assumptions: next });
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <BulletList items={scope.assumptions} />
            )}
          </Section>
        ) : null}

        {scope.risks.length > 0 ? (
          <Section
            label={SCOPING.preview.sectionLabels.risks}
            editing={false}
            onEdit={() => {
              /* PR-B: full risk editor with severity selector */
            }}
            onCancel={() => setEditing(null)}
            editDisabled
          >
            <ul className="flex flex-col gap-2">
              {scope.risks.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--color-fg)]"
                >
                  <SeverityBadge severity={r.severity} />
                  <span className="leading-relaxed">{r.description}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section
          label={SCOPING.preview.sectionLabels.phases}
          editing={false}
          onEdit={() => {
            /* PR-B: full phase editor */
          }}
          onCancel={() => setEditing(null)}
          editDisabled
        >
          <ol className="flex flex-col gap-3">
            {scope.phases.map((p, i) => (
              <li key={i} className="text-sm text-[var(--color-fg)]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-[var(--color-primary-900)]">
                    {i + 1}. {p.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {p.durationWeeks} {p.durationWeeks === 1 ? "wk" : "wks"}
                  </span>
                </div>
                <ul className="mt-1 ml-4 flex flex-col gap-0.5 text-[var(--color-slate-800)]">
                  {p.milestones.map((m, j) => (
                    <li key={j} className="list-disc text-[13px] leading-snug">
                      {m}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          label={SCOPING.preview.sectionLabels.ballparkTimelineWeeks}
          editing={false}
          onEdit={() => {
            /* PR-B */
          }}
          onCancel={() => setEditing(null)}
          editDisabled
        >
          <p className="text-sm text-[var(--color-fg)]">
            {SCOPING.preview.timelineRange(
              scope.ballparkTimelineWeeks.min,
              scope.ballparkTimelineWeeks.max,
            )}
          </p>
        </Section>

        <Section
          label={SCOPING.preview.sectionLabels.recommendedServices}
          editing={editing === "recommendedServices"}
          onEdit={() => setEditing("recommendedServices")}
          onCancel={() => setEditing(null)}
        >
          {editing === "recommendedServices" ? (
            <PillarMultiSelect
              initial={scope.recommendedServices}
              onSave={(next) => {
                onChange({ ...scope, recommendedServices: next });
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <ChipList items={scope.recommendedServices.map(humanizePillar)} />
          )}
        </Section>
      </div>

      {/* Actions — disabled in PR-A */}
      <footer className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
        <button
          type="button"
          disabled
          title={SCOPING.preview.actions.pdfTooltipPending}
          aria-label={SCOPING.preview.actions.pdfTooltipPending}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download aria-hidden="true" size={14} />
          {SCOPING.preview.actions.pdfLabel}
        </button>
        <button
          type="button"
          disabled
          title={SCOPING.preview.actions.submitTooltipPending}
          aria-label={SCOPING.preview.actions.submitTooltipPending}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send aria-hidden="true" size={14} />
          {SCOPING.preview.actions.submitLabel}
        </button>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section shell + small inputs                                               */
/* -------------------------------------------------------------------------- */

function Section({
  label,
  editing,
  onEdit,
  onCancel,
  editDisabled = false,
  children,
}: {
  label: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  editDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[var(--color-border)] py-3 last:border-b-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
          {label}
        </h3>
        {editing ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-primary-700)]"
          >
            {SCOPING.preview.cancelEditLabel}
          </button>
        ) : editDisabled ? null : (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${SCOPING.preview.editLabel} ${label}`}
            className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] p-1 text-[var(--color-muted)] hover:bg-[var(--color-slate-100)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <Pencil aria-hidden="true" size={12} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function FreeTextEditor({
  initial,
  onSave,
  onCancel,
  rows = 3,
}: {
  initial: string;
  onSave: (next: string) => void;
  onCancel: () => void;
  rows?: number;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-snug text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none"
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          {SCOPING.preview.cancelEditLabel}
        </button>
        <button
          type="button"
          onClick={() => onSave(value.trim())}
          disabled={value.trim().length === 0}
          className="rounded-[var(--radius-xs)] bg-[var(--color-primary-700)] px-2 py-1 text-[11px] font-medium text-white hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {SCOPING.preview.saveEditLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * Bullet-list editor: one item per line in a single textarea. Empty lines
 * are dropped on save. Simpler UX than per-row +/− buttons and good enough
 * for the lists we have (1–12 items).
 */
function ListEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: string[];
  onSave: (next: string[]) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial.join("\n"));
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={Math.max(3, initial.length + 1)}
        className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-snug text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none"
      />
      <p className="text-[10px] italic text-[var(--color-muted)]">
        One item per line.
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          {SCOPING.preview.cancelEditLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            const items = value
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0);
            onSave(items);
          }}
          className="rounded-[var(--radius-xs)] bg-[var(--color-primary-700)] px-2 py-1 text-[11px] font-medium text-white hover:bg-[var(--color-primary-800)]"
        >
          {SCOPING.preview.saveEditLabel}
        </button>
      </div>
    </div>
  );
}

function PillarMultiSelect({
  initial,
  onSave,
  onCancel,
}: {
  initial: ScopeSummary["recommendedServices"];
  onSave: (next: ScopeSummary["recommendedServices"]) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {SERVICE_PILLARS.map((p) => {
          const isOn = selected.has(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                const next = new Set(selected);
                if (isOn) next.delete(p);
                else next.add(p);
                setSelected(next);
              }}
              className={`rounded-[var(--radius-full)] border px-2.5 py-1 text-[11px] font-medium transition ${
                isOn
                  ? "border-[var(--color-primary-700)] bg-[var(--color-primary-700)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:border-[var(--color-primary-700)]"
              }`}
            >
              {humanizePillar(p)}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          {SCOPING.preview.cancelEditLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            const next = SERVICE_PILLARS.filter((p) =>
              selected.has(p),
            ) as ScopeSummary["recommendedServices"];
            if (next.length === 0) return;
            onSave(next);
          }}
          disabled={selected.size === 0}
          className="rounded-[var(--radius-xs)] bg-[var(--color-primary-700)] px-2 py-1 text-[11px] font-medium text-white hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {SCOPING.preview.saveEditLabel}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Read-only renderers                                                        */
/* -------------------------------------------------------------------------- */

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-slate-800)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 flex flex-col gap-1">
      {items.map((item, i) => (
        <li
          key={i}
          className="list-disc text-sm leading-relaxed text-[var(--color-fg)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function SeverityBadge({ severity }: { severity: "low" | "medium" | "high" }) {
  const cls =
    severity === "high"
      ? "border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] text-[var(--color-danger)]"
      : severity === "medium"
        ? "border-[var(--color-warn)] bg-[color-mix(in_oklab,var(--color-warn)_10%,transparent)] text-[var(--color-warn)]"
        : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-[var(--radius-full)] border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${cls}`}
    >
      {SCOPING.preview.severityLabel[severity]}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-12 text-center">
      <h2 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
        {SCOPING.preview.emptyHeading}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-slate-800)]">
        {SCOPING.preview.emptyBody}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Humanizers                                                                 */
/* -------------------------------------------------------------------------- */

function humanizeStage(stage: ScopeSummary["developmentStage"]): string {
  switch (stage) {
    case "preformulation":
      return "Pre-formulation";
    case "formulation":
      return "Formulation";
    case "method-development":
      return "Method development";
    case "stability":
      return "Stability";
    case "clinical-supplies":
      return "Clinical supplies";
    case "scaleup":
      return "Scale-up";
    case "commercial":
      return "Commercial";
  }
}

function humanizePillar(
  pillar: ScopeSummary["recommendedServices"][number],
): string {
  switch (pillar) {
    case "development":
      return "Development";
    case "analytical":
      return "Analytical";
    case "regulatory":
      return "Regulatory";
    case "distribution":
      return "Distribution";
    case "quality":
      return "Quality";
  }
}
