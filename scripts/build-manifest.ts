/**
 * Build-time manifest generator for agents.aledpritchard.com.
 *
 * Reads artefact files from .claude/skills/ (and future task/routine/agent
 * directories), parses YAML frontmatter, resolves composed_of references for
 * agents, and writes two manifests:
 *
 *   public/manifest.json       — public artefacts only
 *   public/manifest.owner.json — all artefacts (public + private)
 *
 * FETCH STRATEGY: filesystem reads (not GitHub API).
 * Rationale: this script co-locates with the artefact files in the claude-ops
 * repo, so filesystem access is simpler, faster, and requires no network or
 * auth token. External build environments (e.g. Vercel for agents.aledpritchard
 * .com) should consume the committed public/manifest.json directly via the
 * GitHub raw content endpoint — one HTTPS GET, no auth required for a public
 * repo. If a live-from-source build is ever needed, run this script after a
 * shallow clone.
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  existsSync,
  rmSync,
} from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

// ── types ─────────────────────────────────────────────────────────────────────

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

interface RawFrontmatter {
  name?: unknown;
  type?: unknown;
  domain?: unknown;
  surface?: unknown;
  status?: unknown;
  gating?: unknown;
  downloadable?: unknown;
  composed_of?: unknown;
  summary?: unknown;
  description?: unknown;
}

type ParsedRecord = Omit<ManifestRecord, "composed_of"> & {
  composed_of: string[];
};

// ── paths ─────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");

// Extend this list as task/routine/agent directories are added to the repo.
const ARTEFACT_DIRS: { dir: string; defaultType: ArtefactType }[] = [
  { dir: join(repoRoot, ".claude", "skills"), defaultType: "skill" },
];

const ARTEFACT_FILENAME = "SKILL.md";

// ── validators ────────────────────────────────────────────────────────────────

const VALID_TYPES: ArtefactType[] = ["skill", "task", "routine", "agent"];
const VALID_DOMAINS: Domain[] = ["ops", "content", "web"];
const VALID_SURFACES: Surface[] = ["claude-skill", "cowork", "claude-code"];
const VALID_STATUSES: Status[] = ["done", "draft", "proposed"];
const VALID_GATINGS: Gating[] = ["public", "private"];

function isCI(): boolean {
  return process.argv.includes("--ci") || process.env.CI === "true";
}

function buildError(message: string, filePath?: string): Error {
  const location = filePath ? ` (${relative(repoRoot, filePath)})` : "";
  return new Error(`[build-manifest] ERROR${location}: ${message}`);
}

function warn(message: string, filePath?: string): void {
  const location = filePath ? ` (${relative(repoRoot, filePath)})` : "";
  console.warn(`[build-manifest] WARN${location}: ${message}`);
}

function parseEnum<T extends string>(
  raw: unknown,
  valid: T[],
  fieldName: string,
  filePath: string,
  defaultValue: T,
): T {
  if (raw === undefined || raw === null) return defaultValue;
  if (typeof raw !== "string") {
    throw buildError(
      `"${fieldName}" must be a string, got ${typeof raw}`,
      filePath,
    );
  }
  if (!valid.includes(raw as T)) {
    throw buildError(
      `"${fieldName}" value "${raw}" is not one of: ${valid.join(", ")}`,
      filePath,
    );
  }
  return raw as T;
}

// ── scanner ───────────────────────────────────────────────────────────────────

interface ArtefactFile {
  filePath: string;
  defaultType: ArtefactType;
}

function findArtefactFiles(): ArtefactFile[] {
  const files: ArtefactFile[] = [];

  for (const { dir, defaultType } of ARTEFACT_DIRS) {
    if (!existsSync(dir)) {
      warn(`artefact directory not found, skipping: ${relative(repoRoot, dir)}`);
      continue;
    }

    for (const entry of readdirSync(dir)) {
      const entryPath = join(dir, entry);
      if (!statSync(entryPath).isDirectory()) continue;

      const candidatePath = join(entryPath, ARTEFACT_FILENAME);
      if (!existsSync(candidatePath)) {
        warn(
          `directory "${entry}" has no ${ARTEFACT_FILENAME} — skipping`,
          entryPath,
        );
        continue;
      }

      files.push({ filePath: candidatePath, defaultType });
    }
  }

  return files;
}

// ── parser ────────────────────────────────────────────────────────────────────

function parseArtefact(filePath: string, defaultType: ArtefactType): ParsedRecord {
  const raw = readFileSync(filePath, "utf-8");

  let data: RawFrontmatter;
  try {
    data = matter(raw).data as RawFrontmatter;
  } catch (err) {
    throw buildError(
      `frontmatter parse error: ${(err as Error).message}`,
      filePath,
    );
  }

  // name is required — missing name is the "loud failure" signal
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    throw buildError(
      '"name" is required and must be a non-empty string. ' +
        "Add YAML frontmatter with at least `name: <slug>` to this file.",
      filePath,
    );
  }
  const name = data.name.trim();

  const type = parseEnum(data.type, VALID_TYPES, "type", filePath, defaultType);
  const domain = parseEnum(data.domain, VALID_DOMAINS, "domain", filePath, "ops");
  const status = parseEnum(data.status, VALID_STATUSES, "status", filePath, "done");
  const gating = parseEnum(data.gating, VALID_GATINGS, "gating", filePath, "public");

  let surface: Surface | undefined;
  if (data.surface !== undefined && data.surface !== null) {
    surface = parseEnum(data.surface, VALID_SURFACES, "surface", filePath, "claude-skill");
  }

  const downloadable =
    data.downloadable !== undefined ? Boolean(data.downloadable) : gating === "public";

  // summary: prefer explicit summary, fall back to first sentence of description
  let summary = "";
  if (data.summary && typeof data.summary === "string") {
    summary = data.summary.trim();
  } else if (data.description && typeof data.description === "string") {
    const firstSentence = data.description.split(".")[0]?.trim() ?? "";
    summary = firstSentence.length > 120
      ? firstSentence.slice(0, 117) + "…"
      : firstSentence;
  }

  // composed_of: raw names, resolved in the next pass
  const composedOf: string[] = [];
  if (type === "agent" && Array.isArray(data.composed_of)) {
    for (const item of data.composed_of) {
      if (typeof item !== "string" || !item.trim()) {
        throw buildError('"composed_of" entries must be non-empty strings', filePath);
      }
      composedOf.push(item.trim());
    }
  }

  return {
    name,
    type,
    domain,
    surface,
    status,
    gating,
    downloadable,
    summary,
    composed_of: composedOf,
    _path: relative(repoRoot, filePath),
  };
}

// ── resolver ──────────────────────────────────────────────────────────────────

function resolveComposedOf(records: ParsedRecord[]): ManifestRecord[] {
  const byName = new Map<string, ParsedRecord>();
  for (const r of records) {
    if (byName.has(r.name)) {
      throw buildError(`duplicate artefact name "${r.name}" — names must be unique`);
    }
    byName.set(r.name, r);
  }

  const resolvedCache = new Map<string, ManifestRecord>();

  function resolve(name: string, chain: string[]): ManifestRecord {
    if (resolvedCache.has(name)) return resolvedCache.get(name)!;

    const record = byName.get(name);
    if (!record) {
      throw buildError(
        `composed_of references "${name}" but no artefact with that name was found`,
      );
    }

    if (chain.includes(name)) {
      throw buildError(
        `circular composed_of reference: ${[...chain, name].join(" → ")}`,
      );
    }

    const next = [...chain, name];
    const resolved: ManifestRecord = {
      ...record,
      composed_of: record.composed_of.map((dep) => resolve(dep, next)),
    };
    resolvedCache.set(name, resolved);
    return resolved;
  }

  for (const r of records) {
    resolve(r.name, []);
  }

  return records.map((r) => resolvedCache.get(r.name)!);
}

// ── main ──────────────────────────────────────────────────────────────────────

function main(): void {
  const artefactFiles = findArtefactFiles();

  if (artefactFiles.length === 0) {
    if (isCI()) {
      console.error("[build-manifest] ERROR: no artefact files found");
      process.exit(1);
    }
    warn("no artefact files found — manifest will be empty");
  }

  console.log(`[build-manifest] found ${artefactFiles.length} artefact file(s)`);

  const parsed = artefactFiles.map(({ filePath, defaultType }) =>
    parseArtefact(filePath, defaultType),
  );

  const all = resolveComposedOf(parsed);
  const publicRecords = all.filter((r) => r.gating === "public");
  const privateCount = all.length - publicRecords.length;

  console.log(
    `[build-manifest] ${publicRecords.length} public, ${privateCount} private`,
  );

  const outDir = join(repoRoot, "public");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  writeFileSync(
    join(outDir, "manifest.json"),
    JSON.stringify(publicRecords, null, 2) + "\n",
    "utf-8",
  );
  writeFileSync(
    join(outDir, "manifest.owner.json"),
    JSON.stringify(all, null, 2) + "\n",
    "utf-8",
  );

  console.log(
    `[build-manifest] wrote public/manifest.json (${publicRecords.length} records)`,
  );
  console.log(
    `[build-manifest] wrote public/manifest.owner.json (${all.length} records)`,
  );

  // Downloads: emit a clean .md (body only, frontmatter stripped) for every
  // public + downloadable artefact, named <artefact>.md. The downloads dir is
  // rebuilt from scratch each run so no file lingers for an artefact that has
  // since been made private or non-downloadable.
  const downloadsDir = join(outDir, "downloads");
  rmSync(downloadsDir, { recursive: true, force: true });
  const downloadable = publicRecords.filter((r) => r.downloadable);
  if (downloadable.length > 0) {
    mkdirSync(downloadsDir, { recursive: true });
    for (const record of downloadable) {
      const source = readFileSync(join(repoRoot, record._path), "utf-8");
      const body = matter(source).content.trim();
      writeFileSync(
        join(downloadsDir, `${record.name}.md`),
        body + "\n",
        "utf-8",
      );
    }
  }
  console.log(
    `[build-manifest] wrote ${downloadable.length} download(s) to public/downloads/`,
  );
}

try {
  main();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
