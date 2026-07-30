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
    <header style={{ padding: '16px 0 20px 0', borderBottom: '2px dashed #CBD5E1', marginBottom: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Brand & Logo Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div
            onClick={onGoHome}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            title="Click to go to Home Landing Page"
          >
            <img
              src="/logo.svg"
              alt="Space Paste Logo"
              style={{ height: '48px', width: 'auto', display: 'block', filter: 'drop-shadow(1.5px 1.5px 0px #2A1B17)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '1.8rem', lineHeight: '1', color: 'var(--text-primary)' }}>Space Paste</h1>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  LOCAL-FIRST
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px', fontWeight: 600 }}>
                Physical Location Memory & Item Vault
              </p>
            </div>
          </div>

          {/* Home / Stashes View Navigation Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: '10px', border: '1.5px solid #2A1B17' }}>
            <button
              onClick={onGoHome}
              className={`btn btn-sm ${activeView === 'home' ? 'btn-gold' : ''}`}
              style={{ border: activeView === 'home' ? 'var(--border-thick)' : 'none', boxShadow: 'none' }}
            >
              <Home size={14} />
              <span>Home Pitch</span>
            </button>

            <button
              onClick={onGoStashes}
              className={`btn btn-sm ${activeView === 'stashes' ? 'btn-primary' : ''}`}
              style={{ border: activeView === 'stashes' ? 'var(--border-thick)' : 'none', boxShadow: 'none' }}
            >
              <Package size={14} />
              <span>My Stashes ({stashesCount})</span>
            </button>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          
          <button onClick={onOpenScanner} className="btn btn-accent" style={{ flex: '1 1 140px' }}>
            <Camera size={18} />
            <span>Scan & Match</span>
          </button>

          <button onClick={onOpenAddLocation} className="btn btn-primary" style={{ flex: '1 1 140px' }}>
            <Plus size={18} />
            <span>+ Add Location</span>
          </button>

          <button
            onClick={onRefreshGeo}
            className="btn btn-sm"
            style={{
              backgroundColor: currentCoords ? '#ECFDF5' : '#FFFBEB',
              borderColor: '#2A1B17',
              color: '#2A1B17',
            }}
            title={geoError || 'Click to update GPS position'}
          >
            <MapPin size={14} color={currentCoords ? '#047857' : '#B45309'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {currentCoords ? 'GPS Active' : 'GPS Idle'}
            </span>
          </button>

          <button onClick={onOpenBackup} className="btn btn-sm" title="Data Backup & Export">
            <Database size={14} />
          </button>

        </div>

      </div>
    </header>
  );
};
