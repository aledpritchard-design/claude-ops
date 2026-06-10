import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { ManifestRecord } from "@/lib/manifest";
import { SECTION_TYPES } from "@/lib/manifest";
import RepositoryPage from "@/components/RepositoryPage";

export default function Page() {
  const publicPath = join(process.cwd(), "public", "manifest.json");
  const ownerPath = join(process.cwd(), "public", "manifest.owner.json");

  const publicAll: ManifestRecord[] = JSON.parse(readFileSync(publicPath, "utf-8"));
  const ownerAll: ManifestRecord[] = existsSync(ownerPath)
    ? JSON.parse(readFileSync(ownerPath, "utf-8"))
    : publicAll;

  const publicArtefacts = publicAll.filter((a) =>
    (SECTION_TYPES as string[]).includes(a.type),
  );
  const ownerArtefacts = ownerAll.filter((a) =>
    (SECTION_TYPES as string[]).includes(a.type),
  );

  return (
    <RepositoryPage
      artefacts={publicArtefacts}
      ownerArtefacts={ownerArtefacts}
    />
  );
}
