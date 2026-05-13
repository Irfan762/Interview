import { useState } from 'react';
import { 
  IconClose, IconPhone, IconCard, IconBank, 
  IconQR, IconLock, IconChevronRight, IconCheck 
} from './Icons';

export default function PaymentModal({ plan, amount, onSuccess, onClose }) {
  const [step, setStep] = useState('methods'); // methods | upi | card | processing | success

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Payment for {plan}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{amount}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
            <IconClose size={20} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {step === 'methods' && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 16 }}>Select Payment Method</div>
              <MethodBtn icon={<IconPhone size={24} />} label="UPI (Google Pay, PhonePe)" onClick={() => setStep('upi')} />
              <MethodBtn icon={<IconCard size={24} />} label="Debit / Credit Card" onClick={() => setStep('card')} />
              <MethodBtn icon={<IconBank size={24} />} label="Net Banking" onClick={handlePay} />
            </div>
          )}

          {step === 'upi' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 20 }}>Scan QR to Pay</div>
              <div style={{ width: 160, height: 160, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', color: '#94a3b8' }}>
                <IconQR size={80} />
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Open any UPI App (GPay, PhonePe, BHIM) to scan</div>
              <button onClick={handlePay} style={payBtn}>Simulate Payment Success</button>
            </div>
          )}

          {step === 'card' && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 16 }}>Enter Card Details</div>
              <input placeholder="Card Number" style={inpStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                <input placeholder="MM/YY" style={inpStyle} />
                <input placeholder="CVV" style={inpStyle} />
              </div>
              <button onClick={handlePay} style={{ ...payBtn, marginTop: 24 }}>Pay {amount}</button>
            </div>
          )}

          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={spinnerStyle}></div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginTop: 20 }}>Processing Payment...</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>Please do not close this window</div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', animation: 'scaleUp 0.5s ease-out' }}>
                <IconCheck size={36} color="white" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginTop: 24 }}>Payment Successful!</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Your subscription has been upgraded</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IconLock size={12} /> Secure 256-bit SSL Encrypted Payment
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function MethodBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', marginBottom: 10, transition: 'all 0.2s', color: '#64748b' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#667eea'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
    >
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{label}</span>
      <span style={{ marginLeft: 'auto', display: 'flex' }}><IconChevronRight size={16} /></span>
    </button>
  );
}

const inpStyle = { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1e293b' };
const payBtn = { width: '100%', padding: '14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' };
const spinnerStyle = { width: 40, height: 40, border: '4px solid #f1f5f9', borderTopColor: '#667eea', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' };
