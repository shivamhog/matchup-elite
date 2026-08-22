import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Compass, User, Wallet } from "lucide-react";

import { BottomNav, type NavItem } from "@/components/matchup/BottomNav";

const items: NavItem[] = [
  { to: "/client", label: "Discover", icon: Compass, exact: true },
  { to: "/client/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/client/wallet", label: "Wallet", icon: Wallet },
  { to: "/client/profile", label: "Profile", icon: User },
];

export const Route = createFileRoute("/client")({
  component: ClientLayout,
});

function ClientLayout() {
  return (
    <>
      <Outlet />
      <BottomNav items={items} />
    </>
  );
}
