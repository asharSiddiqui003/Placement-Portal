import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

const AMBER = '#c8a84b';
const INK = '#111110';
const CREAM = '#f5f0e8';

interface LoginProps {
  onToggle: () => void;
  onBack?: () => void;
}

export const Login = ({ onToggle, onBack }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: CREAM,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 md:p-12"
        style={{
          background: '#fff',
          border: `1.5px solid rgba(17,17,16,0.12)`,
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Top navigation row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '28px', height: '28px', background: INK,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '12px', height: '12px', background: AMBER }} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', letterSpacing: '-0.01em', color: INK }}>
              Placement Portal
            </span>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                color: INK, opacity: 0.6, fontSize: '0.8rem', fontWeight: '600',
                padding: '0.4rem 0', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
              Back
            </button>
          )}
        </div>

        <h2 style={{
          fontSize: '1.8rem', fontWeight: '900', color: INK,
          margin: '0 0 0.4rem 0', letterSpacing: '-0.03em',
        }}>
          Welcome back
        </h2>
        <p style={{
          fontSize: '0.88rem', opacity: 0.5, color: INK,
          margin: '0 0 2rem 0',
        }}>
          Sign in to your placement portal
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#fef2f2', border: '1.5px solid #fecaca',
              color: '#b91c1c', padding: '0.75rem 1rem',
              fontSize: '0.82rem', marginBottom: '1.5rem',
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{
              display: 'block', fontSize: '0.78rem', fontWeight: '600',
              color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute', left: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', width: '18px', height: '18px',
                color: 'rgba(17,17,16,0.3)',
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                style={{
                  width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1.5px solid rgba(17,17,16,0.18)',
                  background: CREAM, fontSize: '0.88rem', color: INK,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{
              display: 'block', fontSize: '0.78rem', fontWeight: '600',
              color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute', left: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', width: '18px', height: '18px',
                color: 'rgba(17,17,16,0.3)',
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1.5px solid rgba(17,17,16,0.18)',
                  background: CREAM, fontSize: '0.88rem', color: INK,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: INK, color: CREAM,
              border: `2px solid ${INK}`,
              padding: '0.85rem', fontSize: '0.88rem',
              fontWeight: '700', letterSpacing: '0.04em',
              textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = AMBER;
                e.currentTarget.style.borderColor = AMBER;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.borderColor = INK;
            }}
          >
            {loading ? (
              <div style={{
                width: '18px', height: '18px',
                border: `2px solid ${CREAM}`, borderTopColor: 'transparent',
                borderRadius: '50%', animation: 'spin 0.6s linear infinite',
              }} />
            ) : (
              <>
                <LogIn style={{ width: '18px', height: '18px' }} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '1.8rem',
          fontSize: '0.85rem', color: INK, opacity: 0.55,
        }}>
          Don't have an account?{' '}
          <button
            onClick={onToggle}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: AMBER, fontWeight: '700', fontSize: '0.85rem',
              textDecoration: 'underline', textUnderlineOffset: '3px',
              padding: 0,
            }}
          >
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
};
