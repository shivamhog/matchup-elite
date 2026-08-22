import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { StatusPill } from "@/components/matchup/BookingCard";
import { EmptyState } from "@/components/matchup/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { decideWinner, formatINR, isSetValid } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";

export const Route = createFileRoute("/match/$id")({
  head: () => ({
    meta: [
      { title: "Match Verification — MatchUp" },
      {
        name: "description",
        content:
          "Enter the 21-point match score and get coach or court-admin verification to release escrow instantly.",
      },
      { property: "og:title", content: "Match score & escrow release — MatchUp" },
      {
        property: "og:description",
        content: "Anti-fraud referee verification unlocks the athlete's payout.",
      },
    ],
  }),
  component: MatchScreen,
});

type SetRow = { a: string; b: string };

function MatchScreen() {
  const { id } = Route.useParams();
  const { state, submitScore } = useStore();
  const navigate = useNavigate();
  const booking = state.bookings.find((b) => b.id === id);

  const [rows, setRows] = useState<SetRow[]>([
    { a: "", b: "" },
    { a: "", b: "" },
    { a: "", b: "" },
  ]);
  const [verified, setVerified] = useState(false);

  if (!booking) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-md px-4 pt-16">
        <EmptyState title="Match not found" hint="This booking no longer exists." />
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link to="/client">Back to app</Link>
        </Button>
      </div>
    );
  }

  const parsed = rows
    .filter((r) => r.a !== "" && r.b !== "")
    .map((r) => ({ a: Number(r.a), b: Number(r.b) }));

  const setEl = (i: number, side: "a" | "b", value: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [side]: value.replace(/[^0-9]/g, "") } : r)));

  const submit = () => {
    if (parsed.length < 2) {
      toast.error("Enter at least two completed sets");
      return;
    }
    if (parsed.some((s) => !isSetValid(s))) {
      toast.error("Each set must be a valid 21-point result (e.g. 21-18, 23-21, 30-29)");
      return;
    }
    if (!decideWinner(parsed)) {
      toast.error("Sets are tied — add the deciding set");
      return;
    }
    submitScore(booking.id, parsed, verified);
    if (verified) {
      toast.success(`Verified · ${formatINR(booking.amount)} released to ${booking.athleteName}`);
      navigate({ to: booking.athleteId === "me" ? "/player/earnings" : "/client/bookings" });
    } else {
      toast("Score saved — awaiting coach / court-admin verification");
    }
  };

  const locked = booking.status === "verified";

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-16 pt-6">
      <button
        onClick={() => navigate({ to: booking.athleteId === "me" ? "/player" : "/client/bookings" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Match verification</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {booking.clientName} vs {booking.athleteName}
      </p>

      <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
        <p className="font-medium">{booking.courtName}</p>
        <p className="text-xs text-muted-foreground">{booking.slot}</p>
        <div className="mt-3 flex items-center justify-between">
          <StatusPill status={booking.status} />
          <p className="font-bold text-primary">{formatINR(booking.amount)} in escrow</p>
        </div>
      </div>

      {locked ? (
        <div className="mt-5 rounded-2xl border border-primary/40 bg-primary/10 p-5 text-center">
          <ShieldCheck className="mx-auto size-6 text-primary" />
          <p className="mt-2 font-bold">Verified &amp; settled</p>
          <p className="mt-1 font-mono text-sm">
            {booking.sets.map((s) => `${s.a}-${s.b}`).join("  ·  ")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatINR(booking.amount)} released to {booking.athleteName}.
          </p>
        </div>
      ) : (
        <>
          <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Final score · best of 3 (21 points)
          </h2>
          <div className="mt-2 space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3">
                <span className="w-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Set {i + 1}
                </span>
                <Input
                  aria-label={`Set ${i + 1} client points`}
                  inputMode="numeric"
                  maxLength={2}
                  value={r.a}
                  placeholder="21"
                  onChange={(e) => setEl(i, "a", e.target.value)}
                  className="text-center font-mono"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  aria-label={`Set ${i + 1} player points`}
                  inputMode="numeric"
                  maxLength={2}
                  value={r.b}
                  placeholder="18"
                  onChange={(e) => setEl(i, "b", e.target.value)}
                  className="text-center font-mono"
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Left column = {booking.clientName} (client), right = {booking.athleteName} (athlete).
          </p>

          <div className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="admin" className="text-sm font-semibold">
                Coach / Courtyard Admin verification
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                The anti-fraud referee check. Escrow only releases once this is on.
              </p>
            </div>
            <Switch id="admin" checked={verified} onCheckedChange={setVerified} />
          </div>

          <Button size="lg" className="mt-5 w-full font-bold" onClick={submit}>
            {verified ? `Verify & release ${formatINR(booking.amount)}` : "Save score"}
          </Button>
        </>
      )}
    </div>
  );
}
