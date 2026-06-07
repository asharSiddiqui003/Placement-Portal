import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Hash, BookOpen, Calendar, ArrowLeft } from 'lucide-react';

const AMBER = '#c8a84b';
const INK = '#111110';
const CREAM = '#f5f0e8';

interface RegisterProps {
  onToggle: () => void;
  onBack?: () => void;
}

export const Register = ({ onToggle, onBack }: RegisterProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roll_number: '',
    branch: '',
    year: 1,
    cpi: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { email, password, ...profileData } = formData;
    const { error } = await signUp(email, password, profileData);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'cpi' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: CREAM,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        fontFamily: "'Inter', system-ui, sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#fff',
          border: `1.5px solid rgba(17,17,16,0.12)`,
          padding: '3rem',
          width: '100%',
          maxWidth: '640px',
          boxSizing: 'border-box',
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
          Create Account
        </h2>
        <p style={{
          fontSize: '0.88rem', opacity: 0.5, color: INK,
          margin: '0 0 2rem 0',
        }}>
          Join the placement preparation portal
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: '600',
                color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', width: '18px', height: '18px',
                  color: 'rgba(17,17,16,0.3)',
                }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
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

            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: '600',
                color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
              }}>
                Roll Number
              </label>
              <div style={{ position: 'relative' }}>
                <Hash style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', width: '18px', height: '18px',
                  color: 'rgba(17,17,16,0.3)',
                }} />
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  placeholder="2024001"
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
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
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

          <div style={{ marginBottom: '1.2rem' }}>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1.5px solid rgba(17,17,16,0.18)',
                  background: CREAM, fontSize: '0.88rem', color: INK,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginBottom: '2rem' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: '600',
                color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
              }}>
                Branch
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', width: '18px', height: '18px',
                  color: 'rgba(17,17,16,0.3)',
                }} />
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1.5px solid rgba(17,17,16,0.18)',
                    background: CREAM, fontSize: '0.88rem', color: INK,
                    outline: 'none', boxSizing: 'border-box',
                    height: '42px',
                  }}
                >
                  <option value="">Select</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="EE">EE</option>
                  <option value="CE">CE</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: '600',
                color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
              }}>
                Year
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', width: '18px', height: '18px',
                  color: 'rgba(17,17,16,0.3)',
                }} />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1.5px solid rgba(17,17,16,0.18)',
                    background: CREAM, fontSize: '0.88rem', color: INK,
                    outline: 'none', boxSizing: 'border-box',
                    height: '42px',
                  }}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: '600',
                color: INK, marginBottom: '0.5rem', letterSpacing: '0.01em',
              }}>
                CPI
              </label>
              <input
                type="number"
                name="cpi"
                value={formData.cpi}
                onChange={handleChange}
                placeholder="8.5"
                step="0.01"
                min="0"
                max="10"
                style={{
                  width: '100%', padding: '0.75rem',
                  border: '1.5px solid rgba(17,17,16,0.18)',
                  background: CREAM, fontSize: '0.88rem', color: INK,
                  outline: 'none', boxSizing: 'border-box',
                  height: '42px',
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
              display: 'flex', alignItems: 'center', justifycontent: 'center', gap: '0.5rem',
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
                margin: '0 auto',
              }} />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '1.8rem',
          fontSize: '0.85rem', color: INK, opacity: 0.55,
        }}>
          Already have an account?{' '}
          <button
            onClick={onToggle}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: AMBER, fontWeight: '700', fontSize: '0.85rem',
              textDecoration: 'underline', textUnderlineOffset: '3px',
              padding: 0,
            }}
          >
            Sign in here
          </button>
        </p>
      </motion.div>
    </div>
  );
};
