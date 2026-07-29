import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface DomainResearchModalProps {
  onClose: () => void;
}

export const DomainResearchModal: React.FC<DomainResearchModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '2px dashed #E2DCD2', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', backgroundColor: 'var(--bg-subtle)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #1F2421' }}>
              🌐
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Short Domain & Best QR Code Guide</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Optimized domain names under $30/year budget
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Core Concept Explanation */}
        <div style={{ backgroundColor: '#EBF5FF', border: '2px solid #2563EB', borderRadius: '12px', padding: '14px 16px', marginBottom: '18px' }}>
          <h4 style={{ color: '#1E40AF', fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Why Short URLs Make Better QR Codes
          </h4>
          <p style={{ color: '#1E3A8A', fontSize: '0.86rem', lineHeight: '1.45' }}>
            QR code matrix density is strictly determined by URL character count. Shorter URLs produce <strong>Version 1 QR codes (21×21 grid)</strong> with larger dots, maximum contrast, high scannability from a distance, and an ultra-clean visual look on physical stickers!
          </p>
        </div>

        {/* Domain Comparison Table */}
        <h4 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>🏆 Top Short Domain Recommendations (&lt;$30/yr)</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          
          {/* Option 1: Sta.sh */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-tactile-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>Sta.sh</span>
                <span className="badge badge-green">Version 1 QR (21×21)</span>
              </div>
              <span style={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.9rem' }}>~$25 / yr</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Clever Domain Hack:</strong> Encodes as <code>https://sta.sh/s1</code> (17 chars). Best tactile feel and ultra-minimal QR matrix!
            </p>
          </div>

          {/* Option 2: QRst.app */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-tactile-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-navy)' }}>QRst.app</span>
                <span className="badge badge-green">Version 1 QR (21×21)</span>
              </div>
              <span style={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.9rem' }}>~$14 / yr</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Short for "QR Stash". Includes automatic HTTPS HSTS security. Very affordable annual renewal!
            </p>
          </div>

          {/* Option 3: Stsh.co */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-tactile-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-sage)' }}>Stsh.co</span>
                <span className="badge badge-green">Version 1 QR (21×21)</span>
              </div>
              <span style={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.9rem' }}>~$22 / yr</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Classic startup vibe. Encodes as <code>https://stsh.co/1</code> (16 chars).
            </p>
          </div>

          {/* Option 4: QStash.link */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)', borderRadius: '12px', padding: '14px', boxShadow: 'var(--shadow-tactile-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>QStash.link</span>
                <span className="badge badge-blue">Version 2 QR (25×25)</span>
              </div>
              <span style={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.9rem' }}>~$12 / yr</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Direct utility domain extension for linking physical stashes.
            </p>
          </div>

        </div>

        {/* Buying Advice */}
        <div style={{ borderTop: '1.5px dashed #E2DCD2', paddingTop: '14px' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>💡 Registrar Buying Tip</h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            We recommend purchasing via <strong>Porkbun</strong> or <strong>Cloudflare Registrar</strong>. Both offer zero markup on renewals, free WHOIS privacy protection, and transparent pricing under $30/yr.
          </p>
        </div>

      </div>
    </div>
  );
};
