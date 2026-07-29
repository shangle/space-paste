import React, { useState, useEffect } from 'react';
import { X, Radio, QrCode, Link as LinkIcon, Share, Volume2, Mic, Check } from 'lucide-react';
import QRCode from 'qrcode';
import type { PhysicalLocation } from '../types';
import { sonicShare } from '../services/sonicShare';
import { sound } from '../services/sound';

interface ShareStashModalProps {
  location: PhysicalLocation;
  onClose: () => void;
  onSelectDetectedLocation: (code: string) => void;
}

export const ShareStashModal: React.FC<ShareStashModalProps> = ({
  location,
  onClose,
  onSelectDetectedLocation,
}) => {
  const [activeTab, setActiveTab] = useState<'sonic' | 'link' | 'qr'>('sonic');
  
  // Sonic FSK Broadcasting state
  const [broadcasting, setBroadcasting] = useState(false);

  // Sonic FSK Receiving state
  const [listening, setListening] = useState(false);

  // Direct Link Copy state
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const directUrl = `https://spacepaste.app/${location.id}`;

  useEffect(() => {
    // Generate QR Data URL
    QRCode.toDataURL(directUrl, { width: 280, margin: 2, color: { dark: '#2A1B17', light: '#FFF8E1' } })
      .then(setQrDataUrl)
      .catch(() => {});

    return () => {
      if (listening) {
        sonicShare.stopListening();
      }
    };
  }, [location.id]);

  const handleToggleBroadcast = async () => {
    if (broadcasting) {
      setBroadcasting(false);
    } else {
      setBroadcasting(true);
      sound.playScanSuccess();
      try {
        await sonicShare.transmitCode(location.code);
      } finally {
        setBroadcasting(false);
      }
    }
  };

  const handleToggleListen = async () => {
    if (listening) {
      sonicShare.stopListening();
      setListening(false);
    } else {
      setListening(true);
      try {
        await sonicShare.startListening((detectedCode: string) => {
          sound.playScanSuccess();
          sonicShare.stopListening();
          setListening(false);
          onSelectDetectedLocation(detectedCode);
        });
      } catch {
        setListening(false);
      }
    }
  };

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
      <div className="modal-content" style={{ maxWidth: '580px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '2.5px dashed #2A1B17', paddingBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Share {location.name} Stash</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', fontWeight: 600 }}>
              Modular sound signal, direct link, or QR code
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
          <button
            onClick={() => setActiveTab('sonic')}
            className={`btn btn-sm ${activeTab === 'sonic' ? 'btn-primary' : ''}`}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'sonic' ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
              color: activeTab === 'sonic' ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            <Radio size={15} /> Acoustic Tone
          </button>

          <button
            onClick={() => setActiveTab('link')}
            className={`btn btn-sm ${activeTab === 'link' ? 'btn-primary' : ''}`}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'link' ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
              color: activeTab === 'link' ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            <LinkIcon size={15} /> Direct Link
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
            <QrCode size={15} /> QR Code
          </button>
        </div>

        {/* Sonic Sound Signal Tab */}
        {activeTab === 'sonic' && (
          <div style={{ padding: '18px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: 'var(--border-thick)', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 color="var(--color-orbit-orange)" size={20} /> Acoustic Sound Pulse Transceiver
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px', fontWeight: 600 }}>
              Space Paste uses Frequency Shift Keying (FSK) audio pulses to transmit stash location codes directly through device speakers & microphones!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={handleToggleBroadcast}
                className={`btn ${broadcasting ? 'btn-red' : 'btn-accent'}`}
                style={{ padding: '12px' }}
              >
                <Volume2 size={18} />
                <span>{broadcasting ? 'Transmitting...' : '🔊 Broadcast Tone'}</span>
              </button>

              <button
                onClick={handleToggleListen}
                className={`btn ${listening ? 'btn-red' : 'btn-gold'}`}
                style={{ padding: '12px' }}
              >
                <Mic size={18} />
                <span>{listening ? 'Stop Listening' : '🎙️ Receive Tone'}</span>
              </button>
            </div>

            {broadcasting && (
              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#FFFDE7', borderRadius: '8px', border: '1.5px solid #FFB300', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, color: '#C74800' }}>
                📡 Transmitting sound pulse payload... Bring receiving phone nearby!
              </div>
            )}

            {listening && (
              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1.5px solid #047857', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, color: '#047857' }}>
                🎙️ Listening for incoming acoustic stash signals...
              </div>
            )}
          </div>
        )}

        {/* Direct Link Tab */}
        {activeTab === 'link' && (
          <div style={{ padding: '18px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: 'var(--border-thick)', marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Direct Stash URL Route:
            </label>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                readOnly
                value={directUrl}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #2A1B17',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)',
                }}
              />
              <button onClick={handleCopyLink} className="btn btn-accent">
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button onClick={handleNativeShare} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Share size={16} /> Share via Phone App Sheet
            </button>
          </div>
        )}

        {/* QR Code Tab */}
        {activeTab === 'qr' && (
          <div style={{ textAlign: 'center', padding: '18px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: 'var(--border-thick)', marginBottom: '16px' }}>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                style={{ width: '200px', height: '200px', borderRadius: '12px', border: 'var(--border-thick)', marginBottom: '12px' }}
              />
            )}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Scan this QR code with any camera phone to open {location.name} vault instantly.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
