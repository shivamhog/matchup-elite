import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, Screen, SectionTitle } from "@/components/matchup/Shell";
import { WalletCard } from "@/components/matchup/WalletCard";
import { formatINR } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet & Escrow — MatchUp" },
      {
        name: "description",
        content: "MatchUp wallet balance, escrow-locked match funds and full transaction ledger.",
      },
      { property: "og:title", content: "Wallet & escrow — MatchUp" },
      { property: "og:description", content: "Add money by UPI and track every match transaction." },
    ],
  }),
  component: WalletScreen,
});

function WalletScreen() {
  const { state } = useStore();
  const ledger = state.transactions.filter((t) => t.side === "client");

  return (
    <Screen title="Wallet" subtitle="Coins are locked in escrow until a match is verified">
      <WalletCard />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Available</p>
          <p className="mt-1 text-xl font-bold">{formatINR(state.balance)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">In escrow</p>
          <p className="mt-1 text-xl font-bold text-tier-gold">{formatINR(state.escrow)}</p>
        </div>
      </div>

      <SectionTitle>Transactions</SectionTitle>
      <div className="space-y-2">
        {ledger.length ? (
          ledger.map((t) => (
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
              <p
                className={cn(
                  "text-sm font-bold",
                  t.amount >= 0 ? "text-primary" : "text-muted-foreground",
                )}
              >
                {t.amount >= 0 ? "+" : "−"}
                {formatINR(Math.abs(t.amount))}
              </p>
            </div>
          ))
        ) : (
          <EmptyState title="No transactions yet" hint="Add money to start booking matches." />
        )}
      </div>
    </Screen>
  );
}
