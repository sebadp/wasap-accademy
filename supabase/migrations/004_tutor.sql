-- ============================================================================
-- 004_tutor.sql
-- AI tutor usage tracking and free-question budgets
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tutor usage log
-- ---------------------------------------------------------------------------
CREATE TABLE tutor_usage (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  challenge_id text,
  question     text        NOT NULL,
  response     text        NOT NULL,
  xp_cost      int         NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tutor_usage_user_id ON tutor_usage (user_id);

-- ---------------------------------------------------------------------------
-- Free questions budget per challenge
-- ---------------------------------------------------------------------------
CREATE TABLE tutor_free_questions (
  user_id        uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  challenge_id   text NOT NULL,
  questions_used int  NOT NULL DEFAULT 0,

  PRIMARY KEY (user_id, challenge_id)
);

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE tutor_usage          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_free_questions ENABLE ROW LEVEL SECURITY;

-- tutor_usage
CREATE POLICY "Users can select own tutor usage"
  ON tutor_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutor usage"
  ON tutor_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tutor usage"
  ON tutor_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- tutor_free_questions
CREATE POLICY "Users can select own free questions"
  ON tutor_free_questions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own free questions"
  ON tutor_free_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own free questions"
  ON tutor_free_questions FOR UPDATE
  USING (auth.uid() = user_id);
