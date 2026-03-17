// --- Progress ---

export interface LessonProgress {
  module_id: string;
  lesson_id: string;
  status: string;
  completed_at: string | null;
}

export interface ModuleProgress {
  module_id: string;
  status: "locked" | "available" | "in_progress" | "completed";
  challenge_completed: boolean;
  lessons: LessonProgress[];
}

export interface CompleteItemRequest {
  module_id: string;
  lesson_id?: string;
  time_spent_seconds?: number;
}

export interface CompleteItemResponse {
  xp_awarded: number;
  new_total_xp: number;
  new_level: number;
  badge_unlocked: string | null;
}

// --- XP ---

export interface XPEvent {
  amount: number;
  source: string;
  source_id: string;
  created_at: string;
}

export interface XPResponse {
  total_xp: number;
  current_level: number;
  level_title: string;
  xp_to_next_level: number;
  recent_events: XPEvent[];
}

// --- Badges ---

export interface Badge {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
  awarded_at: string | null;
}

// --- Streaks ---

export interface StreakDay {
  date: string;
  xp_earned: number;
}

export interface StreakResponse {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  freeze_tokens: number;
  calendar: StreakDay[];
}

// --- Challenges ---

export interface ChallengeDefinition {
  challenge_id: string;
  module_id: string;
  title: string;
  description: string;
  starter_code: string;
  test_code: string;
  xp_reward: number;
}

export interface ChallengeSubmitRequest {
  challenge_id: string;
  code: string;
  tests_passed: number;
  tests_total: number;
  passed: boolean;
}

export interface ChallengeSubmitResponse {
  xp_awarded: number;
  new_total_xp: number;
  badge_unlocked: string | null;
}

// --- Tutor ---

export interface TutorRequest {
  challenge_id: string;
  question: string;
  module_id: string;
}

export interface TutorResponse {
  answer: string;
  xp_cost: number;
  free_questions_remaining: number;
}

// --- Leaderboard ---

export interface LeaderboardEntry {
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
}

// --- Modules (curriculum) ---

export interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  tier: "Foundation" | "Core" | "Intermediate" | "Advanced" | "Expert" | "Specialist" | "Production";
  lessonCount: number;
}
