import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const status = searchParams.get("status");

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
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, cityId, date, endDate, location, type } = body;

  if (!title || !cityId || !date || !type) {
    return NextResponse.json({ error: "Campos obrigatorios: title, cityId, date, type" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description || null,
      cityId,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : null,
      location: location || null,
      type,
    },
    include: { city: true },
  });

  return NextResponse.json({ event }, { status: 201 });
}
