import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-popover/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to as "/"}
            activeOptions={{ exact: item.exact ?? false }}
            className="group flex flex-1 flex-col items-center gap-1 py-2.5 text-muted-foreground transition-colors data-[status=active]:text-primary"
          >
            <item.icon className="size-5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
