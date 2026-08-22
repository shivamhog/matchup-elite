import { MapPin, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TierBadge, VerifiedBadge } from "@/components/matchup/TierBadge";
import { formatINR } from "@/lib/matchup/pricing";
import type { Athlete } from "@/lib/matchup/types";

export function PlayerCard({ athlete, onSelect }: { athlete: Athlete; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-14 border border-border">
            <AvatarImage src={athlete.photo} alt={`${athlete.name} profile photo`} />
            <AvatarFallback className="bg-surface text-sm font-bold">
              {athlete.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {athlete.online ? (
            <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-card bg-primary" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold">{athlete.name}</p>
            {athlete.verified ? <VerifiedBadge label="ID" /> : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <TierBadge tier={athlete.tier} />
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="size-3 fill-current text-tier-gold" /> {athlete.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {athlete.distanceKm.toFixed(1)} km away
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-primary">{formatINR(athlete.rate)}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">per match</p>
        </div>
      </div>
    </button>
  );
}
