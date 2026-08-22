import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { TIERS, type Tier } from "@/lib/matchup/types";

export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  const t = TIERS[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
        className,
      )}
      style={{
        color: t.colorVar,
        borderColor: `color-mix(in oklab, ${t.colorVar} 45%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${t.colorVar} 12%, transparent)`,
      }}
    >
      {t.code} · {t.label}
    </span>
  );
}

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
      <ShieldCheck className="size-3" />
      {label}
    </span>
  );
}
