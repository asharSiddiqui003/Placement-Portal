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

export const Dashboard = () => {
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
    { name: 'DSA Practice', icon: Code, color: 'bg-blue-500', href: '/questions' },
    { name: 'Aptitude Tests', icon: Brain, color: 'bg-green-500', href: '/mock-tests' },
    { name: 'System Design', icon: Network, color: 'bg-purple-500', href: '/questions' },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-gray-600 mt-2">Always stay updated in your placement portal</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Companies Applied</p>
              <p className="text-3xl font-bold text-gray-900">{stats.companiesApplied}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Offers Received</p>
              <p className="text-3xl font-bold text-gray-900">{stats.offersReceived}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Upcoming Interviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingInterviews}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Placement Prep Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module, idx) => (
              <a
                key={idx}
                href={module.href}
                className="group p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{module.name}</h3>
                <button className="text-blue-600 text-sm font-medium group-hover:underline">
                  View →
                </button>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Company Question Banks
          </h2>
          <div className="space-y-3">
            {companyQuestions.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.company}</span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.count} Qs
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Daily Announcements
          </h2>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    announcement.is_important
                      ? 'bg-red-50 border-red-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  {announcement.link && (
                    <a
                      href={announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No announcements yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Upcoming Mock Tests
          </h2>
          <div className="space-y-3">
            {upcomingTests.length > 0 ? (
              upcomingTests.map((test) => (
                <div key={test.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{test.title}</h3>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {test.duration} min
                    </span>
                  </div>
                  {test.company && (
                    <p className="text-sm text-gray-600">Company: {test.company}</p>
                  )}
                  <a
                    href={`/mock-tests/${test.id}`}
                    className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Test
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming tests</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
