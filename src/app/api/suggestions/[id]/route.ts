import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Status invalido" }, { status: 400 });
  }

  const suggestion = await prisma.suggestion.update({
    where: { id },
    data: {
      status,
      moderatedBy: session.user.id,
      moderatedAt: new Date(),
    },
    include: {
      user: { select: { name: true, image: true, city: true } },
    },
  });

  return NextResponse.json({ suggestion });
}
