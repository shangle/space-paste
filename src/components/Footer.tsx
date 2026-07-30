import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onGoHome: () => void;
  onGoStashes: () => void;
  onOpenAddLocation: () => void;
  onOpenBackup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onGoStashes,
  onOpenAddLocation,
  onOpenBackup,
}) => {
  return (
    <footer
      style={{
        marginTop: '60px',
        borderTop: '2.5px solid #2A1B17',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px 20px 0 0',
        padding: '36px 20px 80px 20px', // Extra bottom padding for mobile navigation bar
        boxShadow: '0 -4px 12px rgba(42, 27, 23, 0.05)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top Footer Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', marginBottom: '32px' }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <img src="/logo.svg" alt="Space Paste" style={{ height: '36px', width: 'auto' }} />
              <span style={{ fontFamily: 'var(--font-groovy)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Space Paste
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: 600, marginBottom: '14px' }}>
              Never lose your place in the physical world. Stash podcast episodes, cable guides, torque specs, and passwords directly to physical spots.
            </p>
            <div className="badge badge-teal" style={{ fontSize: '0.74rem' }}>
              <ShieldCheck size={14} /> 100% LOCAL-FIRST INDEXEDDB
            </div>
          </div>

          {/* Column 2: Vault Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vault Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
              <li>
                <button onClick={onGoHome} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  🏠 Home Product Overview
                </button>
              </li>
              <li>
                <button onClick={onGoStashes} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  📦 My Physical Stashes
                </button>
              </li>
              <li>
                <button onClick={onOpenAddLocation} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ➕ Tag New Physical Location
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Resources & Data */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resources & Data
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
              <li>
                <button onClick={onOpenBackup} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  💾 Backup & Restore JSON Vault
                </button>
              </li>
              <li>
                <a href="https://spacepaste.app/car" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  🚗 Car Route (`spacepaste.app/car`)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Open Source & Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Open Source
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
              <li>
                <a
                  href="https://github.com/shangle/space-paste"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://shangle.github.io/space-paste/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  🌐 GitHub Pages Deployment
                </a>
              </li>
              <li>
                <a
                  href="https://spacepaste.app/"
                  style={{ color: 'var(--color-orbit-orange)', textDecoration: 'none' }}
                >
                  ✨ spacepaste.app Domain
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div style={{ borderTop: '1.5px dashed #CBD5E1', paddingTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <div>
            © {new Date().getFullYear()} <strong>Space Paste</strong>. All physical memory stored locally on device.
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <span>Privacy-First</span>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>WCAG AAA 100/100</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
