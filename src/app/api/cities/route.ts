import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cities = await prisma.city.findMany({
    select: { id: true, name: true, latitude: true, longitude: true, population: true, supporters: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ cities });
}
