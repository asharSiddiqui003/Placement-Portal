import { useEffect, useState } from 'react';
import { supabase, QuestionBankItem } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Filter, Search, BookOpen, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';

export const QuestionBank = () => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionBankItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    company: 'all',
    topic: 'all',
    difficulty: 'all',
    search: '',
  });
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());

  const questionsPerPage = 20;

  useEffect(() => {
    fetchQuestions();
    const saved = localStorage.getItem('bookmarkedQuestions');
    if (saved) {
      setBookmarkedQuestions(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from('question_bank')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setQuestions(data);
  };

  const applyFilters = () => {
    let filtered = questions;

    if (filters.company !== 'all') {
      filtered = filtered.filter((q) => q.company === filters.company);
    }

    if (filters.topic !== 'all') {
      filtered = filtered.filter((q) => q.topic === filters.topic);
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty);
    }

    if (filters.search) {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  const toggleBookmark = (questionId: string) => {
    const newBookmarks = new Set(bookmarkedQuestions);
    if (newBookmarks.has(questionId)) {
      newBookmarks.delete(questionId);
    } else {
      newBookmarks.add(questionId);
    }
    setBookmarkedQuestions(newBookmarks);
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(Array.from(newBookmarks)));
  };

  const companies = ['all', ...Array.from(new Set(questions.map((q) => q.company)))];
  const topics = ['all', ...Array.from(new Set(questions.map((q) => q.topic)))];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Question Bank</h1>
        <p className="text-gray-600">
          Explore {questions.length} questions from top companies
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <select
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company === 'all' ? 'All Companies' : company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search questions..."
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredQuestions.length} questions
          </p>
          <button
            onClick={() => setFilters({ company: 'all', topic: 'all', difficulty: 'all', search: '' })}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {paginatedQuestions.map((question, idx) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {question.company}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {question.topic}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {question.question}
                </h3>
              </div>
              <button
                onClick={() => toggleBookmark(question.id)}
                className="ml-4"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    bookmarkedQuestions.has(question.id)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {question.options && (
              <div className="mb-3 space-y-2">
                {(question.options as string[]).map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className="px-4 py-2 bg-gray-50 rounded-lg text-sm"
                  >
                    {String.fromCharCode(65 + optIdx)}. {option}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                setExpandedQuestion(expandedQuestion === question.id ? null : question.id)
              }
              className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              {expandedQuestion === question.id ? 'Hide Answer' : 'Show Answer'}
              {expandedQuestion === question.id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedQuestion === question.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="font-semibold text-green-800 mb-2">Answer:</p>
                <p className="text-gray-900">{question.answer}</p>
                {question.explanation && (
                  <div className="mt-3">
                    <p className="font-semibold text-green-800 mb-2">Explanation:</p>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
