import type { PhysicalLocation, StashItem } from '../types';

const DB_NAME = 'space_paste_vault_db';
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('locations')) {
        const locStore = db.createObjectStore('locations', { keyPath: 'id' });
        locStore.createIndex('by-name', 'name');
      }
      if (!db.objectStoreNames.contains('items')) {
        const itemStore = db.createObjectStore('items', { keyPath: 'id' });
        itemStore.createIndex('by-location', 'locationId');
        itemStore.createIndex('by-type', 'type');
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// LOCATIONS CRUD
export async function getAllLocations(): Promise<PhysicalLocation[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('locations', 'readonly');
    const store = tx.objectStore('locations');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getLocationById(id: string): Promise<PhysicalLocation | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('locations', 'readonly');
    const store = tx.objectStore('locations');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocation(location: PhysicalLocation): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('locations', 'readwrite');
    const store = tx.objectStore('locations');
    const req = store.put(location);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function updateLocation(location: PhysicalLocation): Promise<void> {
  return saveLocation(location);
}

export async function deleteLocation(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['locations', 'items'], 'readwrite');
    tx.objectStore('locations').delete(id);
    
    const itemStore = tx.objectStore('items');
    const index = itemStore.index('by-location');
    const req = index.getAllKeys(id);
    
    req.onsuccess = () => {
      const keys = req.result;
      for (const k of keys) {
        itemStore.delete(k);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// STASH ITEMS CRUD
export async function getItemsByLocation(locationId: string): Promise<StashItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readonly');
    const store = tx.objectStore('items');
    const index = store.index('by-location');
    const req = index.getAll(locationId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllItems(): Promise<StashItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readonly');
    const store = tx.objectStore('items');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveItem(item: StashItem): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readwrite');
    const store = tx.objectStore('items');
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteItem(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readwrite');
    const store = tx.objectStore('items');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// BACKUP IMPORT / EXPORT
export async function exportBackupJSON(): Promise<string> {
  const locations = await getAllLocations();
  const items = await getAllItems();
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    locations,
    items,
  }, null, 2);
}

export async function importBackupJSON(jsonStr: string): Promise<{ locationsCount: number; itemsCount: number }> {
  const data = JSON.parse(jsonStr);
  if (!data.locations || !data.items) {
    throw new Error('Invalid Space Paste backup format');
  }

  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['locations', 'items'], 'readwrite');
    const locStore = tx.objectStore('locations');
    const itemStore = tx.objectStore('items');

    for (const loc of data.locations) {
      locStore.put(loc);
    }
    for (const item of data.items) {
      itemStore.put(item);
    }

    tx.oncomplete = () => {
      resolve({
        locationsCount: data.locations.length,
        itemsCount: data.items.length,
      });
    };
    tx.onerror = () => reject(tx.error);
  });
}

// DEMO SEED DATA
export async function seedDemoDataIfEmpty(): Promise<void> {
  const locations = await getAllLocations();
  if (locations.length > 0) return;

  const now = new Date().toISOString();

  const demoLocations: PhysicalLocation[] = [
    {
      id: 'car',
      name: 'Car Stash',
      description: 'Glovebox & center console (Podcast handoffs, tire pressure specs, registration docs)',
      code: 'spacepaste.app/car',
      icon: '🚗',
      color: '#C74800',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'desk',
      name: 'Main Work Desk',
      description: 'Under monitor stand & left drawer (USB-C cable guide, WiFi credentials, serials)',
      code: 'spacepaste.app/desk',
      icon: '💻',
      color: '#006978',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'coffee',
      name: 'Kitchen Coffee Station',
      description: 'Next to espresso machine (Dial-in grind size, bean roast dates, descale recipe)',
      code: 'spacepaste.app/coffee',
      icon: '☕',
      color: '#FFB300',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'workbench',
      name: 'Garage Workbench',
      description: 'Red metal toolbox top compartment (Metric hex keys, torque settings, wire specs)',
      code: 'spacepaste.app/workbench',
      icon: '🧰',
      color: '#C62828',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const demoItems: StashItem[] = [
    {
      id: 'demo_1',
      locationId: 'car',
      type: 'link',
      title: 'Current Podcast Episode - Deep Space Tech',
      content: 'https://open.spotify.com/episode/podcast-deep-space-tech-42',
      tags: ['podcast', 'car', 'audio'],
      pinned: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo_2',
      locationId: 'car',
      type: 'note',
      title: 'Tire Pressure & Fuel Spec',
      content: 'Front tires: 34 PSI | Rear tires: 32 PSI. Premium 91 octane required.',
      tags: ['car', 'maintenance'],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo_3',
      locationId: 'desk',
      type: 'note',
      title: 'Guest WiFi Password',
      content: 'SSID: Orbit_Guest_5G | Password: Kosmonaut#2026#Stash',
      tags: ['wifi', 'desk'],
      pinned: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo_4',
      locationId: 'coffee',
      type: 'note',
      title: 'Espresso Machine Dial-in Settings',
      content: 'Grinder setting: 4.2 | 18g in -> 36g out in 28 seconds. Temp: 93°C.',
      tags: ['coffee', 'recipe'],
      pinned: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const db = await initDB();
  const tx = db.transaction(['locations', 'items'], 'readwrite');
  const locStore = tx.objectStore('locations');
  const itemStore = tx.objectStore('items');

  for (const loc of demoLocations) {
    locStore.put(loc);
  }
  for (const item of demoItems) {
    itemStore.put(item);
  }
}
