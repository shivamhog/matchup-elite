import { createFileRoute } from "@tanstack/react-router";
import { Lock, TrendingUp } from "lucide-react";

import { EmptyState, Screen, SectionTitle } from "@/components/matchup/Shell";
import { formatINR } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";

export const Route = createFileRoute("/player/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings & Payouts — MatchUp" },
      {
        name: "description",
        content: "Track escrow-pending match fees and instant payouts released after verification.",
      },
      { property: "og:title", content: "Athlete earnings — MatchUp" },
      { property: "og:description", content: "Per-match payouts released straight from escrow." },
    ],
  }),
  component: Earnings,
});

function Earnings() {
  const { state } = useStore();
  const pending = state.bookings
    .filter((b) => b.athleteId === "me" && (b.status === "accepted" || b.status === "awaiting_score"))
    .reduce((s, b) => s + b.amount, 0);
  const payouts = state.transactions.filter((t) => t.side === "athlete");

  return (
    <Screen title="Earnings" subtitle="Paid per 21-point match, never per hour">
      <div className="rounded-3xl border border-primary/25 bg-card p-5 neon-glow">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <TrendingUp className="size-3.5" /> Available balance
        </p>
        <p className="mt-2 text-4xl font-black tracking-tight text-primary text-glow">
          {formatINR(state.earnings)}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="size-3" /> {formatINR(pending)} pending in client escrow
        </p>
      </div>

      <SectionTitle>Payout history</SectionTitle>
      <div className="space-y-2">
        {payouts.length ? (
          payouts.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(t.at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="text-sm font-bold text-primary">+{formatINR(t.amount)}</p>
            </div>
          ))
        ) : (
          <EmptyState
            title="No payouts yet"
            hint="Accept a gig, play the match and get verified to release escrow."
          />
        )}
      </div>
    </Screen>
  );
}
