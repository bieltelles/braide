import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

/** Find nearest Maranhão city from coordinates */
function findNearestCityServer(lat: number, lng: number): string | null {
  let nearest: { name: string; distance: number } | null = null;
  for (const city of maranhaoCities) {
    const d = haversineKm(lat, lng, city.latitude, city.longitude);
    if (!nearest || d < nearest.distance) {
      nearest = { name: city.name, distance: d };
    }
  }
  if (nearest && nearest.distance <= 150) return nearest.name;
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "200");
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  try {
    const [supporters, count] = await Promise.all([
      prisma.user.findMany({
        where: { isSupporter: true },
        select: { id: true, name: true, image: true, city: true, supportedAt: true },
        orderBy: { supportedAt: "desc" },
        take: limit,
      }),
      prisma.user.count({ where: { isSupporter: true } }),
    ]);

    // Group supporters by city for the map
    const cityGroups: Record<string, { name: string; lat: number; lng: number; count: number; supporters: { id: string; name: string | null; image: string | null }[] }> = {};

    for (const s of supporters) {
      const cityName = s.city || "Maranhão";
      if (!cityGroups[cityName]) {
        const cityData = maranhaoCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
        cityGroups[cityName] = {
          name: cityName,
          lat: cityData?.latitude ?? -4.0,
          lng: cityData?.longitude ?? -44.5,
          count: 0,
          supporters: [],
        };
      }
      cityGroups[cityName].count++;
      if (cityGroups[cityName].supporters.length < 10) {
        cityGroups[cityName].supporters.push({ id: s.id, name: s.name, image: s.image });
      }
    }

    // Sort city groups: if viewer has coordinates, prioritize nearby cities
    let cities = Object.values(cityGroups);
    if (lat && lng) {
      cities.sort((a, b) => {
        const distA = Math.sqrt((a.lat - lat) ** 2 + (a.lng - lng) ** 2);
        const distB = Math.sqrt((b.lat - lat) ** 2 + (b.lng - lng) ** 2);
        return distA - distB;
      });
    } else {
      cities.sort((a, b) => b.count - a.count);
    }

    return NextResponse.json({ supporters, count, cities });
  } catch {
    return NextResponse.json({ supporters: [], count: 0, cities: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    let city = body.city || null;
    const latitude = body.latitude;
    const longitude = body.longitude;

    // If coordinates provided but no city, resolve server-side
    if (!city && latitude && longitude) {
      city = findNearestCityServer(latitude, longitude);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isSupporter: true,
        supportedAt: new Date(),
        ...(city ? { city } : {}),
      },
    });

    return NextResponse.json({ success: true, user: { city: user.city } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
