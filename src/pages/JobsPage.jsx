import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = '/api/jobs';
const JOB_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'campus', label: '🏫 Campus' },
  { value: 'offcampus', label: '🌐 Off-Campus' },
  { value: 'internship', label: '📝 Internship' },
  { value: 'hackathon', label: '🏆 Hackathon' },
  { value: 'referral', label: '🤝 Referral' },
];
const TYPE_COLORS = { campus: '#4CAF50', offcampus: '#2196F3', internship: '#FF9800', hackathon: '#E91E63', referral: '#9C27B0' };

export default function JobsPage() {
  const { authFetch, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState('browse'); // browse | saved
  const [form, setForm] = useState({ company: '', role: '', description: '', ctc: '', stipend: '', location: '', type: 'offcampus', batchEligibility: '', skillsRequired: '', lastDate: '', applyLink: '' });

  useEffect(() => { loadJobs(); }, [filter, tab]);

  const loadJobs = async () => {
    try {
      const url = tab === 'saved' ? `${API}/user/saved` : `${API}?${filter !== 'all' ? `type=${filter}` : ''}${search ? `&search=${search}` : ''}`;
      const r = await authFetch(url);
      const d = await r.json();
      setJobs(Array.isArray(d) ? d : []);
    } catch {}
  };

  const createJob = async () => {
    try {
      const body = {
        ...form,
        batchEligibility: form.batchEligibility.split(',').map(s => s.trim()).filter(Boolean),
        skillsRequired: form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
        lastDate: form.lastDate || undefined,
      };
      await authFetch(API, { method: 'POST', body: JSON.stringify(body) });
      setShowCreate(false); loadJobs();
      setForm({ company: '', role: '', description: '', ctc: '', stipend: '', location: '', type: 'offcampus', batchEligibility: '', skillsRequired: '', lastDate: '', applyLink: '' });
    } catch {}
  };

  const saveJob = async (id) => {
    try { await authFetch(`${API}/${id}/save`, { method: 'POST' }); loadJobs(); } catch {}
  };

  const markApplied = async (id) => {
    try { await authFetch(`${API}/${id}/apply`, { method: 'POST' }); loadJobs(); } catch {}
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>💼 Job Board</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Campus & off-campus opportunities</div>
        </div>
        <button onClick={() => setShowCreate(true)} style={btnGold}>➕ Post Job</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {['browse', 'saved'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', border: 'none', borderRadius: 10, cursor: 'pointer',
            background: tab === t ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
            color: tab === t ? '#000' : '#888', fontWeight: tab === t ? 700 : 400, fontSize: 13,
          }}>{t === 'browse' ? '🔍 Browse' : '💾 Saved'}</button>
        ))}
      </div>

      {/* Search & Filters */}
      {tab === 'browse' && (
        <div style={{ marginBottom: 20 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadJobs()} placeholder="Search companies, roles..."
            style={{ width: '100%', maxWidth: 400, padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {JOB_TYPES.map(t => (
              <button key={t.value} onClick={() => setFilter(t.value)} style={{
                padding: '6px 14px', fontSize: 12, borderRadius: 10,
                border: filter === t.value ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                background: filter === t.value ? 'rgba(255,215,0,0.1)' : 'rgba(15,23,42,0.5)',
                color: filter === t.value ? '#FFD700' : '#94a3b8', cursor: 'pointer',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', padding: 20 }} onClick={() => setShowCreate(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: 'rgba(20,20,40,0.98)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 20, padding: '28px 24px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Post a Job</span>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <Inp label="Company" v={form.company} set={v => setForm(f => ({ ...f, company: v }))} ph="Google" />
            <Inp label="Role" v={form.role} set={v => setForm(f => ({ ...f, role: v }))} ph="SDE Intern" />
            <Inp label="Description" v={form.description} set={v => setForm(f => ({ ...f, description: v }))} ph="Job details..." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Inp label="CTC" v={form.ctc} set={v => setForm(f => ({ ...f, ctc: v }))} ph="12 LPA" />
              <Inp label="Stipend" v={form.stipend} set={v => setForm(f => ({ ...f, stipend: v }))} ph="40K/month" />
              <Inp label="Location" v={form.location} set={v => setForm(f => ({ ...f, location: v }))} ph="Bangalore" />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={selStyle}>
                {JOB_TYPES.filter(t => t.value !== 'all').map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Inp label="Batch Eligibility (comma)" v={form.batchEligibility} set={v => setForm(f => ({ ...f, batchEligibility: v }))} ph="2025, 2026, 2027" />
            <Inp label="Skills Required (comma)" v={form.skillsRequired} set={v => setForm(f => ({ ...f, skillsRequired: v }))} ph="React, Node.js, DSA" />
            <Inp label="Last Date" v={form.lastDate} set={v => setForm(f => ({ ...f, lastDate: v }))} ph="" type="date" />
            <Inp label="Apply Link" v={form.applyLink} set={v => setForm(f => ({ ...f, applyLink: v }))} ph="https://careers.google.com/..." />
            <button onClick={createJob} style={{ ...btnGold, width: '100%', marginTop: 16 }}>Post Job</button>
          </div>
        </div>
      )}

      {/* Job List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {jobs.map(j => {
          const daysLeft = j.lastDate ? Math.ceil((new Date(j.lastDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
          const applied = j.applicants?.includes(user?.id);
          const saved = j.savedBy?.includes(user?.id);
          return (
            <div key={j._id} style={{
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10, padding: '3px 10px', borderRadius: 8, fontWeight: 700,
                      background: `${TYPE_COLORS[j.type] || '#888'}22`, color: TYPE_COLORS[j.type] || '#888',
                      border: `1px solid ${TYPE_COLORS[j.type] || '#888'}44`,
                    }}>{j.type?.toUpperCase()}</span>
                    {j.isFeatured && <span style={{ fontSize: 10, background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '3px 8px', borderRadius: 6 }}>⭐ Featured</span>}
                    {daysLeft !== null && daysLeft <= 3 && daysLeft >= 0 && <span style={{ fontSize: 10, background: 'rgba(244,67,54,0.1)', color: '#f44336', padding: '3px 8px', borderRadius: 6 }}>🔥 {daysLeft}d left</span>}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{j.company}</div>
                  <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 2 }}>{j.role}</div>
                  {j.description && <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 }}>{j.description.slice(0, 150)}{j.description.length > 150 ? '...' : ''}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {j.ctc && <div style={{ fontSize: 18, fontWeight: 800, color: '#4CAF50' }}>{j.ctc}</div>}
                  {j.stipend && <div style={{ fontSize: 14, color: '#FFD700' }}>{j.stipend}</div>}
                  {j.location && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>📍 {j.location}</div>}
                </div>
              </div>
              {/* Skills */}
              {j.skillsRequired?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {j.skillsRequired.map(s => (
                    <span key={s} style={{ fontSize: 11, background: 'rgba(102,126,234,0.1)', color: '#667eea', padding: '3px 10px', borderRadius: 8, border: '1px solid rgba(102,126,234,0.2)' }}>{s}</span>
                  ))}
                </div>
              )}
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                {j.applyLink && <a href={j.applyLink} target="_blank" rel="noreferrer" style={{ ...btnGold, textDecoration: 'none', fontSize: 12, padding: '8px 16px' }}>🔗 Apply</a>}
                <button onClick={() => markApplied(j._id)} style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 10, cursor: 'pointer', border: '1px solid', borderColor: applied ? '#4CAF50' : 'rgba(255,255,255,0.15)', background: applied ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.05)', color: applied ? '#4CAF50' : '#94a3b8' }}>
                  {applied ? '✅ Applied' : '📋 Mark Applied'}
                </button>
                <button onClick={() => saveJob(j._id)} style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 10, cursor: 'pointer', border: '1px solid', borderColor: saved ? '#FFD700' : 'rgba(255,255,255,0.15)', background: saved ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)', color: saved ? '#FFD700' : '#94a3b8' }}>
                  {saved ? '⭐ Saved' : '💾 Save'}
                </button>
              </div>
            </div>
          );
        })}
        {jobs.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>No jobs found. Post one or check back later! 💼</div>}
      </div>
    </div>
  );
}

function Inp({ label, v, set, ph, type = 'text' }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
      <input type={type} value={v} onChange={e => set(e.target.value)} placeholder={ph} style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}

const btnGold = { padding: '10px 20px', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: 12, cursor: 'pointer' };
const selStyle = { width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' };
