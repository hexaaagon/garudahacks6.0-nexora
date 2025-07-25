-- Add new columns to classrooms table
ALTER TABLE classrooms 
ADD COLUMN grade VARCHAR(20) NOT NULL DEFAULT 'Grade 1',
ADD COLUMN subjects TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN share_code VARCHAR(20) UNIQUE NOT NULL DEFAULT '',
ADD COLUMN admin_ids TEXT[] DEFAULT '{}',
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Create interests table
CREATE TABLE interests (
  id TEXT PRIMARY KEY,
  name VARCHAR(15) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create student_interests table
CREATE TABLE student_interests (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  interest_id TEXT NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, interest_id)
);

-- Create personality_assessments table
CREATE TABLE personality_assessments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  personality_type TEXT NOT NULL,
  strength_description TEXT NOT NULL,
  learning_style TEXT NOT NULL,
  math_score INTEGER NOT NULL DEFAULT 0,
  logical_score INTEGER NOT NULL DEFAULT 0,
  creativity_score INTEGER NOT NULL DEFAULT 0,
  comprehension_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default interests
INSERT INTO interests (id, name, is_default) VALUES
  ('int_coding', 'Coding', true),
  ('int_gaming', 'Gaming', true),
  ('int_math', 'Mathematics', true),
  ('int_science', 'Science', true),
  ('int_art', 'Art', true),
  ('int_music', 'Music', true),
  ('int_sports', 'Sports', true),
  ('int_reading', 'Reading', true),
  ('int_writing', 'Writing', true),
  ('int_photo', 'Photography', true),
  ('int_dance', 'Dancing', true),
  ('int_cooking', 'Cooking', true),
  ('int_history', 'History', true),
  ('int_geography', 'Geography', true),
  ('int_lang', 'Language Learning', true),
  ('int_philosophy', 'Philosophy', true),
  ('int_psychology', 'Psychology', true),
  ('int_physics', 'Physics', true);

-- Create indexes for better performance
CREATE INDEX idx_student_interests_student_id ON student_interests(student_id);
CREATE INDEX idx_student_interests_interest_id ON student_interests(interest_id);
CREATE INDEX idx_personality_assessments_student_id ON personality_assessments(student_id);
CREATE INDEX idx_classrooms_share_code ON classrooms(share_code);
CREATE INDEX idx_classrooms_teacher_id ON classrooms(teacher_id);
