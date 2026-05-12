import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, authFetch } = useAuth();
  const [stats, setStats] = useState({ users: 0, jobs: 0, communities: 0, alumni: 0 });
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const r = await authFetch('/api/auth/users');
      if (r.ok) { const d = await r.json(); setUsers(Array.isArray(d) ? d : []); }
    } catch {}
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(255,215,0,0.05))',
        border: '1px solid rgba(220,38,38,0.2)', borderRadius: 20, padding: '28px 32px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>Admin Dashboard</div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>Welcome, {user?.name} · Platform Management</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {['overview', 'users', 'jobs', 'communities'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', border: 'none', borderRadius: 10, cursor: 'pointer',
            background: tab === t ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
            color: tab === t ? '#000' : '#888', fontWeight: tab === t ? 700 : 400, fontSize: 13,
            textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '👥', label: 'Total Users', value: users.length || '—', color: '#667eea' },
              { icon: '💼', label: 'Active Jobs', value: '—', color: '#4CAF50' },
              { icon: '💬', label: 'Communities', value: '—', color: '#f093fb' },
              { icon: '🎓', label: 'Alumni Listed', value: '—', color: '#FFD700' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: '22px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Admin Actions */}
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>⚡ Admin Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { icon: '📢', title: 'Post Job Opportunity', desc: 'Add campus or off-campus openings', action: '/jobs' },
              { icon: '🎓', title: 'Add Alumni Profile', desc: 'Expand the alumni network', action: '/alumni' },
              { icon: '💬', title: 'Create Community', desc: 'Start a college or batch group', action: '/community' },
              { icon: '📊', title: 'View User Activity', desc: 'Monitor platform engagement', action: null },
            ].map(a => (
              <div key={a.title} style={{
                background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'users' && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>👥 Registered Users</div>
          {users.length === 0 ? (
            <div style={{ color: '#64748b', padding: 30, textAlign: 'center', background: 'rgba(15,23,42,0.5)', borderRadius: 14 }}>
              No users found. Database may be offline — demo mode active.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {users.map(u => (
                <div key={u._id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, flexWrap: 'wrap',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                    {u.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{u.email}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: '4px 10px', borderRadius: 8, fontWeight: 700,
                    background: u.role === 'admin' ? 'rgba(220,38,38,0.15)' : 'rgba(102,126,234,0.15)',
                    color: u.role === 'admin' ? '#ef4444' : '#667eea',
                    border: `1px solid ${u.role === 'admin' ? 'rgba(220,38,38,0.3)' : 'rgba(102,126,234,0.3)'}`,
                  }}>{u.role?.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{u.college || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'jobs' && (
        <div style={{ color: '#64748b', padding: 40, textAlign: 'center', background: 'rgba(15,23,42,0.5)', borderRadius: 14 }}>
          💼 Navigate to the <span style={{ color: '#FFD700' }}>Jobs</span> page via sidebar to manage job postings.
        </div>
      )}

      {tab === 'communities' && (
        <div style={{ color: '#64748b', padding: 40, textAlign: 'center', background: 'rgba(15,23,42,0.5)', borderRadius: 14 }}>
          💬 Navigate to <span style={{ color: '#FFD700' }}>Community</span> via sidebar to manage groups.
        </div>
      )}
    </div>
  );
}
