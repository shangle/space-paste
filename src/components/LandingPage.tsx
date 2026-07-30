import React from 'react';
import { Sparkles, MapPin, Package, Zap, Share2, QrCode, Lock } from 'lucide-react';
import { sound } from '../services/sound';
import { AppleTreeMemoryGraphic } from './AppleTreeMemoryGraphic';

interface LandingPageProps {
  onStartDemo: () => void;
  onOpenAddLocation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDemo,
  onOpenAddLocation,
}) => {
  return (
    <div style={{ padding: '8px 0 40px 0' }}>
      
      {/* Hero Pitch Banner (Opera / Proton Style Agency Grade) */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: 'var(--border-thick)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-tactile)',
          padding: '36px 20px',
          marginBottom: '36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#C7480012 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }} className="badge badge-orange">
            <Sparkles size={14} color="#C74800" />
            <span>THE LOCAL-FIRST PHYSICAL MEMORY VAULT</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.15', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Never Lose Your Place in the Physical World.
          </h1>

          <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '26px', maxWidth: '680px', margin: '0 auto 26px auto', fontWeight: 600 }}>
            Space Paste seamlessly bridges your digital brain to real-world physical locations. Stash podcast episodes, cable guides, torque specs, and passwords directly to physical spots via instant web routes, QR stickers, or AI photo signatures.
          </p>

          {/* Primary CTA Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => {
                sound.playScanSuccess();
                onStartDemo();
              }}
              className="btn btn-accent"
              style={{ padding: '13px 26px', fontSize: '1.05rem' }}
            >
              <Zap size={20} />
              <span>Explore Interactive Demo</span>
            </button>

            <button
              onClick={onOpenAddLocation}
              className="btn btn-primary"
              style={{ padding: '13px 22px', fontSize: '1.05rem' }}
            >
              <Package size={20} />
              <span>+ Create First Location</span>
            </button>
          </div>

        </div>
      </div>

      {/* Apple Tree Physical Location Memory Concept Graphic */}
      <AppleTreeMemoryGraphic />

      {/* Real-World Use Case Scenarios (Podcast Car Story & Workshop) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '8px' }}>REAL-WORLD SCENARIOS</span>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Built for How You Actually Live & Work</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
            How Space Paste solves physical context switching across everyday moments
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Scenario 1: The Car Podcast Handoff */}
          <div className="card-tile" style={{ borderTop: '6px solid var(--color-orbit-orange)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '2.4rem' }}>🚗</span>
                <span className="badge badge-orange">PODCAST HANDOFF</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>The Car Podcast Memory Vault</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: 600 }}>
                You’re listening to an amazing podcast episode on your phone during your drive home. You arrive at your driveway and want to pick up right where you left off tomorrow.
              </p>
              <div style={{ margin: '14px 0', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', border: '1.5px solid #2A1B17', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 700 }}>
                💡 <strong>The Solution:</strong> In the past, you couldn’t "eject" the tape. Now, simply tap your podcast app’s Share button to Space Paste → Car Stash. Next time you step into your car or open <code>spacepaste.app/car</code>, your saved episode is right there.
              </div>
            </div>
          </div>

          {/* Scenario 2: The Garage & Workshop Blueprint */}
          <div className="card-tile" style={{ borderTop: '6px solid var(--color-astro-turquoise)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '2.4rem' }}>🧰</span>
                <span className="badge badge-teal">WORKSHOP BLUEPRINT</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Toolbox & Hardware Specs</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: 600 }}>
                Print a QR sticker label and stick it to your workbench or tool cabinet. Scan it to instantly pull up metric hex key sizes, oil filter part numbers, or wire diagrams.
              </p>
              <div style={{ margin: '14px 0', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', border: '1.5px solid #2A1B17', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 700 }}>
                💡 <strong>No More Searching:</strong> Never search through endless bookmarks or camera roll screenshots while holding a wrench.
              </div>
            </div>
          </div>

          {/* Scenario 3: The Espresso Coffee Station */}
          <div className="card-tile" style={{ borderTop: '6px solid var(--color-retro-yellow)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '2.4rem' }}>☕</span>
                <span className="badge badge-yellow">COFFEE DIAL-IN</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Coffee Bar Grind Settings</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontWeight: 600 }}>
                Snap a quick photo signature of your coffee station. Space Paste matches your espresso machine visually and brings up your dialed-in grind sizes and bean roast dates.
              </p>
              <div style={{ margin: '14px 0', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', border: '1.5px solid #2A1B17', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 700 }}>
                💡 <strong>Visual AI Recognition:</strong> No QR sticker needed — just point your camera at your coffee bar to recall your recipe.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Architecture Grid (Proton / Opera Level Specs) */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', border: 'var(--border-thick)', borderRadius: '20px', padding: '28px 20px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🔒 Privacy & Platform Architecture</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            Proton-grade local privacy combined with native web share integration
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #2A1B17', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={20} color="var(--color-orbit-orange)" />
              <h4 style={{ fontSize: '1rem' }}>100% Local-First Engine</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              All notes, links, and photo hashes remain inside your browser's IndexedDB. Zero cloud surveillance servers.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #2A1B17', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Share2 size={20} color="var(--color-astro-turquoise)" />
              <h4 style={{ fontSize: '1rem' }}>Web Share Target API</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Share URLs directly from iOS Safari or Android Chrome share menus straight into your physical stashes.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #2A1B17', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <QrCode size={20} color="var(--color-rocket-red)" />
              <h4 style={{ fontSize: '1rem' }}>QR Sticker Studio</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Print tactile QR labels formatted for home thermal printers or standard label sheets.
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #2A1B17', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <MapPin size={20} color="var(--color-deep-brown)" />
              <h4 style={{ fontSize: '1rem' }}>GPS Proximity Engine</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Calculates Haversine distance vectors to order your stashes from nearest to farthest as you travel.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
