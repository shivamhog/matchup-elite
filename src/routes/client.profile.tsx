import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck, Sparkles, Users } from "lucide-react";

import { Screen, SectionTitle } from "@/components/matchup/Shell";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";

export const Route = createFileRoute("/client/profile")({
  head: () => ({
    meta: [
      { title: "Client Profile — MatchUp" },
      {
        name: "description",
        content: "Your MatchUp client account, anti-fatigue pricing policy and match history summary.",
      },
      { property: "og:title", content: "Client profile — MatchUp" },
      { property: "og:description", content: "Account details and pay-per-match protections." },
    ],
  }),
  component: ClientProfile,
});

function ClientProfile() {
  const { state, setRole } = useStore();
  const navigate = useNavigate();
  const verified = state.bookings.filter((b) => b.status === "verified");
  const spent = verified.reduce((sum, b) => sum + b.amount, 0);

  return (
    <Screen title="Profile" subtitle="Client account">
      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="text-xl font-bold">{state.clientName}</p>
        <p className="mt-1 text-sm text-muted-foreground">Casual player · Bengaluru</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Matches played
            </p>
            <p className="mt-1 text-lg font-bold">{verified.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total spent</p>
            <p className="mt-1 text-lg font-bold">{formatINR(spent)}</p>
          </div>
        </div>
      </div>

      <SectionTitle>Your protections</SectionTitle>
      <div className="space-y-2">
        {[
          {
            icon: Sparkles,
            title: "Anti-fatigue pricing",
            body: "Every booking is one 21-point match. Long rallies never cost you extra.",
          },
          {
            icon: ShieldCheck,
            title: "Escrow safety",
            body: "Funds only leave escrow after a verified score — declines refund instantly.",
          },
          {
            icon: Users,
            title: "Tier-validated athletes",
            body: "Rates are capped by the athlete's verified ID level, so no one overprices.",
          },
        ].map((f) => (
          <div key={f.title} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <f.icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{f.body}</p>
            </div>
          </div>
        ))}
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
