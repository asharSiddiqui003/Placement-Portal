import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MockTests } from './pages/MockTests';
import { QuestionBank } from './pages/QuestionBank';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { Landing } from './pages/Landing';
import { DSAHub } from './pages/DSAHub';

// ─── DEV BYPASS ───────────────────────────────────────────────────────────────
// Set to true to skip Supabase auth and jump straight to the Dashboard.
// ⚠️  REMEMBER to set back to false before committing / deploying!
// ─────────────────────────────────────────────────────────────────────────────
const DEV_BYPASS = false;

const DEV_MOCK_PROFILE = {
  id: 'dev-user-123',
  email: 'dev@placementportal.com',
  name: 'Dev User',
  roll_number: 'DEV001',
  branch: 'CSE',
  year: 3,
  cpi: 8.5,
  applied_companies: ['Google', 'Amazon'],
  offers: ['TCS'],
  created_at: new Date().toISOString(),
};

// ─── Dev bypass component — full app, no auth wall ───────────────────────────
function DevApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'dsa-hub': return <DSAHub onNavigate={setCurrentPage} />;
      case 'mock-tests': return <MockTests />;
      case 'questions': return <QuestionBank />;
      case 'resume': return <ResumeBuilder />;
      case 'analytics': return <Analytics />;
      case 'profile': return <Profile />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

// ─── Real app — requires Supabase auth ───────────────────────────────────────
function AppContent() {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [wasLoggedIn, setWasLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setWasLoggedIn(true);
    } else if (wasLoggedIn && !user) {
      setShowLanding(false);
      setShowRegister(false);
      setWasLoggedIn(false);
    }
  }, [user, wasLoggedIn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && showLanding) {
    return (
      <Landing
        onLogin={() => { setShowLanding(false); setShowRegister(false); }}
        onRegister={() => { setShowLanding(false); setShowRegister(true); }}
      />
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onToggle={() => setShowRegister(false)} onBack={() => setShowLanding(true)} />
    ) : (
      <Login onToggle={() => setShowRegister(true)} onBack={() => setShowLanding(true)} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'dsa-hub': return <DSAHub onNavigate={setCurrentPage} />;
      case 'mock-tests': return <MockTests />;
      case 'questions': return <QuestionBank />;
      case 'resume': return <ResumeBuilder />;
      case 'analytics': return <Analytics />;
      case 'profile': return <Profile />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <ThemeProvider>
      {DEV_BYPASS ? (
        <AuthProvider>
          <DevApp />
        </AuthProvider>
      ) : (
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      )}
    </ThemeProvider>
  );
}

export default App;