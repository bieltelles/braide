import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  const items = await prisma.downloadItem.findMany({
    where: {
      isActive: true,
      ...(category && category !== "all" ? { category } : {}),
    },
    orderBy: { downloads: "desc" },
  });

  return NextResponse.json({ items });
}
