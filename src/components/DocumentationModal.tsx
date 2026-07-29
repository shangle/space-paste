import React from 'react';
import { X, BookOpen, ShieldCheck, Radio, Camera, MapPin } from 'lucide-react';

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '2.5px dashed #5D4037', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.8rem', backgroundColor: 'var(--color-astro-turquoise)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-thick)', color: '#FFFFFF' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Space Paste Launch Guide</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                Complete Product Documentation & Tech Specs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
          
          <section>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-orbit-orange)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Local-First Architecture
            </h4>
            <p>
              Space Paste stores 100% of location data, notes, image snapshots, and photo signatures locally inside your browser's IndexedDB engine. No account setup required, zero tracking servers, and works fully offline in flight mode.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-astro-turquoise)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={18} /> Sonic Stash FSK Audio Tones
            </h4>
            <p>
              Space Paste can convert stash location payloads into acoustic Frequency Shift Keying (FSK) sine-wave audio bursts. Bring any receiving phone near your speaker with the Sonic Listener active, and the microphone FFT spectrum analyzer decodes the stash code in real-time.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-rocket-red)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={18} /> In-Browser Perceptual Photo Signatures
            </h4>
            <p>
              When snapping a photo of your desk, workbench, or coffee bar, Space Paste extracts a 64-bit grayscale perceptual luminance hash and a 4×4 spatial color distribution matrix. During live camera scans, canvas frame comparison computes a weighted similarity score (75% structural + 25% color) to match your physical spot without sending photos anywhere.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-deep-brown)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={18} /> GPS Proximity Engine
            </h4>
            <p>
              Using the browser Geolocation API, Space Paste tags physical locations with latitude and longitude coordinates. Whenever you open the app, it calculates Haversine distances to order your physical stashes from nearest to farthest.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-retro-yellow)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔗 Direct URL Routing (`spacepaste.app/car`)
            </h4>
            <p>
              Visiting `https://spacepaste.app/car` or `/#/car` immediately matches and opens the Car Stash vault on load.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
