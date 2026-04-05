import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { maranhaoCities } from "@/data/maranhao-cities";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cityId = searchParams.get("city");
  const type = searchParams.get("type");
  const admin = searchParams.get("admin");

  try {
    const locations = await prisma.supportLocation.findMany({
      where: {
        ...(admin !== "true" ? { isActive: true } : {}),
        ...(cityId ? { cityId } : {}),
        ...(type && type !== "all" ? { type } : {}),
      },
      include: { city: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ locations });
  } catch {
    return NextResponse.json({ locations: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, address, cityId, cityName, latitude, longitude, type, phone, openHours } = body;

  if (!name || !address || !type) {
    return NextResponse.json({ error: "Campos obrigatórios: nome, endereço, tipo" }, { status: 400 });
  }

  if (!cityId && !cityName) {
    return NextResponse.json({ error: "Informe o município" }, { status: 400 });
  }

  try {
    // Resolve city ID (upsert if static)
    let realCityId = cityId;
    const isStaticId = !cityId || cityId.startsWith("static-");

    if (isStaticId && cityName) {
      let city = await prisma.city.findFirst({ where: { name: cityName } });
      if (!city) {
        const staticData = maranhaoCities.find(
          (c) => c.name.toLowerCase() === cityName.toLowerCase()
        );
        city = await prisma.city.create({
          data: {
            name: cityName,
            latitude: staticData?.latitude ?? -2.531,
            longitude: staticData?.longitude ?? -44.283,
            population: staticData?.population ?? 0,
          },
        });
      }
      realCityId = city.id;
    }

    // Default coordinates from city if not provided
    let lat = latitude;
    let lng = longitude;
    if (!lat || !lng) {
      const city = await prisma.city.findUnique({ where: { id: realCityId } });
      if (city) {
        lat = lat || city.latitude;
        lng = lng || city.longitude;
      }
    }

    const location = await prisma.supportLocation.create({
      data: {
        name,
        address,
        cityId: realCityId,
        latitude: lat || -2.531,
        longitude: lng || -44.283,
        type,
        phone: phone || null,
        openHours: openHours || null,
      },
      include: { city: true },
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
