import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Clock } from 'lucide-react';
import { sound } from '../services/sound';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user snoozed prompt (7 days)
    const snoozedUntil = localStorage.getItem('spacepaste_install_snoozed_until');
    if (snoozedUntil && Date.now() < Number(snoozedUntil)) {
      return;
    }

    // Check if dismissed for current session
    if (sessionStorage.getItem('spacepaste_install_dismissed')) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback detection if browser supports PWA but didn't trigger prompt yet
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone && !snoozedUntil && !sessionStorage.getItem('spacepaste_install_dismissed')) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        sound.playScanSuccess();
      }
      setDeferredPrompt(null);
      setVisible(false);
    } else {
      alert('To install Space Paste as an app on iOS or Mobile:\n\n1. Tap the Share button in Safari / Chrome.\n2. Select "Add to Home Screen".');
      setVisible(false);
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
  );
};
