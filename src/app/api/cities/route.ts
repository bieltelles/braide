import { NextResponse } from "next/server";
import { maranhaoCities } from "@/data/maranhao-cities";

export async function GET() {
  // Try to fetch from database first
  try {
    const { prisma } = await import("@/lib/prisma");
    const cities = await prisma.city.findMany({
      select: { id: true, name: true, latitude: true, longitude: true, population: true, supporters: true },
      orderBy: { name: "asc" },
    });

    if (cities.length > 0) {
      return NextResponse.json({ cities });
    }
  } catch {
    // Database not available, fall through to static data
  }

  // Fallback: return static list of 217 MA municipalities
  const cities = maranhaoCities.map((c, i) => ({
    id: `static-${i}`,
    name: c.name,
    latitude: c.latitude,
    longitude: c.longitude,
    population: c.population,
    supporters: 0,
  }));

  return NextResponse.json({ cities });
}
