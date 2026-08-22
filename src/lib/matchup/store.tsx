import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ATHLETES, CLIENT_NAMES, COURTS, SLOTS } from "./data";
import { clampRadius, clampRate, decideWinner } from "./pricing";
import type { Athlete, Booking, MatchScore, Tier, Transaction } from "./types";

const STORAGE_KEY = "matchup.state.v1";

export type Role = "client" | "player";

export type AppState = {
  role: Role | null;
  clientName: string;
  balance: number;
  escrow: number;
  athletes: Athlete[];
  bookings: Booking[];
  transactions: Transaction[];
  /** Signed-in athlete profile (player view) */
  me: {
    name: string;
    tier: Tier;
    rate: number;
    online: boolean;
    radiusKm: number;
    verified: boolean;
    photo: string;
    /** keys: `${dayIndex}-${hour}` */
    slots: string[];
  };
  earnings: number;
};

const initialState = (): AppState => ({
  role: null,
  clientName: "Rahul Gupta",
  balance: 2400,
  escrow: 0,
  athletes: ATHLETES,
  bookings: [],
  transactions: [
    {
      id: "t0",
      kind: "topup",
      label: "Wallet opening balance",
      amount: 2400,
      at: Date.now() - 86400000,
      side: "client",
    },
  ],
  me: {
    name: "Aarav Menon",
    tier: "silver",
    rate: 180,
    online: false,
    radiusKm: 3,
    verified: true,
    photo: "https://i.pravatar.cc/160?img=59",
    slots: ["2-19", "2-20", "4-19", "4-20", "5-7", "5-8"],
  },
  earnings: 0,
});

type Ctx = {
  state: AppState;
  setRole: (r: Role | null) => void;
  addMoney: (amount: number) => void;
  bookMatch: (athlete: Athlete, courtId: string, slot: string) => string;
  respondToRequest: (id: string, accept: boolean) => void;
  cancelBooking: (id: string) => void;
  submitScore: (id: string, sets: MatchScore[], adminVerified: boolean) => void;
  updateMe: (patch: Partial<AppState["me"]>) => void;
  toggleSlot: (key: string) => void;
  simulateIncoming: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        setState((s) => ({ ...s, ...parsed, athletes: ATHLETES }));
      }
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable */
    }
  }, [state, hydrated]);

  const setRole = useCallback((role: Role | null) => setState((s) => ({ ...s, role })), []);

  const addMoney = useCallback((amount: number) => {
    setState((s) => ({
      ...s,
      balance: s.balance + amount,
      transactions: [
        { id: uid(), kind: "topup", label: "Added via UPI", amount, at: Date.now(), side: "client" },
        ...s.transactions,
      ],
    }));
  }, []);

  const bookMatch = useCallback((athlete: Athlete, courtId: string, slot: string) => {
    const id = uid();
    setState((s) => {
      if (s.balance < athlete.rate) return s;
      const court = COURTS.find((c) => c.id === courtId) ?? COURTS[0];
      const booking: Booking = {
        id,
        athleteId: athlete.id,
        athleteName: athlete.name,
        clientName: s.clientName,
        courtId: court.id,
        courtName: `${court.name}, ${court.area}`,
        slot,
        amount: athlete.rate,
        status: "pending",
        createdAt: Date.now(),
        sets: [],
        adminVerified: false,
      };
      return {
        ...s,
        balance: s.balance - athlete.rate,
        escrow: s.escrow + athlete.rate,
        bookings: [booking, ...s.bookings],
        transactions: [
          {
            id: uid(),
            kind: "escrow_lock",
            label: `Escrow locked · ${athlete.name}`,
            amount: -athlete.rate,
            at: Date.now(),
            side: "client",
          },
          ...s.transactions,
        ],
      };
    });
    return id;
  }, []);

  const refund = (s: AppState, b: Booking, label: string): AppState => ({
    ...s,
    balance: s.balance + b.amount,
    escrow: Math.max(0, s.escrow - b.amount),
    transactions: [
      { id: uid(), kind: "refund", label, amount: b.amount, at: Date.now(), side: "client" },
      ...s.transactions,
    ],
  });

  const respondToRequest = useCallback((id: string, accept: boolean) => {
    setState((s) => {
      const b = s.bookings.find((x) => x.id === id);
      if (!b || b.status !== "pending") return s;
      if (accept) {
        return {
          ...s,
          bookings: s.bookings.map((x) => (x.id === id ? { ...x, status: "accepted" } : x)),
        };
      }
      const next = refund(s, b, `Refund · ${b.athleteName} declined`);
      return {
        ...next,
        bookings: next.bookings.map((x) => (x.id === id ? { ...x, status: "declined" } : x)),
      };
    });
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setState((s) => {
      const b = s.bookings.find((x) => x.id === id);
      if (!b || (b.status !== "pending" && b.status !== "accepted")) return s;
      const next = refund(s, b, `Refund · cancelled match with ${b.athleteName}`);
      return {
        ...next,
        bookings: next.bookings.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)),
      };
    });
  }, []);

  const submitScore = useCallback((id: string, sets: MatchScore[], adminVerified: boolean) => {
    setState((s) => {
      const b = s.bookings.find((x) => x.id === id);
      if (!b || (b.status !== "accepted" && b.status !== "awaiting_score")) return s;
      const winner = decideWinner(sets) ?? undefined;
      if (!adminVerified) {
        return {
          ...s,
          bookings: s.bookings.map((x) =>
            x.id === id ? { ...x, sets, winner, status: "awaiting_score" } : x,
          ),
        };
      }
      return {
        ...s,
        escrow: Math.max(0, s.escrow - b.amount),
        earnings: s.earnings + b.amount,
        bookings: s.bookings.map((x) =>
          x.id === id
            ? { ...x, sets, winner, adminVerified: true, status: "verified" }
            : x,
        ),
        transactions: [
          {
            id: uid(),
            kind: "payout",
            label: `Payout received · ${b.clientName}`,
            amount: b.amount,
            at: Date.now(),
            side: "athlete",
          },
          {
            id: uid(),
            kind: "escrow_release",
            label: `Escrow released · ${b.athleteName}`,
            amount: -b.amount,
            at: Date.now(),
            side: "client",
          },
          ...s.transactions,
        ],
      };
    });
  }, []);

  const updateMe = useCallback((patch: Partial<AppState["me"]>) => {
    setState((s) => {
      const me = { ...s.me, ...patch };
      if (patch.tier && !patch.rate) me.rate = clampRate(me.tier, s.me.rate);
      if (patch.rate !== undefined) me.rate = clampRate(me.tier, patch.rate);
      if (patch.radiusKm !== undefined) me.radiusKm = clampRadius(patch.radiusKm);
      return { ...s, me };
    });
  }, []);

  const toggleSlot = useCallback((key: string) => {
    setState((s) => ({
      ...s,
      me: {
        ...s.me,
        slots: s.me.slots.includes(key)
          ? s.me.slots.filter((k) => k !== key)
          : [...s.me.slots, key],
      },
    }));
  }, []);

  /** Player view: fabricate an inbound gig request from a random client. */
  const simulateIncoming = useCallback(() => {
    setState((s) => {
      const court = COURTS.filter((c) => c.distanceKm <= s.me.radiusKm)[0] ?? COURTS[0];
      const booking: Booking = {
        id: uid(),
        athleteId: "me",
        athleteName: s.me.name,
        clientName: CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)],
        courtId: court.id,
        courtName: `${court.name}, ${court.area}`,
        slot: SLOTS[Math.floor(Math.random() * SLOTS.length)],
        amount: s.me.rate,
        status: "pending",
        createdAt: Date.now(),
        sets: [],
        adminVerified: false,
      };
      return { ...s, bookings: [booking, ...s.bookings] };
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      setRole,
      addMoney,
      bookMatch,
      respondToRequest,
      cancelBooking,
      submitScore,
      updateMe,
      toggleSlot,
      simulateIncoming,
    }),
    [
      state,
      setRole,
      addMoney,
      bookMatch,
      respondToRequest,
      cancelBooking,
      submitScore,
      updateMe,
      toggleSlot,
      simulateIncoming,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}
