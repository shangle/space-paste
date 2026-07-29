import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, ShoppingBag, RefreshCw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/sound';

interface MerchDropModalProps {
  onClose: () => void;
}

interface StoredAttempt {
  timestamp: string;
  message: string;
  status: 'QUALIFIED' | 'DENIED';
}

const GMAIL_PHRASES = [
  'DENIED: Your inbox contains 14,291 unread newsletters. Kosmonaut protocol requires clean inbox karma.',
  'QUALIFIED: Gmail power user detected! Cosmic resonance test passed.',
  'DENIED: Google Drive storage is at 99.4%. Clear your spam folder to align cosmic frequency.',
];

const RETRO_PHRASES = [
  'DENIED: You are using a temporal time vortex email from 1999. Please return to 2026 to qualify.',
  'QUALIFIED: Retro legend status! Dial-up modem sounds detected.',
  'DENIED: You’ve got mail! ...But unfortunately no cosmic qualification today.',
];

const APPLE_PHRASES = [
  'QUALIFIED: Your device emitted pure titanium cosmic vibrations!',
  'DENIED: iCloud storage full. Backup your photos before entering deep space.',
];

const EDU_PHRASES = [
  'DENIED: Campus dining hall microwave radiation interfered with your Kosmonaut telemetry signal.',
  'QUALIFIED: Student Kosmonaut signal verified!',
];

const RANDOM_VIRAL_PHRASES = [
  'DENIED: Our AI detected you put pineapple on pizza. Disqualified by Kosmonaut Protocol 7.',
  'QUALIFIED: Your email matched the golden cosmic ratio of Jupiter’s third moon!',
  'DENIED: Your astrological moon sign collided with Mercury in retrograde. Try again in 48 hours.',
  'QUALIFIED: Solar flare alignment passed with 99.8% precision!',
  'DENIED: You tapped the button with your left thumb instead of your right index finger.',
  'QUALIFIED: Telepathic signal received! You are Kosmonaut #4,209 in cosmic alignment.',
  'DENIED: Too much cosmic static in your area. Walk 3 steps to the left and retry.',
  'QUALIFIED: High-gravity orbital pass confirmed. Welcome to the Space Paste Crew!',
  'DENIED: You haven’t drank enough water today. Hydrate to qualify for deep space travel.',
  'QUALIFIED: Cosmic resonance test passed with flying colors!',
];

function formatTimeAgo(isoTimestamp: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoTimestamp).getTime()) / 1000);
  if (diffSec < 10) return 'just a few seconds ago';
  if (diffSec < 60) return `${diffSec} seconds ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
}

export const MerchDropModal: React.FC<MerchDropModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [stepMsg, setStepMsg] = useState('Initializing Kosmonaut scanner...');
  const [result, setResult] = useState<{ status: 'QUALIFIED' | 'DENIED'; message: string; isRepeat?: boolean } | null>(null);

  const handleCheckQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || checking) return;

    setChecking(true);
    setResult(null);

    const steps = [
      'Scanning email domain frequency...',
      'Analyzing orbital inbox karma...',
      'Checking solar flare alignment...',
      'Verifying Kosmonaut resonance...',
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setStepMsg(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
        finalizeResult();
      }
    }, 550);
  };

  const finalizeResult = () => {
    setChecking(false);
    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1] || '';

    let signupRecords: Record<string, StoredAttempt[]> = {};
    try {
      signupRecords = JSON.parse(localStorage.getItem('spacepaste_merch_signups') || '{}');
    } catch {
      signupRecords = {};
    }

    const previousAttempts = signupRecords[cleanEmail] || [];
    const attemptCount = previousAttempts.length;

    let selectedMsg = '';
    let isQualified = false;
    let isRepeat = false;

    if (attemptCount > 0) {
      isRepeat = true;
      const lastAttempt = previousAttempts[previousAttempts.length - 1];
      const timeAgoStr = formatTimeAgo(lastAttempt.timestamp);

      if (attemptCount === 1) {
        selectedMsg = `⚠️ You already tested '${cleanEmail}' ${timeAgoStr}! Result: ${lastAttempt.message}`;
        isQualified = lastAttempt.status === 'QUALIFIED';
      } else if (attemptCount === 2) {
        const firstTimeAgo = formatTimeAgo(previousAttempts[0].timestamp);
        selectedMsg = `🤨 Seriously? You've tested '${cleanEmail}' twice already (${firstTimeAgo} & ${timeAgoStr}). Cosmic physics hasn't changed.`;
        isQualified = false;
      } else if (attemptCount === 3) {
        selectedMsg = `😮‍💨 *Exhausted Kosmonaut AI sigh*... Attempt #4 for '${cleanEmail}'. Repetitive testing won't alter your solar flare status!`;
        isQualified = false;
      } else {
        selectedMsg = `🧊 DEEP CRYO-SLEEP LOCKOUT: Attempt #${attemptCount + 1} for '${cleanEmail}'. This test signal is locked in stasis until 2126.`;
        isQualified = false;
      }
    } else {
      if (domain.includes('gmail')) {
        selectedMsg = GMAIL_PHRASES[Math.floor(Math.random() * GMAIL_PHRASES.length)];
      } else if (domain.includes('yahoo') || domain.includes('aol') || domain.includes('hotmail')) {
        selectedMsg = RETRO_PHRASES[Math.floor(Math.random() * RETRO_PHRASES.length)];
      } else if (domain.includes('apple') || domain.includes('icloud') || domain.includes('me.com')) {
        selectedMsg = APPLE_PHRASES[Math.floor(Math.random() * APPLE_PHRASES.length)];
      } else if (domain.includes('.edu')) {
        selectedMsg = EDU_PHRASES[Math.floor(Math.random() * EDU_PHRASES.length)];
      } else {
        selectedMsg = RANDOM_VIRAL_PHRASES[Math.floor(Math.random() * RANDOM_VIRAL_PHRASES.length)];
      }
      isQualified = selectedMsg.startsWith('QUALIFIED');
    }

    const outcomeStatus = isQualified ? 'QUALIFIED' : 'DENIED';

    const newAttempt: StoredAttempt = {
      timestamp: new Date().toISOString(),
      message: selectedMsg,
      status: outcomeStatus,
    };
    signupRecords[cleanEmail] = [...previousAttempts, newAttempt];
    localStorage.setItem('spacepaste_merch_signups', JSON.stringify(signupRecords));

    setResult({ status: outcomeStatus, message: selectedMsg, isRepeat });

    if (isQualified && !isRepeat) {
      sound.playScanSuccess();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } else {
      sound.playStashItem();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '2.5px dashed #2A1B17', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '2rem', backgroundColor: 'var(--color-orbit-orange)', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-thick)', color: '#FFF8E1' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Kosmonaut Compatibility Portal</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', fontWeight: 600 }}>
                App Features Are 100% FREE • Zero Marketing Signups
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Informational Banner */}
        <div style={{ backgroundColor: 'var(--bg-subtle)', border: 'var(--border-thick)', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 600 }}>
            🚀 <strong>Space Paste app is 100% free with unlimited local storage</strong>. Physical merch is currently in research & development. Test your email below to scan your Kosmonaut cosmic frequency score! <em>(Note: No emails are subscribed to marketing lists).</em>
          </p>
        </div>

        {/* Qualification Checker Form */}
        <form onSubmit={handleCheckQualification} style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 800, display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>
            Enter Email for Kosmonaut Frequency Check:
          </label>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="email"
              required
              placeholder="kosmonaut@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={checking}
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'var(--border-thick)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" className="btn btn-accent" disabled={checking}>
              <Sparkles size={16} />
              <span>{checking ? 'Scanning...' : 'Test Signal'}</span>
            </button>
          </div>
        </form>

        {/* Live Loading Simulation */}
        {checking && (
          <div style={{ padding: '16px', backgroundColor: '#FFFDE7', border: '2px solid #E65100', borderRadius: '12px', textAlign: 'center', marginBottom: '16px' }}>
            <RefreshCw size={24} className="spin" color="#E65100" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#E65100' }}>{stepMsg}</p>
          </div>
        )}

        {/* Qualification Result Output */}
        {result && (
          <div
            style={{
              padding: '18px',
              borderRadius: '14px',
              border: result.status === 'QUALIFIED' ? '2.5px solid #047857' : '2.5px solid #C62828',
              backgroundColor: result.status === 'QUALIFIED' ? '#ECFDF5' : '#FFEBEE',
              marginBottom: '18px',
              animation: 'popIn 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {result.status === 'QUALIFIED' ? (
                <CheckCircle2 size={26} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={26} color="#C62828" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    marginBottom: '6px',
                    backgroundColor: result.status === 'QUALIFIED' ? '#047857' : '#C62828',
                    color: '#FFFFFF',
                  }}
                >
                  {result.status} {result.isRepeat ? '(RETRY DETECTED)' : ''}
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1.5px dashed #8D6E63', paddingTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <ShieldCheck size={16} color="#047857" />
          <span>Local Kosmonaut Protocol • Space Paste is 100% free to use.</span>
        </div>

      </div>
    </div>
  );
};
