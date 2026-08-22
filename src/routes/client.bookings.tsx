import { createFileRoute } from "@tanstack/react-router";

import { BookingCard } from "@/components/matchup/BookingCard";
import { EmptyState, Screen, SectionTitle } from "@/components/matchup/Shell";
import { useStore } from "@/lib/matchup/store";

export const Route = createFileRoute("/client/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — MatchUp" },
      {
        name: "description",
        content: "Track every booked badminton match, escrow status and score verification.",
      },
      { property: "og:title", content: "My badminton bookings — MatchUp" },
      { property: "og:description", content: "Pending, accepted and verified matches in one place." },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  const { state, cancelBooking } = useStore();
  const mine = state.bookings.filter((b) => b.athleteId !== "me");
  const active = mine.filter((b) => ["pending", "accepted", "awaiting_score"].includes(b.status));
  const past = mine.filter((b) => !["pending", "accepted", "awaiting_score"].includes(b.status));

  return (
    <Screen title="Bookings" subtitle="Escrow-protected matches">
      <SectionTitle>Active</SectionTitle>
      <div className="space-y-2.5">
        {active.length ? (
          active.map((b) => (
            <BookingCard key={b.id} booking={b} perspective="client" onCancel={cancelBooking} />
          ))
        ) : (
          <EmptyState title="No active matches" hint="Book an opponent from Discover to get started." />
        )}
      </div>

      {past.length ? (
        <>
          <SectionTitle>History</SectionTitle>
          <div className="space-y-2.5">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} perspective="client" />
            ))}
          </div>
        </>
      ) : null}
    </Screen>
  );
}
