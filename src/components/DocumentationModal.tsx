import React from 'react';
import { X, BookOpen, ShieldCheck, Camera, MapPin } from 'lucide-react';

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '2px dashed #2A1B17', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '1.6rem', backgroundColor: 'var(--color-astro-turquoise)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-thick)', color: '#FFFFFF' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Space Paste Launch Guide</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>
                Complete Product Documentation & Tech Specs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
          
          <section>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-orbit-orange)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Local-First Architecture
            </h4>
            <p>
              Space Paste stores 100% of location data, notes, image snapshots, and photo signatures locally inside your browser's IndexedDB engine. No account setup required, zero tracking servers, and works fully offline in flight mode.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-rocket-red)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={16} /> In-Browser Perceptual Photo Signatures
            </h4>
            <p>
              When snapping a photo of your desk, workbench, or coffee bar, Space Paste extracts a 64-bit grayscale perceptual luminance hash and a 4×4 spatial color distribution matrix. During live camera scans, canvas frame comparison computes a weighted similarity score (75% structural + 25% color) to match your physical spot without sending photos anywhere.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-deep-brown)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> GPS Proximity Engine
            </h4>
            <p>
              Using the browser Geolocation API, Space Paste tags physical locations with latitude and longitude coordinates. Whenever you open the app, it calculates Haversine distances to order your physical stashes from nearest to farthest.
            </p>
          </section>

          <section>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-retro-yellow)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
