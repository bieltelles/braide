interface Coordinate {
  latitude: number;
  longitude: number;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Haversine formula to calculate distance between two points on Earth
 */
export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const R = 6371; // Earth radius in km

  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.latitude)) *
      Math.cos(toRadians(b.latitude)) *
      sinLon * sinLon;

  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Calculate total km traveled along a sequence of cities (ordered by event date)
 */
export function calculateTotalKm(cities: Coordinate[]): number {
  if (cities.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < cities.length; i++) {
    total += haversineDistance(cities[i - 1], cities[i]);
  }
  return Math.round(total);
}
