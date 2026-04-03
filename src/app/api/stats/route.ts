import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [supporters, events, suggestions, cities, downloads, locations] =
    await Promise.all([
      prisma.user.count({ where: { isSupporter: true } }),
      prisma.event.count(),
      prisma.suggestion.count(),
      prisma.city.count(),
      prisma.downloadItem.count({ where: { isActive: true } }),
      prisma.supportLocation.count({ where: { isActive: true } }),
    ]);

  const recentSupporters = await prisma.user.findMany({
    where: { isSupporter: true },
    select: { name: true, city: true, supportedAt: true },
    orderBy: { supportedAt: "desc" },
    take: 5,
  });

  const suggestionsByStatus = await prisma.suggestion.groupBy({
    by: ["status"],
    _count: true,
  });

  const pendingSuggestions = suggestionsByStatus.find(
    (s) => s.status === "pending"
  )?._count ?? 0;

  const scheduledEvents = await prisma.event.count({
    where: { status: "scheduled" },
  });

  return NextResponse.json({
    supporters,
    events,
    suggestions,
    cities,
    downloads,
    locations,
    recentSupporters,
    suggestionsByStatus,
    pendingSuggestions,
    scheduledEvents,
  });
}
