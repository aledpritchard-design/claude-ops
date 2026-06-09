export type ArtefactType = "skill" | "task" | "routine" | "agent";
export type Domain = "ops" | "content" | "web";
export type Surface = "claude-skill" | "cowork" | "claude-code";
export type Status = "done" | "draft" | "proposed";
export type Gating = "public" | "private";

export interface ManifestRecord {
  name: string;
  type: ArtefactType;
  domain: Domain;
  surface?: Surface;
  status: Status;
  gating: Gating;
  downloadable: boolean;
  summary: string;
  composed_of: ManifestRecord[];
  _path: string;
}

export const SECTION_TYPES: ArtefactType[] = ["skill", "task", "routine"];

export const SECTION_META: Record<
  "skill" | "task" | "routine",
  { index: string; label: string; subtitle: string }
> = {
  skill: {
    index: "01",
    label: "Section",
    subtitle: "Reusable Claude Code procedures invoked on demand.",
  },
  task: {
    index: "02",
    label: "Section",
    subtitle: "Scheduled or triggered automation tasks.",
  },
  routine: {
    index: "03",
    label: "Section",
    subtitle: "Recurring operational routines run on a cadence.",
  },
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  ops: "Ops",
  content: "Content",
  web: "Web",
};

export const STATUS_LABELS: Record<Status, string> = {
  done: "Done",
  draft: "Draft",
  proposed: "Proposed",
};

export const SURFACE_LABELS: Record<Surface, string> = {
  "claude-skill": "Claude skill",
  cowork: "Cowork",
  "claude-code": "Claude Code",
};
