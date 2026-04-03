import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const includeInactive = searchParams.get("includeInactive") === "true";

  const items = await prisma.downloadItem.findMany({
    where: {
      ...(!includeInactive ? { isActive: true } : {}),
      ...(category && category !== "all" ? { category } : {}),
    },
    orderBy: { downloads: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, category, fileUrl, fileSize, fileType, thumbnail } = body;

  if (!title || !category || !fileUrl) {
    return NextResponse.json({ error: "Campos obrigatorios: title, category, fileUrl" }, { status: 400 });
  }

  const item = await prisma.downloadItem.create({
    data: {
      title,
      description: description || null,
      category,
      fileUrl,
      fileSize: fileSize || null,
      fileType: fileType || null,
      thumbnail: thumbnail || null,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
