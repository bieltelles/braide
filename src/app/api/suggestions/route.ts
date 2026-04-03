import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  const suggestions = await prisma.suggestion.findMany({
    where: {
      ...(category && category !== "all" ? { category } : {}),
      ...(status && status !== "all" ? { status } : {}),
    },
    include: {
      user: { select: { name: true, image: true, city: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const counts = await prisma.suggestion.groupBy({
    by: ["status"],
    _count: true,
  });

  return NextResponse.json({ suggestions, counts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { category, content } = body;

  if (!category || !content?.trim()) {
    return NextResponse.json({ error: "Campos obrigatorios: category, content" }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json({ error: "Conteudo muito longo (max 1000 caracteres)" }, { status: 400 });
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      userId: session.user.id,
      category,
      content: content.trim(),
    },
  });

  return NextResponse.json({ suggestion }, { status: 201 });
}
