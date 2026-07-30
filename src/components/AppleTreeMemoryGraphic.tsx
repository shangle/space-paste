import React from 'react';

export const AppleTreeMemoryGraphic: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: 'var(--border-thick)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-tactile)',
        padding: '24px 16px',
        marginBottom: '32px',
        overflow: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span className="badge badge-orange" style={{ marginBottom: '8px' }}>PHYSICAL CONTEXT HANDOFF</span>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Why Your Brain Needs Space Paste
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
          Stop straining your brain to remember physical spots. Let Space Paste hold the physical tether.
        </p>
      </div>

      {/* 2-Panel Comparison Vector Graphic */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* PANEL 1: WITHOUT SPACE PASTE (Mental Strain) */}
        <div
          style={{
            backgroundColor: '#FFF5F5',
            border: '2px solid #C62828',
            borderRadius: '16px',
            padding: '18px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="badge" style={{ backgroundColor: '#FFEBEE', color: '#C62828', borderColor: '#C62828' }}>
              ❌ WITHOUT SPACE PASTE
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C62828' }}>Cognitive Strain</span>
          </div>

          {/* SVG Illustration: Person walking away + Mental Tether stretching back */}
          <div style={{ width: '100%', height: '210px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #2A1B17', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sky Background & Ground Line */}
              <rect width="400" height="200" fill="#FFF8E1" />
              <line x1="0" y1="165" x2="400" y2="165" stroke="#2A1B17" strokeWidth="3" strokeDasharray="6 6" />

              {/* Apple Tree (Left Side) */}
              <g id="apple-tree">
                {/* Trunk */}
                <path d="M 60 165 L 60 110 Q 60 90 45 80" stroke="#2A1B17" strokeWidth="12" strokeLinecap="round" />
                <path d="M 60 110 Q 60 90 75 80" stroke="#2A1B17" strokeWidth="8" strokeLinecap="round" />
                {/* Foliage Canopy */}
                <circle cx="60" cy="70" r="45" fill="#2E7D32" stroke="#2A1B17" strokeWidth="3" />
                <circle cx="40" cy="80" r="30" fill="#388E3C" stroke="#2A1B17" strokeWidth="3" />
                <circle cx="80" cy="80" r="30" fill="#4CAF50" stroke="#2A1B17" strokeWidth="3" />
                {/* Apples */}
                <circle cx="45" cy="60" r="6" fill="#C62828" stroke="#2A1B17" strokeWidth="1.5" />
                <circle cx="70" cy="50" r="6" fill="#C62828" stroke="#2A1B17" strokeWidth="1.5" />
                <circle cx="35" cy="85" r="6" fill="#C62828" stroke="#2A1B17" strokeWidth="1.5" />
                <circle cx="75" cy="85" r="6" fill="#C62828" stroke="#2A1B17" strokeWidth="1.5" />
              </g>

              {/* Dotted Mental Strain Tether (Stretching from person's head back to Apple Tree) */}
              <path
                d="M 310 90 Q 190 40 60 70"
                stroke="#C62828"
                strokeWidth="3.5"
                strokeDasharray="6 6"
              />

              {/* Brain Bubble / Thought Strain */}
              <g transform="translate(160, 25)">
                <rect x="0" y="0" width="130" height="34" rx="8" fill="#FFEBEE" stroke="#C62828" strokeWidth="2" />
                <text x="65" y="21" fill="#C62828" fontSize="11" fontWeight="bold" textAnchor="middle">
                  🧠 "Where did I leave it?!"
                </text>
              </g>

              {/* Person Walking Away (Right Side) */}
              <g id="person-walking-away" transform="translate(290, 85)">
                {/* Head */}
                <circle cx="20" cy="15" r="12" fill="#FFB300" stroke="#2A1B17" strokeWidth="2.5" />
                {/* Body */}
                <path d="M 20 27 L 20 52" stroke="#2A1B17" strokeWidth="3.5" strokeLinecap="round" />
                {/* Legs (Walking right) */}
                <path d="M 20 52 L 10 75" stroke="#2A1B17" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 20 52 L 32 75" stroke="#2A1B17" strokeWidth="3.5" strokeLinecap="round" />
                {/* Arms (Swinging) */}
                <path d="M 20 35 L 8 48" stroke="#2A1B17" strokeWidth="3" strokeLinecap="round" />
                <path d="M 20 35 L 32 45" stroke="#2A1B17" strokeWidth="3" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.86rem', color: '#2A1B17', fontWeight: 700, lineHeight: '1.4' }}>
            Walking away means your brain is forced to constantly pull back to physical details ("What were the hex key sizes?", "Which podcast episode was I listening to?").
          </div>
        </div>

        {/* PANEL 2: WITH SPACE PASTE (Effortless 1-Tap Recall) */}
        <div
          style={{
            backgroundColor: '#E0F7FA',
            border: '2.5px solid #006978',
            borderRadius: '16px',
            padding: '18px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="badge badge-teal">
              ✨ WITH SPACE PASTE
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#006978' }}>Effortless Handoff</span>
          </div>

          {/* SVG Illustration: Person holding Space Paste + Beacon Radar Ping over Apple Tree */}
          <div style={{ width: '100%', height: '210px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #2A1B17', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sky Background & Ground Line */}
              <rect width="400" height="200" fill="#FFF8E1" />
              <line x1="0" y1="165" x2="400" y2="165" stroke="#2A1B17" strokeWidth="3" />

              {/* Apple Tree (Left Side) with Glowing Radar Ping Beacon */}
              <g id="apple-tree-ping">
                {/* Radar Ping Rings */}
                <circle cx="60" cy="70" r="65" fill="none" stroke="#FFB300" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.8" />
                <circle cx="60" cy="70" r="50" fill="none" stroke="#C74800" strokeWidth="2" opacity="0.6" />
                <circle cx="60" cy="70" r="30" fill="none" stroke="#006978" strokeWidth="2" opacity="0.9" />

                {/* Trunk */}
                <path d="M 60 165 L 60 110 Q 60 90 45 80" stroke="#2A1B17" strokeWidth="12" strokeLinecap="round" />
                <path d="M 60 110 Q 60 90 75 80" stroke="#2A1B17" strokeWidth="8" strokeLinecap="round" />
                {/* Foliage Canopy */}
                <circle cx="60" cy="70" r="45" fill="#2E7D32" stroke="#2A1B17" strokeWidth="3" />
                <circle cx="40" cy="80" r="30" fill="#388E3C" stroke="#2A1B17" strokeWidth="3" />
                <circle cx="80" cy="80" r="30" fill="#4CAF50" stroke="#2A1B17" strokeWidth="3" />
                {/* Apples */}
                <circle cx="45" cy="60" r="6" fill="#C62828" stroke="#2A1B17" strokeWidth="1.5" />
                <circle cx="70" cy="50" r="6" fill="#C62828" stroke="#2A1B17" strokeWidth="1.5" />

                {/* Beacon Target Pin */}
                <g transform="translate(60, 25)">
                  <circle cx="0" cy="0" r="14" fill="#FFB300" stroke="#2A1B17" strokeWidth="2" />
                  <text x="0" y="4" fill="#2A1B17" fontSize="12" textAnchor="middle">📍</text>
                </g>
              </g>

              {/* Person Walking Confidently (Right Side) holding Space Paste */}
              <g id="person-holding-phone" transform="translate(260, 85)">
                {/* Head */}
                <circle cx="20" cy="15" r="12" fill="#FFB300" stroke="#2A1B17" strokeWidth="2.5" />
                {/* Smile */}
                <path d="M 16 18 Q 20 22 24 18" stroke="#2A1B17" strokeWidth="1.5" fill="none" />
                {/* Body */}
                <path d="M 20 27 L 20 52" stroke="#2A1B17" strokeWidth="3.5" strokeLinecap="round" />
                {/* Legs */}
                <path d="M 20 52 L 12 75" stroke="#2A1B17" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 20 52 L 28 75" stroke="#2A1B17" strokeWidth="3.5" strokeLinecap="round" />
                {/* Arm holding phone up */}
                <path d="M 20 35 L 36 30" stroke="#2A1B17" strokeWidth="3" strokeLinecap="round" />

                {/* Smartphone Screen with Apple Tree Card */}
                <g transform="translate(32, 10)">
                  <rect x="0" y="0" width="34" height="52" rx="6" fill="#FFFFFF" stroke="#2A1B17" strokeWidth="2" />
                  <rect x="3" y="3" width="28" height="46" rx="4" fill="#FFF8E1" />
                  {/* Space Paste Rocket Logo Icon */}
                  <text x="17" y="18" fontSize="11" textAnchor="middle">🚀</text>
                  {/* Mini Apple Tree Card inside App */}
                  <rect x="6" y="24" width="22" height="18" rx="3" fill="#E0F7FA" stroke="#006978" strokeWidth="1" />
                  <text x="17" y="36" fontSize="9" textAnchor="middle">🌳</text>
                </g>
              </g>

              {/* Connecting Spatial Signal Line */}
              <path
                d="M 292 95 Q 180 110 74 35"
                stroke="#006978"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.86rem', color: '#2A1B17', fontWeight: 700, lineHeight: '1.4' }}>
            Space Paste holds the physical location tether for you. Open your phone or scan a QR sticker to instantly recall notes, specs, and URLs linked to that physical spot.
          </div>
        </div>

      </div>
    </div>
  );
};
