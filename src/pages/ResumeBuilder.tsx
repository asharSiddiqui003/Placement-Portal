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

  const templates = [
    {
      name: 'Modern Professional',
      preview: 'Clean and modern design with clear sections',
      color: 'blue',
    },
    {
      name: 'Tech Minimalist',
      preview: 'Minimalist layout perfect for tech roles',
      color: 'green',
    },
    {
      name: 'Executive Classic',
      preview: 'Traditional format for experienced professionals',
      color: 'purple',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
        <p className="text-gray-600">
          Upload your resume and get instant ATS score feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Upload Your Resume</h2>
              <p className="text-gray-600 mb-6">
                Upload your resume to get instant ATS score and feedback
              </p>

              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer transition-colors">
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

              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>

          {selectedResume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-4">ATS Analysis Results</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">ATS Score</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedResume.ats_score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      (selectedResume.ats_score || 0) >= 70
                        ? 'bg-green-500'
                        : (selectedResume.ats_score || 0) >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedResume.ats_score}%` }}
                  />
                </div>
              </div>

              {selectedResume.feedback && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedResume.feedback.strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-800 text-sm flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedResume.feedback.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-orange-800 text-sm flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedResume.feedback.keywords.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">
                          Detected Keywords ({selectedResume.feedback.keywords.length})
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.feedback.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
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
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  <Download className="w-5 h-5" />
                  Download Analysis
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Resume Templates</h2>
            <div className="space-y-3">
              {templates.map((template, idx) => (
                <div
                  key={idx}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.preview}</p>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Your Resumes</h2>
            <div className="space-y-3">
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => analyzeResume(resume)}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {resume.file_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </p>
                        {resume.ats_score && (
                          <div className="mt-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                resume.ats_score >= 70
                                  ? 'bg-green-100 text-green-700'
                                  : resume.ats_score >= 50
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              Score: {resume.ats_score}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm">
                  No resumes uploaded yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold mb-4">ATS Optimization Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Use Action Verbs</h3>
              <p className="text-sm text-gray-600">
                Start bullet points with strong action verbs like "developed", "implemented", "designed"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Include Keywords</h3>
              <p className="text-sm text-gray-600">
                Match job description keywords naturally throughout your resume
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Quantify Achievements</h3>
              <p className="text-sm text-gray-600">
                Use numbers and metrics to demonstrate impact
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Simple Formatting</h3>
              <p className="text-sm text-gray-600">
                Avoid complex tables, images, and graphics that ATS can't parse
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
