import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  IconTracker, IconCommunity, IconJobs, IconAlumni, 
  IconAI, IconBulb, IconWave, IconChevronRight 
} from '../components/Icons';

const QUICK_LINKS = [
  { to: '/tracker', icon: IconTracker, label: '1-4-7 Tracker', desc: 'Continue your revision', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { to: '/community', icon: IconCommunity, label: 'Community', desc: 'Placement discussions', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { to: '/jobs', icon: IconJobs, label: 'Job Board', desc: 'Find opportunities', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { to: '/alumni', icon: IconAlumni, label: 'Alumni Network', desc: 'Get referrals', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { to: '/ai-analyzer', icon: IconAI, label: 'AI Analyzer', desc: 'Prep roadmap', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
];

const TIPS = [
  "Solve 2 LeetCode problems daily to maintain your streak",
  "Practice STAR method for HR questions",
  "Revise OS scheduling algorithms — common in TCS NQT",
  "Use the AI Analyzer to find skill gaps in your resume",
  "Connect with alumni for referral opportunities",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [stats, setStats] = useState({ trackerDone: 0, trackerTotal: 84 });

  useEffect(() => {
    try {
      const done = JSON.parse(localStorage.getItem('irfan147') || '{}');
      const count = Object.values(done).filter(Boolean).length;
      setStats(s => ({ ...s, trackerDone: count }));
    } catch {}
  }, []);

  const pct = Math.round((stats.trackerDone / stats.trackerTotal) * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.04))',
        border: '1px solid rgba(255,215,0,0.15)', borderRadius: 20, padding: '28px 32px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Student'}
          </div>
          <IconWave color="#FFD700" />
        </div>
        <div style={{ color: '#94a3b8', fontSize: 14 }}>
          {user?.college || 'Your College'} · Batch {user?.batch || '2027'} · Ready to crack placements?
        </div>
        <div style={{
          marginTop: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '12px 16px',
          border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <IconBulb color="#FFD700" />
          <span style={{ color: '#FFD700', fontSize: 13 }}>{TIPS[tipIdx]}</span>
        </div>
      </div>

      {/* Tracker Progress Card */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 28px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(102,126,234,0.1)', padding: 8, borderRadius: 10, color: '#667eea' }}>
              <IconTracker size={24} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>1-4-7 Revision Progress</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>28-day interview preparation plan</div>
            </div>
          </div>
          <div style={{
            fontSize: 28, fontWeight: 900,
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{pct}%</div>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            width: `${pct}%`, height: '100%', borderRadius: 8,
            background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
            transition: 'width 0.6s ease', boxShadow: '0 0 16px rgba(102,126,234,0.4)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>{stats.trackerDone} / {stats.trackerTotal} tasks</span>
          <Link to="/tracker" style={{ fontSize: 12, color: '#FFD700', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            Continue <IconChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Quick Access</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {QUICK_LINKS.map(link => (
          <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 20px',
              transition: 'all 0.3s', cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                background: link.gradient, borderRadius: '50%', opacity: 0.1, filter: 'blur(20px)',
              }} />
              <div style={{ 
                fontSize: 32, marginBottom: 12, display: 'flex', 
                color: link.to === '/tracker' ? '#667eea' : link.to === '/community' ? '#f093fb' : link.to === '/jobs' ? '#4facfe' : link.to === '/alumni' ? '#43e97b' : '#fa709a'
              }}>
                <link.icon size={36} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{link.label}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Platform stats */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '20px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>CracKInterview — Your complete campus placement ecosystem</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { label: 'Tracker', icon: IconTracker },
            { label: 'Community', icon: IconCommunity },
            { label: 'Jobs', icon: IconJobs },
            { label: 'Alumni', icon: IconAlumni },
            { label: 'AI Prep', icon: IconAI },
          ].map(s => (
            <div key={s.label} style={{ fontSize: 11, color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <s.icon size={20} />
              <div>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
