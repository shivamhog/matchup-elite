import type { Athlete, Court } from "./types";

export const COURTS: Court[] = [
  { id: "c1", name: "Smash Arena", area: "Koramangala", distanceKm: 0.8, activeMatches: 6, openNow: true },
  { id: "c2", name: "Shuttle Park", area: "Indiranagar", distanceKm: 1.6, activeMatches: 3, openNow: true },
  { id: "c3", name: "Baseline Sports Hub", area: "HSR Layout", distanceKm: 2.4, activeMatches: 9, openNow: true },
  { id: "c4", name: "Drop Shot Academy", area: "BTM Layout", distanceKm: 3.1, activeMatches: 2, openNow: false },
  { id: "c5", name: "Rally Point Courts", area: "Ejipura", distanceKm: 4.2, activeMatches: 5, openNow: true },
];

export const SLOTS = [
  "Today · 6:00 PM",
  "Today · 7:00 PM",
  "Today · 8:00 PM",
  "Tomorrow · 6:30 AM",
  "Tomorrow · 7:00 PM",
];

const p = (n: number) => `https://i.pravatar.cc/160?img=${n}`;

export const ATHLETES: Athlete[] = [
  {
    id: "a1", name: "Arjun Nair", photo: p(12), tier: "platinum", verified: true, rating: 4.9,
    matches: 412, distanceKm: 1.2, rate: 950, online: true,
    bio: "BWF ranked pro. Explosive net play, 300+ verified matches on MatchUp.",
  },
  {
    id: "a2", name: "Meera Kapoor", photo: p(45), tier: "gold", verified: true, rating: 4.8,
    matches: 268, distanceKm: 0.9, rate: 420, online: true,
    bio: "State champion 2024. Great sparring partner for rally endurance.",
  },
  {
    id: "a3", name: "Rohit Sharma", photo: p(33), tier: "silver", verified: true, rating: 4.6,
    matches: 154, distanceKm: 1.5, rate: 180, online: true,
    bio: "University league regular. Patient coach-style opponent.",
  },
  {
    id: "a4", name: "Ananya Rao", photo: p(47), tier: "gold", verified: true, rating: 4.7,
    matches: 201, distanceKm: 2.1, rate: 380, online: true,
    bio: "National rank 38. Aggressive smash game, loves fast singles.",
  },
  {
    id: "a5", name: "Vikram Iyer", photo: p(15), tier: "bronze", verified: false, rating: 4.2,
    matches: 62, distanceKm: 0.6, rate: 40, online: true,
    bio: "Club player, evenings only. Friendly casual games.",
  },
  {
    id: "a6", name: "Sanya Verma", photo: p(23), tier: "silver", verified: true, rating: 4.5,
    matches: 118, distanceKm: 2.8, rate: 220, online: true,
    bio: "District doubles medalist. Strong defensive drills.",
  },
  {
    id: "a7", name: "Karan Malhotra", photo: p(53), tier: "platinum", verified: true, rating: 5.0,
    matches: 520, distanceKm: 3.6, rate: 1200, online: false,
    bio: "Ex-international circuit. Elite pace, books out fast.",
  },
  {
    id: "a8", name: "Divya Menon", photo: p(31), tier: "bronze", verified: true, rating: 4.1,
    matches: 44, distanceKm: 1.9, rate: 30, online: true,
    bio: "Weekend club regular building rally consistency.",
  },
  {
    id: "a9", name: "Aditya Shetty", photo: p(60), tier: "silver", verified: false, rating: 4.4,
    matches: 96, distanceKm: 4.4, rate: 140, online: true,
    bio: "University team reserve. Solid baseline control.",
  },
  {
    id: "a10", name: "Priya Deshmukh", photo: p(9), tier: "gold", verified: true, rating: 4.8,
    matches: 233, distanceKm: 3.2, rate: 460, online: true,
    bio: "State ranked. Specialises in match-simulation sessions.",
  },
  {
    id: "a11", name: "Nikhil Bose", photo: p(68), tier: "bronze", verified: false, rating: 3.9,
    matches: 27, distanceKm: 2.5, rate: 25, online: true,
    bio: "New to the platform. Casual 21-pointers after work.",
  },
  {
    id: "a12", name: "Tanvi Joshi", photo: p(26), tier: "platinum", verified: true, rating: 4.9,
    matches: 388, distanceKm: 4.8, rate: 880, online: true,
    bio: "Asian circuit qualifier. Elite footwork sessions.",
  },
];

export const CLIENT_NAMES = [
  "Rahul Gupta",
  "Ishita Bansal",
  "Farhan Qureshi",
  "Neha Pillai",
  "Sameer Khanna",
];
