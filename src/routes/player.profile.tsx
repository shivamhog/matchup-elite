import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Screen, SectionTitle } from "@/components/matchup/Shell";
import { TierBadge, VerifiedBadge } from "@/components/matchup/TierBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clampRate, formatINR, isRateValid, rateBandLabel } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";
import { TIERS, TIER_ORDER, type Tier } from "@/lib/matchup/types";

export const Route = createFileRoute("/player/profile")({
  head: () => ({
    meta: [
      { title: "Athlete Profile & Rate — MatchUp" },
      {
        name: "description",
        content:
          "Set your per-match rate within your validated ID tier band, from Bronze ₹20 to Platinum ₹800+.",
      },
      { property: "og:title", content: "Athlete profile and tier pricing — MatchUp" },
      { property: "og:description", content: "Tier-validated pricing keeps rates fair for everyone." },
    ],
  }),
  component: PlayerProfile,
});

function PlayerProfile() {
  const { state, updateMe, setRole } = useStore();
  const navigate = useNavigate();
  const { me } = state;
  const [draft, setDraft] = useState(String(me.rate));

  const applyTier = (tier: Tier) => {
    const next = clampRate(tier, Number(draft));
    updateMe({ tier, rate: next });
    setDraft(String(next));
    toast.success(`Switched to ${TIERS[tier].label} · ${rateBandLabel(tier)}`);
  };

  const saveRate = () => {
    const value = Number(draft);
    if (!isRateValid(me.tier, value)) {
      toast.error(`${TIERS[me.tier].label} rates must be ${rateBandLabel(me.tier)}`);
      setDraft(String(clampRate(me.tier, value)));
      return;
    }
    updateMe({ rate: value });
    toast.success(`Rate set to ${formatINR(value)} per match`);
  };

  return (
    <Screen title="Profile" subtitle="Athlete account">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-16 border border-border">
            <AvatarImage src={me.photo} alt={me.name} />
            <AvatarFallback>{me.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold">{me.name}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <TierBadge tier={me.tier} />
              {me.verified ? <VerifiedBadge label="ID verified" /> : null}
            </div>
          </div>
        </div>
      </div>

      <SectionTitle>Validated ID level</SectionTitle>
      <div className="space-y-2">
        {TIER_ORDER.map((t) => {
          const meta = TIERS[t];
          const on = me.tier === t;
          return (
            <button
              key={t}
              onClick={() => applyTier(t)}
              data-on={on}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors data-[on=true]:border-primary"
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: meta.colorVar }}>
                  {meta.code}-Tier · {meta.label}
                </p>
                <p className="text-xs text-muted-foreground">{meta.blurb}</p>
              </div>
              <p className="text-xs font-medium text-foreground/80">{rateBandLabel(t)}</p>
            </button>
          );
        })}
      </div>

      <SectionTitle>Your per-match rate</SectionTitle>
      <div className="rounded-2xl border border-border bg-card p-4">
        <Label htmlFor="rate">Rate for one 21-point match (₹)</Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="rate"
            inputMode="numeric"
            maxLength={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          />
          <Button onClick={saveRate} className="font-semibold">
            Save
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Allowed for {TIERS[me.tier].label}: {rateBandLabel(me.tier)}. Hourly metering is disabled
          platform-wide.
        </p>
      </div>

      <Button
        variant="outline"
        className="mt-6 w-full"
        onClick={() => {
          setRole(null);
          navigate({ to: "/" });
        }}
      >
        <LogOut className="size-4" /> Switch role
      </Button>
    </Screen>
  );
}
