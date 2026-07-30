import React, { useEffect, useRef } from 'react';
import { Camera, Plus, MapPin, Database, Home, Package, Search } from 'lucide-react';
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
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  searchQuery,
  onSearchChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Global Keyboard Shortcut: '/' or 'Cmd+K' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header style={{ padding: '16px 0 20px 0', borderBottom: '2px dashed #CBD5E1', marginBottom: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Top App Brand & Navigation Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Logo & Brand Title */}
          <div
            onClick={onGoHome}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            title="Space Paste - Home"
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

          {/* Navigation Tabs (Home / My Stashes) */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: '10px', border: '1.5px solid #2A1B17' }}>
            <button
              onClick={onGoHome}
              className={`btn btn-sm ${activeView === 'home' ? 'btn-gold' : ''}`}
              style={{ border: activeView === 'home' ? 'var(--border-thick)' : 'none', boxShadow: 'none' }}
            >
              <Home size={14} />
              <span>Home</span>
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

        {/* Workspace Toolbar: Search Bar + Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Global Search Input (Slack/Gmail Style Quick Search) */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Search physical stashes, notes, cables, or links"
              placeholder="Search stashes, notes, cables, links... (/)"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeView !== 'stashes') onGoStashes();
              }}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '10px',
                border: 'var(--border-thick)',
                fontFamily: 'inherit',
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Action Control Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={onOpenScanner} className="btn btn-accent">
              <Camera size={16} />
              <span>Scan & Match</span>
            </button>

            <button onClick={onOpenAddLocation} className="btn btn-primary">
              <Plus size={16} />
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
              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                {currentCoords ? 'GPS Active' : 'GPS Idle'}
              </span>
            </button>

            <button onClick={onOpenBackup} className="btn btn-sm" title="Data Backup & Export">
              <Database size={14} />
            </button>

            <a
              href="https://github.com/shangle/space-paste"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{ padding: '8px 10px' }}
              title="View GitHub Repository & Source Code"
            >
              <svg height="15" width="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>

        </div>

      </div>
    </header>
  );
};
