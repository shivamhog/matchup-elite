import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, IndianRupee, ShieldCheck, Trophy, Zap } from "lucide-react";

import { useStore } from "@/lib/matchup/store";
import { TIERS, TIER_ORDER } from "@/lib/matchup/types";
import { rateBandLabel } from "@/lib/matchup/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchUp — Badminton Athlete-on-Demand & Skill Upgradation" },
      {
        name: "description",
        content:
          "Book verified badminton opponents near you or earn as a freelance athlete. Pay-per-match pricing, no hourly metering, escrow-protected payouts.",
      },
      { property: "og:title", content: "MatchUp — Play & Earn on the badminton court" },
      {
        property: "og:description",
        content:
          "Hire nearby verified players by the 21-point match, or go online and earn freelance gigs within a 5 km radius.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { setRole } = useStore();
  const navigate = useNavigate();

  const choose = (role: "client" | "player") => {
    setRole(role);
    navigate({ to: role === "client" ? "/client" : "/player" });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pb-12 pt-14">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
        <Zap className="size-3.5" /> Play &amp; Earn
      </div>

      <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight">
        MATCH<span className="text-primary text-glow">UP</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Freelance jobs for athletes, on-demand opponents for players. Every booking is priced per
        21-point match — never by the hour.
      </p>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => choose("client")}
          className="group w-full rounded-3xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">I want to Play / Hire</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Find verified opponents nearby and book a match instantly.
              </p>
            </div>
            <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </button>

        <button
          onClick={() => choose("player")}
          className="group w-full rounded-3xl border border-primary/40 bg-primary/10 p-5 text-left transition-colors hover:border-primary neon-glow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">I want to Work / Earn</p>
              <p className="mt-1 text-sm text-foreground/70">
                Go online, set your radius and get paid per match.
              </p>
            </div>
            <ArrowRight className="size-5 shrink-0 text-primary" />
          </div>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2">
        {[
          { icon: ShieldCheck, label: "Escrow secured" },
          { icon: IndianRupee, label: "No hourly bill" },
          { icon: Trophy, label: "Tier verified" },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-2xl border border-border bg-surface/60 p-3 text-center"
          >
            <f.icon className="mx-auto size-4 text-primary" />
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {f.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-9 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
        Tiered per-match pricing
      </h2>
      <div className="mt-2 space-y-2">
        {TIER_ORDER.map((tier) => {
          const t = TIERS[tier];
          return (
            <div
              key={tier}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: t.colorVar }}>
                  {t.code}-Tier · {t.label}
                </p>
                <p className="text-xs text-muted-foreground">{t.blurb}</p>
              </div>
              <p className="text-right text-xs font-medium text-foreground/80">
                {rateBandLabel(tier)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
