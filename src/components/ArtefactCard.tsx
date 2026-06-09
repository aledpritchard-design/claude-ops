import type { ManifestRecord } from "@/lib/manifest";
import {
  DOMAIN_LABELS,
  STATUS_LABELS,
  SURFACE_LABELS,
} from "@/lib/manifest";

interface Props {
  artefact: ManifestRecord;
  sectionIndex: number;
  cardIndex: number;
}

export default function ArtefactCard({
  artefact,
  sectionIndex,
  cardIndex,
}: Props) {
  const { name, type, domain, surface, status, summary, downloadable } =
    artefact;

  return (
    <div className="bg-[#151616] flex flex-col items-start justify-between p-6 h-[390px] min-w-0">
      {/* top: section.card index */}
      <div className="flex items-center gap-2 text-[12px] font-medium tracking-[0.36px] text-white/70 tabular-nums shrink-0">
        <span>0{sectionIndex}</span>
        <span>·</span>
        <span>{String(cardIndex).padStart(2, "0")}</span>
      </div>

      {/* middle: name + descriptor */}
      <div className="flex flex-col gap-2 w-full shrink-0">
        <div className="flex gap-2 items-center">
          <span className="text-[10px] font-medium tracking-[0.3px] uppercase text-white/50 bg-white/10 px-2 py-0.5 rounded-sm">
            {type}
          </span>
          <span className="text-[10px] font-medium tracking-[0.3px] uppercase text-white/50 bg-white/10 px-2 py-0.5 rounded-sm">
            {DOMAIN_LABELS[domain]}
          </span>
        </div>
        <p className="text-[22px] font-normal leading-[1.1] text-white break-words">
          {name}
        </p>
        {summary && (
          <p className="text-[12px] font-normal leading-[1.4] text-white/70 line-clamp-2">
            {summary}
          </p>
        )}
      </div>

      {/* bottom: metadata */}
      <div className="border-t border-white/10 pt-4 flex flex-col gap-2 w-full shrink-0 text-[10px] font-normal leading-normal">
        <div className="flex flex-col gap-1">
          <span className="text-white/70">category</span>
          <span className="text-white">{type}</span>
        </div>
        {surface && (
          <div className="flex flex-col gap-1">
            <span className="text-white/70">surface</span>
            <span className="text-white">{SURFACE_LABELS[surface]}</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-white/70">status</span>
          <span className="text-white">{STATUS_LABELS[status]}</span>
        </div>
        {downloadable && (
          <a
            href={`downloads/${name}.md`}
            download={`${name}.md`}
            className="text-white/70 hover:text-white underline underline-offset-2 transition-colors w-fit mt-1"
          >
            Download .md
          </a>
        )}
      </div>
    </div>
  );
}
