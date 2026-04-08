import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { maranhaoCities } from "@/data/maranhao-cities";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  try {
    const events = await prisma.event.findMany({
      where: {
        ...(type && type !== "all" ? { type } : {}),
        ...(status && status !== "all" ? { status } : {}),
      },
      include: { city: true },
      orderBy: { date: "desc" },
      take: 50,
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, cityId, cityName, date, endDate, location, time, type } = body;

  if (!title || !date || !type) {
    return NextResponse.json({ error: "Campos obrigatórios: title, date, type" }, { status: 400 });
  }

  if (!cityId && !cityName) {
    return NextResponse.json({ error: "Informe o município" }, { status: 400 });
  }

  try {
    // Resolve the real cityId — upsert if it's a static ID or not found
    let realCityId = cityId;

    const isStaticId = !cityId || cityId.startsWith("static-");

    if (isStaticId && cityName) {
      // Find or create the city in DB
      let city = await prisma.city.findFirst({ where: { name: cityName } });

      if (!city) {
        // Look up coords from static data
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
    } else {
      // Verify the cityId exists
      const city = await prisma.city.findUnique({ where: { id: cityId } });
      if (!city && cityName) {
        // cityId doesn't exist, upsert by name
        const existing = await prisma.city.findFirst({ where: { name: cityName } });
        if (existing) {
          realCityId = existing.id;
        } else {
          const staticData = maranhaoCities.find(
            (c) => c.name.toLowerCase() === cityName.toLowerCase()
          );
          const created = await prisma.city.create({
            data: {
              name: cityName,
              latitude: staticData?.latitude ?? -2.531,
              longitude: staticData?.longitude ?? -44.283,
              population: staticData?.population ?? 0,
            },
          });
          realCityId = created.id;
        }
      }
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        cityId: realCityId,
        date: new Date(date + "T12:00:00"),
        endDate: endDate ? new Date(endDate + "T12:00:00") : null,
        location: location || null,
        time: time || null,
        type,
      },
      include: { city: true },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
