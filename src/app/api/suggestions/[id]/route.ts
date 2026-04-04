import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      moderatedAt: new Date(),
    },
    include: {
      user: { select: { name: true, image: true, city: true } },
    },
  });

  return NextResponse.json({ suggestion });
}
