import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  const events = await prisma.event.findMany({
    where: {
      ...(category && category !== "all" ? { type: category } : {}),
    },
    include: { city: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, cityId, date, endDate, location, type } = body;

  if (!title || !cityId || !date || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
  });

  return NextResponse.json({ event }, { status: 201 });
}
