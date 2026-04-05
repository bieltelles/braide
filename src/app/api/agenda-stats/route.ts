import { NextResponse } from "next/server";
import { maranhaoCities } from "@/data/maranhao-cities";

interface CityCoord {
  name: string;
  latitude: number;
  longitude: number;
}

/** Haversine distance in km between two coordinates */
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

/** Calculate total route distance starting from São Luís, visiting cities in event date order */
function calculateRouteKm(visitedCities: CityCoord[]): { totalKm: number; route: CityCoord[] } {
  if (visitedCities.length === 0) return { totalKm: 0, route: [] };

  // Start from São Luís
  const slz = maranhaoCities.find((c) => c.name === "São Luís")!;
  const start: CityCoord = { name: "São Luís", latitude: slz.latitude, longitude: slz.longitude };

  // Build route: São Luís → first city → ... → last city
  const route: CityCoord[] = [start, ...visitedCities];

  let totalKm = 0;
  for (let i = 1; i < route.length; i++) {
    // Apply 1.35x multiplier for road distance approximation (straight-line → road)
    totalKm += haversineKm(
      route[i - 1].latitude, route[i - 1].longitude,
      route[i].latitude, route[i].longitude
    ) * 1.35;
  }

  return { totalKm: Math.round(totalKm), route };
}

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    // Get completed events with their cities, ordered by date
    const completedEvents = await prisma.event.findMany({
      where: { status: "completed" },
      include: { city: true },
      orderBy: { date: "asc" },
    });

    const scheduledEvents = await prisma.event.findMany({
      where: { status: "scheduled" },
      include: { city: true },
      orderBy: { date: "asc" },
    });

    // Unique visited cities (completed events) in date order
    const visitedCityNames = new Set<string>();
    const visitedCities: CityCoord[] = [];
    for (const event of completedEvents) {
      if (event.city && !visitedCityNames.has(event.city.name)) {
        visitedCityNames.add(event.city.name);
        visitedCities.push({
          name: event.city.name,
          latitude: event.city.latitude,
          longitude: event.city.longitude,
        });
      }
    }

    // Unique upcoming cities (scheduled events)
    const upcomingCityNames = new Set<string>();
    const upcomingCities: CityCoord[] = [];
    for (const event of scheduledEvents) {
      if (event.city && !upcomingCityNames.has(event.city.name) && !visitedCityNames.has(event.city.name)) {
        upcomingCityNames.add(event.city.name);
        upcomingCities.push({
          name: event.city.name,
          latitude: event.city.latitude,
          longitude: event.city.longitude,
        });
      }
    }

    const { totalKm, route } = calculateRouteKm(visitedCities);

    return NextResponse.json({
      totalKm,
      visitedCitiesCount: visitedCities.length,
      completedEventsCount: completedEvents.length,
      scheduledEventsCount: scheduledEvents.length,
      visitedCities,
      upcomingCities,
      route,
    });
  } catch {
    // Fallback when DB is unavailable
    return NextResponse.json({
      totalKm: 0,
      visitedCitiesCount: 0,
      completedEventsCount: 0,
      scheduledEventsCount: 0,
      visitedCities: [],
      upcomingCities: [],
      route: [],
    });
  }
}
