import React from 'react';
import { Sparkles, Camera, ShieldCheck, MapPin, Package, Zap, ShoppingBag, BookOpen } from 'lucide-react';
import { sound } from '../services/sound';

interface LandingPageProps {
  onStartDemo: () => void;
  onOpenAddLocation: () => void;
  onOpenMerchDrop: () => void;
  onOpenDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDemo,
  onOpenAddLocation,
  onOpenMerchDrop,
  onOpenDocs,
}) => {
  return (
    <div style={{ padding: '8px 0 32px 0' }}>
      
      {/* Hero Pitch Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: 'var(--border-thick)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-tactile)',
          padding: '28px 18px',
          marginBottom: '28px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }} className="badge badge-orange">
            <Sparkles size={14} color="#C74800" />
            <span>LOCAL-FIRST PHYSICAL MEMORY VAULT</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', lineHeight: '1.18', marginBottom: '14px', color: 'var(--text-primary)' }}>
            Remember Anything at Any Physical Location.
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '22px', maxWidth: '600px', margin: '0 auto 22px auto', fontWeight: 600 }}>
            Space Paste links digital notes, web URLs, cable guides, and checklists to physical real-world spots using QR stickers or photo visual matching.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => {
                sound.playScanSuccess();
                onStartDemo();
              }}
              className="btn btn-accent"
              style={{ padding: '12px 22px', fontSize: '1rem' }}
            >
              <Zap size={18} />
              <span>Explore Demo Stashes</span>
            </button>

            <button
              onClick={onOpenAddLocation}
              className="btn btn-primary"
              style={{ padding: '12px 20px', fontSize: '1rem' }}
            >
              <Package size={18} />
              <span>+ Create First Stash</span>
            </button>

            <button
              onClick={onOpenMerchDrop}
              className="btn btn-gold"
              style={{ padding: '12px 18px', fontSize: '1rem' }}
            >
              <ShoppingBag size={18} />
              <span>Merch Portal</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3 Steps Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>How Space Paste Works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            Organize physical memory in your office, garage, car, or kitchen
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          
          <div className="card-tile" style={{ borderTop: '5px solid var(--color-orbit-orange)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>🏷️</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>1. Tag a Physical Spot</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Print a QR sticker label or snap a visual photo signature of your desk/toolbox.
            </p>
          </div>

          <div className="card-tile" style={{ borderTop: '5px solid var(--color-astro-turquoise)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>📝</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>2. Stash Your Info</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Save USB cable notes, coffee grind settings, tire pressure, or website links.
            </p>
          </div>

          <div className="card-tile" style={{ borderTop: '5px solid var(--color-retro-yellow)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>🚀</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>3. Scan & Retrieve Instantly</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              When you walk up to your spot or open `spacepaste.app/car`, everything pops up instantly.
            </p>
          </div>

        </div>
      </div>

      {/* Differentiators Section */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', border: 'var(--border-thick)', borderRadius: '16px', padding: '22px 18px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', textAlign: 'center' }}>⚡ Key Platform Features</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <ShieldCheck size={22} color="var(--color-orbit-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>100% Local-First Privacy</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Everything stays in IndexedDB on your device. Zero cloud tracking.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Camera size={22} color="var(--color-rocket-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Desk Photo Signature Matcher</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Takes a quick snap of your desk or workbench and matches it visually.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <MapPin size={22} color="var(--color-deep-brown)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>GPS Proximity Sorting</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Automatically prioritizes the closest physical stashes to where you are standing.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Docs Button */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={onOpenDocs} className="btn btn-brown" style={{ padding: '12px 20px' }}>
          <BookOpen size={18} />
          <span>Read Full Launch Documentation & FAQ</span>
        </button>
      </div>

    </div>
  );
};
