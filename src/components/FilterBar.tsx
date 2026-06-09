"use client";

import type { Domain, Status } from "@/lib/manifest";

interface Props {
  activeDomain: Domain | null;
  activeStatus: Status | null;
  onDomain: (d: Domain | null) => void;
  onStatus: (s: Status | null) => void;
}

const DOMAINS: Domain[] = ["ops", "content", "web"];
const STATUSES: Status[] = ["done", "draft", "proposed"];

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[12px] font-medium px-3 py-1 rounded-sm border transition-colors cursor-pointer ${
        active
          ? "border-white text-white bg-white/10"
          : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({
  activeDomain,
  activeStatus,
  onDomain,
  onStatus,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[12px]">
      <div className="flex items-center gap-2">
        <span className="text-white/40 tracking-wide">Domain</span>
        <div className="flex gap-1">
          {DOMAINS.map((d) => (
            <FilterButton
              key={d}
              label={d}
              active={activeDomain === d}
              onClick={() => onDomain(activeDomain === d ? null : d)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white/40 tracking-wide">Status</span>
        <div className="flex gap-1">
          {STATUSES.map((s) => (
            <FilterButton
              key={s}
              label={s}
              active={activeStatus === s}
              onClick={() => onStatus(activeStatus === s ? null : s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
