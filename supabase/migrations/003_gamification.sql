-- ============================================================================
-- 003_gamification.sql
-- XP, badges, streaks, and leveling
-- ============================================================================

-- ---------------------------------------------------------------------------
-- XP events log
-- ---------------------------------------------------------------------------
CREATE TABLE xp_events (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  amount     int         NOT NULL,
  source     text        NOT NULL
             CHECK (source IN (
               'lesson_complete',
               'challenge_complete',
               'quiz',
               'streak_bonus',
               'first_try',
               'speed_run'
             )),
  source_id  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_events_user_id ON xp_events (user_id);

-- ---------------------------------------------------------------------------
-- Aggregate XP per user
-- ---------------------------------------------------------------------------
CREATE TABLE user_xp (
  user_id       uuid PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
  total_xp      int         NOT NULL DEFAULT 0,
  current_level int         NOT NULL DEFAULT 1,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Badges
-- ---------------------------------------------------------------------------
CREATE TABLE user_badges (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  badge_id   text        NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges (user_id);

-- ---------------------------------------------------------------------------
-- Streaks
-- ---------------------------------------------------------------------------
CREATE TABLE user_streaks (
  user_id            uuid PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
  current_streak     int  NOT NULL DEFAULT 0,
  longest_streak     int  NOT NULL DEFAULT 0,
  last_activity_date date,
  freeze_tokens      int  NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Streak history (daily log)
-- ---------------------------------------------------------------------------
CREATE TABLE streak_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  activity_date date NOT NULL,
  xp_earned     int  NOT NULL DEFAULT 0,

  UNIQUE (user_id, activity_date)
);

CREATE INDEX idx_streak_history_user_id ON streak_history (user_id);

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE xp_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;

-- xp_events
CREATE POLICY "Users can select own xp events"
  ON xp_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp events"
  ON xp_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own xp events"
  ON xp_events FOR UPDATE
  USING (auth.uid() = user_id);

-- user_xp
CREATE POLICY "Users can select own xp"
  ON user_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp"
  ON user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own xp"
  ON user_xp FOR UPDATE
  USING (auth.uid() = user_id);

-- user_badges
CREATE POLICY "Users can select own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own badges"
  ON user_badges FOR UPDATE
  USING (auth.uid() = user_id);

-- user_streaks
CREATE POLICY "Users can select own streaks"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- streak_history
CREATE POLICY "Users can select own streak history"
  ON streak_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak history"
  ON streak_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak history"
  ON streak_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Trigger: auto-create user_xp and user_streaks when a profile is created
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_profile_gamification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_xp (user_id) VALUES (NEW.id);
  INSERT INTO public.user_streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_gamification
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile_gamification();
