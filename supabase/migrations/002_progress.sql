-- ============================================================================
-- 002_progress.sql
-- Lesson progress, module progress, and challenge submissions
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Lesson progress
-- ---------------------------------------------------------------------------
CREATE TABLE lesson_progress (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  module_id          text        NOT NULL,
  lesson_id          text        NOT NULL,
  status             text        NOT NULL DEFAULT 'completed',
  time_spent_seconds int         NOT NULL DEFAULT 0,
  completed_at       timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, module_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress (user_id);

-- ---------------------------------------------------------------------------
-- Module progress
-- ---------------------------------------------------------------------------
CREATE TABLE module_progress (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  module_id            text        NOT NULL,
  status               text        NOT NULL DEFAULT 'locked'
                        CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  challenge_completed  bool        NOT NULL DEFAULT false,
  started_at           timestamptz,
  completed_at         timestamptz,

  UNIQUE (user_id, module_id)
);

CREATE INDEX idx_module_progress_user_id ON module_progress (user_id);

-- ---------------------------------------------------------------------------
-- Challenge submissions
-- ---------------------------------------------------------------------------
CREATE TABLE challenge_submissions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  challenge_id text        NOT NULL,
  code         text        NOT NULL,
  tests_passed int         NOT NULL,
  tests_total  int         NOT NULL,
  passed       bool        NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_challenge_submissions_user_id ON challenge_submissions (user_id);

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE lesson_progress       ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress       ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

-- lesson_progress policies
CREATE POLICY "Users can select own lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- module_progress policies
CREATE POLICY "Users can select own module progress"
  ON module_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress"
  ON module_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress"
  ON module_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- challenge_submissions policies
CREATE POLICY "Users can select own challenge submissions"
  ON challenge_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge submissions"
  ON challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge submissions"
  ON challenge_submissions FOR UPDATE
  USING (auth.uid() = user_id);
