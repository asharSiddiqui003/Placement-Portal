import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Announcement, MockTest } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Award,
  Calendar,
  Code,
  Brain,
  Network,
  Building2,
  Clock,
  TrendingUp,
  Bell,
} from 'lucide-react';

interface Stats {
  companiesApplied: number;
  offersReceived: number;
  upcomingInterviews: number;
}

interface CompanyQuestionCount {
  company: string;
  count: number;
}

interface DashboardProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    companiesApplied: 0,
    offersReceived: 0,
    upcomingInterviews: 0,
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<MockTest[]>([]);
  const [companyQuestions, setCompanyQuestions] = useState<CompanyQuestionCount[]>([]);

  useEffect(() => {
    if (profile) {
      setStats({
        companiesApplied: profile.applied_companies?.length || 0,
        offersReceived: profile.offers?.length || 0,
        upcomingInterviews: 3,
      });
    }

    fetchAnnouncements();
    fetchUpcomingTests();
    fetchCompanyQuestions();
  }, [profile]);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setAnnouncements(data);
  };

  const fetchUpcomingTests = async () => {
    const { data } = await supabase
      .from('mock_tests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);

    if (data) setUpcomingTests(data);
  };

  const fetchCompanyQuestions = async () => {
    const companies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple', 'Netflix'];
    const counts: CompanyQuestionCount[] = [];

    for (const company of companies) {
      const { count } = await supabase
        .from('question_bank')
        .select('*', { count: 'exact', head: true })
        .eq('company', company);

      counts.push({ company, count: count || 0 });
    }

    setCompanyQuestions(counts);
  };

  const modules = [
    { name: 'DSA Practice', icon: Code, color: 'bg-orange-500', page: 'dsa-hub' },
    { name: 'Aptitude Tests', icon: Brain, color: 'bg-emerald-500', page: 'mock-tests' },
    { name: 'Question Bank', icon: Network, color: 'bg-indigo-500', page: 'questions' },
  ];

  const handleNavigation = (page: string, params?: any) => {
    if (onNavigate) {
      onNavigate(page, params);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── Welcome Header ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base mt-1.5">
          Always stay updated in your placement portal
        </p>
      </motion.div>

      {/* ── Top Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 dark:bg-orange-950/50 p-3 rounded-xl">
              <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-zinc-400 text-xs sm:text-sm font-medium">
                Companies Applied
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.companiesApplied}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-xl">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-zinc-400 text-xs sm:text-sm font-medium">
                Offers Received
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.offersReceived}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 dark:bg-amber-950/50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-zinc-400 text-xs sm:text-sm font-medium">
                Upcoming Interviews
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.upcomingInterviews}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Modules & Company Banks ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Placement Prep Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {modules.map((module, idx) => (
              <div
                key={idx}
                onClick={() => handleNavigation(module.page)}
                className="group p-5 border border-gray-200 dark:border-zinc-800 rounded-xl hover:shadow-md hover:border-orange-500/40 dark:hover:border-orange-500/40 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
              >
                <div className={`${module.color} w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-1.5 text-sm sm:text-base">
                  {module.name}
                </h3>
                <span className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium group-hover:underline">
                  Open Module →
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Company Question Banks
          </h2>
          <div className="space-y-2.5">
            {companyQuestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleNavigation('questions', { company: item.company })}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-zinc-200">
                  {item.company}
                </span>
                <span className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/40 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {item.count} Qs
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Announcements & Mock Tests ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Daily Announcements
          </h2>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-xl border-l-4 ${
                    announcement.is_important
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-500'
                      : 'bg-orange-50 dark:bg-orange-950/20 border-orange-500'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm sm:text-base">
                    {announcement.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">
                    {announcement.content}
                  </p>
                  {announcement.link && (
                    <a
                      href={announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium mt-2 inline-block hover:underline"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-zinc-500 text-center py-6 text-sm">
                No announcements yet
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Upcoming Mock Tests
          </h2>
          <div className="space-y-3">
            {upcomingTests.length > 0 ? (
              upcomingTests.map((test) => (
                <div
                  key={test.id}
                  className="p-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-zinc-800 dark:to-zinc-800/60 border border-orange-100/50 dark:border-zinc-700/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100 text-sm sm:text-base">
                      {test.title}
                    </h3>
                    <span className="bg-orange-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {test.duration} min
                    </span>
                  </div>
                  {test.company && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
                      Company: {test.company}
                    </p>
                  )}
                  <button
                    onClick={() => handleNavigation('mock-tests', { testId: test.id })}
                    className="inline-block mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-colors"
                  >
                    Start Test
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-zinc-500 text-center py-6 text-sm">
                No upcoming tests
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};