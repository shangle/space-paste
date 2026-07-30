import React from 'react';
import { QrCode, Share2, Trash2, ArrowRight, Pencil } from 'lucide-react';
import type { PhysicalLocation } from '../types';

interface LocationCardProps {
  location: PhysicalLocation;
  onOpenDetail: (location: PhysicalLocation) => void;
  onEditLocation: (location: PhysicalLocation) => void;
  onShowQR: (location: PhysicalLocation) => void;
  onShareStash: (location: PhysicalLocation) => void;
  onDelete: (id: string) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onOpenDetail,
  onEditLocation,
  onShowQR,
  onShareStash,
  onDelete,
}) => {
  // Only show distance badge if GPS coords exist and distance is a finite number
  const showDistance =
    location.coords !== undefined &&
    location.distanceMeters !== undefined &&
    isFinite(location.distanceMeters);

  const distanceText = showDistance
    ? location.distanceMeters! < 1000
      ? `${Math.round(location.distanceMeters!)}m away`
      : `${(location.distanceMeters! / 1000).toFixed(1)}km away`
    : null;

  return (
    <div
      className="card-tile"
      style={{
        borderTop: `6px solid ${location.color || 'var(--color-orbit-orange)'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '210px',
      }}
    >
      {/* Top Header Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                fontSize: '2rem',
                width: '46px',
                height: '46px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '12px',
                border: 'var(--border-thick)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {location.icon}
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                {location.name}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                {showDistance && distanceText && (
                  <span className="badge badge-orange">📍 {distanceText}</span>
                )}
                {location.photoSignature ? (
                  <span className="badge badge-yellow">📸 Visual Hash</span>
                ) : (
                  <span className="badge">QR Coded</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditLocation(location);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
              title="Edit Location Stash"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(location.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
              title="Delete Stash"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Location Description */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            marginBottom: '16px',
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {location.description || 'Physical location stash point.'}
        </p>
      </div>

      {/* Bottom Action Controls */}
      <div style={{ borderTop: '1.5px dashed #8D6E63', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>📦</span>
          <span>{location.itemCount || 0} Items</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onShareStash(location)}
            className="btn btn-sm btn-gold"
            title="Share Stash Route or QR"
          >
            <Share2 size={14} />
          </button>

          <button
            onClick={() => onShowQR(location)}
            className="btn btn-sm"
            title="Print / View QR Code Sticker"
          >
            <QrCode size={14} />
          </button>

          <button
            onClick={() => onOpenDetail(location)}
            className="btn btn-sm btn-primary"
          >
            <span>Open Vault</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
