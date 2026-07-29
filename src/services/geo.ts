import type { GeoCoords, PhysicalLocation } from '../types';

/**
 * Calculates the Haversine distance in meters between two lat/lng coordinates.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance in meters into human-friendly string (e.g. "12m away", "450m away", "1.4 km away").
 */
export function formatDistance(meters: number): string {
  if (meters < 15) {
    return '📍 Here now (<15m)';
  }
  if (meters < 1000) {
    return `${meters}m away`;
  }
  return `${(meters / 1000).toFixed(1)} km away`;
}

/**
 * Sorts location list by distance to user's current GPS location.
 */
export function sortLocationsByProximity(
  locations: PhysicalLocation[],
  currentCoords: GeoCoords | null
): PhysicalLocation[] {
  if (!currentCoords) {
    // Fall back to sorting by updated time if GPS is not active
    return [...locations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  const calculated = locations.map((loc) => {
    if (!loc.coords) {
      return { ...loc, distanceMeters: Infinity };
    }
    const dist = calculateHaversineDistance(
      currentCoords.latitude,
      currentCoords.longitude,
      loc.coords.latitude,
      loc.coords.longitude
    );
    return { ...loc, distanceMeters: dist };
  });

  return calculated.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
}

/**
 * Gets user's current geolocation via Browser Geolocation API.
 */
export function getCurrentPosition(): Promise<GeoCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
}
