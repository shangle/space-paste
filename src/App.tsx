import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LocationCard } from './components/LocationCard';
import { ScannerModal } from './components/ScannerModal';
import { AddLocationModal } from './components/AddLocationModal';
import { EditLocationModal } from './components/EditLocationModal';
import { LocationDetailModal } from './components/LocationDetailModal';
import { QRPrintModal } from './components/QRPrintModal';
import { BackupModal } from './components/BackupModal';
import { ShareStashModal } from './components/ShareStashModal';
import { MerchDropModal } from './components/MerchDropModal';
import { DocumentationModal } from './components/DocumentationModal';
import { LandingPage } from './components/LandingPage';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Footer } from './components/Footer';
import { MobileTabBar } from './components/MobileTabBar';

import type { PhysicalLocation, GeoCoords } from './types';
import { getAllLocationsWithCounts, saveLocation, updateLocation, deleteLocation, seedDemoDataIfEmpty } from './services/db';
import { getCurrentPosition, sortLocationsByProximity } from './services/geo';
import { ShoppingBag, BookOpen, Plus, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [locations, setLocations] = useState<PhysicalLocation[]>([]);
  const [currentCoords, setCurrentCoords] = useState<GeoCoords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'stashes'>('stashes');

  // Search Filter State (Slack / Gmail Style Search)
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Modal active states
  const [showScanner, setShowScanner] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PhysicalLocation | null>(null);
  const [showBackup, setShowBackup] = useState(false);
  const [showMerch, setShowMerch] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<PhysicalLocation | null>(null);
  const [qrLocation, setQrLocation] = useState<PhysicalLocation | null>(null);
  const [shareLocation, setShareLocation] = useState<PhysicalLocation | null>(null);

  // Initial setup
  useEffect(() => {
    async function init() {
      const list = await getAllLocationsWithCounts();
      
      // Check URL Path routing (e.g. spacepaste.app/car or spacepaste.app/#/car)
      const pathSlug = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase() || window.location.hash.replace(/^#\/?/, '').toLowerCase();
      
      if (pathSlug && pathSlug !== '') {
        const matched = list.find((loc) => {
          const locSlug = loc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (
            locSlug === pathSlug ||
            loc.id.toLowerCase() === pathSlug ||
            loc.code.toLowerCase().includes(pathSlug)
          );
        });

        if (matched) {
          setSelectedLocation(matched);
          setActiveView('stashes');
        }
      } else if (list.length === 0) {
        setActiveView('home');
      }

      setLocations(sortLocationsByProximity(list, null));
      fetchGPSPosition();
    }
    init();
  }, []);

  const loadLocations = async () => {
    const list = await getAllLocationsWithCounts();
    setLocations(sortLocationsByProximity(list, currentCoords));
  };

  const handleStartDemo = async () => {
    await seedDemoDataIfEmpty();
    await loadLocations();
    setActiveView('stashes');
  };

  const fetchGPSPosition = async () => {
    try {
      const pos = await getCurrentPosition();
      setCurrentCoords(pos);
      setGeoError(null);
      setLocations((prev) => sortLocationsByProximity(prev, pos));
    } catch (err: any) {
      setGeoError(err.message);
    }
  };

  useEffect(() => {
    if (currentCoords) {
      setLocations((prev) => sortLocationsByProximity(prev, currentCoords));
    }
  }, [currentCoords]);

  const handleSaveNewLocation = async (newLoc: PhysicalLocation) => {
    await saveLocation(newLoc);
    setShowAddLocation(false);
    await loadLocations();
    setSelectedLocation(newLoc);
    setActiveView('stashes');
  };

  const handleUpdateExistingLocation = async (updatedLoc: PhysicalLocation) => {
    await updateLocation(updatedLoc);
    setEditingLocation(null);
    if (selectedLocation && selectedLocation.id === updatedLoc.id) {
      setSelectedLocation(updatedLoc);
    }
    await loadLocations();
  };

  const handleDeleteLocation = async (id: string) => {
    if (confirm('Are you sure you want to delete this physical location stash?')) {
      await deleteLocation(id);
      await loadLocations();
    }
  };

  // Instant Search Filter across location names, codes, descriptions
  const filteredLocations = locations.filter((loc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      loc.name.toLowerCase().includes(q) ||
      (loc.description && loc.description.toLowerCase().includes(q)) ||
      loc.code.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 14px 40px 14px' }}>
      
      {/* Space Paste Header App Bar */}
      <Header
        onOpenScanner={() => setShowScanner(true)}
        onOpenAddLocation={() => setShowAddLocation(true)}
        onOpenBackup={() => setShowBackup(true)}
        onGoHome={() => setActiveView('home')}
        onGoStashes={() => setActiveView('stashes')}
        activeView={activeView}
        stashesCount={locations.length}
        currentCoords={currentCoords}
        geoError={geoError}
        onRefreshGeo={fetchGPSPosition}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showMobileSearch={showMobileSearch}
        onToggleMobileSearch={() => setShowMobileSearch(!showMobileSearch)}
      />

      {/* Quick Merch, Docs & GitHub Bar (Desktop Only) */}
      <div className="desktop-toolbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowMerch(true)} className="btn btn-sm btn-gold">
            <ShoppingBag size={14} />
            <span>Merch Portal (App is Free)</span>
          </button>

          <button onClick={() => setShowDocs(true)} className="btn btn-sm">
            <BookOpen size={14} />
            <span>Launch Guide & Docs</span>
          </button>

          <a
            href="https://github.com/shangle/space-paste"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-brown"
          >
            <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub Source</span>
          </a>
        </div>

        {activeView === 'stashes' && (
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {searchQuery ? `Search Results (${filteredLocations.length})` : `Physical Stashes (${locations.length})`}
          </div>
        )}
      </div>

      {/* PWA App Install Banner with Snooze & Dismiss */}
      <PWAInstallBanner />

      {/* Main View Area */}
      <main>
        {activeView === 'home' ? (
          <LandingPage
            onStartDemo={handleStartDemo}
            onOpenAddLocation={() => setShowAddLocation(true)}
            onOpenMerchDrop={() => setShowMerch(true)}
            onOpenDocs={() => setShowDocs(true)}
          />
        ) : filteredLocations.length === 0 ? (
          /* Empty Search / Empty Stashes View */
          <div
            style={{
              padding: '40px 18px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: 'var(--border-thick)',
              boxShadow: 'var(--shadow-tactile)',
              margin: '16px 0',
            }}
          >
            <div style={{ fontSize: '3.2rem', marginBottom: '10px' }}>
              {searchQuery ? '🔍' : '📦'}
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              {searchQuery ? `No stashes found matching "${searchQuery}"` : 'No Physical Locations Stashed Yet!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', maxWidth: '440px', margin: '0 auto 20px auto', fontWeight: 600, lineHeight: '1.4' }}>
              {searchQuery
                ? 'Try searching for another keyword or add a new physical location.'
                : "You haven't stashed any locations yet. Tag your car, work desk, coffee station, or garage workbench to get started."}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-sm btn-gold"
                  style={{ padding: '10px 18px' }}
                >
                  Clear Search Filter
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowAddLocation(true)}
                    className="btn btn-primary"
                    style={{ padding: '12px 24px', fontSize: '1.05rem' }}
                  >
                    <Plus size={20} />
                    <span>+ Add Your First Location</span>
                  </button>

                  <button
                    onClick={handleStartDemo}
                    className="btn btn-gold"
                    style={{ padding: '12px 20px', fontSize: '1rem' }}
                  >
                    <Sparkles size={16} />
                    <span>Load Sample Locations</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid-stash">
            {filteredLocations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                onOpenDetail={(location) => setSelectedLocation(location)}
                onEditLocation={(location) => setEditingLocation(location)}
                onShowQR={(location) => setQrLocation(location)}
                onShareStash={(location) => setShareLocation(location)}
                onDelete={handleDeleteLocation}
              />
            ))}
          </div>
        )}
      </main>

      {/* Global Comprehensive Footer */}
      <Footer
        onGoHome={() => setActiveView('home')}
        onGoStashes={() => setActiveView('stashes')}
        onOpenAddLocation={() => setShowAddLocation(true)}
        onOpenBackup={() => setShowBackup(true)}
        onOpenDocs={() => setShowDocs(true)}
        onOpenMerch={() => setShowMerch(true)}
      />

      {/* Mobile App Bottom Navigation Dock */}
      <MobileTabBar
        activeView={activeView}
        stashesCount={locations.length}
        onGoHome={() => setActiveView('home')}
        onGoStashes={() => setActiveView('stashes')}
        onOpenScanner={() => setShowScanner(true)}
        onOpenAddLocation={() => setShowAddLocation(true)}
        onToggleSearch={() => setShowMobileSearch(!showMobileSearch)}
      />

      {/* Modals */}
      {showScanner && (
        <ScannerModal
          locations={locations}
          onClose={() => setShowScanner(false)}
          onSelectLocation={(loc) => {
            setShowScanner(false);
            setSelectedLocation(loc);
            setActiveView('stashes');
          }}
        />
      )}

      {showAddLocation && (
        <AddLocationModal
          onClose={() => setShowAddLocation(false)}
          onSave={handleSaveNewLocation}
        />
      )}

      {editingLocation && (
        <EditLocationModal
          location={editingLocation}
          onClose={() => setEditingLocation(null)}
          onSave={handleUpdateExistingLocation}
        />
      )}

      {selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onEditLocation={(loc) => {
            setSelectedLocation(null);
            setEditingLocation(loc);
          }}
          onShowQR={(loc) => setQrLocation(loc)}
          onUpdateLocationItemCount={loadLocations}
        />
      )}

      {qrLocation && (
        <QRPrintModal
          location={qrLocation}
          onClose={() => setQrLocation(null)}
        />
      )}

      {shareLocation && (
        <ShareStashModal
          location={shareLocation}
          onClose={() => setShareLocation(null)}
        />
      )}

      {showBackup && (
        <BackupModal
          onClose={() => setShowBackup(false)}
          onRefreshData={loadLocations}
        />
      )}

      {showMerch && (
        <MerchDropModal
          onClose={() => setShowMerch(false)}
        />
      )}

      {showDocs && (
        <DocumentationModal
          onClose={() => setShowDocs(false)}
        />
      )}

    </div>
  );
};
