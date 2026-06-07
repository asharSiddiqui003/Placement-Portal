import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, TestAttempt } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Target, Award } from 'lucide-react';

export const Analytics = () => {
  const { profile } = useAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', profile.id)
      .order('completed_at', { ascending: true });

    if (data) setAttempts(data);
  };

  const branchPackageData = [
    { branch: 'CSE', avgPackage: 18.5 },
    { branch: 'ECE', avgPackage: 14.2 },
    { branch: 'ME', avgPackage: 12.8 },
    { branch: 'EE', avgPackage: 13.5 },
    { branch: 'CE', avgPackage: 11.9 },
  ];

  const companyHiringData = [
    { company: 'Amazon', hires: 45 },
    { company: 'Google', hires: 32 },
    { company: 'Microsoft', hires: 38 },
    { company: 'Meta', hires: 28 },
    { company: 'Apple', hires: 25 },
    { company: 'Netflix', hires: 18 },
  ];

  const skillGapData = [
    { skill: 'DSA', proficiency: 75, target: 90 },
    { skill: 'Aptitude', proficiency: 85, target: 90 },
    { skill: 'Coding', proficiency: 70, target: 90 },
    { skill: 'System Design', proficiency: 60, target: 90 },
    { skill: 'Communication', proficiency: 80, target: 90 },
  ];

  const topicPerformance = [
    { topic: 'Arrays', score: 85 },
    { topic: 'DP', score: 70 },
    { topic: 'Graphs', score: 75 },
    { topic: 'Trees', score: 80 },
    { topic: 'Aptitude', score: 90 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Placement Analytics</h1>
        <p className="text-gray-600">
          Comprehensive insights into placement trends and your performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h3 className="font-semibold">Overall Progress</h3>
          </div>
          <p className="text-3xl font-bold mb-1">
            {attempts.length > 0
              ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
              : 0}
            %
          </p>
          <p className="text-blue-100 text-sm">Average test score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8" />
            <h3 className="font-semibold">Tests Completed</h3>
          </div>
          <p className="text-3xl font-bold mb-1">{attempts.length}</p>
          <p className="text-green-100 text-sm">Practice sessions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8" />
            <h3 className="font-semibold">Best Score</h3>
          </div>
          <p className="text-3xl font-bold mb-1">
            {attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)).toFixed(0) : 0}%
          </p>
          <p className="text-purple-100 text-sm">Personal best</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4">Branch-wise Average Package (LPA)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchPackageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgPackage" fill="#3B82F6" name="Average Package (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4">Company-wise Hiring Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={companyHiringData}
                cx="50%"
                cy="50%"
                label={({ payload }) => `${payload.company}: ${payload.hires}`}
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="hires"
              >
                {companyHiringData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4">Skill Gap Analysis</h2>
          <div className="space-y-4">
            {skillGapData.map((skill, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-600">
                    {skill.proficiency}% / {skill.target}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${skill.target}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Current</span>
                  <span className="text-xs text-gray-500">Target</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-4">Topic-wise Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="topic" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="score" fill="#10B981" name="Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};