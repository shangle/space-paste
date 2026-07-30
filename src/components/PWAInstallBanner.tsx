import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Clock, Share, Plus, Sparkles, CheckCircle2, Monitor } from 'lucide-react';
import { sound } from '../services/sound';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  
  // Platform Detection
  const [platform, setPlatform] = useState<'ios-safari' | 'ios-other' | 'android' | 'desktop' | 'native'>('native');

  useEffect(() => {
    // Check if already running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if snoozed (7 days) or dismissed (session)
    const snoozedUntil = localStorage.getItem('spacepaste_install_snoozed_until');
    if (snoozedUntil && Date.now() < Number(snoozedUntil)) {
      return;
    }
    if (sessionStorage.getItem('spacepaste_install_dismissed')) {
      return;
    }

    // Detect OS & Browser
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
    const isAndroid = /Android/.test(ua);

    if (isIOS && isSafari) {
      setPlatform('ios-safari');
    } else if (isIOS) {
      setPlatform('ios-other');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Native Browser Prompt Listener (Chrome, Edge, Opera, Android Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('native');
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If deferred prompt didn't fire (iOS / Desktop Safari), still show banner if not installed
    setTimeout(() => {
      if (!isStandalone) {
        setVisible(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    sound.playStashItem();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        sound.playScanSuccess();
      }
      setDeferredPrompt(null);
      setVisible(false);
    } else {
      // Show device-tailored installation guide modal
      setShowInstructionsModal(true);
    }
  };

  const handleSnooze = () => {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('spacepaste_install_snoozed_until', String(Date.now() + sevenDaysMs));
    setVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('spacepaste_install_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* PWA Install Notification Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: 'var(--border-thick)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-tactile)',
          padding: '14px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 260px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-orbit-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF8E1',
              border: '1.5px solid #2A1B17',
              flexShrink: 0,
            }}
          >
            <Smartphone size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Install Space Paste App</span>
              <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>FAST APP</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
              Add to home screen for 1-tap physical memory access & offline support
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleInstallClick} className="btn btn-sm btn-accent">
            <Download size={14} />
            <span>Install App</span>
          </button>

          <button onClick={handleSnooze} className="btn btn-sm" title="Snooze for 7 days">
            <Clock size={14} />
            <span>Snooze 7d</span>
          </button>

          <button
            onClick={handleDismiss}
            className="btn btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Device-Specific Interactive Installation Guide Modal */}
      {showInstructionsModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '24px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--color-orbit-orange)" />
                <h3 style={{ fontSize: '1.3rem' }}>Install Space Paste</h3>
              </div>
              <button onClick={() => setShowInstructionsModal(false)} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5', fontWeight: 600 }}>
              Space Paste works offline like a native app. Follow the simple steps for your device below:
            </p>

            {/* iOS Safari Instructions */}
            {platform === 'ios-safari' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-orbit-orange)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    Tap the <strong>Share button</strong> <Share size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in Safari's bottom toolbar.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-astro-turquoise)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    Scroll down and select <strong>"Add to Home Screen"</strong> <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} />.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-rocket-red)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>3</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    Tap <strong>"Add"</strong> in the top right corner. Launch from your home screen anytime!
                  </div>
                </div>
              </div>
            )}

            {/* iOS Other Browsers */}
            {platform === 'ios-other' && (
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17', fontSize: '0.88rem', fontWeight: 700, lineHeight: '1.5' }}>
                💡 <strong>iOS Notice:</strong> To install Web Apps on iPhone or iPad, please open <code>https://spacepaste.app</code> in <strong>Safari</strong>, tap <strong>Share</strong>, and tap <strong>"Add to Home Screen"</strong>.
              </div>
            )}

            {/* Android Instructions */}
            {platform === 'android' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17', fontSize: '0.88rem', fontWeight: 700 }}>
                  1. Tap the <strong>3 dots menu (⋮)</strong> in Chrome or your Android browser.
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17', fontSize: '0.88rem', fontWeight: 700 }}>
                  2. Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.
                </div>
              </div>
            )}

            {/* Desktop Instructions */}
            {platform === 'desktop' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #2A1B17', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Monitor size={20} color="var(--color-orbit-orange)" />
                  <div>
                    Click the <strong>Install Icon</strong> in your address bar (right side of URL) or select <strong>File &gt; Add to Dock</strong> in Safari.
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowInstructionsModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
            >
              <CheckCircle2 size={18} /> Got It!
            </button>

          </div>
        </div>
      )}

    </>
  );
};
