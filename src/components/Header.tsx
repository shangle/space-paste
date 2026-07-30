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
  showMobileSearch: boolean;
  onToggleMobileSearch: () => void;
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
  showMobileSearch,
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
    <header className="app-header" style={{ padding: '12px 0 16px 0', borderBottom: '2px dashed #CBD5E1', marginBottom: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Top App Brand & Navigation Row (Ultra-Compact on Mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Logo & Brand Title */}
          <div
            onClick={onGoHome}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            title="Space Paste - Home"
          >
            <img
              src="/logo.svg"
              alt="Space Paste Logo"
              style={{ height: '38px', width: 'auto', display: 'block', filter: 'drop-shadow(1.5px 1.5px 0px #2A1B17)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '1.5rem', lineHeight: '1', color: 'var(--text-primary)' }}>Space Paste</h1>
                <span className="badge badge-teal" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                  LOCAL-FIRST
                </span>
              </div>
              <p className="desktop-only-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px', fontWeight: 600 }}>
                Physical Location Memory & Item Vault
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile as bottom dock takes over) */}
          <div className="desktop-nav-tabs" style={{ gap: '4px', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: '10px', border: '1.5px solid #2A1B17' }}>
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

          {/* Quick Header Right Actions (GPS Badge + Backup) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onRefreshGeo}
              className="btn btn-sm"
              style={{
                backgroundColor: currentCoords ? '#ECFDF5' : '#FFFBEB',
                borderColor: '#2A1B17',
                color: '#2A1B17',
                padding: '4px 8px',
                fontSize: '0.75rem',
              }}
              title={geoError || 'Click to update GPS position'}
            >
              <MapPin size={13} color={currentCoords ? '#047857' : '#B45309'} />
              <span style={{ fontWeight: 700 }}>
                {currentCoords ? 'GPS Active' : 'GPS Idle'}
              </span>
            </button>

            <button onClick={onOpenBackup} className="btn btn-sm" style={{ padding: '6px' }} title="Data Backup & Export">
              <Database size={14} />
            </button>
          </div>

        </div>

        {/* Search Bar Row (Always visible on desktop, expandable on mobile) */}
        {(showMobileSearch || window.innerWidth >= 640) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: '1', position: 'relative' }}>
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
          </div>
        )}

        {/* Desktop Workspace Action Toolbar */}
        <div className="desktop-toolbar" style={{ alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={onOpenScanner} className="btn btn-accent">
            <Camera size={16} />
            <span>Scan & Match</span>
          </button>

          <button onClick={onOpenAddLocation} className="btn btn-primary">
            <Plus size={16} />
            <span>+ Add Location</span>
          </button>
        </div>

      </div>
    </header>
  );
};
