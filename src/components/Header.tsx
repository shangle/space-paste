import React from 'react';
import { Camera, Plus, MapPin, Database, Home, Package } from 'lucide-react';
import type { GeoCoords } from '../types';

interface HeaderProps {
  onOpenScanner: () => void;
  onOpenAddLocation: () => void;
  onOpenBackup: () => void;
  onGoHome: () => void;
  onGoStashes: () => void;
  activeView: 'home' | 'stashes';
  stashesCount: number;
  currentCoords: GeoCoords | null;
  geoError: string | null;
  onRefreshGeo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScanner,
  onOpenAddLocation,
  onOpenBackup,
  onGoHome,
  onGoStashes,
  activeView,
  stashesCount,
  currentCoords,
  geoError,
  onRefreshGeo,
}) => {
  return (
    <header style={{ padding: '20px 0 24px 0', borderBottom: '2.5px dashed #CBD5E1', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Unboxed Logo & Brand Title */}
        <div
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          title="Click to go to Home Landing Page"
        >
          {/* Logo SVG brought out of bounding box */}
          <img
            src="/logo.svg"
            alt="Space Paste Logo"
            style={{ height: '64px', width: 'auto', display: 'block', filter: 'drop-shadow(2px 2px 0px #5D4037)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '2.1rem', lineHeight: '1.05', color: 'var(--text-primary)' }}>Space Paste</h1>
              <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                LOCAL-FIRST
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px', fontWeight: 600 }}>
              Physical Location Memory & Acoustic Item Vault
            </p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Home / Stashes Toggle Buttons */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-subtle)', padding: '4px', borderRadius: '12px', border: '1.5px solid #5D4037' }}>
            <button
              onClick={onGoHome}
              className={`btn btn-sm ${activeView === 'home' ? 'btn-gold' : ''}`}
              style={{ border: activeView === 'home' ? 'var(--border-thick)' : 'none', boxShadow: activeView === 'home' ? 'var(--shadow-tactile-sm)' : 'none' }}
            >
              <Home size={15} />
              <span>Home Pitch</span>
            </button>

            <button
              onClick={onGoStashes}
              className={`btn btn-sm ${activeView === 'stashes' ? 'btn-primary' : ''}`}
              style={{ border: activeView === 'stashes' ? 'var(--border-thick)' : 'none', boxShadow: activeView === 'stashes' ? 'var(--shadow-tactile-sm)' : 'none' }}
            >
              <Package size={15} />
              <span>My Stashes ({stashesCount})</span>
            </button>
          </div>

          {/* GPS Proximity Badge */}
          <button
            onClick={onRefreshGeo}
            className="btn btn-sm"
            style={{
              backgroundColor: currentCoords ? '#ECFDF5' : '#FFFBEB',
              borderColor: '#5D4037',
              color: '#5D4037',
              cursor: 'pointer',
            }}
            title={geoError || 'Click to update GPS position'}
          >
            <MapPin size={15} color={currentCoords ? '#047857' : '#B45309'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {currentCoords ? 'GPS Active' : 'GPS Idle'}
            </span>
          </button>

          {/* Backup / Export */}
          <button onClick={onOpenBackup} className="btn btn-sm" title="Data Backup & Export">
            <Database size={15} />
          </button>

          {/* Camera Scanner */}
          <button onClick={onOpenScanner} className="btn btn-accent">
            <Camera size={18} />
            <span>Scan & Match</span>
          </button>

          {/* Add New Location */}
          <button onClick={onOpenAddLocation} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Location</span>
          </button>
        </div>

      </div>
    </header>
  );
};
