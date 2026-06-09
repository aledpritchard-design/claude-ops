import { readFileSync } from "fs";
import { join } from "path";
import type { ManifestRecord } from "@/lib/manifest";
import { SECTION_TYPES } from "@/lib/manifest";
import RepositoryPage from "@/components/RepositoryPage";

export default function Page() {
  const raw = readFileSync(
    join(process.cwd(), "public", "manifest.json"),
    "utf-8",
  );
  const all: ManifestRecord[] = JSON.parse(raw);
  const artefacts = all.filter((a) =>
    (SECTION_TYPES as string[]).includes(a.type),
  );
  return <RepositoryPage artefacts={artefacts} />;
}
