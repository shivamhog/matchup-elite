import { createFileRoute } from "@tanstack/react-router";

import { Screen } from "@/components/matchup/Shell";
import { useStore } from "@/lib/matchup/store";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [6, 7, 8, 9, 17, 18, 19, 20, 21];

const label = (h: number) => {
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour} ${suffix}`;
};

export const Route = createFileRoute("/player/schedule")({
  head: () => ({
    meta: [
      { title: "Weekly Availability — MatchUp" },
      {
        name: "description",
        content: "Tap the hours you're free each week so clients can only book your open slots.",
      },
      { property: "og:title", content: "Set your weekly badminton availability — MatchUp" },
      { property: "og:description", content: "A tap-to-mark scheduler for freelance athletes." },
    ],
  }),
  component: Schedule,
});

function Schedule() {
  const { state, toggleSlot } = useStore();
  const slots = state.me.slots;

  return (
    <Screen title="Schedule" subtitle="Tap hours you're free — clients only see these">
      <div className="overflow-x-auto rounded-3xl border border-border bg-card p-3">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-12" />
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h}>
                <td className="pr-1 text-right text-[10px] font-semibold text-muted-foreground">
                  {label(h)}
                </td>
                {DAYS.map((d, di) => {
                  const key = `${di}-${h}`;
                  const on = slots.includes(key);
                  return (
                    <td key={key}>
                      <button
                        aria-label={`${d} ${label(h)} ${on ? "available" : "unavailable"}`}
                        onClick={() => toggleSlot(key)}
                        className={cn(
                          "h-8 w-full rounded-md border transition-colors",
                          on
                            ? "border-primary bg-primary/70"
                            : "border-border bg-surface hover:border-primary/40",
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">Marked hours this week</p>
        <p className="text-lg font-bold text-primary">{slots.length}</p>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Example: tap 7 PM and 8 PM on Wednesday to open a 7:00 – 9:00 PM window.
      </p>
    </Screen>
  );
}
