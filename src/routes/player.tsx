import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CalendarRange, IndianRupee, User, Zap } from "lucide-react";

import { BottomNav, type NavItem } from "@/components/matchup/BottomNav";

const items: NavItem[] = [
  { to: "/player", label: "Gigs", icon: Zap, exact: true },
  { to: "/player/schedule", label: "Schedule", icon: CalendarRange },
  { to: "/player/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/player/profile", label: "Profile", icon: User },
];

export const Route = createFileRoute("/player")({
  component: PlayerLayout,
});

function PlayerLayout() {
  return (
    <>
      <Outlet />
      <BottomNav items={items} />
    </>
  );
}
