import React, { useState, useEffect } from 'react';
import { X, Plus, Pin, Trash2, ExternalLink, Copy, Check, QrCode, Sparkles, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PhysicalLocation, StashItem, ItemType, ChecklistItem } from '../types';
import { getItemsByLocation, saveItem, deleteItem } from '../services/db';
import { sound } from '../services/sound';

interface LocationDetailModalProps {
  location: PhysicalLocation;
  onClose: () => void;
  onEditLocation: (loc: PhysicalLocation) => void;
  onShowQR: (loc: PhysicalLocation) => void;
  onUpdateLocationItemCount: () => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  onClose,
  onEditLocation,
  onShowQR,
  onUpdateLocationItemCount,
}) => {
  const [items, setItems] = useState<StashItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | ItemType>('all');
  
  // New Item Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<ItemType>('note');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');
  
  // Checklist Form Items
  const [checklistInputs, setChecklistInputs] = useState<string[]>(['', '']);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [location.id]);

  const loadItems = async () => {
    const list = await getItemsByLocation(location.id);
    setItems(list);
    onUpdateLocationItemCount();
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let checklist: ChecklistItem[] | undefined = undefined;
    if (newType === 'checklist') {
      checklist = checklistInputs
        .filter((txt) => txt.trim().length > 0)
        .map((txt, idx) => ({ id: `c_${Date.now()}_${idx}`, text: txt.trim(), completed: false }));
    }

    const newItem: StashItem = {
      id: `item_${Date.now()}`,
      locationId: location.id,
      type: newType,
      title: newTitle.trim(),
      content: newContent.trim(),
      checklist,
      tags: newTag ? newTag.split(',').map((t) => t.trim().toLowerCase()) : [],
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveItem(newItem);
    sound.playStashItem();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewTag('');
    setChecklistInputs(['', '']);
    setShowAddForm(false);
    loadItems();
  };

  const handleToggleChecklist = async (item: StashItem, checkId: string) => {
    if (!item.checklist) return;

    const updatedChecklist = item.checklist.map((c) =>
      c.id === checkId ? { ...c, completed: !c.completed } : c
    );

    const updatedItem: StashItem = {
      ...item,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    };

    await saveItem(updatedItem);
    sound.playChecklistPop();

    if (updatedChecklist.every((c) => c.completed)) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }

    loadItems();
  };

  const handleTogglePin = async (item: StashItem) => {
    const updated: StashItem = {
      ...item,
      pinned: !item.pinned,
      updatedAt: new Date().toISOString(),
    };
    await saveItem(updated);
    loadItems();
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this item from stash?')) {
      await deleteItem(id);
      loadItems();
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter((item) =>
    activeFilter === 'all' ? true : item.type === activeFilter
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', padding: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '2.5px dashed #2A1B17', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                fontSize: '2.2rem',
                width: '52px',
                height: '52px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px',
                border: 'var(--border-thick)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {location.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', lineHeight: '1.2', color: 'var(--text-primary)' }}>{location.name} Vault</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px', fontWeight: 600 }}>
                {location.description || 'Stashed digital items & notes'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => onEditLocation(location)} className="btn btn-sm" title="Edit Vault Details">
              <Pencil size={15} /> Edit
            </button>
            <button onClick={() => onShowQR(location)} className="btn btn-sm" title="Print QR Code">
              <QrCode size={15} /> Sticker
            </button>
            <button onClick={onClose} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Bar: Add Item & Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {(['all', 'note', 'link', 'checklist'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`btn btn-sm ${activeFilter === filter ? 'btn-primary' : ''}`}
                style={{
                  textTransform: 'capitalize',
                  backgroundColor: activeFilter === filter ? 'var(--color-astro-turquoise)' : 'var(--bg-card)',
                  color: activeFilter === filter ? '#FFFFFF' : 'var(--text-primary)',
                }}
              >
                {filter === 'all' && '📦 All Stashed'}
                {filter === 'note' && '📝 Notes'}
                {filter === 'link' && '🔗 Links'}
                {filter === 'checklist' && '☑️ Checklists'}
              </button>
            ))}
          </div>

          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-accent btn-sm">
            <Plus size={16} />
            <span>{showAddForm ? 'Close Form' : 'Stash New Item'}</span>
          </button>
        </div>

        {/* Add Item Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleCreateItem}
            style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '18px',
              borderRadius: '14px',
              border: 'var(--border-thick)',
              marginBottom: '22px',
            }}
          >
            <h4 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>➕ Stash a New Item</h4>

            {/* Type selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {(['note', 'link', 'checklist'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  className={`btn btn-sm ${newType === t ? 'btn-gold' : ''}`}
                  style={{
                    flex: 1,
                    textTransform: 'capitalize',
                    backgroundColor: newType === t ? 'var(--color-retro-yellow)' : 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {t === 'note' && '📝 Note'}
                  {t === 'link' && '🔗 Web Link'}
                  {t === 'checklist' && '☑️ Checklist'}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                required
                placeholder="Item Title (e.g. Current Podcast, Cable Guide, WiFi Pass)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #2A1B17',
                  fontFamily: 'inherit',
                  fontSize: '0.92rem',
                  color: 'var(--text-primary)',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {newType === 'note' && (
              <div style={{ marginBottom: '10px' }}>
                <textarea
                  placeholder="Note details, serial numbers, reminder text..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #2A1B17',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            )}

            {newType === 'link' && (
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/guide-or-podcast"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #2A1B17',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            )}

            {newType === 'checklist' && (
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  Checklist Tasks:
                </label>
                {checklistInputs.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Task ${idx + 1}...`}
                    value={val}
                    onChange={(e) => {
                      const next = [...checklistInputs];
                      next[idx] = e.target.value;
                      setChecklistInputs(next);
                    }}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #2A1B17',
                      marginBottom: '6px',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setChecklistInputs([...checklistInputs, ''])}
                  className="btn btn-sm"
                  style={{ marginTop: '4px', fontSize: '0.78rem' }}
                >
                  + Add Task
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
              <Sparkles size={16} /> Save to Stash
            </button>
          </form>
        )}

        {/* Item List Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '50vh', overflowY: 'auto' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', border: '1.5px dashed #2A1B17' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎈</div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>No items in this stash yet!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
                Tap "Stash New Item" above to add a note, link, or checklist for this location.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isPinned = item.pinned;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: isPinned ? '#FFFDE7' : 'var(--bg-card)',
                    border: isPinned ? '2.5px solid var(--color-retro-yellow)' : 'var(--border-thick)',
                    borderRadius: '14px',
                    padding: '16px',
                    boxShadow: 'var(--shadow-tactile-sm)',
                  }}
                >
                  {/* Top Item Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {item.type === 'note' && '📝'}
                        {item.type === 'link' && '🔗'}
                        {item.type === 'checklist' && '☑️'}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleTogglePin(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isPinned ? 'var(--color-orbit-orange)' : 'var(--text-muted)',
                        }}
                        title={isPinned ? 'Unpin Item' : 'Pin Item'}
                      >
                        <Pin size={16} fill={isPinned ? 'var(--color-orbit-orange)' : 'none'} />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Content: Note / Link / Checklist */}
                  {item.type === 'note' && item.content && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', whiteSpace: 'pre-wrap', lineHeight: '1.4', marginBottom: '10px', fontWeight: 600 }}>
                      {item.content}
                    </p>
                  )}

                  {item.type === 'link' && item.content && (
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={item.content}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-brown"
                        style={{ textDecoration: 'none' }}
                      >
                        <span>Open Link</span>
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => handleCopyText(item.content, item.id)}
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--bg-subtle)' }}
                      >
                        {copiedId === item.id ? <Check size={14} color="#047857" /> : <Copy size={14} />}
                        <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
                      </button>
                    </div>
                  )}

                  {item.type === 'checklist' && item.checklist && (
                    <div style={{ marginBottom: '10px', marginTop: '6px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {item.checklist.map((c) => (
                          <label
                            key={c.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              backgroundColor: c.completed ? '#ECFDF5' : 'var(--bg-subtle)',
                              border: '1px solid #2A1B17',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={c.completed}
                              onChange={() => handleToggleChecklist(item, c.id)}
                              style={{ width: '18px', height: '18px', accentColor: 'var(--color-astro-turquoise)' }}
                            />
                            <span
                              style={{
                                fontSize: '0.9rem',
                                textDecoration: c.completed ? 'line-through' : 'none',
                                color: c.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                fontWeight: c.completed ? 500 : 700,
                              }}
                            >
                              {c.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer metadata */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                    <span>Stashed {new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.content && item.type === 'note' && (
                      <button
                        onClick={() => handleCopyText(item.content, item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedId === item.id ? <Check size={12} color="#047857" /> : <Copy size={12} />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
