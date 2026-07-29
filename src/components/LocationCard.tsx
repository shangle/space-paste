import React from 'react';
import { QrCode, Camera, MapPin, Package, ArrowRight, Trash2, Share2 } from 'lucide-react';
import type { PhysicalLocation } from '../types';
import { formatDistance } from '../services/geo';

interface LocationCardProps {
  location: PhysicalLocation;
  onOpenDetail: (loc: PhysicalLocation) => void;
  onShowQR: (loc: PhysicalLocation) => void;
  onShareStash: (loc: PhysicalLocation) => void;
  onDelete: (id: string) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onOpenDetail,
  onShowQR,
  onShareStash,
  onDelete,
}) => {
  const cardColor = location.color || '#00A896';

  return (
    <div
      className="card-tile"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
        borderTop: `6px solid ${cardColor}`,
      }}
    >
      {/* Top Header & Badges */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                fontSize: '2.1rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px',
                border: '1.5px solid #1E293B',
              }}
            >
              {location.icon || '🚀'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                {location.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                {location.distanceMeters !== undefined && location.distanceMeters !== Infinity ? (
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                    {formatDistance(location.distanceMeters)}
                  </span>
                ) : (
                  <span className="badge" style={{ fontSize: '0.72rem' }}>
                    <MapPin size={12} /> Stashed
                  </span>
                )}
                {location.photoSignature ? (
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                    <Camera size={11} /> Photo Matched
                  </span>
                ) : (
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                    <QrCode size={11} /> QR Coded
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(location.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
            }}
            title="Delete Location"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Description & Photo Preview if available */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '14px', lineHeight: '1.4' }}>
          {location.description || 'No notes added for this location.'}
        </p>

        {location.photoSnapshot && (
          <div style={{ marginBottom: '14px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #1E293B', maxHeight: '110px' }}>
            <img
              src={location.photoSnapshot}
              alt={location.name}
              style={{ width: '100%', height: '110px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* Bottom Footer & Action Buttons */}
      <div style={{ borderTop: '1.5px dashed #CBD5E1', paddingTop: '14px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.9rem' }}>
            <Package size={16} color={cardColor} />
            <span>{location.itemCount ?? 0} Items</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onShareStash(location)}
              className="btn btn-sm btn-gold"
              title="Share Stash via Sonic Signal or Link"
            >
              <Share2 size={14} />
            </button>

            <button
              onClick={() => onShowQR(location)}
              className="btn btn-sm"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
              title="View & Print QR Sticker"
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
    </div>
  );
};
