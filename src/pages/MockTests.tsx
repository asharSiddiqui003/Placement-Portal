import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, MockTest, TestAttempt, Question } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Trophy, Filter, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Camera, Mic, Shield, AlertTriangle, Minimize2, Maximize2, Video,
  AlertCircle, X, Eye, EyeOff
} from 'lucide-react';

// Types for proctoring
type ViolationType =
  | 'tab_switch'
  | 'fullscreen_exit'
  | 'copy_attempt'
  | 'paste_attempt'
  | 'right_click'
  | 'devtools_open';

interface ProctoringState {
  cameraActive: boolean;
  microphoneActive: boolean;
  violations: ViolationType[];
  violationCount: number;
  snapshots: string[];
  isFullscreen: boolean;
  showWarning: boolean;
  warningMessage: string;
}

// Custom hook for proctoring
const useProctoring = (config: {
  onViolation?: (type: ViolationType, count: number) => void;
  onMaxViolationsReached?: () => void;
  maxViolations?: number;
  autoSubmitOnMaxViolations?: boolean;
  takeSnapshots?: boolean;
  snapshotInterval?: number;
}) => {
  const {
    onViolation,
    onMaxViolationsReached,
    maxViolations = 3,
    autoSubmitOnMaxViolations = true,
    takeSnapshots = true,
    snapshotInterval = 30000,
  } = config;

  const [state, setState] = useState<ProctoringState>({
    cameraActive: false,
    microphoneActive: false,
    violations: [],
    violationCount: 0,
    snapshots: [],
    isFullscreen: false,
    showWarning: false,
    warningMessage: '',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);
  const isFullscreenRef = useRef(false);

  const showWarningMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, showWarning: true, warningMessage: message }));
    setTimeout(() => {
      setState(prev => ({ ...prev, showWarning: false, warningMessage: '' }));
    }, 3000);
  }, []);

  const recordViolation = useCallback((type: ViolationType) => {
    setState(prev => {
      const newCount = prev.violationCount + 1;

      const violationMessages = {
        tab_switch: '⚠️ Tab/window switch detected! Stay on test page.',
        fullscreen_exit: '⚠️ Fullscreen mode exited! Please re-enter fullscreen.',
        copy_attempt: '⚠️ Copying is disabled during test.',
        paste_attempt: '⚠️ Pasting is disabled during test.',
        right_click: '⚠️ Right-click is disabled during test.',
        devtools_open: '⚠️ Developer tools detected! Please close them.',
      };

      showWarningMessage(violationMessages[type]);
      onViolation?.(type, newCount);

      if (autoSubmitOnMaxViolations && newCount >= maxViolations) {
        showWarningMessage(`❌ Maximum violations (${maxViolations}) reached! Submitting test...`);
        setTimeout(() => {
          onMaxViolationsReached?.();
        }, 1500);
      }

      return {
        ...prev,
        violations: [...prev.violations, type],
        violationCount: newCount,
      };
    });
  }, [onViolation, autoSubmitOnMaxViolations, maxViolations, onMaxViolationsReached, showWarningMessage]);

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState(prev => ({
        ...prev,
        cameraActive: true,
        microphoneActive: true,
      }));

      if (takeSnapshots) {
        startSnapshots();
      }

      return true;
    } catch (error) {
      console.error('Failed to get media permissions:', error);
      showWarningMessage('❌ Camera/Microphone access denied! Test cannot start.');
      return false;
    }
  };

  const takeSnapshot = useCallback((): string | null => {
    if (!videoRef.current || !videoRef.current.videoWidth) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const snapshot = canvas.toDataURL('image/jpeg', 0.6);

      setState(prev => ({
        ...prev,
        snapshots: [...prev.snapshots, snapshot].slice(-50),
      }));

      return snapshot;
    }
    return null;
  }, []);

  const startSnapshots = () => {
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
    }
    snapshotIntervalRef.current = setInterval(takeSnapshot, snapshotInterval);
  };

  const initVisibilityDetection = () => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  const initFullscreenDetection = () => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;

      setState(prev => ({ ...prev, isFullscreen: isFullscreenNow }));

      if (!isFullscreenNow && isFullscreenRef.current) {
        recordViolation('fullscreen_exit');
      }

      isFullscreenRef.current = isFullscreenNow;
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setState(prev => ({ ...prev, isFullscreen: true }));
      isFullscreenRef.current = true;
      return true;
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      showWarningMessage('⚠️ Please allow fullscreen mode for the test');
      return false;
    }
  };

  const initEventBlockers = () => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation('copy_attempt');
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation('paste_attempt');
      return false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation('right_click');
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S')
      ) {
        e.preventDefault();
        recordViolation('devtools_open');
        return false;
      }

      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        recordViolation('tab_switch');
      }

      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        recordViolation('copy_attempt');
      }

      if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        recordViolation('paste_attempt');
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  const initProctoring = async () => {
    const mediaGranted = await requestMediaPermissions();
    if (!mediaGranted) return false;

    await requestFullscreen();

    const cleanupVisibility = initVisibilityDetection();
    const cleanupFullscreen = initFullscreenDetection();
    const cleanupEvents = initEventBlockers();

    cleanupFunctionsRef.current = [cleanupVisibility, cleanupFullscreen, cleanupEvents];

    return true;
  };

  const getProctoringData = () => ({
    violations: state.violations,
    violationCount: state.violationCount,
    snapshots: state.snapshots,
    cameraEnabled: state.cameraActive,
    microphoneEnabled: state.microphoneActive,
    timestamp: new Date().toISOString(),
  });

  const cleanup = () => {
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    cleanupFunctionsRef.current.forEach(cleanup => cleanup());

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return {
    videoRef,
    state,
    initProctoring,
    takeSnapshot,
    getProctoringData,
    recordViolation,
    requestFullscreen,
    showWarningMessage,
  };
};

// Permission Modal Component
const ProctoringPermissionModal = ({ onAccept, onDecline, testName }: {
  onAccept: () => void;
  onDecline: () => void;
  testName: string;
}) => {
  const [countdown, setCountdown] = useState(5);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (accepted) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onAccept();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [accepted, onAccept]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
      >
        <div className="text-center mb-4">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">Proctoring Required</h2>
          <p className="text-gray-600 mt-1">Maintaining test integrity for <strong>{testName}</strong></p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important: Read Carefully
            </h3>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Camera and Microphone access is MANDATORY</li>
              <li>You must stay in fullscreen mode throughout the test</li>
              <li>Leaving the test tab/window will be counted as a violation</li>
              <li>Maximum 3 violations allowed - test will auto-submit</li>
              <li>Copy/Paste and Right-click are disabled</li>
              <li>Your activity is being monitored</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Privacy Notice
            </h3>
            <p className="text-sm">
              Your camera snapshots and activity logs are only stored for this attempt
              and will be reviewed for academic integrity purposes only.
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">✅ What you need to do:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Click "Allow" when browser asks for camera/microphone access</li>
              <li>Allow fullscreen mode when prompted</li>
              <li>Stay focused on the test window</li>
              <li>Ensure good lighting for camera visibility</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Decline & Exit
          </button>
          <button
            onClick={() => setAccepted(true)}
            disabled={accepted}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${accepted
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
          >
            {accepted ? `Starting in ${countdown}s...` : 'I Understand & Accept'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Warning Toast Component
const WarningToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
    >
      <AlertTriangle className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Camera Preview Component
const CameraPreview = ({ videoRef, violationCount, maxViolations, isFullscreen, onFullscreenToggle }: {
  videoRef: React.RefObject<HTMLVideoElement>;
  violationCount: number;
  maxViolations: number;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
}) => {
  const [isCameraVisible, setIsCameraVisible] = useState(true);

  return (
    <div className={`fixed ${isCameraVisible ? 'bottom-4 right-4' : 'bottom-4 right-4'} z-20`}>
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500" style={{ width: isCameraVisible ? '200px' : 'auto' }}>
        {isCameraVisible && (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-36 object-cover bg-gray-900"
            />
            <div className="bg-gray-900 text-white text-xs px-3 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Recording</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono ${violationCount >= maxViolations ? 'text-red-400' : violationCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                  ⚠️ {violationCount}/{maxViolations}
                </span>
                <button
                  onClick={onFullscreenToggle}
                  className="hover:bg-gray-700 p-1 rounded"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </>
        )}
        <button
          onClick={() => setIsCameraVisible(!isCameraVisible)}
          className="absolute -top-2 -left-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors"
        >
          {isCameraVisible ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
        </button>
      </div>
    </div>
  );
};

// Main Component
export const MockTests = () => {
  const { profile } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [proctoringReady, setProctoringReady] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    videoRef,
    state: proctoringState,
    initProctoring,
    getProctoringData,
    requestFullscreen,
  } = useProctoring({
    maxViolations: 3,
    autoSubmitOnMaxViolations: true,
    onViolation: (type, count) => {
      setWarningMessage(`⚠️ Warning ${count}/3: ${type.replace('_', ' ').toUpperCase()}`);
    },
    onMaxViolationsReached: () => {
      setWarningMessage('❌ Maximum violations reached! Submitting test...');
      setTimeout(() => {
        handleSubmit();
      }, 2000);
    },
    takeSnapshots: true,
    snapshotInterval: 30000,
  });

  useEffect(() => {
    fetchTests();
    fetchAttempts();
  }, []);

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft, testCompleted]);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('mock_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTests(data);
    } catch (error) {
      console.error('Error fetching mock tests:', error);
    }
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
    setShowPermissionModal(true);
  };

  const handleAcceptProctoring = async () => {
    setShowPermissionModal(false);
    const success = await initProctoring();

    if (success) {
      setProctoringReady(true);
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(selectedTest!.duration * 60);
      setTestStarted(true);
      setTestCompleted(false);
      setScore(null);
    } else {
      alert('Camera and microphone access is required for this test. Please allow permissions and try again.');
      setSelectedTest(null);
    }
  };

  const handleDeclineProctoring = () => {
    setShowPermissionModal(false);
    setSelectedTest(null);
    alert('You declined proctoring. Test cannot be started without camera access.');
  };

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (!testCompleted && testStarted) {
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedTest || !profile || isSubmitting) return;

    setIsSubmitting(true);

    const proctoringData = getProctoringData();

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

    // Prepare insert data - include violation_count if your table has it
    const insertData: any = {
      user_id: profile.id,
      test_id: selectedTest.id,
      score: correctCount,
      total,
      percentage,
      answers,
      proctoring_logs: proctoringData,
      flagged: proctoringData.violationCount > 0,
      completed_at: new Date().toISOString(),
    };

    // Add violation_count if the column exists (it will be added after SQL migration)
    // If you haven't run the SQL yet, this will be ignored by Supabase
    insertData.violation_count = proctoringData.violationCount;

    const { error } = await supabase.from('test_attempts').insert(insertData);

    if (error) {
      console.error('Error saving attempt:', error);
      // If error is about violation_count column not existing, try without it
      if (error.message?.includes('violation_count')) {
        delete insertData.violation_count;
        const { error: retryError } = await supabase.from('test_attempts').insert(insertData);
        if (retryError) {
          console.error('Error saving attempt without violation_count:', retryError);
        }
      }
    }

    await fetchAttempts();
    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullscreenToggle = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await requestFullscreen();
    }
  };

  const filteredTests = filterCompany === 'all'
    ? tests
    : tests.filter((t) => t.company === filterCompany);

  // Get violation count safely from attempt (handles if column doesn't exist)
  const getViolationCount = (attempt: any) => {
    return attempt.violation_count !== undefined ? attempt.violation_count : 0;
  };

  // Test in progress view
  if (testStarted && selectedTest && proctoringReady) {
    const questions = selectedTest.questions as Question[];
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <>
        <AnimatePresence>
          {warningMessage && (
            <WarningToast message={warningMessage} onClose={() => setWarningMessage(null)} />
          )}
        </AnimatePresence>

        <CameraPreview
          videoRef={videoRef}
          violationCount={proctoringState.violationCount}
          maxViolations={3}
          isFullscreen={proctoringState.isFullscreen}
          onFullscreenToggle={handleFullscreenToggle}
        />

        <div className="p-6 max-w-5xl mx-auto pb-24">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-2xl font-bold">{selectedTest.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className={`font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-red-600'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Q{currentQuestion + 1}/{questions.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[question.id] === idx
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === idx}
                      onChange={() => handleAnswer(question.id, idx)}
                      className="mr-3 w-4 h-4"
                      disabled={testCompleted}
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-xl disabled:opacity-50 hover:bg-gray-200 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3 font-medium">Question Navigator:</p>
              <div className="flex gap-2 flex-wrap">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${currentQuestion === idx
                        ? 'bg-blue-600 text-white shadow-md'
                        : answers[questions[idx].id] !== undefined
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded" />
                  <span>Current</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Test completed view with results
  if (testCompleted && selectedTest && score) {
    const questions = selectedTest.questions as Question[];

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div className="text-center">
            <div className={`${score.percentage >= 70 ? 'bg-green-100' : score.percentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Trophy className={`w-12 h-12 ${score.percentage >= 70 ? 'text-green-600' : score.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
            <p className="text-gray-600 mb-6">Here are your results for {selectedTest.title}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-2xl font-bold text-purple-600">{score.score}</p>
              </div>
              <div className={`${proctoringState.violationCount > 0 ? 'bg-red-50' : 'bg-gray-50'} p-4 rounded-lg`}>
                <p className="text-sm text-gray-600">Violations</p>
                <p className={`text-2xl font-bold ${proctoringState.violationCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {proctoringState.violationCount}
                </p>
              </div>
            </div>

            {proctoringState.violationCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ Note: {proctoringState.violationCount} violation(s) were recorded during this test.
                  Your results may be under review.
                </p>
              </div>
            )}

            <div className="text-left space-y-4 mb-6 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-lg">Answer Review</h3>
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div key={q.id} className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          Q{idx + 1}: {q.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          Your answer: {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 font-medium mt-1">
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
                setProctoringReady(false);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Tests
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main tests listing view
  return (
    <>
      {showPermissionModal && selectedTest && (
        <ProctoringPermissionModal
          testName={selectedTest.title}
          onAccept={handleAcceptProctoring}
          onDecline={handleDeclineProctoring}
        />
      )}

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mock Tests</h1>
          <p className="text-gray-600">Practice with company-specific and general aptitude tests</p>
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>📋 Test Guidelines:</strong> Camera access required. Fullscreen mode enforced.
            Tab switching and copy/paste are prohibited. Maximum 3 violations allowed.
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Companies</option>
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Meta">Meta</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-gray-800">No Tests Found</h3>
            <p className="text-gray-600 mt-1">There are no mock tests matching this filter, or the database needs to be seeded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTests.map((test) => {
              const attempt = attempts.find((a) => a.test_id === test.id);

              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{test.title}</h3>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {test.duration} min
                    </span>
                  </div>

                  {test.company && (
                    <p className="text-sm text-gray-600 mb-2">🏢 {test.company}</p>
                  )}

                  <p className="text-sm text-gray-600 mb-4">
                    📝 {(test.questions as Question[]).length} Questions
                  </p>

                  {attempt && (
                    <div className={`${attempt.percentage >= 70 ? 'bg-green-50 border-green-200' : attempt.percentage >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-lg p-3 mb-4`}>
                      <p className="text-sm font-semibold">
                        Previous Score: {attempt.percentage.toFixed(1)}%
                      </p>
                      {attempt.flagged && (
                        <p className="text-xs text-red-600 mt-1">⚠️ Flagged for review</p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => startTest(test)}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {attempt ? 'Retake Test' : 'Start Test'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {attempts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">📊 Your Past Attempts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Test</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Percentage</th>
                    <th className="text-left py-3 px-4">Violations</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => {
                    const test = tests.find((t) => t.id === attempt.test_id);
                    const violationCount = getViolationCount(attempt);
                    return (
                      <tr key={attempt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{test?.title || 'Unknown'}</td>
                        <td className="py-3 px-4">
                          {attempt.score}/{attempt.total}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${attempt.percentage >= 70
                                ? 'bg-green-100 text-green-700'
                                : attempt.percentage >= 40
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {attempt.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${violationCount > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                            {violationCount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
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
    </>
  );
};