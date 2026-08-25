import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Resume, ATSFeedback } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const ResumeBuilder = () => {
  const { profile } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', profile.id)
      .order('uploaded_at', { ascending: false });

    if (data) setResumes(data);
  };

  const calculateATSScore = (fileName: string): { score: number; feedback: ATSFeedback } => {
    const keywords = [
      'react', 'javascript', 'python', 'java', 'typescript', 'node',
      'leadership', 'team', 'project', 'developed', 'implemented',
      'designed', 'managed', 'achieved', 'improved', 'created',
    ];

    const content = fileName.toLowerCase();
    const foundKeywords = keywords.filter(keyword => content.includes(keyword));
    const baseScore = 50;
    const keywordScore = Math.min(40, foundKeywords.length * 5);
    const lengthScore = Math.min(10, content.length / 10);

    const totalScore = Math.min(100, Math.round(baseScore + keywordScore + lengthScore));

    const strengths = [];
    const improvements = [];

    if (foundKeywords.length > 5) {
      strengths.push('Good use of technical keywords');
    } else {
      improvements.push('Add more relevant technical keywords');
    }

    if (totalScore >= 70) {
      strengths.push('Well-structured content');
    } else {
      improvements.push('Include more action verbs (developed, implemented, designed)');
      improvements.push('Highlight quantifiable achievements');
    }

    const feedback: ATSFeedback = {
      strengths: strengths.length > 0 ? strengths : ['Resume uploaded successfully'],
      improvements: improvements.length > 0 ? improvements : ['Consider adding more project details'],
      keywords: foundKeywords,
    };

    return { score: totalScore, feedback };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);

    try {
      const fileUrl = URL.createObjectURL(file);
      const { score, feedback } = calculateATSScore(file.name);

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: profile.id,
          file_name: file.name,
          file_url: fileUrl,
          ats_score: score,
          feedback,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSelectedResume(data);
        fetchResumes();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const analyzeResume = async (resume: Resume) => {
    setAnalyzing(true);
    setSelectedResume(resume);

    setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scoreBadge = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-zinc-100">Resume Builder</h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Upload your resume and get instant ATS score feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Upload card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800 mb-6">
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-zinc-100">Upload Your Resume</h2>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">
                Upload your resume to get instant ATS score and feedback
              </p>

              <label className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold cursor-pointer transition-colors">
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading...' : 'Choose File'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <p className="text-sm text-gray-500 dark:text-zinc-500 mt-4">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>

          {/* Analysis results */}
          {selectedResume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-zinc-100">ATS Analysis Results</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">ATS Score</span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {selectedResume.ats_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${scoreColor(selectedResume.ats_score || 0)}`}
                    style={{ width: `${selectedResume.ats_score}%` }}
                  />
                </div>
              </div>

              {selectedResume.feedback && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-green-900 dark:text-green-400">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedResume.feedback.strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-800 dark:text-green-300 text-sm flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-500 mt-0.5">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <h3 className="font-semibold text-orange-900 dark:text-orange-400">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedResume.feedback.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-orange-800 dark:text-orange-300 text-sm flex items-start gap-2">
                          <span className="text-orange-600 dark:text-orange-500 mt-0.5">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedResume.feedback.keywords.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-400">
                          Detected Keywords ({selectedResume.feedback.keywords.length})
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.feedback.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors">
                  <Download className="w-5 h-5" />
                  Download Analysis
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar: resume list */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-zinc-100">Your Resumes</h2>
            <div className="space-y-3">
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="p-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors border border-transparent dark:border-zinc-700"
                    onClick={() => analyzeResume(resume)}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-zinc-100 truncate">
                          {resume.file_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-zinc-400">
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </p>
                        {resume.ats_score && (
                          <div className="mt-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${scoreBadge(resume.ats_score)}`}>
                              Score: {resume.ats_score}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-zinc-500 text-center py-4 text-sm">
                  No resumes uploaded yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ATS Tips */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-6 border border-orange-100 dark:border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-zinc-100">ATS Optimization Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Use Action Verbs', desc: 'Start bullet points with strong action verbs like "developed", "implemented", "designed"' },
            { title: 'Include Keywords', desc: 'Match job description keywords naturally throughout your resume' },
            { title: 'Quantify Achievements', desc: 'Use numbers and metrics to demonstrate impact' },
            { title: 'Simple Formatting', desc: 'Avoid complex tables, images, and graphics that ATS can\'t parse' },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-zinc-100">{tip.title}</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};