import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, QrCode, Sparkles, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import type { PhysicalLocation } from '../types';
import { extractPhotoSignature, calculateSignatureMatch } from '../services/vision';
import { sound } from '../services/sound';

interface ScannerModalProps {
  locations: PhysicalLocation[];
  onClose: () => void;
  onSelectLocation: (loc: PhysicalLocation) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  locations,
  onClose,
  onSelectLocation,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [activeTab, setActiveTab] = useState<'dual' | 'qr' | 'photo'>('dual');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoMatch, setPhotoMatch] = useState<{ location: PhysicalLocation; score: number } | null>(null);
  const [statusMsg, setStatusMsg] = useState('Point camera at a QR code or your desk/physical spot...');

  // Start Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setCameraError('Unable to access camera. Check permissions or select a location manually below.');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Frame Processing Loop for QR & Photo Matching
  useEffect(() => {
    if (!cameraActive) return;

    let animFrameId: number;
    let lastPhotoCheckTime = 0;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // 1. QR Code Scan Attempt
          if (activeTab === 'dual' || activeTab === 'qr') {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (qrCode) {
              const matchedLoc = locations.find((l) => l.code === qrCode.data || qrCode.data.includes(l.id));
              if (matchedLoc) {
                sound.playScanSuccess();
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
                onSelectLocation(matchedLoc);
                return;
              } else {
                setStatusMsg(`QR Code detected: "${qrCode.data.slice(0, 24)}..." (Not linked to location)`);
              }
            }
          }

          // 2. Photo Signature Matching Attempt (Throttle to every 500ms)
          const now = Date.now();
          if ((activeTab === 'dual' || activeTab === 'photo') && now - lastPhotoCheckTime > 500) {
            lastPhotoCheckTime = now;

            try {
              const { signature } = extractPhotoSignature(video);
              let bestLoc: PhysicalLocation | null = null;
              let maxScore = 0;

              for (const loc of locations) {
                if (loc.photoSignature) {
                  const score = calculateSignatureMatch(signature, loc.photoSignature);
                  if (score > maxScore) {
                    maxScore = score;
                    bestLoc = loc;
                  }
                }
              }

              // Threshold for photo matching: 80% similarity
              if (bestLoc && maxScore >= 80) {
                setPhotoMatch({ location: bestLoc, score: maxScore });
                setStatusMsg(`✨ High photo match! Found "${bestLoc.name}" (${maxScore}% match)`);
              } else if (bestLoc && maxScore >= 65) {
                setPhotoMatch({ location: bestLoc, score: maxScore });
                setStatusMsg(`Photo similarity: "${bestLoc.name}" (${maxScore}%). Move closer to match.`);
              } else {
                setPhotoMatch(null);
                if (activeTab === 'photo') {
                  setStatusMsg('Scanning physical spot... Move camera to match your desk or location.');
                }
              }
            } catch {
              // Frame reading fallback
            }
          }
        }
      }

      animFrameId = requestAnimationFrame(processFrame);
    };

    animFrameId = requestAnimationFrame(processFrame);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [cameraActive, activeTab, locations, onSelectLocation]);

  const handleConfirmPhotoMatch = () => {
    if (photoMatch) {
      sound.playScanSuccess();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onSelectLocation(photoMatch.location);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={22} color="var(--accent-terracotta)" />
            <h2 style={{ fontSize: '1.4rem' }}>Physical Location Scanner</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: '12px', border: '1.5px solid #1F2421' }}>
          <button
            onClick={() => setActiveTab('dual')}
            className={`btn btn-sm ${activeTab === 'dual' ? 'btn-primary' : ''}`}
            style={{ flex: 1, border: activeTab === 'dual' ? 'var(--border-thick)' : 'none', boxShadow: activeTab === 'dual' ? 'var(--shadow-tactile-sm)' : 'none' }}
          >
            <Sparkles size={14} /> Dual Auto Match
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`btn btn-sm ${activeTab === 'qr' ? 'btn-primary' : ''}`}
            style={{ flex: 1, border: activeTab === 'qr' ? 'var(--border-thick)' : 'none', boxShadow: activeTab === 'qr' ? 'var(--shadow-tactile-sm)' : 'none' }}
          >
            <QrCode size={14} /> QR Code Only
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`btn btn-sm ${activeTab === 'photo' ? 'btn-primary' : ''}`}
            style={{ flex: 1, border: activeTab === 'photo' ? 'var(--border-thick)' : 'none', boxShadow: activeTab === 'photo' ? 'var(--shadow-tactile-sm)' : 'none' }}
          >
            <Camera size={14} /> Desk Photo Match
          </button>
        </div>

        {/* Camera Viewport Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            backgroundColor: '#000000',
            borderRadius: '16px',
            overflow: 'hidden',
            border: 'var(--border-thick)',
            boxShadow: 'var(--shadow-tactile)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Scanner Overlay HUD */}
          {cameraActive && (
            <div
              style={{
                position: 'absolute',
                inset: '0',
                border: '2px dashed rgba(255, 255, 255, 0.4)',
                margin: '24px',
                borderRadius: '16px',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* QR Reticle */}
              {activeTab !== 'photo' && (
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    border: '3px solid var(--accent-gold)',
                    borderRadius: '16px',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                  }}
                />
              )}
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#FFFFFF' }}>
              <AlertCircle size={36} color="var(--accent-terracotta)" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '0.95rem', marginBottom: '12px' }}>{cameraError}</p>
            </div>
          )}
        </div>

        {/* Live Status Message & Photo Match Indicator */}
        <div style={{ marginTop: '16px' }}>
          {photoMatch && photoMatch.score >= 80 ? (
            <div
              style={{
                backgroundColor: '#E8F5E9',
                border: '2px solid #2E7D32',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={24} color="#2E7D32" />
                <div>
                  <div style={{ fontWeight: 700, color: '#1B5E20' }}>
                    Matched "{photoMatch.location.name}"! ({photoMatch.score}% similarity)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#2E7D32' }}>
                    Physical spot recognized from photo signature.
                  </div>
                </div>
              </div>
              <button onClick={handleConfirmPhotoMatch} className="btn btn-sm btn-primary">
                Open Stash
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid #1F2421',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RefreshCw size={14} className="spin" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        {/* Manual Location Selection Fallback */}
        <div style={{ borderTop: '1.5px dashed #E2DCD2', marginTop: '18px', paddingTop: '14px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Or select a location manually from your list:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  sound.playScanSuccess();
                  onSelectLocation(loc);
                }}
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <span>{loc.icon}</span>
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
