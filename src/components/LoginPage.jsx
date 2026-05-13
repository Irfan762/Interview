import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  IconLightning, IconAlumni as IconStudent, IconShield as IconAdmin, 
  IconRocket, IconShield 
} from './Icons';

const API = '/api';

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [roleTab, setRoleTab] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', batch: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, college: form.college, batch: form.batch, branch: form.branch, role: roleTab };
      const res = await fetch(`${API}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      login(data.user, data.token);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const demoLogin = (role) => {
    const demos = {
      student: { id: 'demo_student', name: 'Demo Student', email: 'demo@student.com', role: 'student', college: 'RSCOE Pune', batch: '2027', subscription: 'premium' },
      admin: { id: 'demo_admin', name: 'Admin User', email: 'admin@cracki.com', role: 'admin', college: 'System', batch: '' },
    };
    login(demos[role], 'demo_token');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: "'Inter', system-ui, sans-serif", padding: 20,
    }}>
      <div style={{
        width: '100%', maxWidth: 460, background: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,215,0,0.2)', borderRadius: 24, padding: '40px 36px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ color: '#FFD700', display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <IconLightning size={48} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CracKInterview</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Campus Placement Ecosystem</div>
        </div>

        {/* Role Selection */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 12, textAlign: 'center', letterSpacing: 1 }}>LOGIN AS</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { key: 'student', Icon: IconStudent, label: 'Student', desc: 'Track prep & find jobs' },
              { key: 'admin', Icon: IconAdmin, label: 'Admin', desc: 'Manage platform' },
            ].map(r => (
              <button key={r.key} onClick={() => setRoleTab(r.key)} style={{
                flex: 1, padding: '16px 12px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                background: roleTab === r.key ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.06))' : 'rgba(0,0,0,0.2)',
                border: roleTab === r.key ? '2px solid rgba(255,215,0,0.4)' : '2px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s',
              }}>
                <div style={{ color: roleTab === r.key ? '#FFD700' : '#64748b', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                  <r.Icon size={32} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: roleTab === r.key ? '#FFD700' : '#94a3b8' }}>{r.label}</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Login / Register Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, cursor: 'pointer',
              background: mode === m ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
              color: mode === m ? '#000' : '#888', fontWeight: mode === m ? 700 : 400, fontSize: 14,
              transition: 'all 0.2s'
            }}>{m === 'login' ? 'Login' : 'Sign Up'}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <Inp label="Full Name" value={form.name} onChange={v => set('name', v)} placeholder="Irfan Khan" />
              {roleTab === 'student' && (
                <>
                  <Inp label="College" value={form.college} onChange={v => set('college', v)} placeholder="RSCOE Pune" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Inp label="Batch" value={form.batch} onChange={v => set('batch', v)} placeholder="2027" />
                    <Inp label="Branch" value={form.branch} onChange={v => set('branch', v)} placeholder="Computer Engg" />
                  </div>
                </>
              )}
            </>
          )}
          <Inp label="Email" type="email" value={form.email} onChange={v => set('email', v)} placeholder={roleTab === 'admin' ? 'admin@cracki.com' : 'you@college.edu'} />
          <Inp label="Password" type="password" value={form.password} onChange={v => set('password', v)} placeholder="••••••••" />

          {error && <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px 0', marginTop: 4, border: 'none', borderRadius: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? 'rgba(255,215,0,0.3)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#000', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 24px rgba(255,215,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            {loading ? 'Please wait...' : (
              <>
                <IconRocket size={20} />
                {mode === 'login' ? `Login as ${roleTab === 'admin' ? 'Admin' : 'Student'}` : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Buttons */}
        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <button onClick={() => demoLogin('student')} style={demoBtn}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <IconStudent size={14} /> Demo Student
            </div>
          </button>
          <button onClick={() => demoLogin('admin')} style={demoBtn}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <IconAdmin size={14} /> Demo Admin
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Inp({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
    </div>
  );
}

const demoBtn = { flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all-0.2s' };
