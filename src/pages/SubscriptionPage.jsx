import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { IconRocket, IconShield, IconCheck } from '../components/Icons';

export default function SubscriptionPage() {
  const { user, authFetch, updateUser } = useAuth();
  const [loading, setLoading] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const navigate = useNavigate();

  const completeSubscription = async (plan) => {
    console.log('Finalizing subscription for:', plan);
    setLoading(plan);
    try {
      const r = await authFetch('/api/auth/subscribe', {
        method: 'POST',
        body: JSON.stringify({ plan })
      });
      const d = await r.json();
      if (r.ok || d.subscription) { 
        updateUser(d);
        setActivePlan(null);
        navigate('/');
      }
    } catch (err) {
      console.error('Sub error:', err);
      if (user?.id?.startsWith('demo_')) {
        updateUser({ subscription: plan });
        setActivePlan(null);
        navigate('/');
      } else {
        alert('Subscription failed. Try again.');
      }
    } finally {
      setLoading(null);
    }
  };

  const PLANS = [
    {
      id: 'basic',
      name: 'Core Preparation',
      price: '₹50',
      features: [
        '1-4-7 Tracker access',
        'AI Resume Analysis',
        'AI Interview Roadmap',
        'Public & Private Communities',
        'Placement Tips & Tricks'
      ],
      color: '#667eea',
      btn: 'Get Access'
    },
    {
      id: 'premium',
      name: 'Networking Master',
      price: '₹100',
      features: [
        'All Core Prep features',
        'Full Alumni Network access',
        'Direct Alumni Connections',
        'Priority Referral access',
        'Personal Networking guide'
      ],
      color: '#FFD700',
      btn: 'Unlock Everything'
    }
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 12 }}>
          <IconRocket size={32} color="#FFD700" />
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>Choose Your Path to Success</h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: 16 }}>Invest in your career with our affordable placement ecosystem</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {PLANS.map((p) => {
          const isCurrent = user?.subscription === p.id;
          return (
            <div key={p.id} style={{
              background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)',
              border: `1px solid ${isCurrent ? p.color : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 24, padding: '32px 24px', position: 'relative',
              display: 'flex', flexDirection: 'column',
              transition: 'all 0.3s',
            }}>
              {isCurrent && <div style={{ position: 'absolute', top: 12, right: 12, background: p.color, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20 }}>ACTIVE</div>}
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: p.color, marginBottom: 20 }}>{p.price} <span style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>/one-time</span></div>
              
              <div style={{ flex: 1, textAlign: 'left', marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IconCheck size={16} color={p.color} /> {f}
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent || (loading && loading !== p.id)}
                onClick={() => { console.log('Selecting plan:', p.name); setActivePlan(p); }}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                  background: isCurrent ? 'rgba(255,255,255,0.05)' : p.color,
                  color: isCurrent ? '#64748b' : '#000',
                  fontWeight: 800, cursor: isCurrent ? 'default' : 'pointer',
                  fontSize: 14, transition: 'all 0.2s',
                }}
                onMouseEnter={e => !isCurrent && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => !isCurrent && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading === p.id ? 'Processing...' : isCurrent ? 'Current Plan' : p.btn}
              </button>
            </div>
          );
        })}
      </div>

      {activePlan && (
        <PaymentModal
          plan={activePlan.name}
          amount={activePlan.price}
          onSuccess={() => completeSubscription(activePlan.id)}
          onClose={() => setActivePlan(null)}
        />
      )}

      <div style={{ marginTop: 40, color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <IconShield size={16} /> Secure Payment · One-time fee for life access
      </div>
    </div>
  );
}
