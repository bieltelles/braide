import { maranhaoCities } from "@/data/maranhao-cities";

/** Haversine distance in km */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Find the nearest Maranhão city to given coordinates */
export function findNearestCity(lat: number, lng: number): { name: string; distance: number } | null {
  let nearest: { name: string; distance: number } | null = null;

  for (const city of maranhaoCities) {
    const d = haversineKm(lat, lng, city.latitude, city.longitude);
    if (!nearest || d < nearest.distance) {
      nearest = { name: city.name, distance: d };
    }
  }

  // If nearest city is more than 150km away, user is likely not in Maranhão
  if (nearest && nearest.distance > 150) return null;

  return nearest;
}

/** Top 20 Maranhão cities by population for quick-select fallback */
export const topCitiesByPopulation = [...maranhaoCities]
  .sort((a, b) => (b.population || 0) - (a.population || 0))
  .slice(0, 20)
  .map((c) => c.name);
