import React from 'react';
import { Sparkles, Camera, Radio, ShieldCheck, MapPin, Package, Zap, ShoppingBag, BookOpen } from 'lucide-react';
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
    <div style={{ padding: '10px 0 40px 0', animation: 'fadeIn 0.3s ease' }}>
      
      {/* Hero Pitch Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: 'var(--border-thick)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-tactile-lg)',
          padding: '36px 28px',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#F28C3815 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Tagline Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }} className="badge badge-orange">
            <Sparkles size={14} color="#D84315" />
            <span>LOCAL-FIRST PHYSICAL MEMORY & ITEM VAULT</span>
          </div>

          <h1 style={{ fontSize: '2.75rem', lineHeight: '1.15', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Remember Anything at Any Physical Location.
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '28px', maxWidth: '640px', margin: '0 auto 28px auto', fontWeight: 600 }}>
            Space Paste links digital notes, web URLs, cable guides, and checklists to physical real-world spots using QR stickers, photo visual matching, or acoustic sound signals.
          </p>

          {/* Primary Call to Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <button
              onClick={() => {
                sound.playScanSuccess();
                onStartDemo();
              }}
              className="btn btn-accent"
              style={{ padding: '14px 26px', fontSize: '1.05rem' }}
            >
              <Zap size={20} />
              <span>Explore Demo Stashes</span>
            </button>

            <button
              onClick={onOpenAddLocation}
              className="btn btn-primary"
              style={{ padding: '14px 24px', fontSize: '1.05rem' }}
            >
              <Package size={20} />
              <span>+ Create First Stash</span>
            </button>

            <button
              onClick={onOpenMerchDrop}
              className="btn btn-gold"
              style={{ padding: '14px 20px', fontSize: '1.05rem' }}
            >
              <ShoppingBag size={20} />
              <span>Merch Drops</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3 Cosmic Steps Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>How Space Paste Works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>
            3 simple steps to organize physical memory in your office, garage, or kitchen
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div className="card-tile" style={{ borderTop: '6px solid var(--color-orbit-orange)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏷️</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>1. Tag a Physical Spot</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Print a QR sticker label, snap a visual photo signature of your desk/toolbox, or use acoustic sound signals.
            </p>
          </div>

          <div className="card-tile" style={{ borderTop: '6px solid var(--color-astro-turquoise)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>2. Stash Your Info</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Save USB cable notes, coffee grind settings, tire pressure, hex key sizes, or website links to that location.
            </p>
          </div>

          <div className="card-tile" style={{ borderTop: '6px solid var(--color-retro-yellow)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚀</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>3. Scan & Retrieve Instantly</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              When you walk up to your spot or open `spacepaste.app/car`, everything stashed there pops up in milliseconds.
            </p>
          </div>

        </div>
      </div>

      {/* Why Reddit & TechCrunch Users Love Space Paste */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', border: 'var(--border-thick)', borderRadius: '20px', padding: '28px 24px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', textAlign: 'center' }}>⚡ Why Space Paste Hooks Every Power User</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <ShieldCheck size={24} color="var(--color-orbit-orange)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>100% Local-First Privacy</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Everything stays in IndexedDB on your device. Zero cloud surveillance.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Radio size={24} color="var(--color-astro-turquoise)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Acoustic FSK Sound Signals</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Transmit stashes between devices using audible frequency tones.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Camera size={24} color="var(--color-rocket-red)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Desk Photo Signature Matcher</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Takes a quick snap of your desk or coffee station and matches it visually.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <MapPin size={24} color="var(--color-deep-brown)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>GPS Proximity Sorting</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Automatically prioritizes the closest physical stashes to where you are standing.</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ & Launch Documentation Modal Trigger */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={onOpenDocs} className="btn btn-brown" style={{ padding: '12px 22px' }}>
          <BookOpen size={18} />
          <span>Read Full Launch Documentation & FAQ</span>
        </button>
      </div>

    </div>
  );
};
