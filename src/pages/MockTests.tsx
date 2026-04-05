import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, MockTest, TestAttempt, Question } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Clock, Trophy, Filter, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export const MockTests = () => {
  const { profile } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [filterCompany, setFilterCompany] = useState<string>('all');

  useEffect(() => {
    fetchTests();
    fetchAttempts();
  }, []);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft]);

  const fetchTests = async () => {
    const { data } = await supabase
      .from('mock_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTests(data);
  };

  const fetchAttempts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', profile.id)
      .order('completed_at', { ascending: false });

    if (data) setAttempts(data);
  };

  const startTest = (test: MockTest) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(test.duration * 60);
    setTestStarted(true);
    setTestCompleted(false);
    setScore(null);
  };

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!selectedTest || !profile) return;

    setTestStarted(false);
    setTestCompleted(true);

    let correctCount = 0;
    const questions = selectedTest.questions as Question[];

    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = questions.length;
    const percentage = (correctCount / total) * 100;

    setScore({ score: correctCount, total, percentage });

    await supabase.from('test_attempts').insert({
      user_id: profile.id,
      test_id: selectedTest.id,
      score: correctCount,
      total,
      percentage,
      answers,
    });

    fetchAttempts();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTests = filterCompany === 'all'
    ? tests
    : tests.filter((t) => t.company === filterCompany);

  if (testStarted && selectedTest) {
    const questions = selectedTest.questions as Question[];
    const question = questions[currentQuestion];

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{selectedTest.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
              </div>
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === idx
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === idx}
                    onChange={() => handleAnswer(question.id, idx)}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-6 flex gap-2 flex-wrap">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold ${
                  currentQuestion === idx
                    ? 'bg-blue-600 text-white'
                    : answers[questions[idx].id] !== undefined
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted && selectedTest && score) {
    const questions = selectedTest.questions as Question[];

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
          <p className="text-gray-600 mb-6">Here are your results</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {score.score}/{score.total}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-2xl font-bold text-green-600">{score.percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-2xl font-bold text-purple-600">{score.score}</p>
            </div>
          </div>

          <div className="text-left space-y-4 mb-6">
            <h3 className="font-bold text-lg">Answer Review</h3>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        Q{idx + 1}: {q.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 font-medium">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setSelectedTest(null);
              setTestCompleted(false);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Tests
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mock Tests</h1>
        <p className="text-gray-600">Practice with company-specific and general aptitude tests</p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Companies</option>
            <option value="Amazon">Amazon</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTests.map((test) => {
          const attempt = attempts.find((a) => a.test_id === test.id);

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{test.title}</h3>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {test.duration} min
                </span>
              </div>

              {test.company && (
                <p className="text-sm text-gray-600 mb-4">Company: {test.company}</p>
              )}

              <p className="text-sm text-gray-600 mb-4">
                Questions: {(test.questions as Question[]).length}
              </p>

              {attempt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-green-700">
                    Previous Score: {attempt.percentage.toFixed(1)}%
                  </p>
                </div>
              )}

              <button
                onClick={() => startTest(test)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {attempt ? 'Retake Test' : 'Start Test'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {attempts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Your Past Attempts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Test</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Percentage</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => {
                  const test = tests.find((t) => t.id === attempt.test_id);
                  return (
                    <tr key={attempt.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{test?.title || 'Unknown'}</td>
                      <td className="py-3 px-4">
                        {attempt.score}/{attempt.total}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            attempt.percentage >= 70
                              ? 'bg-green-100 text-green-700'
                              : attempt.percentage >= 50
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {attempt.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
