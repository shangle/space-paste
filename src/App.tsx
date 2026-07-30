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
import { LandingPage } from './components/LandingPage';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Footer } from './components/Footer';
import { MobileTabBar } from './components/MobileTabBar';

import type { PhysicalLocation, GeoCoords } from './types';
import { getAllLocationsWithCounts, saveLocation, updateLocation, deleteLocation, seedDemoDataIfEmpty } from './services/db';
import { getCurrentPosition, sortLocationsByProximity } from './services/geo';
import { Plus, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [locations, setLocations] = useState<PhysicalLocation[]>([]);
  const [currentCoords, setCurrentCoords] = useState<GeoCoords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'stashes'>('home');

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Modal active states
  const [showScanner, setShowScanner] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PhysicalLocation | null>(null);
  const [showBackup, setShowBackup] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<PhysicalLocation | null>(null);
  const [qrLocation, setQrLocation] = useState<PhysicalLocation | null>(null);
  const [shareLocation, setShareLocation] = useState<PhysicalLocation | null>(null);

  // Synchronize View State & Hash Routing (`/#/stashes` vs `/#/home`)
  const navigateToView = (view: 'home' | 'stashes') => {
    setActiveView(view);
    if (view === 'stashes') {
      window.history.replaceState(null, '', '#/stashes');
    } else {
      window.history.replaceState(null, '', '#/home');
    }
  };

  // Initial setup & route parsing
  useEffect(() => {
    async function init() {
      const list = await getAllLocationsWithCounts();
      
      // Parse URL Path & Hash routes
      const pathSlug = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase() || window.location.hash.replace(/^#\/?/, '').toLowerCase();
      
      if (pathSlug === 'stashes' || pathSlug === 'dashboard') {
        setActiveView('stashes');
      } else if (pathSlug === 'home' || pathSlug === '') {
        setActiveView('home');
      } else {
        // Direct location route lookup (e.g. spacepaste.app/car)
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
        } else {
          setActiveView('home');
        }
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
    navigateToView('stashes');
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
    navigateToView('stashes');
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
      
      {/* App Header */}
      <Header
        onOpenScanner={() => setShowScanner(true)}
        onOpenAddLocation={() => setShowAddLocation(true)}
        onOpenBackup={() => setShowBackup(true)}
        onGoHome={() => navigateToView('home')}
        onGoStashes={() => navigateToView('stashes')}
        activeView={activeView}
        stashesCount={locations.length}
        currentCoords={currentCoords}
        geoError={geoError}
        onRefreshGeo={fetchGPSPosition}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showMobileSearch={showMobileSearch}
      />

      {/* Main View Area */}
      <main>
        {activeView === 'home' ? (
          /* Public Product Home Landing Page */
          <LandingPage
            onStartDemo={handleStartDemo}
            onOpenAddLocation={() => setShowAddLocation(true)}
          />
        ) : (
          /* App Dashboard View (`/stashes`) */
          <>
            {/* PWA App Install Banner (App Dashboard Only) */}
            <PWAInstallBanner />

            {filteredLocations.length === 0 ? (
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
          </>
        )}
      </main>

      {/* Global Comprehensive Footer */}
      <Footer
        onGoHome={() => navigateToView('home')}
        onGoStashes={() => navigateToView('stashes')}
        onOpenAddLocation={() => setShowAddLocation(true)}
        onOpenBackup={() => setShowBackup(true)}
      />

      {/* Mobile App Bottom Navigation Dock */}
      <MobileTabBar
        activeView={activeView}
        stashesCount={locations.length}
        onGoHome={() => navigateToView('home')}
        onGoStashes={() => navigateToView('stashes')}
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
            navigateToView('stashes');
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

    </div>
  );
};
