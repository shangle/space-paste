import React, { useState, useEffect } from 'react';
import { X, Volume2, Copy, QrCode, Share2, Radio, Check, Mic } from 'lucide-react';
import QRCode from 'qrcode';
import type { PhysicalLocation } from '../types';
import { sonicShare } from '../services/sonicShare';
import { sound } from '../services/sound';

interface ShareStashModalProps {
  location: PhysicalLocation;
  onClose: () => void;
  onSelectDetectedLocation?: (code: string) => void;
}

export const ShareStashModal: React.FC<ShareStashModalProps> = ({
  location,
  onClose,
  onSelectDetectedLocation,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'sonic' | 'qr'>('sonic');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  
  // Sonic state
  const [transmitting, setTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [listening, setListening] = useState(false);
  const [detectedMsg, setDetectedMsg] = useState<string | null>(null);

  // Direct short path link: https://spacepaste.app/location-name-or-id
  const directSlug = location.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const shareableUrl = `https://spacepaste.app/${directSlug || location.id}`;

  useEffect(() => {
    QRCode.toDataURL(shareableUrl, { width: 280, margin: 2 }, (err, url) => {
      if (!err && url) setQrDataUrl(url);
    });
  }, [shareableUrl]);

  // Transmit sonic pulse
  const handleTransmitSonic = async () => {
    setTransmitting(true);
    setProgress(0);
    try {
      await sonicShare.transmitCode(location.code, (pct) => setProgress(pct));
      sound.playScanSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setTransmitting(false);
    }
  };

  // Toggle audio listener
  const handleToggleListening = async () => {
    if (listening) {
      sonicShare.stopListening();
      setListening(false);
    } else {
      try {
        setListening(true);
        setDetectedMsg('Listening for acoustic stash pulse from nearby device...');
        await sonicShare.startListening((code) => {
          sound.playScanSuccess();
          setDetectedMsg(`✨ Received acoustic signal: "${code}"`);
          if (onSelectDetectedLocation) {
            onSelectDetectedLocation(code);
          }
        });
      } catch (err: any) {
        alert(`Mic access error: ${err.message}`);
        setListening(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      sonicShare.stopListening();
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Space Paste Stash: ${location.name}`,
        text: `Open ${location.name} stash on Space Paste!`,
        url: shareableUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '2px dashed #E2DCD2', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', backgroundColor: 'var(--bg-subtle)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #1E293B' }}>
              🚀
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Share Stash: {location.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Modular sharing methods to transfer stash to other devices
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: '12px', border: '1.5px solid #1E293B' }}>
          <button
            onClick={() => setActiveTab('sonic')}
            className={`btn btn-sm ${activeTab === 'sonic' ? 'btn-accent' : ''}`}
            style={{ flex: 1 }}
          >
            <Radio size={14} /> Audible Tones
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`btn btn-sm ${activeTab === 'link' ? 'btn-primary' : ''}`}
            style={{ flex: 1 }}
          >
            <Share2 size={14} /> Direct URL
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`btn btn-sm ${activeTab === 'qr' ? 'btn-gold' : ''}`}
            style={{ flex: 1 }}
          >
            <QrCode size={14} /> QR Code
          </button>
        </div>

        {/* Sonic Audio Sharing Tab */}
        {activeTab === 'sonic' && (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: 'var(--border-thick)', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Volume2 size={20} color="var(--accent-rocket)" /> Sonic Stash Pulse
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              Transmit this stash code over audio frequency tones! Receiving devices listen with their microphone to automatically open the stash.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleTransmitSonic}
                className="btn btn-accent"
                disabled={transmitting}
                style={{ width: '100%', padding: '12px' }}
              >
                <Radio className={transmitting ? 'spin' : ''} size={18} />
                <span>{transmitting ? `Broadcasting Tones (${progress}%)...` : '🔊 Broadcast Acoustic Signal'}</span>
              </button>

              <button
                onClick={handleToggleListening}
                className={`btn ${listening ? 'btn-gold' : 'btn-navy'}`}
                style={{ width: '100%', padding: '10px' }}
              >
                <Mic size={16} />
                <span>{listening ? 'Stop Microphone Receiver' : '🎙️ Listen for Incoming Signal'}</span>
              </button>
            </div>

            {detectedMsg && (
              <div style={{ marginTop: '14px', padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1.5px solid #1E293B', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {detectedMsg}
              </div>
            )}
          </div>
        )}

        {/* Direct Link Tab */}
        {activeTab === 'link' && (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: 'var(--border-thick)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Direct Stash URL
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                readOnly
                value={shareableUrl}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #1E293B',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF',
                }}
              />
              <button onClick={handleCopyLink} className="btn btn-primary">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button onClick={handleNativeShare} className="btn btn-navy" style={{ width: '100%' }}>
              <Share2 size={16} /> Share via Apps / OS Sheet
            </button>
          </div>
        )}

        {/* QR Code Tab */}
        {activeTab === 'qr' && (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: 'var(--border-thick)', textAlign: 'center' }}>
            {qrDataUrl && (
              <div style={{ display: 'inline-block', padding: '12px', backgroundColor: '#FFFFFF', border: '2px solid #1E293B', borderRadius: '12px', marginBottom: '12px' }}>
                <img src={qrDataUrl} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Scan this QR code with any camera or Space Paste to instantly open this stash.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
