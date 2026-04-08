import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { maranhaoCities } from "@/data/maranhao-cities";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { cityId, cityName, date, endDate, time, ...rest } = body;

  const data: Record<string, unknown> = { ...rest };

  // Explicitly handle time — allow clearing it by sending null
  if (time !== undefined) {
    data.time = time || null;
  }

  // Handle date fields with timezone-safe parsing
  if (date) {
    data.date = new Date(date + "T12:00:00");
  }
  if (endDate) {
    data.endDate = new Date(endDate + "T12:00:00");
  }

  // Handle city upsert if needed
  if (cityId) {
    const isStaticId = cityId.startsWith("static-");
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
      data.cityId = city.id;
    } else {
      data.cityId = cityId;
    }
  }

  const event = await prisma.event.update({
    where: { id },
    data,
    include: { city: true },
  });

  return NextResponse.json({ event });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
