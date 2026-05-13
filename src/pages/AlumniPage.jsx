import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = '/api/alumni';

export default function AlumniPage() {
  const { authFetch, user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [filters, setFilters] = useState({ company: '', college: '', referral: false });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', role: '', college: '', batch: '', branch: '', linkedin: '', email: '', skills: '', city: '', isOpenToReferral: false, interviewTips: '', experience: '' });
  const [topCompanies, setTopCompanies] = useState([]);

  useEffect(() => { load(); loadStats(); }, []);

  const load = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.company) params.set('company', filters.company);
      if (filters.college) params.set('college', filters.college);
      if (filters.referral) params.set('referral', 'true');
      const r = await authFetch(`${API}?${params}`);
      const d = await r.json(); setAlumni(Array.isArray(d) ? d : []);
    } catch {}
  };

  const loadStats = async () => {
    try { const r = await authFetch(`${API}/stats/companies`); const d = await r.json(); setTopCompanies(Array.isArray(d) ? d : []); } catch {}
  };

  const addAlumni = async () => {
    try {
      const body = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      await authFetch(API, { method: 'POST', body: JSON.stringify(body) });
      setShowAdd(false); load(); loadStats();
    } catch {}
  };

  const connect = async (id) => {
    try { await authFetch(`${API}/${id}/connect`, { method: 'POST' }); load(); } catch {}
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>🎓 Alumni Network</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Connect with alumni & get referrals</div>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowAdd(true)} style={btnGold}>➕ Add Alumni</button>
        )}
      </div>

      {/* Top Companies Bar */}
      {topCompanies.length > 0 && (
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#FFD700', marginBottom: 12 }}>🏢 Top Companies with Alumni</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {topCompanies.map(c => (
              <button key={c._id} onClick={() => { setFilters(f => ({ ...f, company: c._id })); }} style={{
                padding: '6px 14px', fontSize: 12, borderRadius: 10,
                background: filters.company === c._id ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${filters.company === c._id ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: filters.company === c._id ? '#FFD700' : '#cbd5e1', cursor: 'pointer',
              }}>
                {c._id} <span style={{ color: '#64748b', fontSize: 10 }}>({c.count}) {c.referrals > 0 ? `· ${c.referrals} referrals` : ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        <input value={filters.company} onChange={e => setFilters(f => ({ ...f, company: e.target.value }))} placeholder="Filter by company..." style={inputStyle} />
        <input value={filters.college} onChange={e => setFilters(f => ({ ...f, college: e.target.value }))} placeholder="Filter by college..." style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.referral} onChange={e => setFilters(f => ({ ...f, referral: e.target.checked }))} />
          🤝 Open to Referral
        </label>
        <button onClick={load} style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 10, background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)', cursor: 'pointer' }}>Search</button>
        {(filters.company || filters.college || filters.referral) && (
          <button onClick={() => { setFilters({ company: '', college: '', referral: false }); setTimeout(load, 100); }} style={{ padding: '8px 12px', fontSize: 12, borderRadius: 10, background: 'rgba(244,67,54,0.1)', color: '#f44336', border: '1px solid rgba(244,67,54,0.2)', cursor: 'pointer' }}>✕ Clear</button>
        )}
      </div>

      {/* Add Alumni Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', padding: 20 }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: 'rgba(20,20,40,0.98)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 20, padding: '28px 24px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Add Alumni Profile</span>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <Inp label="Name" v={form.name} s={v => setForm(f => ({ ...f, name: v }))} p="John Doe" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Inp label="Company" v={form.company} s={v => setForm(f => ({ ...f, company: v }))} p="Google" />
              <Inp label="Role" v={form.role} s={v => setForm(f => ({ ...f, role: v }))} p="SDE-2" />
              <Inp label="College" v={form.college} s={v => setForm(f => ({ ...f, college: v }))} p="RSCOE Pune" />
              <Inp label="Batch" v={form.batch} s={v => setForm(f => ({ ...f, batch: v }))} p="2022" />
              <Inp label="Branch" v={form.branch} s={v => setForm(f => ({ ...f, branch: v }))} p="CS" />
              <Inp label="City" v={form.city} s={v => setForm(f => ({ ...f, city: v }))} p="Bangalore" />
            </div>
            <Inp label="LinkedIn" v={form.linkedin} s={v => setForm(f => ({ ...f, linkedin: v }))} p="https://linkedin.com/in/..." />
            <Inp label="Email" v={form.email} s={v => setForm(f => ({ ...f, email: v }))} p="john@company.com" />
            <Inp label="Skills (comma)" v={form.skills} s={v => setForm(f => ({ ...f, skills: v }))} p="React, System Design" />
            <Inp label="Interview Tips" v={form.interviewTips} s={v => setForm(f => ({ ...f, interviewTips: v }))} p="Focus on DSA..." />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
              <input type="checkbox" checked={form.isOpenToReferral} onChange={e => setForm(f => ({ ...f, isOpenToReferral: e.target.checked }))} />
              Open to giving referrals
            </label>
            <button onClick={addAlumni} style={{ ...btnGold, width: '100%' }}>Add Alumni</button>
          </div>
        </div>
      )}

      {/* Alumni Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {alumni.map(a => {
          const requested = a.connectionRequests?.includes(user?.id);
          const connected = a.connections?.includes(user?.id);
          return (
            <div key={a._id} style={{
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 20px',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{a.name}</div>
                  <div style={{ fontSize: 14, color: '#FFD700', marginTop: 2 }}>{a.role} @ {a.company}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>🎓 {a.college} · {a.batch} · {a.branch}</div>
                  {a.city && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>📍 {a.city}</div>}
                </div>
                {a.isOpenToReferral && (
                  <span style={{ fontSize: 10, background: 'rgba(76,175,80,0.1)', color: '#4CAF50', padding: '4px 10px', borderRadius: 8, fontWeight: 600, border: '1px solid rgba(76,175,80,0.2)', flexShrink: 0 }}>🤝 Referral</span>
                )}
              </div>
              {/* Skills */}
              {a.skills?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {a.skills.slice(0, 5).map(s => (
                    <span key={s} style={{ fontSize: 10, background: 'rgba(102,126,234,0.1)', color: '#667eea', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(102,126,234,0.15)' }}>{s}</span>
                  ))}
                </div>
              )}
              {a.interviewTips && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                  💡 {a.interviewTips.slice(0, 120)}{a.interviewTips.length > 120 ? '...' : ''}
                </div>
              )}
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {a.linkedin && <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 10, background: 'rgba(10,102,194,0.1)', color: '#0A66C2', border: '1px solid rgba(10,102,194,0.2)', textDecoration: 'none' }}>🔗 LinkedIn</a>}
                <button onClick={() => connect(a._id)} style={{
                  padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 10, cursor: 'pointer',
                  background: connected ? 'rgba(76,175,80,0.1)' : requested ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)',
                  color: connected ? '#4CAF50' : requested ? '#FFD700' : '#94a3b8',
                  border: `1px solid ${connected ? 'rgba(76,175,80,0.3)' : requested ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.15)'}`,
                }}>
                  {connected ? '✅ Connected' : requested ? '⏳ Pending' : '🤝 Connect'}
                </button>
              </div>
            </div>
          );
        })}
        {alumni.length === 0 && <div style={{ gridColumn: '1 / -1', color: '#64748b', textAlign: 'center', padding: 40 }}>No alumni found. Add alumni profiles to build the directory! 🎓</div>}
      </div>
    </div>
  );
}

function Inp({ label, v, s, p }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
      <input value={v} onChange={e => s(e.target.value)} placeholder={p} style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}

const inputStyle = { padding: '8px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none', width: 180, boxSizing: 'border-box' };
const btnGold = { padding: '10px 20px', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: 12, cursor: 'pointer' };
