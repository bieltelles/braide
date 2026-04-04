import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Allow public download count increment without auth
  if (body.downloads !== undefined && Object.keys(body).length === 1) {
    try {
      await prisma.downloadItem.update({
        where: { id },
        data: { downloads: { increment: 1 } },
      });
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
  }

  // All other updates require admin
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.downloadItem.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ item });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.downloadItem.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
