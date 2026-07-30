import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LocationCard } from './components/LocationCard';
import { ScannerModal } from './components/ScannerModal';
import { AddLocationModal } from './components/AddLocationModal';
import { LocationDetailModal } from './components/LocationDetailModal';
import { QRPrintModal } from './components/QRPrintModal';
import { BackupModal } from './components/BackupModal';
import { ShareStashModal } from './components/ShareStashModal';
import { MerchDropModal } from './components/MerchDropModal';
import { DocumentationModal } from './components/DocumentationModal';
import { LandingPage } from './components/LandingPage';

import type { PhysicalLocation, GeoCoords } from './types';
import { getAllLocations, saveLocation, deleteLocation, seedDemoDataIfEmpty } from './services/db';
import { getCurrentPosition, sortLocationsByProximity } from './services/geo';
import { ShoppingBag, BookOpen, Plus, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [locations, setLocations] = useState<PhysicalLocation[]>([]);
  const [currentCoords, setCurrentCoords] = useState<GeoCoords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'stashes'>('stashes');

  // Modal active states
  const [showScanner, setShowScanner] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showMerch, setShowMerch] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<PhysicalLocation | null>(null);
  const [qrLocation, setQrLocation] = useState<PhysicalLocation | null>(null);
  const [shareLocation, setShareLocation] = useState<PhysicalLocation | null>(null);

  // Initial setup
  useEffect(() => {
    async function init() {
      const list = await getAllLocations();
      
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
    const list = await getAllLocations();
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

  const handleDeleteLocation = async (id: string) => {
    if (confirm('Are you sure you want to delete this physical location stash?')) {
      await deleteLocation(id);
      await loadLocations();
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 14px 40px 14px' }}>
      
      {/* Space Paste Header */}
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
      />

      {/* Quick Merch & Docs Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowMerch(true)} className="btn btn-sm btn-gold">
            <ShoppingBag size={14} />
            <span>Merch Portal (App is Free)</span>
          </button>

          <button onClick={() => setShowDocs(true)} className="btn btn-sm">
            <BookOpen size={14} />
            <span>Launch Guide & Docs</span>
          </button>
        </div>

        {activeView === 'stashes' && (
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Physical Stashes ({locations.length})
          </div>
        )}
      </div>

      {/* Main View Area */}
      <main>
        {activeView === 'home' ? (
          <LandingPage
            onStartDemo={handleStartDemo}
            onOpenAddLocation={() => setShowAddLocation(true)}
            onOpenMerchDrop={() => setShowMerch(true)}
            onOpenDocs={() => setShowDocs(true)}
          />
        ) : locations.length === 0 ? (
          /* Empty Stashes Screen */
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
            <div style={{ fontSize: '3.2rem', marginBottom: '10px' }}>📦</div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              No Physical Locations Stashed Yet!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', maxWidth: '440px', margin: '0 auto 20px auto', fontWeight: 600, lineHeight: '1.4' }}>
              You haven't stashed any locations yet. Tag your car, work desk, coffee station, or garage workbench to get started.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
            </div>
          </div>
        ) : (
          <div className="grid-stash">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                onOpenDetail={(location) => setSelectedLocation(location)}
                onShowQR={(location) => setQrLocation(location)}
                onShareStash={(location) => setShareLocation(location)}
                onDelete={handleDeleteLocation}
              />
            ))}
          </div>
        )}
      </main>

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

      {selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
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
