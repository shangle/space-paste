import React from 'react';
import { Camera, Plus, MapPin, Database } from 'lucide-react';
import type { GeoCoords } from '../types';

interface HeaderProps {
  onOpenScanner: () => void;
  onOpenAddLocation: () => void;
  onOpenBackup: () => void;
  currentCoords: GeoCoords | null;
  geoError: string | null;
  onRefreshGeo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScanner,
  onOpenAddLocation,
  onOpenBackup,
  currentCoords,
  geoError,
  onRefreshGeo,
}) => {
  return (
    <header style={{ padding: '20px 0 28px 0', borderBottom: '2.5px dashed #CBD5E1', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Space Paste Minimalist Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-tactile-sm)',
              overflow: 'hidden',
              backgroundColor: '#FAF6EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
            }}
          >
            <img src="/logo.svg" alt="Space Paste Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.85rem', lineHeight: '1.1', color: 'var(--text-primary)' }}>Space Paste</h1>
              <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                LOCAL-FIRST
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px', fontWeight: 600 }}>
              Physical Location Memory & Acoustic Item Vault
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* GPS Proximity Badge */}
          <button
            onClick={onRefreshGeo}
            className="btn btn-sm"
            style={{
              backgroundColor: currentCoords ? '#ECFDF5' : '#FFFBEB',
              borderColor: '#1E293B',
              color: '#1E293B',
              cursor: 'pointer',
            }}
            title={geoError || 'Click to update GPS position'}
          >
            <MapPin size={15} color={currentCoords ? '#047857' : '#B45309'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {currentCoords ? 'GPS Active (Proximity Sorted)' : 'GPS Idle (Tap to Enable)'}
            </span>
          </button>

          {/* Backup / Export */}
          <button onClick={onOpenBackup} className="btn btn-sm">
            <Database size={16} />
            <span>Data</span>
          </button>

          {/* Camera & Photo Scanner */}
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
