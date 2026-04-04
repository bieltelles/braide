import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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
  const body = await request.json();
  const { category, content, name } = body;

  if (!category || !content?.trim()) {
    return NextResponse.json({ error: "Campos obrigatorios: category, content" }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json({ error: "Conteudo muito longo (max 1000 caracteres)" }, { status: 400 });
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      category,
      content: content.trim(),
      authorName: name || "Anônimo",
    },
  });

  return NextResponse.json({ suggestion }, { status: 201 });
}
