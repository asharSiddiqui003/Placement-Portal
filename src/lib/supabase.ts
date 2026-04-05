import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  roll_number: string;
  branch: string;
  year: number;
  cpi: number | null;
  applied_companies: string[];
  offers: string[];
  created_at: string;
};

export type MockTest = {
  id: string;
  title: string;
  company: string | null;
  duration: number;
  questions: Question[];
  created_at: string;
};

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type TestAttempt = {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  total: number;
  percentage: number;
  answers: Record<string, number>;
  completed_at: string;
};

export type QuestionBankItem = {
  id: string;
  company: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[] | null;
  answer: string;
  explanation: string | null;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  link: string | null;
  is_important: boolean;
  created_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  ats_score: number | null;
  feedback: ATSFeedback | null;
  uploaded_at: string;
};

export type ATSFeedback = {
  strengths: string[];
  improvements: string[];
  keywords: string[];
};
