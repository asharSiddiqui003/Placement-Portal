import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LandingProps {
    onLogin: () => void;
    onRegister: () => void;
}

const TICKER_ITEMS = [
    'MOCK TESTS',
    'QUESTION BANK',
    'ATS RESUME SCORER',
    'PLACEMENT ANALYTICS',
    'COMPANY FILTERS',
    'PERFORMANCE TRACKING',
    'INTERVIEW PREP',
    'TIMED ASSESSMENTS',
];

const AMBER = '#c8a84b';
const INK = '#111110';
const CREAM = '#f5f0e8';
const CREAM_DARK = '#ede8de';

export const Landing = ({ onLogin, onRegister }: LandingProps) => {
    const [tickerPos, setTickerPos] = useState(0);
    const tickerRef = useRef<number | null>(null);
    const tickerWidth = useRef(0);

    useEffect(() => {
        const itemWidth = 240;
        tickerWidth.current = TICKER_ITEMS.length * itemWidth;
        const animate = () => {
            setTickerPos((prev) => {
                const next = prev - 0.6;
                return next <= -tickerWidth.current ? 0 : next;
            });
            tickerRef.current = requestAnimationFrame(animate);
        };
        tickerRef.current = requestAnimationFrame(animate);
        return () => { if (tickerRef.current) cancelAnimationFrame(tickerRef.current); };
    }, []);

    const features = [
        {
            num: '01',
            title: 'Mock Tests',
            desc: 'Timed, company-specific assessments with instant grading and detailed explanations. One question at a time — just like the real thing.',
            tag: 'Assessments',
        },
        {
            num: '02',
            title: 'Question Bank',
            desc: '2400+ curated interview questions. Filter by company, topic, or difficulty. Bookmark what you need, skip what you know.',
            tag: '2400+ Questions',
        },
        {
            num: '03',
            title: 'ATS Resume Scorer',
            desc: 'Upload your resume and get an instant ATS score with detected keywords and specific, actionable improvement suggestions.',
            tag: 'Instant Feedback',
        },
        {
            num: '04',
            title: 'Placement Analytics',
            desc: 'Branch-wise package trends, company hiring stats, and your personal performance curve — all in one clear, visual dashboard.',
            tag: 'Data Insights',
        },
    ];

    const stats = [
        { val: '94%', label: 'Placement Rate' },
        { val: '2400+', label: 'Curated Questions' },
        { val: '40+', label: 'Companies Covered' },
        { val: '6', label: 'Core Modules' },
    ];

    return (
        <div style={{ background: CREAM, color: INK, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh' }}>

            {/* ── NAV ── */}
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: CREAM,
                borderBottom: `1px solid rgba(17,17,16,0.12)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2.5rem',
                height: '56px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                        width: '28px', height: '28px',
                        background: INK,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{ width: '12px', height: '12px', background: AMBER }} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
                        Placement Portal
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                        id="nav-login-btn"
                        onClick={onLogin}
                        style={{
                            background: 'none', border: `1.5px solid rgba(17,17,16,0.25)`,
                            padding: '0.45rem 1.1rem', fontSize: '0.8rem', fontWeight: '600',
                            cursor: 'pointer', color: INK, letterSpacing: '0.01em',
                            transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = INK)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(17,17,16,0.25)')}
                    >
                        Log in
                    </button>
                    <button
                        id="nav-register-btn"
                        onClick={onRegister}
                        style={{
                            background: INK, border: `1.5px solid ${INK}`,
                            padding: '0.45rem 1.1rem', fontSize: '0.8rem', fontWeight: '600',
                            cursor: 'pointer', color: CREAM, letterSpacing: '0.01em',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section style={{ padding: '6rem 3.5rem 5rem', maxWidth: '1180px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >

                    {/* headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
                        fontWeight: '900',
                        lineHeight: 1.05,
                        letterSpacing: '-0.035em',
                        margin: '0 0 1.5rem 0',
                        maxWidth: '18ch',
                    }}>
                        Stop winging<br />
                        your placements.
                    </h1>

                    {/* sub */}
                    <p style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        opacity: 0.58,
                        maxWidth: '48ch',
                        margin: '0 0 2.5rem 0',
                    }}>
                        One place for mock tests, curated question banks, instant ATS resume feedback,
                        and placement analytics. Built for students who take it seriously.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                        <button
                            id="hero-try-btn"
                            onClick={onLogin}
                            style={{
                                background: INK, color: CREAM,
                                border: `2px solid ${INK}`,
                                padding: '0.8rem 2rem', fontSize: '0.88rem',
                                fontWeight: '700', letterSpacing: '0.04em',
                                textTransform: 'uppercase', cursor: 'pointer',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = AMBER;
                                e.currentTarget.style.borderColor = AMBER;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = INK;
                                e.currentTarget.style.borderColor = INK;
                            }}
                        >
                            Try it yourself →
                        </button>
                        <button
                            id="hero-register-btn"
                            onClick={onRegister}
                            style={{
                                background: 'transparent', color: INK,
                                border: `2px solid rgba(17,17,16,0.22)`,
                                padding: '0.8rem 2rem', fontSize: '0.88rem',
                                fontWeight: '600', letterSpacing: '0.04em',
                                textTransform: 'uppercase', cursor: 'pointer',
                                transition: 'border-color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = INK)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(17,17,16,0.22)')}
                        >
                            Create account
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ── STATS STRIP ── */}
            <section style={{
                borderTop: `1.5px solid rgba(17,17,16,0.12)`,
                borderBottom: `1.5px solid rgba(17,17,16,0.12)`,
                background: CREAM_DARK,
            }}>
                <div style={{
                    maxWidth: '1180px', margin: '0 auto',
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                }}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 + 0.3, duration: 0.4 }}
                            style={{
                                padding: '1.8rem 1.5rem',
                                borderRight: i < stats.length - 1 ? `1.5px solid rgba(17,17,16,0.12)` : 'none',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                                fontWeight: '900',
                                color: AMBER,
                                lineHeight: 1,
                                marginBottom: '0.3rem',
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {s.val}
                            </div>
                            <div style={{
                                fontFamily: "'Courier New', monospace",
                                fontSize: '0.68rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                opacity: 0.5,
                            }}>
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TICKER ── */}
            <div style={{
                background: AMBER,
                borderBottom: `1.5px solid rgba(17,17,16,0.15)`,
                padding: '0.7rem 0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}>
                <div style={{
                    display: 'inline-flex',
                    transform: `translateX(${tickerPos}px)`,
                    willChange: 'transform',
                }}>
                    {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span key={i} style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            marginRight: '2.5rem',
                            color: INK,
                            opacity: 0.85,
                        }}>
                            {item} ·
                        </span>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section style={{ padding: '7rem 3.5rem', maxWidth: '1180px', margin: '0 auto' }}>
                {/* section label */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '2.5rem',
                    paddingBottom: '1rem',
                    borderBottom: `1.5px solid rgba(17,17,16,0.1)`,
                }}>
                    <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.68rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', opacity: 0.45,
                    }}>
                        What's inside
                    </span>
                    <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.65rem', opacity: 0.3,
                        letterSpacing: '0.1em',
                    }}>
                        04 MODULES
                    </span>
                </div>

                {/* 2×2 grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0',
                    border: `1.5px solid rgba(17,17,16,0.12)`,
                }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: (i % 2) * 0.1, duration: 0.45 }}
                            style={{
                                padding: '3.2rem 2.8rem',
                                minHeight: '260px',
                                borderRight: i % 2 === 0 ? `1.5px solid rgba(17,17,16,0.12)` : 'none',
                                borderBottom: i < 2 ? `1.5px solid rgba(17,17,16,0.12)` : 'none',
                                transition: 'background 0.18s, color 0.18s',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = INK;
                                e.currentTarget.style.color = CREAM;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = INK;
                            }}
                        >
                            {/* number + tag row */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '1.8rem',
                            }}>
                                <span style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: '0.62rem', opacity: 0.35,
                                    letterSpacing: '0.18em',
                                }}>
                                    {f.num}
                                </span>
                                <span style={{
                                    fontFamily: "'Courier New', monospace",
                                    fontSize: '0.6rem', letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    background: AMBER, color: INK,
                                    padding: '0.2rem 0.55rem',
                                    fontWeight: '700',
                                }}>
                                    {f.tag}
                                </span>
                            </div>

                            <h3 style={{
                                fontSize: '1.65rem', fontWeight: '800',
                                margin: '0 0 1rem 0', letterSpacing: '-0.02em',
                            }}>
                                {f.title}
                            </h3>
                            <p style={{
                                fontSize: '0.95rem', lineHeight: 1.75,
                                opacity: 0.55, margin: 0, maxWidth: '40ch',
                            }}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{
                padding: '7rem 3.5rem 8rem',
                maxWidth: '1180px',
                margin: '0 auto',
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '3rem',
                    paddingBottom: '1rem',
                    borderBottom: `1.5px solid rgba(17,17,16,0.1)`,
                }}>
                    <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.68rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', opacity: 0.45,
                    }}>
                        How it works
                    </span>
                    <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.65rem', opacity: 0.3,
                        letterSpacing: '0.1em',
                    }}>
                        03 STEPS
                    </span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '3.5rem',
                }}>
                    {[
                        {
                            step: '01',
                            title: 'Create your profile',
                            desc: 'Sign up with your college details — branch, year, CPI. Your dashboard is personalized from day one.',
                        },
                        {
                            step: '02',
                            title: 'Practice & prepare',
                            desc: 'Take timed mock tests, browse the question bank, upload your resume for ATS scoring. Track everything.',
                        },
                        {
                            step: '03',
                            title: 'Crack the placement',
                            desc: 'Use analytics to find your weak spots, bookmark key questions, and walk into your interview prepared.',
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.12, duration: 0.5 }}
                            style={{ padding: '0' }}
                        >
                            <div style={{
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                fontWeight: '900',
                                color: AMBER,
                                lineHeight: 1,
                                marginBottom: '1.4rem',
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {item.step}
                            </div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: '800',
                                marginBottom: '0.9rem',
                                letterSpacing: '-0.02em',
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                fontSize: '0.95rem',
                                lineHeight: 1.75,
                                opacity: 0.5,
                                margin: 0,
                                maxWidth: '34ch',
                            }}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA — FULL WIDTH FADE-IN ── */}
            <section style={{
                background: INK,
                padding: '10rem 3.5rem',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        maxWidth: '1180px',
                        margin: '0 auto',
                        textAlign: 'center',
                    }}
                >
                    <p style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.68rem', color: AMBER,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        marginBottom: '1.2rem', opacity: 0.7,
                    }}>
                        Get started today
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        fontWeight: '900',
                        color: CREAM,
                        lineHeight: 1.05,
                        letterSpacing: '-0.04em',
                        margin: '0 0 2.5rem 0',
                    }}>
                        Ready to crack it?
                    </h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <button
                            id="cta-login-btn"
                            onClick={onLogin}
                            style={{
                                background: CREAM, color: INK,
                                border: `2px solid ${CREAM}`,
                                padding: '1rem 2.5rem',
                                fontSize: '0.88rem', fontWeight: '700',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = AMBER;
                                e.currentTarget.style.borderColor = AMBER;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = CREAM;
                                e.currentTarget.style.borderColor = CREAM;
                            }}
                        >
                            Log In
                        </button>
                        <button
                            id="cta-register-btn"
                            onClick={onRegister}
                            style={{
                                background: 'transparent', color: CREAM,
                                border: `2px solid rgba(245,240,232,0.3)`,
                                padding: '1rem 2.5rem',
                                fontSize: '0.88rem', fontWeight: '700',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                cursor: 'pointer', transition: 'border-color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = CREAM)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)')}
                        >
                            Register
                        </button>
                    </motion.div>

                    <p style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.65rem', color: CREAM,
                        opacity: 0.2, marginTop: '3rem',
                        letterSpacing: '0.08em',
                    }}>
                        Free to use. No credit card required.
                    </p>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{
                borderTop: `1.5px solid rgba(17,17,16,0.1)`,
                padding: '2rem 3.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1180px',
                margin: '0 auto',
            }}>
                <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.65rem', opacity: 0.3,
                    letterSpacing: '0.08em',
                }}>
                    © 2026 Placement Prep Portal
                </span>
                <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.65rem', opacity: 0.3,
                    letterSpacing: '0.08em',
                }}>
                    Built for serious students.
                </span>
            </footer>

        </div>
    );
};
