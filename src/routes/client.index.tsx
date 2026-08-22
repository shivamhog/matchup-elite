import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

import { PlayerCard } from "@/components/matchup/PlayerCard";
import { EmptyState, Screen, SectionTitle, SwitchRoleLink } from "@/components/matchup/Shell";
import { TierBadge, VerifiedBadge } from "@/components/matchup/TierBadge";
import { WalletCard } from "@/components/matchup/WalletCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { COURTS, SLOTS } from "@/lib/matchup/data";
import { formatINR } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";
import { TIERS, TIER_ORDER, type Athlete, type Tier } from "@/lib/matchup/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/")({
  head: () => ({
    meta: [
      { title: "Discover Players — MatchUp" },
      {
        name: "description",
        content:
          "Browse verified badminton opponents near you, filtered by skill tier, with transparent per-match rates.",
      },
      { property: "og:title", content: "Discover badminton opponents near you — MatchUp" },
      {
        property: "og:description",
        content: "Verified players sorted by distance with per-21-point-match pricing.",
      },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { state, bookMatch } = useStore();
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [courtId, setCourtId] = useState(COURTS[0]!.id);
  const [slot, setSlot] = useState(SLOTS[1]!);

  const players = useMemo(
    () =>
      state.athletes
        .filter((a) => a.online)
        .filter((a) => (filter === "all" ? true : a.tier === filter))
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [state.athletes, filter],
  );

  const book = () => {
    if (!selected) return;
    if (state.balance < selected.rate) {
      toast.error("Not enough balance — add money to your wallet first");
      return;
    }
    bookMatch(selected, courtId, slot);
    toast.success(`${formatINR(selected.rate)} locked in escrow · request sent to ${selected.name}`);
    setSelected(null);
  };

  return (
    <Screen
      title="Find an opponent"
      subtitle={`Hi ${state.clientName.split(" ")[0]}, 21-point matches near you`}
      action={<SwitchRoleLink to="/player" label="Player view" />}
    >
      <WalletCard />

      <SectionTitle>Active courts nearby</SectionTitle>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {COURTS.map((c) => (
          <div
            key={c.id}
            className="min-w-[10.5rem] shrink-0 rounded-2xl border border-border bg-card p-3"
          >
            <p className="truncate text-sm font-semibold">{c.name}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {c.area} · {c.distanceKm} km
            </p>
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-[11px] font-semibold",
                c.openNow ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Flame className="size-3" />
              {c.openNow ? `${c.activeMatches} live matches` : "Closed now"}
            </p>
          </div>
        ))}
      </div>

      <SectionTitle right={<span className="text-xs text-muted-foreground">{players.length} online</span>}>
        Players by distance
      </SectionTitle>
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
        {(["all", ...TIER_ORDER] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            data-on={filter === t}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors data-[on=true]:border-primary data-[on=true]:bg-primary/15 data-[on=true]:text-primary"
          >
            {t === "all" ? "All tiers" : `${TIERS[t].code} · ${TIERS[t].label}`}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {players.length ? (
          players.map((a) => (
            <PlayerCard key={a.id} athlete={a} onSelect={() => setSelected(a)} />
          ))
        ) : (
          <EmptyState title="No players in this tier" hint="Try another skill tier or check back later." />
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl">
          {selected ? (
            <>
              <SheetHeader className="pb-0">
                <SheetTitle className="sr-only">Book {selected.name}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8">
                <div className="flex items-center gap-3">
                  <Avatar className="size-16 border border-border">
                    <AvatarImage src={selected.photo} alt={selected.name} />
                    <AvatarFallback>{selected.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-bold">{selected.name}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <TierBadge tier={selected.tier} />
                      {selected.verified ? <VerifiedBadge /> : null}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{selected.bio}</p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Rating", value: selected.rating.toFixed(1), icon: Star },
                    { label: "Matches", value: String(selected.matches) },
                    { label: "Distance", value: `${selected.distanceKm} km` },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-surface p-3 text-center">
                      <p className="text-base font-bold">{s.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Court
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {COURTS.filter((c) => c.openNow).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCourtId(c.id)}
                        data-on={courtId === c.id}
                        className="rounded-xl border border-border bg-surface px-3 py-2 text-left text-xs font-semibold transition-colors data-[on=true]:border-primary data-[on=true]:text-primary"
                      >
                        {c.name}
                        <span className="block text-[10px] font-normal text-muted-foreground">
                          {c.area} · {c.distanceKm} km
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Slot
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SLOTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        data-on={slot === s}
                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold transition-colors data-[on=true]:border-primary data-[on=true]:text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1 × 21-point match</span>
                    <span className="font-semibold">{formatINR(selected.rate)}</span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-muted-foreground">Hourly metering</span>
                    <span className="font-semibold text-primary">Never charged</span>
                  </div>
                </div>

                <Button className="w-full font-bold" size="lg" onClick={book}>
                  Book match · {formatINR(selected.rate)} to escrow
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </Screen>
  );
}
