import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cityId = searchParams.get("city");
  const type = searchParams.get("type");

  const locations = await prisma.supportLocation.findMany({
    where: {
      isActive: true,
      ...(cityId ? { cityId } : {}),
      ...(type && type !== "all" ? { type } : {}),
    },
    include: { city: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ locations });
}
