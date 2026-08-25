import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ChatBot } from './ChatBot';
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
  FileText,
  TrendingUp,
  User,
  Menu,
  X,
  GraduationCap,
  Sun,
  Moon,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const { profile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'mock-tests', name: 'Mock Tests', icon: FileQuestion },
    { id: 'questions', name: 'Question Bank', icon: BookOpen },
    { id: 'resume', name: 'Resume Builder', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ── Mobile top navbar ──────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 dark:bg-orange-600 p-2 rounded-lg transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Placement Portal</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile dark mode toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-700 dark:text-zinc-200"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile backdrop overlay ────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Desktop & Mobile Sidebar ──────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 z-40 transform transition-transform duration-200 lg:translate-x-0 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 overflow-y-auto flex-1">
          {/* Brand header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 dark:bg-orange-600 p-2.5 rounded-xl shadow-sm transition-colors">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Placement Portal</span>
          </div>

          {/* User Profile widget */}
          {profile && (
            <div className="mb-6 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800/80 rounded-xl border border-blue-100/50 dark:border-zinc-700/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 dark:bg-orange-600 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors">
                  <span className="text-white font-bold text-sm">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-zinc-100 truncate">{profile.name}</p>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 truncate">
                    {profile.branch} • Year {profile.year}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 dark:bg-orange-600 text-white shadow-sm'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/80 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Theme Switcher at bottom of Sidebar (Option 1) ───────────────── */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/90">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/70 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              {isDark ? (
                <Moon className="w-4 h-4 text-orange-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-sm font-medium">
                {isDark ? 'Dark Theme' : 'Light Theme'}
              </span>
            </div>
            
            {/* Minimalist Switch pill */}
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${isDark ? 'bg-orange-600' : 'bg-gray-300'}`}>
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                  isDark ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </aside>

      {/* Main view container */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>

      {/* ── AI Chat Bubble (every page) ──────────────────────────────────── */}
      <ChatBot onNavigate={onNavigate} />
    </div>
  );
};
