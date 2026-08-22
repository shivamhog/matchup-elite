import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Bell, MapPin, Radar } from "lucide-react";
import { toast } from "sonner";

import { BookingCard } from "@/components/matchup/BookingCard";
import { EmptyState, Screen, SectionTitle, SwitchRoleLink } from "@/components/matchup/Shell";
import { TierBadge } from "@/components/matchup/TierBadge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MAX_RADIUS_KM, MIN_RADIUS_KM, formatINR } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";

export const Route = createFileRoute("/player/")({
  head: () => ({
    meta: [
      { title: "Freelance Gigs — MatchUp for Athletes" },
      {
        name: "description",
        content:
          "Go online, cap your travel radius at 5 km and accept paid badminton match gigs near you.",
      },
      { property: "og:title", content: "Earn as a freelance badminton athlete — MatchUp" },
      {
        property: "og:description",
        content: "Accept or decline incoming match requests with escrow-backed payouts.",
      },
    ],
  }),
  component: Gigs,
});

function Gigs() {
  const { state, updateMe, respondToRequest, simulateIncoming } = useStore();
  const { me } = state;
  const requests = state.bookings.filter((b) => b.athleteId === "me" && b.status === "pending");
  const upcoming = state.bookings.filter(
    (b) => b.athleteId === "me" && (b.status === "accepted" || b.status === "awaiting_score"),
  );
  const fired = useRef(false);

  useEffect(() => {
    if (!me.online || fired.current) return;
    fired.current = true;
    const t = setTimeout(() => {
      simulateIncoming();
      toast("New match request nearby", { description: "Tap Accept to lock the gig." });
    }, 3500);
    return () => clearTimeout(t);
  }, [me.online, simulateIncoming]);

  useEffect(() => {
    if (!me.online) fired.current = false;
  }, [me.online]);

  return (
    <Screen
      title="Gig board"
      subtitle={`${me.name} · ${formatINR(me.rate)} per 21-pt match`}
      action={<SwitchRoleLink to="/client" label="Client view" />}
    >
      <div className="rounded-3xl border border-primary/25 bg-card p-5 neon-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Availability
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight">
              {me.online ? (
                <span className="text-primary text-glow">ONLINE</span>
              ) : (
                <span className="text-muted-foreground">OFFLINE</span>
              )}
            </p>
            <div className="mt-2">
              <TierBadge tier={me.tier} />
            </div>
          </div>
          <Switch
            checked={me.online}
            onCheckedChange={(v) => {
              updateMe({ online: v });
              toast[v ? "success" : "message"](v ? "You're live — accepting gigs" : "You're offline");
            }}
            aria-label="Go online or offline"
            className="scale-125"
          />
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <Radar className="size-4 text-primary" /> Booking radius
          </p>
          <p className="text-sm font-bold text-primary">{me.radiusKm} km</p>
        </div>
        <Slider
          className="mt-4"
          value={[me.radiusKm]}
          min={MIN_RADIUS_KM}
          max={MAX_RADIUS_KM}
          step={0.5}
          onValueChange={([v]) => updateMe({ radiusKm: v ?? MIN_RADIUS_KM })}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Hard cap {MAX_RADIUS_KM} km — requests outside your radius are never routed to you.
        </p>
      </div>

      <SectionTitle
        right={
          <Button size="sm" variant="ghost" onClick={simulateIncoming} disabled={!me.online}>
            Simulate request
          </Button>
        }
      >
        Incoming requests
      </SectionTitle>
      <div className="space-y-2.5">
        {requests.length ? (
          requests.map((b) => (
            <div key={b.id} className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Bell className="size-3" /> New booking request
              </p>
              <p className="mt-2 text-lg font-bold">{b.clientName}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {b.courtName}
              </p>
              <p className="text-xs text-muted-foreground">{b.slot}</p>
              <p className="mt-2 text-2xl font-black text-primary">{formatINR(b.amount)}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                held in escrow · 1 × 21-point match
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    respondToRequest(b.id, false);
                    toast("Request declined · client refunded");
                  }}
                >
                  Decline
                </Button>
                <Button
                  className="font-bold"
                  onClick={() => {
                    respondToRequest(b.id, true);
                    toast.success("Gig accepted — see you on court");
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={me.online ? "Waiting for requests" : "You're offline"}
            hint={
              me.online
                ? "Clients within your radius can now book you."
                : "Flip the switch above to start receiving gigs."
            }
          />
        )}
      </div>

      {upcoming.length ? (
        <>
          <SectionTitle>Confirmed gigs</SectionTitle>
          <div className="space-y-2.5">
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} perspective="athlete" />
            ))}
          </div>
        </>
      ) : null}
    </Screen>
  );
}
