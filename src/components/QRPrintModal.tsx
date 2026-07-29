import React, { useEffect, useState } from 'react';
import { X, Printer, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import type { PhysicalLocation } from '../types';

interface QRPrintModalProps {
  location: PhysicalLocation;
  onClose: () => void;
}

export const QRPrintModal: React.FC<QRPrintModalProps> = ({ location, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(
      location.code,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#1F2421',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [location.code]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-stash-${location.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px', padding: '24px', textAlign: 'center' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={22} color="var(--accent-navy)" />
            <h3 style={{ fontSize: '1.3rem' }}>Printable QR Sticker</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Physical Sticker Card Container */}
        <div
          id="printable-qr-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #1F2421',
            borderRadius: '16px',
            padding: '24px 18px',
            boxShadow: 'var(--shadow-tactile)',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{location.icon}</div>
          <h2 style={{ fontSize: '1.5rem', color: '#1F2421', marginBottom: '2px' }}>{location.name}</h2>
          <p style={{ fontSize: '0.85rem', color: '#5C6560', marginBottom: '16px' }}>
            {location.description || 'Scan with QR Stash to retrieve items'}
          </p>

          {/* QR Image */}
          {qrDataUrl ? (
            <div style={{ display: 'inline-block', padding: '12px', border: '2px solid #1F2421', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
              <img src={qrDataUrl} alt={location.name} style={{ width: '200px', height: '200px', display: 'block' }} />
            </div>
          ) : (
            <div style={{ width: '200px', height: '200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Generating QR...
            </div>
          )}

          <div style={{ marginTop: '14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', color: '#1F2421' }}>
            {location.code}
          </div>
        </div>

        {/* Print / Download Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDownload} className="btn" style={{ flex: 1 }}>
            <Download size={16} /> Save Image
          </button>
          <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1 }}>
            <Printer size={16} /> Print Sticker
          </button>
        </div>

      </div>
    </div>
  );
};
