# MatchUp — Badminton Athlete-on-Demand Platform

A mobile-first demo prototype: deep matte black / charcoal surfaces with electric neon-green accents, sharp minimal cards, high-density scannable lists. All data lives in the browser (no backend), but the full booking loop works end to end and survives navigation within a session.

## Screens

**Landing / Role select (`/`)**
Logo, tagline "Play & Earn", two big toggle cards: "I want to Play/Hire" (Client) and "I want to Work/Earn" (Player). Simple name + tier pick, no real auth.

**Client tabs** — Discover · Bookings · Wallet · Profile
- Discover: wallet balance card at top with "Add Money (Dummy UPI)" modal; nearby active courts strip; player list sorted by distance with photo, verified badge, tier chip, distance (1.2 km away), per-match rate; filter chips for Bronze/Silver/Gold/Platinum.
- Player detail sheet: stats, court pick, slot pick, "Book Match — ₹X" which locks funds into escrow.
- Bookings: cards by status (Pending, Accepted, Awaiting score, Verified/Paid).
- Wallet: balance, escrow-locked total, transaction ledger.

**Player tabs** — Gigs · Schedule · Earnings · Profile
- Gigs: Go Online / Go Offline toggle, geo-radius slider (1–5 km, hard cap), incoming request popup card (client name, court, rate) with Accept / Decline.
- Schedule: week grid, tap hour blocks to mark free hours.
- Profile: tier badge + per-match rate input clamped to the tier band.
- Earnings: available balance, pending escrow, payout history.

**Match validation screen**
Score entry for a 21-point match (best of 3 sets, e.g. 21-18, 21-15), plus a "Coach / Courtyard Admin Verification" toggle. Once toggled and submitted, escrow releases instantly to the player's wallet and both sides see the payout.

## Rules enforced

- No hourly metering anywhere — every price is per 21-point match.
- Tier price bands, validated on input: D/Bronze ₹20–50, C/Silver ₹100–250, B/Gold ₹300–500, A/Platinum ₹800+.
- Escrow: booking debits client balance into a locked bucket; decline or cancel refunds; verified score releases to the player.
- Player radius capped at 5 km; offline players never appear in client discovery.

## Technical notes

- TanStack Start routes: `/`, `/client/*`, `/player/*`, `/match/$id`.
- Single React context store (`AppStore`) holding players, courts, wallet, bookings, transactions; seeded with ~12 players across tiers and a handful of courts; persisted to `localStorage`.
- Escrow and tier bands live in a pure `lib/matchup/` module (pricing, tiers, escrow transitions) so the logic is testable and shared by both views.
- Theme tokens added to `src/styles.css` (near-black background, charcoal cards, neon-green primary, tier accent colors) — no hardcoded color classes in components.
- shadcn components for sheet, dialog, slider, switch, tabs, toast (sonner mounted in `__root.tsx`).
- Bottom tab bars are role-aware; incoming request popups simulated on a timer while the player is online.
- Per-route `head()` metadata with MatchUp-specific titles and descriptions.
