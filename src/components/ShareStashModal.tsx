import React, { useState, useEffect } from 'react';
import { X, QrCode, Link as LinkIcon, Share, Check } from 'lucide-react';
import QRCode from 'qrcode';
import type { PhysicalLocation } from '../types';
import { sound } from '../services/sound';

interface ShareStashModalProps {
  location: PhysicalLocation;
  onClose: () => void;
}

export const ShareStashModal: React.FC<ShareStashModalProps> = ({
  location,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const directUrl = `https://spacepaste.app/${location.id}`;

  useEffect(() => {
    QRCode.toDataURL(directUrl, { width: 280, margin: 2, color: { dark: '#2A1B17', light: '#FFF8E1' } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [location.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    sound.playChecklistPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Space Paste Stash: ${location.name}`,
        text: `Open ${location.name} stash physical memory vault on Space Paste`,
        url: directUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '2px dashed #2A1B17', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Share {location.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', fontWeight: 600 }}>
              Share direct URL route or print QR code sticker
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('link')}
            className={`btn btn-sm ${activeTab === 'link' ? 'btn-primary' : ''}`}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'link' ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
              color: activeTab === 'link' ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            <LinkIcon size={15} /> Direct Link Route
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`btn btn-sm ${activeTab === 'qr' ? 'btn-primary' : ''}`}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'qr' ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
              color: activeTab === 'qr' ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            <QrCode size={15} /> QR Code Sticker
          </button>
        </div>

        {/* Direct Link Tab */}
        {activeTab === 'link' && (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: 'var(--border-thick)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Direct Stash URL Route:
            </label>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                readOnly
                value={directUrl}
                style={{
                  flex: '1 1 180px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #2A1B17',
                  fontFamily: 'monospace',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)',
                }}
              />
              <button onClick={handleCopyLink} className="btn btn-accent" style={{ flexShrink: 0 }}>
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button onClick={handleNativeShare} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Share size={16} /> Share via Native Device Sheet
            </button>
          </div>
        )}

        {/* QR Code Tab */}
        {activeTab === 'qr' && (
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: 'var(--border-thick)' }}>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                style={{ width: '180px', height: '180px', borderRadius: '12px', border: 'var(--border-thick)', marginBottom: '12px' }}
              />
            )}
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Scan this QR code with any camera phone to open {location.name} vault instantly.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
