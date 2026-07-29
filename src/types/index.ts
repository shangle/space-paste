export type ItemType = 'note' | 'link' | 'photo' | 'file' | 'checklist';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StashItem {
  id: string;
  locationId: string;
  type: ItemType;
  title: string;
  content: string; // text note content, link URL, image base64, or JSON checklist string
  checklist?: ChecklistItem[];
  tags: string[];
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeoCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface PhotoSignature {
  hash: string; // 64-bit binary/hex perceptual luminance hash
  colorGrid: number[]; // 16-element HSL hue/sat color signature
}

export interface PhysicalLocation {
  id: string;
  name: string;
  description: string;
  code: string; // QR code payload (e.g. sta.sh/loc_xyz)
  icon: string; // Emoji identifier (e.g., 🛏️, 🪑, 💻, 📦, 🧰, ☕)
  color: string; // Card accent color (e.g., #E8F5E9, #FFF3E0)
  photoSignature?: PhotoSignature;
  photoSnapshot?: string; // Data URL thumbnail
  coords?: GeoCoords;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
  distanceMeters?: number; // Calculated dynamically at runtime
}

export interface ScanResult {
  type: 'qr' | 'photo';
  locationId?: string;
  code?: string;
  matchScore?: number;
  locationName?: string;
}
