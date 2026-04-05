/*
  # Placement Preparation Portal Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `roll_number` (text, unique)
      - `branch` (text)
      - `year` (int)
      - `cpi` (float, nullable)
      - `applied_companies` (jsonb array)
      - `offers` (jsonb array)
      - `created_at` (timestamptz)
    
    - `mock_tests`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text, nullable)
      - `duration` (int, minutes)
      - `questions` (jsonb array)
      - `created_at` (timestamptz)
    
    - `test_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `test_id` (uuid, references mock_tests)
      - `score` (int)
      - `total` (int)
      - `percentage` (float)
      - `answers` (jsonb)
      - `completed_at` (timestamptz)
    
    - `question_bank`
      - `id` (uuid, primary key)
      - `company` (text)
      - `topic` (text)
      - `difficulty` (text)
      - `question` (text)
      - `options` (jsonb, nullable)
      - `answer` (text)
      - `explanation` (text, nullable)
      - `created_at` (timestamptz)
    
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `link` (text, nullable)
      - `is_important` (boolean)
      - `created_at` (timestamptz)
    
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `file_name` (text)
      - `file_url` (text)
      - `ats_score` (int, nullable)
      - `feedback` (jsonb, nullable)
      - `uploaded_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for announcements, mock_tests, and question_bank
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  roll_number text UNIQUE NOT NULL,
  branch text NOT NULL,
  year int NOT NULL,
  cpi float,
  applied_companies jsonb DEFAULT '[]'::jsonb,
  offers jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create mock_tests table
CREATE TABLE IF NOT EXISTS mock_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text,
  duration int NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create test_attempts table
CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  score int NOT NULL,
  total int NOT NULL,
  percentage float NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz DEFAULT now()
);

-- Create question_bank table
CREATE TABLE IF NOT EXISTS question_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL,
  question text NOT NULL,
  options jsonb,
  answer text NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  link text,
  is_important boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  ats_score int,
  feedback jsonb,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Mock Tests Policies (public read)
CREATE POLICY "Anyone can view mock tests"
  ON mock_tests FOR SELECT
  TO authenticated
  USING (true);

-- Test Attempts Policies
CREATE POLICY "Users can view own test attempts"
  ON test_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own test attempts"
  ON test_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Question Bank Policies (public read)
CREATE POLICY "Anyone can view questions"
  ON question_bank FOR SELECT
  TO authenticated
  USING (true);

-- Announcements Policies (public read)
CREATE POLICY "Anyone can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

-- Resumes Policies
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_company ON question_bank(company);
CREATE INDEX IF NOT EXISTS idx_question_bank_topic ON question_bank(topic);
CREATE INDEX IF NOT EXISTS idx_question_bank_difficulty ON question_bank(difficulty);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);