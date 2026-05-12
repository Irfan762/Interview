import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = '/api/ai';

export default function AIAnalyzerPage() {
  const { authFetch } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!resumeText.trim() || !jdText.trim()) { setError('Please paste both resume and JD text'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await authFetch(`${API}/analyze`, { method: 'POST', body: JSON.stringify({ resumeText, jdText, company, role, interviewDate }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Analysis failed');
      setResult(d.analysis);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>🤖 AI Resume & JD Analyzer</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Get a personalized preparation roadmap powered by AI</div>
      </div>

      {!result ? (
        /* Input Form */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={labelStyle}>📄 Paste Your Resume Text</label>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume content here...\n\nName, education, skills, projects, experience..." rows={14} style={textareaStyle} />
          </div>
          <div>
            <label style={labelStyle}>📋 Paste Job Description</label>
            <textarea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste the job description here...\n\nRole, requirements, skills, responsibilities..." rows={14} style={textareaStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={labelStyle}>🏢 Company</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Google" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>💼 Role</label>
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="SDE Intern" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>📅 Interview Date</label>
              <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {error && <div style={{ gridColumn: '1 / -1', background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 12, padding: '10px 16px', color: '#f44336', fontSize: 13 }}>{error}</div>}

          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={analyze} disabled={loading} style={{
              width: '100%', padding: '16px 0', border: 'none', borderRadius: 14,
              background: loading ? 'rgba(255,215,0,0.2)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#000', fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(255,215,0,0.3)', transition: 'all 0.3s',
            }}>
              {loading ? '⏳ Analyzing with AI... (may take 10-15s)' : '🚀 Analyze & Generate Roadmap'}
            </button>
          </div>
        </div>
      ) : (
        /* Results */
        <div>
          <button onClick={() => setResult(null)} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontSize: 14, marginBottom: 20, fontWeight: 600 }}>← New Analysis</button>

          {/* Readiness Score */}
          <div style={{
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '32px 28px', marginBottom: 24, textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 12 }}>Interview Readiness Score</div>
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="70" cy="70" r="60" fill="none"
                  stroke={result.readinessScore >= 75 ? '#4CAF50' : result.readinessScore >= 50 ? '#FFD700' : '#f44336'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(result.readinessScore / 100) * 377} 377`}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: result.readinessScore >= 75 ? '#4CAF50' : result.readinessScore >= 50 ? '#FFD700' : '#f44336' }}>{result.readinessScore}%</span>
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 16, maxWidth: 500, margin: '16px auto 0', lineHeight: 1.6 }}>{result.summary}</div>
          </div>

          {/* Skills Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <SkillBox title="✅ Strong Skills" skills={result.strongSkills} color="#4CAF50" />
            <SkillBox title="⚠️ Missing Skills" skills={result.missingSkills} color="#f44336" />
          </div>

          {/* Interview Rounds & Questions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>🏁 Expected Interview Rounds</div>
              {result.interviewRounds?.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{r}</span>
                </div>
              ))}
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>DSA Level: <span style={{ color: '#FFD700', fontWeight: 600 }}>{result.dsaLevel?.toUpperCase()}</span></div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>❓ Likely Questions</div>
              {result.likelyQuestions?.map((q, i) => (
                <div key={i} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, marginBottom: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>
                  {i + 1}. {q}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Plan */}
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>📅 Your Personalized Daily Plan</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {result.dailyPlan?.map(day => (
                <div key={day.day} style={{
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '16px 18px',
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, marginBottom: 10,
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>Day {day.day}</div>
                  {day.tasks?.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>
                      <span style={{ color: '#667eea', flexShrink: 0 }}>•</span>
                      {t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillBox({ title, skills, color }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {skills?.map(s => (
          <span key={s} style={{
            fontSize: 12, padding: '5px 12px', borderRadius: 10,
            background: `${color}15`, color: color,
            border: `1px solid ${color}33`, fontWeight: 500,
          }}>{s}</span>
        ))}
        {(!skills || skills.length === 0) && <span style={{ fontSize: 13, color: '#64748b' }}>None detected</span>}
      </div>
    </div>
  );
}

const cardStyle = { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '22px 22px' };
const labelStyle = { fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 };
const textareaStyle = { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' };
const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
