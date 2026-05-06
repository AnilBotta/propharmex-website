"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

import { LeadAvatar } from "./LeadAvatar";

export interface ProjectRow {
  id: string;
  code: string;
  title: string;
  company: string | null;
  stage: ProjectStage;
  owner_emails: string[];
  due_date: string | null;
  flagged: boolean;
  notes: string | null;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectStage =
  | "discovery"
  | "scoping_nda"
  | "execution"
  | "qa_review"
  | "delivered";

const STAGE_ORDER: ProjectStage[] = [
  "discovery",
  "scoping_nda",
  "execution",
  "qa_review",
  "delivered",
];

const STAGE_LABEL: Record<ProjectStage, string> = {
  discovery: "Discovery",
  scoping_nda: "Scoping & NDA",
  execution: "Execution",
  qa_review: "QA Review",
  delivered: "Delivered",
};

export function ProjectPipeline({
  initialProjects,
}: {
  initialProjects: ProjectRow[];
}) {
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creatingForStage, setCreatingForStage] = useState<ProjectStage | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCompany, setDraftCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // PointerSensor: 5px activation distance lets the user click cards (e.g. for
  // future "open detail" handlers) without accidentally triggering a drag.
  // KeyboardSensor: ARIA-compliant grab/move via space + arrow keys for
  // screen-reader / keyboard-only users.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const grouped = useMemo(() => {
    const map: Record<ProjectStage, ProjectRow[]> = {
      discovery: [],
      scoping_nda: [],
      execution: [],
      qa_review: [],
      delivered: [],
    };
    for (const p of projects) map[p.stage].push(p);
    return map;
  }, [projects]);

  const totalActive = projects.filter((p) => p.stage !== "delivered").length;
  const activeProject = activeId
    ? projects.find((p) => p.id === activeId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const projectId = String(active.id);
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    // Determine destination stage. The `over` may be:
    //  (a) A column droppable — id is the stage
    //  (b) Another card — its data.current.stage tells us the column
    const overData = over.data.current as
      | { type?: "stage" | "project"; stage?: ProjectStage }
      | undefined;

    let destStage: ProjectStage | null = null;
    if (overData?.stage && STAGE_ORDER.includes(overData.stage)) {
      destStage = overData.stage;
    } else if (STAGE_ORDER.includes(over.id as ProjectStage)) {
      destStage = over.id as ProjectStage;
    }
    if (!destStage) return;
    if (project.stage === destStage) return;

    // Optimistic update.
    const originalStage = project.stage;
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, stage: destStage } : p)),
    );

    // Persist.
    const res = await fetch(`/api/dashboard/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: destStage }),
    });
    if (!res.ok) {
      // Revert.
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, stage: originalStage } : p,
        ),
      );
      // eslint-disable-next-line no-alert
      alert("Failed to move card. Reverted.");
    }
  }

  async function handleStageChange(projectId: string, stage: ProjectStage) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const originalStage = project.stage;
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, stage } : p)),
    );
    const res = await fetch(`/api/dashboard/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    if (!res.ok) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, stage: originalStage } : p,
        ),
      );
      // eslint-disable-next-line no-alert
      alert("Failed to update stage. Reverted.");
    }
  }

  async function handleCreate(stage: ProjectStage) {
    if (!draftTitle.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draftTitle.trim(),
          company: draftCompany.trim() || undefined,
          stage,
        }),
      });
      if (!res.ok) {
        // eslint-disable-next-line no-alert
        alert("Couldn't create project. Please retry.");
        setSubmitting(false);
        return;
      }
      const { project } = (await res.json()) as { project: ProjectRow };
      setProjects((prev) => [project, ...prev]);
      setDraftTitle("");
      setDraftCompany("");
      setCreatingForStage(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="rounded-lg border border-[color:var(--color-border)] bg-white">
        <header className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
          <h2 className="text-[15px] font-semibold text-slate-800">
            Project pipeline
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {totalActive} active
          </span>
          <span className="hidden rounded-md bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 lg:inline">
            Tip: drag cards between columns to change stage
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md border border-[color:var(--color-border)] bg-white px-2 py-1 text-[12px] text-slate-500"
              title="Group by owner — coming soon"
            >
              Group: stage
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md border border-[color:var(--color-border)] bg-white px-2 py-1 text-[12px] text-slate-500"
              title="Filter by owner — coming soon"
            >
              Owner: all
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingForStage("discovery");
                setDraftTitle("");
                setDraftCompany("");
              }}
              className="rounded-md bg-primary-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-primary-700"
            >
              + New project
            </button>
          </div>
        </header>

        <div className="overflow-x-auto p-3">
          <div className="grid min-w-[1000px] grid-cols-5 gap-3">
            {STAGE_ORDER.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                items={grouped[stage]}
                creating={creatingForStage === stage}
                draftTitle={draftTitle}
                draftCompany={draftCompany}
                submitting={submitting}
                onStartCreate={() => {
                  setCreatingForStage(stage);
                  setDraftTitle("");
                  setDraftCompany("");
                }}
                onCancelCreate={() => {
                  setCreatingForStage(null);
                  setDraftTitle("");
                  setDraftCompany("");
                }}
                onChangeTitle={setDraftTitle}
                onChangeCompany={setDraftCompany}
                onSave={() => handleCreate(stage)}
                onStageChange={handleStageChange}
              />
            ))}
          </div>
        </div>
      </section>

      <DragOverlay>
        {activeProject ? (
          <div className="rotate-1 cursor-grabbing">
            <ProjectCardContent project={activeProject} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* -------------------------------------------------------------------------- */
/*  Column                                                                     */
/* -------------------------------------------------------------------------- */

function StageColumn({
  stage,
  items,
  creating,
  draftTitle,
  draftCompany,
  submitting,
  onStartCreate,
  onCancelCreate,
  onChangeTitle,
  onChangeCompany,
  onSave,
  onStageChange,
}: {
  stage: ProjectStage;
  items: ProjectRow[];
  creating: boolean;
  draftTitle: string;
  draftCompany: string;
  submitting: boolean;
  onStartCreate: () => void;
  onCancelCreate: () => void;
  onChangeTitle: (v: string) => void;
  onChangeCompany: (v: string) => void;
  onSave: () => void;
  onStageChange: (projectId: string, stage: ProjectStage) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: "stage", stage },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-0 flex-col rounded-md p-2 transition-colors ${
        isOver
          ? "bg-primary-50 ring-2 ring-primary-300"
          : "bg-slate-50"
      }`}
    >
      <header className="mb-2 flex items-center justify-between gap-2 px-1">
        <h3 className="text-[12px] font-semibold tracking-wide text-slate-700">
          {STAGE_LABEL[stage]}
        </h3>
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
          {items.length}
        </span>
      </header>

      <SortableContext
        items={items.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {items.length === 0 && !creating ? (
            <div className="rounded-md border border-dashed border-slate-200 px-2 py-3 text-center text-[11px] text-slate-400">
              Drop a card here
            </div>
          ) : null}

          {items.map((p) => (
            <SortableProjectCard
              key={p.id}
              project={p}
              onStageChange={(s) => onStageChange(p.id, s)}
            />
          ))}

          {creating ? (
            <div className="rounded-md border border-primary-200 bg-white p-2">
              <input
                type="text"
                autoFocus
                value={draftTitle}
                onChange={(e) => onChangeTitle(e.target.value)}
                placeholder="Project title…"
                className="mb-1.5 w-full rounded-md border border-[color:var(--color-border)] px-2 py-1 text-[12px] text-slate-800 placeholder:text-slate-400"
              />
              <input
                type="text"
                value={draftCompany}
                onChange={(e) => onChangeCompany(e.target.value)}
                placeholder="Company (optional)"
                className="mb-1.5 w-full rounded-md border border-[color:var(--color-border)] px-2 py-1 text-[12px] text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={submitting || draftTitle.trim().length < 2}
                  className="flex-1 rounded-md bg-primary-600 px-2 py-1 text-[11px] font-medium text-white disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={onCancelCreate}
                  className="rounded-md border border-[color:var(--color-border)] bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartCreate}
              className="rounded-md border border-dashed border-slate-300 bg-white px-2 py-1.5 text-[11px] text-slate-500 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              + Add to {STAGE_LABEL[stage]}
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sortable card wrapper                                                      */
/* -------------------------------------------------------------------------- */

function SortableProjectCard({
  project,
  onStageChange,
}: {
  project: ProjectRow;
  onStageChange: (stage: ProjectStage) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: { type: "project", stage: project.stage },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProjectCardContent
        project={project}
        onStageChange={onStageChange}
        isDragging={isDragging}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card content (used both inside SortableProjectCard and DragOverlay)        */
/* -------------------------------------------------------------------------- */

function ProjectCardContent({
  project,
  onStageChange,
  isDragging,
}: {
  project: ProjectRow;
  onStageChange?: (stage: ProjectStage) => void;
  isDragging?: boolean;
}) {
  return (
    <article
      className={`rounded-md border bg-white p-2.5 ${
        isDragging
          ? "cursor-grabbing border-primary-300 shadow-md"
          : "cursor-grab border-[color:var(--color-border)] shadow-sm hover:shadow-md"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-tight text-slate-500">
          {project.code}
        </span>
        {project.flagged ? (
          <span className="text-[11px]" title="Flagged">
            ⚠
          </span>
        ) : null}
      </div>

      <div className="mb-1 text-[12px] font-semibold leading-tight text-slate-800 break-words">
        {project.title}
      </div>
      {project.company ? (
        <div className="mb-2 truncate text-[11px] text-slate-500">
          {project.company}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <div className="flex -space-x-1.5">
          {project.owner_emails.slice(0, 3).map((email) => (
            <span
              key={email}
              className="ring-2 ring-white rounded-full"
              title={email}
            >
              <LeadAvatar email={email} size={20} />
            </span>
          ))}
          {project.owner_emails.length > 3 ? (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-600 ring-2 ring-white">
              +{project.owner_emails.length - 3}
            </span>
          ) : null}
        </div>
        {project.due_date ? (
          <span className="text-[10px] text-slate-500">
            {formatDueDate(project.due_date)}
          </span>
        ) : null}
      </div>

      {/* Accessibility fallback: dropdown for keyboard / SR users who can't
          use drag-and-drop. The dnd-kit KeyboardSensor also works (space to
          grab, arrows to move, space to drop), but the dropdown is simpler
          for assistive tech. onPointerDown stops propagation so opening the
          select doesn't trigger a drag start. */}
      {onStageChange ? (
        <select
          value={project.stage}
          onChange={(e) => onStageChange(e.target.value as ProjectStage)}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Move to stage"
          className="mt-2 w-full rounded-md border border-[color:var(--color-border)] bg-white px-1.5 py-1 text-[10px] text-slate-600 focus:border-primary-500"
        >
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>
      ) : null}
    </article>
  );
}

function formatDueDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
