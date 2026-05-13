import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    if (tab === 'users') loadUsers();
    if (tab === 'approvals') loadApprovals();
  }, [tab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const r = await authFetch('/api/auth/users');
      if (r.ok) { const d = await r.json(); setUsers(Array.isArray(d) ? d : []); }
    } catch {} finally { setLoading(false); }
  };

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const rj = await authFetch('/api/jobs?approved=false');
      if (rj.ok) { const dj = await rj.json(); setPendingJobs(dj); }
      const rp = await authFetch('/api/community/posts/pending');
      if (rp.ok) { const dp = await rp.json(); setPendingPosts(dp); }
    } catch {} finally { setLoading(false); }
  };

  const sendBroadcast = async () => {
    if (!emailSubject || !emailMessage) return;
    setLoading(true);
    setEmailStatus('sending');
    try {
      const r = await authFetch('/api/auth/broadcast', {
        method: 'POST',
        body: JSON.stringify({ subject: emailSubject, message: emailMessage })
      });
      const d = await r.json();
      if (r.ok) {
        setEmailStatus(d.mode === 'console' ? 'mock_success' : 'success');
        setEmailSubject(''); setEmailMessage('');
      } else {
        setEmailStatus('error');
      }
    } catch { setEmailStatus('error'); }
    finally { setLoading(false); }
  };

  const approveJob = async (id) => {
    try {
      await authFetch(`/api/jobs/${id}/approve`, { method: 'POST' });
      setPendingJobs(js => js.filter(j => j._id !== id));
    } catch {}
  };

  const approvePost = async (id) => {
    try {
      await authFetch(`/api/community/posts/${id}/approve`, { method: 'POST' });
      setPendingPosts(ps => ps.filter(p => p._id !== id));
    } catch {}
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(255,215,0,0.05))',
        border: '1px solid rgba(220,38,38,0.2)', borderRadius: 20, padding: '28px 32px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>Admin Dashboard</div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>Welcome, {user?.name} · Platform Moderator</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'users', label: '👥 Users' },
          { id: 'approvals', label: '⏳ Approvals' },
          { id: 'email', label: '📧 Broadcast' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 20px', border: 'none', borderRadius: 10, cursor: 'pointer',
            background: tab === t.id ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
            color: tab === t.id ? '#000' : '#888', fontWeight: tab === t.id ? 700 : 400, fontSize: 13,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { label: 'Registered Students', value: users.length || '...', color: '#667eea', icon: '👨‍🎓' },
            { label: 'Pending Jobs', value: pendingJobs.length, color: '#FFD700', icon: '💼' },
            { label: 'Pending Posts', value: pendingPosts.length, color: '#f5576c', icon: '💬' },
          ].map(s => (
            <div key={s.label} style={cardStyle}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Student Directory</div>
          {loading ? <div style={{ color: '#64748b' }}>Loading users...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>College</th>
                  <th style={thStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={tdStyle}>{u.name}</td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>{u.college || '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: u.role === 'admin' ? 'rgba(244,67,54,0.1)' : 'rgba(76,175,80,0.1)', color: u.role === 'admin' ? '#f44336' : '#4CAF50' }}>{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'approvals' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Jobs Approval */}
          <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>💼 Pending Jobs ({pendingJobs.length})</div>
            {pendingJobs.map(j => (
              <div key={j._id} style={itemStyle}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{j.company} - {j.role}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>by {j.postedBy?.name || 'User'}</div>
                </div>
                <button onClick={() => approveJob(j._id)} style={btnSmallGold}>Approve</button>
              </div>
            ))}
            {pendingJobs.length === 0 && <div style={{ color: '#64748b', fontSize: 12 }}>No pending jobs.</div>}
          </div>

          {/* Posts Approval */}
          <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>💬 Pending Posts ({pendingPosts.length})</div>
            {pendingPosts.map(p => (
              <div key={p._id} style={itemStyle}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{p.description.slice(0, 40)}...</div>
                </div>
                <button onClick={() => approvePost(p._id)} style={btnSmallGold}>Approve</button>
              </div>
            ))}
            {pendingPosts.length === 0 && <div style={{ color: '#64748b', fontSize: 12 }}>No pending posts.</div>}
          </div>
        </div>
      )}

      {tab === 'email' && (
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>📧 Broadcast Email</div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Send an announcement to all registered users via email.</div>
          
          {emailStatus === 'mock_success' && <div style={{ padding: '10px 14px', background: 'rgba(255,215,0,0.1)', color: '#FFD700', borderRadius: 10, fontSize: 12, marginBottom: 16, border: '1px solid rgba(255,215,0,0.2)' }}>⚠️ Credentials not set. Email content has been logged to the server console instead.</div>}
          {emailStatus === 'success' && <div style={{ padding: '10px 14px', background: 'rgba(76,175,80,0.1)', color: '#4CAF50', borderRadius: 10, fontSize: 12, marginBottom: 16, border: '1px solid rgba(76,175,80,0.2)' }}>✅ Emails sent successfully to all users!</div>}
          {emailStatus === 'error' && <div style={{ padding: '10px 14px', background: 'rgba(244,67,54,0.1)', color: '#f44336', borderRadius: 10, fontSize: 12, marginBottom: 16, border: '1px solid rgba(244,67,54,0.2)' }}>❌ Failed to send emails. Check server logs.</div>}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Subject</label>
            <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Upcoming Campus Drive..." style={inputInStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>Message Content</label>
            <textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} placeholder="Type your announcement here..." rows={6} style={{ ...inputInStyle, resize: 'vertical' }} />
          </div>
          <button onClick={sendBroadcast} disabled={loading || !emailSubject || !emailMessage} style={{ ...btnGold, width: '100%', opacity: (loading || !emailSubject || !emailMessage) ? 0.6 : 1 }}>
            {emailStatus === 'sending' ? 'Sending...' : '🚀 Send to All Users'}
          </button>
        </div>
      )}
    </div>
  );
}

const cardStyle = { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px' };
const thStyle = { padding: '12px 8px', fontSize: 12, color: '#94a3b8', fontWeight: 600 };
const tdStyle = { padding: '12px 8px', fontSize: 13, color: '#cbd5e1' };
const itemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' };
const btnSmallGold = { padding: '6px 12px', fontSize: 11, fontWeight: 600, background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 8, cursor: 'pointer' };
const btnGold = { padding: '12px 24px', fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: 12, cursor: 'pointer' };
const inputInStyle = { width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
