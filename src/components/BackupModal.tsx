import React, { useRef, useState } from 'react';
import { X, Download, Upload, Database, CheckCircle } from 'lucide-react';
import { exportBackupJSON, importBackupJSON } from '../services/db';

interface BackupModalProps {
  onClose: () => void;
  onRefreshData: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ onClose, onRefreshData }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      const json = await exportBackupJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-stash-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setMsg('Exported full local stash backup successfully!');
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const res = await importBackupJSON(text);
      setMsg(`Imported ${res.locationsCount} locations and ${res.itemsCount} stashed items!`);
      onRefreshData();
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={22} color="var(--accent-sage)" />
            <h3 style={{ fontSize: '1.3rem' }}>Local Data & Privacy</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
          QR Stash is 100% <strong>local-first</strong>. All physical locations, photo signatures, and stashed notes are stored safely inside your device’s browser storage (IndexedDB).
        </p>

        {msg && (
          <div style={{ padding: '10px 14px', backgroundColor: '#E8F5E9', border: '1.5px solid #2E7D32', borderRadius: '10px', color: '#1B5E20', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle size={16} /> {msg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <button onClick={handleExport} className="btn btn-primary" style={{ padding: '12px' }}>
            <Download size={18} />
            <span>Export Backup (JSON File)</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="btn btn-navy" style={{ padding: '12px' }} disabled={loading}>
            <Upload size={18} />
            <span>{loading ? 'Importing...' : 'Restore Backup (JSON File)'}</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />

        </div>

      </div>
    </div>
  );
};
