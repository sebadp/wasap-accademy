import { createClient } from "@/lib/supabase/client";
import type {
  XPResponse,
  Badge,
  StreakResponse,
  ModuleProgress,
  CompleteItemRequest,
  CompleteItemResponse,
  ChallengeDefinition,
  ChallengeSubmitRequest,
  ChallengeSubmitResponse,
  TutorRequest,
  TutorResponse,
  LeaderboardEntry,
} from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function authHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// --- Progress ---

export function getProgress() {
  return fetchAPI<ModuleProgress[]>("/api/progress");
}

export function completeItem(data: CompleteItemRequest) {
  return fetchAPI<CompleteItemResponse>("/api/progress/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- XP ---

export function getXP() {
  return fetchAPI<XPResponse>("/api/xp");
}

// --- Badges ---

export function getBadges() {
  return fetchAPI<Badge[]>("/api/badges");
}

// --- Streaks ---

export function getStreak() {
  return fetchAPI<StreakResponse>("/api/streaks");
}

export function checkin() {
  return fetchAPI<StreakResponse>("/api/streaks/checkin", { method: "POST" });
}

// --- Challenges ---

export function getChallenge(challengeId: string) {
  return fetchAPI<ChallengeDefinition>(`/api/challenges/${challengeId}`);
}

export function submitChallenge(data: ChallengeSubmitRequest) {
  return fetchAPI<ChallengeSubmitResponse>("/api/challenges/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Tutor ---

export function askTutor(data: TutorRequest) {
  return fetchAPI<TutorResponse>("/api/tutor/ask", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Leaderboard ---

export function getLeaderboard() {
  return fetchAPI<LeaderboardEntry[]>("/api/leaderboard");
}
