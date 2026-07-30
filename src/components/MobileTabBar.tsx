import React from 'react';
import { Home, Package, Camera, Plus, Search } from 'lucide-react';

interface MobileTabBarProps {
  activeView: 'home' | 'stashes';
  stashesCount: number;
  onGoHome: () => void;
  onGoStashes: () => void;
  onOpenScanner: () => void;
  onOpenAddLocation: () => void;
  onToggleSearch: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeView,
  stashesCount,
  onGoHome,
  onGoStashes,
  onOpenScanner,
  onOpenAddLocation,
  onToggleSearch,
}) => {
  return (
    <nav
      className="mobile-tab-bar"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderTop: '2.5px solid #2A1B17',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900,
        boxShadow: '0 -4px 16px rgba(42, 27, 23, 0.15)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <button
        onClick={onGoHome}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeView === 'home' ? 'var(--color-orbit-orange)' : 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <Home size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>Home</span>
      </button>

      <button
        onClick={onGoStashes}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeView === 'stashes' ? 'var(--color-astro-turquoise)' : 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
          position: 'relative',
        }}
      >
        <Package size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>Stashes ({stashesCount})</span>
      </button>

      <button
        onClick={onOpenScanner}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--color-rocket-red)',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-orbit-orange)',
            color: '#FFFFFF',
            border: '2px solid #2A1B17',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-16px',
            boxShadow: 'var(--shadow-tactile-sm)',
          }}
        >
          <Camera size={20} />
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>Scan</span>
      </button>

      <button
        onClick={onOpenAddLocation}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--color-astro-turquoise)',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <Plus size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>+ Stash</span>
      </button>

      <button
        onClick={onToggleSearch}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <Search size={20} />
        <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>Search</span>
      </button>
    </nav>
  );
};
