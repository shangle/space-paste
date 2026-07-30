import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, MapPin, Sparkles, Check } from 'lucide-react';
import type { PhysicalLocation, GeoCoords } from '../types';
import { getCurrentPosition } from '../services/geo';
import { extractPhotoSignature } from '../services/vision';
import { sound } from '../services/sound';

interface EditLocationModalProps {
  location: PhysicalLocation;
  onClose: () => void;
  onSave: (updatedLocation: PhysicalLocation) => void;
}

const EMOJI_OPTIONS = ['🚗', '💻', '🪑', '🧰', '☕', '📦', '🛏️', '📚', '🔑', '🪴', '🧊', '🎨'];
const COLOR_OPTIONS = ['#C74800', '#006978', '#C62828', '#FFB300', '#2A1B17', '#8E24AA', '#009688', '#3F51B5'];

export const EditLocationModal: React.FC<EditLocationModalProps> = ({
  location,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(location.name);
  const [description, setDescription] = useState(location.description || '');
  const [icon, setIcon] = useState(location.icon || '🚗');
  const [color, setColor] = useState(location.color || '#C74800');
  
  const [coords, setCoords] = useState<GeoCoords | null>(location.coords || null);
  const [fetchingGeo, setFetchingGeo] = useState(false);

  // Photo Signature Capture state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoSnapshot, setPhotoSnapshot] = useState<string | null>(location.photoSnapshot || null);
  const [photoSig, setPhotoSig] = useState<any>(location.photoSignature || null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (cameraActive) {
      async function startCamera() {
        setCameraError(null);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
          });
        } catch {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          } catch (err: any) {
            setCameraError(`Camera error: ${err.message || 'Access denied'}`);
            setCameraActive(false);
            return;
          }
        }

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const handleSnapPhoto = () => {
    if (videoRef.current) {
      try {
        const { signature, snapshotUrl } = extractPhotoSignature(videoRef.current);
        setPhotoSig(signature);
        setPhotoSnapshot(snapshotUrl);
        setCameraActive(false);
        sound.playStashItem();
      } catch (err: any) {
        alert(`Failed to capture photo signature: ${err.message}`);
      }
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

    const updatedLoc: PhysicalLocation = {
      ...location,
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      coords: coords || undefined,
      photoSignature: photoSig || undefined,
      photoSnapshot: photoSnapshot || undefined,
      updatedAt: new Date().toISOString(),
    };

    sound.playStashItem();
    onSave(updatedLoc);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Edit {location.name} Stash</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Update location details, icon, theme, or photo visual signature
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Name & Description Inputs */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>
              Location Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'var(--border-thick)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>
              Description / Specific Spot Details
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'var(--border-thick)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Photo Signature Box */}
          <div style={{ marginBottom: '16px', padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: 'var(--border-thick)' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '6px', display: 'block', color: 'var(--text-primary)' }}>
              Visual Photo Signature:
            </label>

            {photoSnapshot ? (
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #2A1B17' }}>
                <img src={photoSnapshot} alt="Snapshot" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoSnapshot(null);
                    setPhotoSig(null);
                    setCameraActive(true);
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
                  <button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="btn btn-accent"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <Camera size={16} /> Snap Spot Photo Signature
                  </button>
                ) : (
                  <div>
                    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid #2A1B17', backgroundColor: '#000000' }}>
                      <video ref={videoRef} playsInline muted style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    </div>
                    <button
                      type="button"
                      onClick={handleSnapPhoto}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '8px', padding: '10px' }}
                    >
                      📸 Snap Visual Signature
                    </button>
                  </div>
                )}
                {cameraError && (
                  <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#C62828', fontWeight: 700 }}>
                    {cameraError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* GPS Tagging */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                GPS Tagging (Proximity Order)
              </label>
              <button
                type="button"
                onClick={handleFetchLocation}
                className="btn btn-sm"
                disabled={fetchingGeo}
              >
                <MapPin size={14} color="var(--color-astro-turquoise)" />
                <span>{fetchingGeo ? 'Tagging...' : coords ? 'Re-tag GPS' : 'Tag GPS'}</span>
              </button>
            </div>
            {coords && (
              <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> GPS Tagged ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
              </div>
            )}
          </div>

          {/* Icon & Color Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Icon Badge
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setIcon(e)}
                    style={{
                      fontSize: '1.2rem',
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      border: icon === e ? '2.5px solid #2A1B17' : '1px solid #8D6E63',
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
              <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Theme Color
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: color === c ? '3px solid #2A1B17' : '1.5px solid #FFFFFF',
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
            <span>Save Location Changes</span>
          </button>

        </form>

      </div>
    </div>
  );
};
