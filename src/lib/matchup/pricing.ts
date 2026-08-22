import { TIERS, type Tier } from "./types";

/** Every transaction is per one 21-point standard match. No hourly metering. */
export const MATCH_UNIT = "per 21-pt match";

export const MAX_RADIUS_KM = 5;
export const MIN_RADIUS_KM = 1;

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function clampRate(tier: Tier, value: number): number {
  const { min, max } = TIERS[tier];
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function rateBandLabel(tier: Tier): string {
  const t = TIERS[tier];
  return t.id === "platinum"
    ? `${formatINR(t.min)}+ ${MATCH_UNIT}`
    : `${formatINR(t.min)} – ${formatINR(t.max)} ${MATCH_UNIT}`;
}

export function isRateValid(tier: Tier, value: number): boolean {
  const { min, max } = TIERS[tier];
  return Number.isFinite(value) && value >= min && value <= max;
}

export function clampRadius(km: number): number {
  return Math.min(MAX_RADIUS_KM, Math.max(MIN_RADIUS_KM, km));
}

/** Winner of a best-of-3, 21-point match. Returns null if undecided. */
export function decideWinner(sets: { a: number; b: number }[]): "client" | "athlete" | null {
  let a = 0;
  let b = 0;
  for (const s of sets) {
    if (s.a === s.b) continue;
    if (s.a > s.b) a += 1;
    else b += 1;
  }
  if (a === b) return null;
  return a > b ? "client" : "athlete";
}

export function isSetValid(s: { a: number; b: number }): boolean {
  const hi = Math.max(s.a, s.b);
  const lo = Math.min(s.a, s.b);
  if (hi < 21 || hi > 30) return false;
  if (hi === 21) return lo <= 19;
  if (hi === 30) return lo === 29;
  return hi - lo === 2;
}
