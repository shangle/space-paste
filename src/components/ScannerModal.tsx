import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, QrCode, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';
import type { PhysicalLocation } from '../types';
import { extractPhotoSignature, calculateSignatureMatch } from '../services/vision';
import { sound } from '../services/sound';

interface ScannerModalProps {
  locations: PhysicalLocation[];
  onClose: () => void;
  onSelectLocation: (location: PhysicalLocation) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  locations,
  onClose,
  onSelectLocation,
}) => {
  const [activeTab, setActiveTab] = useState<'dual' | 'qr' | 'photo'>('dual');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scanning, setScanning] = useState(true);
  const [statusMsg, setStatusMsg] = useState('Position QR code or physical spot in frame...');
  const [matchResult, setMatchResult] = useState<{ location: PhysicalLocation; score: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animFrameId: number;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err: any) {
          setError(`Camera access error: ${err.message || 'Permission denied'}`);
          setScanning(false);
          return;
        }
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
        scanLoop();
      }
    }

    startCamera();

    let lastPhotoMatchTime = 0;

    function scanLoop() {
      if (!scanning || !videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        animFrameId = requestAnimationFrame(scanLoop);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 1. QR Scan Pass
        if (activeTab === 'dual' || activeTab === 'qr') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imgData.data, imgData.width, imgData.height);

          if (qrCode && qrCode.data) {
            const codeStr = qrCode.data.toLowerCase();
            const matched = locations.find((l) =>
              codeStr.includes(l.id.toLowerCase()) ||
              codeStr.includes(l.code.toLowerCase()) ||
              l.code.toLowerCase().includes(codeStr)
            );

            if (matched) {
              sound.playScanSuccess();
              onSelectLocation(matched);
              return;
            }
          }
        }

        // 2. Photo Signature Matching Pass (runs every 600ms)
        const now = Date.now();
        if ((activeTab === 'dual' || activeTab === 'photo') && now - lastPhotoMatchTime > 600) {
          lastPhotoMatchTime = now;
          try {
            const currentSig = extractPhotoSignature(video).signature;

            let bestMatch: PhysicalLocation | null = null;
            let highestScore = 0;

            for (const loc of locations) {
              if (loc.photoSignature) {
                const simScore = calculateSignatureMatch(currentSig, loc.photoSignature);
                if (simScore > highestScore) {
                  highestScore = simScore;
                  bestMatch = loc;
                }
              }
            }

            if (bestMatch && highestScore >= 72) {
              setMatchResult({ location: bestMatch, score: highestScore });
              setStatusMsg(`Visual Match: ${bestMatch.name} (${highestScore}% match)`);
            } else {
              setMatchResult(null);
              setStatusMsg('Position QR code or physical spot in frame...');
            }
          } catch {
            // Skip frame error
          }
        }
      }

      animFrameId = requestAnimationFrame(scanLoop);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanning, activeTab, locations]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Scan & Match Location</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Recognizes QR stickers & visual desk photo signatures
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('dual')}
            className={`btn btn-sm ${activeTab === 'dual' ? 'btn-primary' : ''}`}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'dual' ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
              color: activeTab === 'dual' ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            <Sparkles size={14} /> Dual Scanner
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
            <QrCode size={14} /> QR Only
          </button>

          <button
            onClick={() => setActiveTab('photo')}
            className={`btn btn-sm ${activeTab === 'photo' ? 'btn-primary' : ''}`}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'photo' ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
              color: activeTab === 'photo' ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            <Camera size={14} /> Photo Match
          </button>
        </div>

        {/* Camera Viewport */}
        {error ? (
          <div style={{ padding: '24px', backgroundColor: '#FFEBEE', border: '2px solid #C62828', borderRadius: '14px', textAlign: 'center' }}>
            <AlertCircle size={32} color="#C62828" style={{ marginBottom: '8px' }} />
            <p style={{ color: '#C62828', fontWeight: 800, fontSize: '0.95rem' }}>{error}</p>
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: 'var(--border-thick)', backgroundColor: '#000000', height: '280px' }}>
            <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Scanner Reticle Overlay */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '180px',
                border: '3px dashed #FFB300',
                borderRadius: '16px',
                boxShadow: '0 0 0 9999px rgba(42, 27, 23, 0.45)',
                pointerEvents: 'none',
              }}
            />

            {/* Visual Match Pop Button */}
            {matchResult && (
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
                <button
                  onClick={() => {
                    sound.playScanSuccess();
                    onSelectLocation(matchResult.location);
                  }}
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                >
                  <Sparkles size={18} /> Open {matchResult.location.name} Vault ({matchResult.score}% match)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 700 }}>
          <RefreshCw size={16} className="spin" color="var(--color-orbit-orange)" />
          <span>{statusMsg}</span>
        </div>

      </div>
    </div>
  );
};
