import { Link } from "@tanstack/react-router";
import { CalendarClock, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/matchup/pricing";
import type { Booking, BookingStatus } from "@/lib/matchup/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Awaiting player",
  accepted: "Accepted · escrow locked",
  declined: "Declined · refunded",
  awaiting_score: "Awaiting verification",
  verified: "Verified · paid out",
  cancelled: "Cancelled · refunded",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  const tone =
    status === "verified"
      ? "bg-primary/15 text-primary"
      : status === "declined" || status === "cancelled"
        ? "bg-destructive/15 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        tone,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function BookingCard({
  booking,
  perspective,
  onCancel,
}: {
  booking: Booking;
  perspective: "client" | "athlete";
  onCancel?: (id: string) => void;
}) {
  const counterpart = perspective === "client" ? booking.athleteName : booking.clientName;
  const canScore = booking.status === "accepted" || booking.status === "awaiting_score";

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{counterpart}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {booking.courtName}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="size-3" /> {booking.slot}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{formatINR(booking.amount)}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            per 21-pt match
          </p>
        </div>
      </div>

      {booking.sets.length ? (
        <p className="mt-3 font-mono text-sm text-foreground/90">
          {booking.sets.map((s) => `${s.a}-${s.b}`).join("  ·  ")}
          {booking.winner ? (
            <span className="ml-2 text-xs text-muted-foreground">
              {booking.winner === "client" ? "Client won" : "Player won"}
            </span>
          ) : null}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusPill status={booking.status} />
        <div className="flex gap-2">
          {onCancel && (booking.status === "pending" || booking.status === "accepted") ? (
            <Button size="sm" variant="ghost" onClick={() => onCancel(booking.id)}>
              Cancel
            </Button>
          ) : null}
          {canScore ? (
            <Button size="sm" asChild>
              <Link to="/match/$id" params={{ id: booking.id }}>
                Submit score
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
