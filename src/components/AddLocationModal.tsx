import React, { useState, useRef } from 'react';
import { X, QrCode, Camera, MapPin, Sparkles, Check } from 'lucide-react';
import type { PhysicalLocation, GeoCoords } from '../types';
import { getCurrentPosition } from '../services/geo';
import { extractPhotoSignature } from '../services/vision';
import { sound } from '../services/sound';

interface AddLocationModalProps {
  onClose: () => void;
  onSave: (location: PhysicalLocation) => void;
}

const EMOJI_OPTIONS = ['💻', '🪑', '🧰', '☕', '📦', '🛏️', '📚', '🚗', '🔑', '🪴', '🧊', '🎨'];
const COLOR_OPTIONS = ['#4F46E5', '#D97706', '#059669', '#DC2626', '#2563EB', '#7C3AED', '#DB2777', '#4B5563'];

export const AddLocationModal: React.FC<AddLocationModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('💻');
  const [color, setColor] = useState('#4F46E5');
  const [mode, setMode] = useState<'qr' | 'photo'>('qr');
  
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [fetchingGeo, setFetchingGeo] = useState(false);

  // Photo Signature Capture state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoSnapshot, setPhotoSnapshot] = useState<string | null>(null);
  const [photoSig, setPhotoSig] = useState<any>(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      alert('Camera access failed. Check permissions.');
    }
  };

  const handleSnapPhoto = () => {
    if (videoRef.current) {
      const { signature, snapshotUrl } = extractPhotoSignature(videoRef.current);
      setPhotoSig(signature);
      setPhotoSnapshot(snapshotUrl);

      // Stop camera stream after snap
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
      sound.playStashItem();
    }
  };

  const handleFetchLocation = async () => {
    setFetchingGeo(true);
    try {
      const pos = await getCurrentPosition();
      setCoords(pos);
    } catch (err: any) {
      alert(`GPS Error: ${err.message}`);
    } finally {
      setFetchingGeo(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `loc_${Date.now()}`;
    const code = `sta.sh/${id}`;
    const now = new Date().toISOString();

    const newLoc: PhysicalLocation = {
      id,
      name: name.trim(),
      description: description.trim(),
      code,
      icon,
      color,
      coords: coords || undefined,
      photoSignature: photoSig || undefined,
      photoSnapshot: photoSnapshot || undefined,
      createdAt: now,
      updatedAt: now,
    };

    sound.playStashItem();
    onSave(newLoc);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Add New Physical Location</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Create a stash for your desk, toolbox, pantry, or coffee table
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Recognition Type Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Recognition Method:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => setMode('qr')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: mode === 'qr' ? 'var(--border-thick)' : '1.5px solid #E2DCD2',
                  backgroundColor: mode === 'qr' ? '#EBF5FF' : 'var(--bg-card)',
                  boxShadow: mode === 'qr' ? 'var(--shadow-tactile-sm)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <QrCode size={24} color="var(--accent-navy)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>QR Sticker Code</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Print/scan a QR label</div>
                </div>
              </div>

              <div
                onClick={() => setMode('photo')}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: mode === 'photo' ? 'var(--border-thick)' : '1.5px solid #E2DCD2',
                  backgroundColor: mode === 'photo' ? '#FFF3E0' : 'var(--bg-card)',
                  boxShadow: mode === 'photo' ? 'var(--shadow-tactile-sm)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Camera size={24} color="var(--accent-terracotta)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Photo Signature</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Snap desk/spot photo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Snap Capture Box if Photo Mode */}
          {mode === 'photo' && (
            <div style={{ marginBottom: '18px', padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1.5px solid #1F2421' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                Desk/Spot Visual Snapshot:
              </label>

              {photoSnapshot ? (
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #1F2421' }}>
                  <img src={photoSnapshot} alt="Snapshot" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoSnapshot(null);
                      setPhotoSig(null);
                    }}
                    className="btn btn-sm"
                    style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#FFFFFF' }}
                  >
                    Retake Photo
                  </button>
                </div>
              ) : (
                <div>
                  {!cameraActive ? (
                    <button type="button" onClick={handleStartCamera} className="btn btn-accent" style={{ width: '100%' }}>
                      <Camera size={18} /> Open Camera to Snap Spot
                    </button>
                  ) : (
                    <div>
                      <video ref={videoRef} playsInline muted style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid #1F2421' }} />
                      <button type="button" onClick={handleSnapPhoto} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                        📸 Snap Visual Signature
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Name & Description Inputs */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Location Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work Desk, Workshop Drawer B, Coffee Station"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'var(--border-thick)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Description / Specific Spot
            </label>
            <input
              type="text"
              placeholder="e.g. Under monitor riser, left compartment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'var(--border-thick)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Geolocation Tagging */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                GPS Tagging (For Proximity Sorting)
              </label>
              <button
                type="button"
                onClick={handleFetchLocation}
                className="btn btn-sm"
                disabled={fetchingGeo}
              >
                <MapPin size={14} color="var(--accent-sage)" />
                <span>{fetchingGeo ? 'Tagging...' : coords ? 'Re-tag GPS' : 'Tag Current GPS'}</span>
              </button>
            </div>
            {coords && (
              <div style={{ fontSize: '0.8rem', color: '#2E7D32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> GPS Tagged ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
              </div>
            )}
          </div>

          {/* Icon & Color Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Icon Badge
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setIcon(e)}
                    style={{
                      fontSize: '1.3rem',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: icon === e ? '2px solid #1F2421' : '1px solid #E2DCD2',
                      backgroundColor: icon === e ? 'var(--bg-subtle)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Theme Color
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: color === c ? '3px solid #1F2421' : '1px solid #FFFFFF',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <Sparkles size={18} />
            <span>Create Physical Location Stash</span>
          </button>

        </form>

      </div>
    </div>
  );
};
