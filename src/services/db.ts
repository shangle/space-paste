import type { PhysicalLocation, StashItem } from '../types';

const DB_NAME = 'qrstash_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('locations')) {
        const locStore = db.createObjectStore('locations', { keyPath: 'id' });
        locStore.createIndex('code', 'code', { unique: true });
        locStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('items')) {
        const itemStore = db.createObjectStore('items', { keyPath: 'id' });
        itemStore.createIndex('locationId', 'locationId', { unique: false });
        itemStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function getAllLocations(): Promise<PhysicalLocation[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['locations', 'items'], 'readonly');
    const locStore = tx.objectStore('locations');
    const itemStore = tx.objectStore('items');

    const locRequest = locStore.getAll();
    const itemRequest = itemStore.getAll();

    tx.oncomplete = () => {
      const locations: PhysicalLocation[] = locRequest.result || [];
      const items: StashItem[] = itemRequest.result || [];

      const countMap: Record<string, number> = {};
      items.forEach((item) => {
        countMap[item.locationId] = (countMap[item.locationId] || 0) + 1;
      });

      const result = locations.map((loc) => ({
        ...loc,
        itemCount: countMap[loc.id] || 0,
      }));

      resolve(result);
    };

    tx.onerror = () => reject(tx.error);
  });
}

export async function getLocationById(id: string): Promise<PhysicalLocation | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('locations', 'readonly');
    const request = tx.objectStore('locations').get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocation(location: PhysicalLocation): Promise<PhysicalLocation> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('locations', 'readwrite');
    const store = tx.objectStore('locations');
    const req = store.put(location);
    req.onsuccess = () => resolve(location);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteLocation(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['locations', 'items'], 'readwrite');
    tx.objectStore('locations').delete(id);

    const itemStore = tx.objectStore('items');
    const index = itemStore.index('locationId');
    const req = index.getAllKeys(id);

    req.onsuccess = () => {
      const keys = req.result;
      keys.forEach((key) => itemStore.delete(key));
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getItemsByLocation(locationId: string): Promise<StashItem[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readonly');
    const index = tx.objectStore('items').index('locationId');
    const request = index.getAll(locationId);

    request.onsuccess = () => {
      const items: StashItem[] = request.result || [];
      items.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      resolve(items);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function saveItem(item: StashItem): Promise<StashItem> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readwrite');
    const req = tx.objectStore('items').put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readwrite');
    const req = tx.objectStore('items').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function seedDemoDataIfEmpty(): Promise<void> {
  const existing = await getAllLocations();
  if (existing.length > 0) return;

  const now = new Date().toISOString();

  const demoLocations: PhysicalLocation[] = [
    {
      id: 'car',
      name: 'Car Stash',
      description: 'Glove compartment & trunk side pocket',
      code: 'spacepaste.app/car',
      icon: '🚗',
      color: '#FF5722', // Rocket Orange
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'loc_desk_01',
      name: 'Main Work Desk',
      description: 'Under monitor stand & left drawer',
      code: 'spacepaste.app/loc_desk_01',
      icon: '💻',
      color: '#00A896', // Kosmo Teal
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'loc_toolbox_02',
      name: 'Garage Workbench',
      description: 'Red metal toolbox top compartment',
      code: 'spacepaste.app/loc_toolbox_02',
      icon: '🧰',
      color: '#FFB703', // Star Gold
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const loc of demoLocations) {
    await saveLocation(loc);
  }

  const demoItems: StashItem[] = [
    {
      id: 'item_car_1',
      locationId: 'car',
      type: 'note',
      title: 'Tire Pressure & Registration Copy',
      content: 'Recommended front/rear tire pressure is 32 PSI. Registration copy is in glove box envelope.',
      tags: ['car', 'maintenance'],
      pinned: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'item_car_2',
      locationId: 'car',
      type: 'checklist',
      title: 'Road Trip Checklist',
      content: '',
      checklist: [
        { id: 'cc1', text: 'Check windshield washer fluid', completed: true },
        { id: 'cc2', text: 'Verify tire tread & pressure', completed: true },
        { id: 'cc3', text: 'Pack emergency jumper cables', completed: false },
      ],
      tags: ['travel'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'item_1',
      locationId: 'loc_desk_01',
      type: 'note',
      title: 'Spare USB-C Cable & Dongles',
      content: 'Extra 65W GaN charger and USB-C to HDMI adapter in top left drawer.',
      tags: ['electronics', 'cables'],
      pinned: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const item of demoItems) {
    await saveItem(item);
  }
}

export async function exportBackupJSON(): Promise<string> {
  const db = await getDB();
  const locations = await getAllLocations();
  const items: StashItem[] = await new Promise((resolve, reject) => {
    const tx = db.transaction('items', 'readonly');
    const req = tx.objectStore('items').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });

  return JSON.stringify(
    {
      app: 'Space Paste',
      version: 1,
      exportedAt: new Date().toISOString(),
      locations,
      items,
    },
    null,
    2
  );
}

export async function importBackupJSON(jsonStr: string): Promise<{ locationsCount: number; itemsCount: number }> {
  const data = JSON.parse(jsonStr);
  if (!data.locations || !data.items) {
    throw new Error('Invalid Space Paste backup file format.');
  }

  for (const loc of data.locations) {
    await saveLocation(loc);
  }

  for (const item of data.items) {
    await saveItem(item);
  }

  return {
    locationsCount: data.locations.length,
    itemsCount: data.items.length,
  };
}
