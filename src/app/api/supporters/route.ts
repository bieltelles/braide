import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "100");

  const [supporters, count] = await Promise.all([
    prisma.user.findMany({
      where: { isSupporter: true },
      select: { id: true, name: true, image: true, city: true, supportedAt: true },
      orderBy: { supportedAt: "desc" },
      take: limit,
    }),
    prisma.user.count({ where: { isSupporter: true } }),
  ]);

  return NextResponse.json({ supporters, count });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { isSupporter: true, supportedAt: new Date() },
  });

  return NextResponse.json({ success: true, user });
}
