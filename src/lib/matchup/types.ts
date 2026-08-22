export type Tier = "bronze" | "silver" | "gold" | "platinum";

export type TierMeta = {
  id: Tier;
  code: "D" | "C" | "B" | "A";
  label: string;
  blurb: string;
  min: number;
  max: number;
  colorVar: string;
};

export const TIERS: Record<Tier, TierMeta> = {
  bronze: {
    id: "bronze",
    code: "D",
    label: "Bronze",
    blurb: "Casual / Club",
    min: 20,
    max: 50,
    colorVar: "var(--tier-bronze)",
  },
  silver: {
    id: "silver",
    code: "C",
    label: "Silver",
    blurb: "District / University",
    min: 100,
    max: 250,
    colorVar: "var(--tier-silver)",
  },
  gold: {
    id: "gold",
    code: "B",
    label: "Gold",
    blurb: "State / National Rank",
    min: 300,
    max: 500,
    colorVar: "var(--tier-gold)",
  },
  platinum: {
    id: "platinum",
    code: "A",
    label: "Platinum",
    blurb: "International / Elite Pro",
    min: 800,
    max: 2500,
    colorVar: "var(--tier-platinum)",
  },
};

export const TIER_ORDER: Tier[] = ["bronze", "silver", "gold", "platinum"];

export type Court = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  activeMatches: number;
  openNow: boolean;
};

export type Athlete = {
  id: string;
  name: string;
  photo: string;
  tier: Tier;
  verified: boolean;
  rating: number;
  matches: number;
  distanceKm: number;
  rate: number;
  online: boolean;
  bio: string;
};

export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "awaiting_score"
  | "verified"
  | "cancelled";

export type MatchScore = { a: number; b: number };

export type Booking = {
  id: string;
  athleteId: string;
  athleteName: string;
  clientName: string;
  courtId: string;
  courtName: string;
  slot: string;
  amount: number;
  status: BookingStatus;
  createdAt: number;
  sets: MatchScore[];
  adminVerified: boolean;
  winner?: "client" | "athlete";
};

export type TxKind = "topup" | "escrow_lock" | "escrow_release" | "refund" | "payout";

export type Transaction = {
  id: string;
  kind: TxKind;
  label: string;
  amount: number;
  at: number;
  side: "client" | "athlete";
};
