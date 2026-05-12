import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STUDENT_NAV = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/tracker', icon: '🧠', label: '1-4-7 Tracker' },
  { to: '/community', icon: '💬', label: 'Community' },
  { to: '/jobs', icon: '💼', label: 'Jobs' },
  { to: '/alumni', icon: '🎓', label: 'Alumni' },
  { to: '/ai-analyzer', icon: '🤖', label: 'AI Analyzer' },
];

const ADMIN_NAV = [
  { to: '/', icon: '🛡️', label: 'Admin Panel' },
  { to: '/community', icon: '💬', label: 'Communities' },
  { to: '/jobs', icon: '💼', label: 'Manage Jobs' },
  { to: '/alumni', icon: '🎓', label: 'Alumni Directory' },
  { to: '/tracker', icon: '🧠', label: '1-4-7 Tracker' },
];

export default function Sidebar({ mobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const NAV = isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{
      width: 240, minHeight: '100vh',
      background: 'rgba(10, 10, 26, 0.97)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: mobile ? 'fixed' : 'sticky',
      top: 0, left: 0, zIndex: mobile ? 1000 : 10,
      boxShadow: mobile ? '4px 0 30px rgba(0,0,0,0.8)' : 'none',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: 20, fontWeight: 900,
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>⚡ CracKInterview</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Placement Ecosystem</div>
          </div>
          {mobile && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>✕</button>
          )}
        </div>
      </div>

      {/* User pill */}
      {user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            background: isAdmin ? 'rgba(220,38,38,0.06)' : 'rgba(255,215,0,0.06)',
            border: `1px solid ${isAdmin ? 'rgba(220,38,38,0.15)' : 'rgba(255,215,0,0.12)'}`,
            borderRadius: 12, padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{isAdmin ? '🛡️' : '👤'} {user.name}</span>
              <span style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 6, fontWeight: 700,
                background: isAdmin ? 'rgba(220,38,38,0.2)' : 'rgba(102,126,234,0.2)',
                color: isAdmin ? '#ef4444' : '#667eea',
              }}>{(user.role || 'student').toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{user.college || ''} {user.batch ? `· ${user.batch}` : ''}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={mobile ? onClose : undefined} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 14px', borderRadius: 12, marginBottom: 4,
            textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 700 : 400,
            background: isActive ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.08))' : 'transparent',
            color: isActive ? '#FFD700' : '#94a3b8',
            border: isActive ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
            transition: 'all 0.2s',
          })}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(244,67,54,0.2)',
          background: 'rgba(244,67,54,0.05)', color: '#f44336', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,67,54,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,67,54,0.05)'}
        >🚪 Logout</button>
      </div>
    </div>
  );
}
