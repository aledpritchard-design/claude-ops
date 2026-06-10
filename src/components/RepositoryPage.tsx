"use client";

import { useState, useEffect } from "react";
import type { ManifestRecord, Domain, Status, ArtefactType } from "@/lib/manifest";
import { SECTION_TYPES, SECTION_META } from "@/lib/manifest";
import ArtefactCard from "@/components/ArtefactCard";
import FilterBar from "@/components/FilterBar";

interface Props {
  artefacts: ManifestRecord[];
  ownerArtefacts: ManifestRecord[];
}

const SECTION_HEADINGS: Record<"skill" | "task" | "routine", string> = {
  skill: "Skills",
  task: "Tasks",
  routine: "Routines",
};

export default function RepositoryPage({ artefacts, ownerArtefacts }: Props) {
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [activeStatus, setActiveStatus] = useState<Status | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    if (key && key === process.env.NEXT_PUBLIC_OWNER_KEY) {
      setIsOwner(true);
    }
  }, []);

  const displayArtefacts = isOwner ? ownerArtefacts : artefacts;

  const filtered = displayArtefacts.filter((a) => {
    if (activeDomain && a.domain !== activeDomain) return false;
    if (activeStatus && a.status !== activeStatus) return false;
    return true;
  });

  return (
    <div className="flex items-start min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen shrink-0 w-[320px] flex flex-col items-start justify-between p-8">
        <div className="flex flex-col gap-0 w-full">
          <span className="text-[16px] font-medium leading-[1.4] text-white/70">
            Agent
          </span>
        </div>
        <div className="flex flex-col gap-0 w-full">
          <span className="text-[16px] font-medium leading-[1.4] text-white">
            Aled Pritchard
          </span>
        </div>
        <nav className="flex flex-col gap-2 w-full">
          <span className="text-[16px] font-medium leading-[1.4] text-white/70 mb-2">
            Menu
          </span>
          {(SECTION_TYPES as Array<"skill" | "task" | "routine">).map((t) => (
            <a
              key={t}
              href={`#${t}s`}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors"
            >
              {SECTION_HEADINGS[t]}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col pb-8">
        {/* Page header */}
        <header className="flex flex-col gap-12 pl-8 pr-16 pt-16 pb-24">
          <div className="flex flex-col gap-2">
            <p className="text-[72px] font-normal leading-[1.1] tracking-[-0.01em] text-white">
              os.Claude
            </p>
            <p className="text-[22px] font-normal leading-[1.4] text-white/70">
              AI product design, Knowledge systems, Conversation
            </p>
          </div>
          <div className="border-t border-white/10 w-full" />
          <FilterBar
            activeDomain={activeDomain}
            activeStatus={activeStatus}
            onDomain={setActiveDomain}
            onStatus={setActiveStatus}
          />
        </header>

        {/* Sections */}
        {(SECTION_TYPES as Array<"skill" | "task" | "routine">).map(
          (type, sectionIdx) => {
            const meta = SECTION_META[type];
            const items = filtered.filter((a) => a.type === type);
            return (
              <section
                key={type}
                id={`${type}s`}
                className="flex flex-col gap-16 pl-8 pr-16 py-8"
              >
                <div className="border-t border-white/10 w-full" />
                <div className="flex items-center gap-3 text-[16px] font-medium tracking-[0.48px] text-white tabular-nums">
                  <span style={{ fontFeatureSettings: '"lnum" 1, "tnum" 1' }}>
                    {meta.index}
                  </span>
                  <span style={{ fontFeatureSettings: '"lnum" 1, "tnum" 1' }}>
                    {SECTION_HEADINGS[type]}
                  </span>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-[42px] font-normal leading-[1.1] tracking-[-0.01em] text-white">
                      {SECTION_HEADINGS[type]}
                    </p>
                    <p className="text-[16px] font-normal leading-[1.4] text-white/70">
                      {meta.subtitle}
                    </p>
                  </div>

                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[10px]">
                      {items.map((a, i) => (
                        <ArtefactCard
                          key={a.name}
                          artefact={a}
                          sectionIndex={sectionIdx + 1}
                          cardIndex={i + 1}
                          isOwner={isOwner}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-white/30 py-8">
                      {activeDomain || activeStatus
                        ? "No items match the active filters."
                        : "None yet."}
                    </p>
                  )}
                </div>
              </section>
            );
          },
        )}
      </main>
    </div>
  );
}
