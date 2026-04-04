import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use raw SQL to create tables if they don't exist
    const { prisma } = await import("@/lib/prisma");

    // Check if tables already exist
    let tablesExist = false;
    try {
      await prisma.$queryRawUnsafe(`SELECT 1 FROM "DownloadItem" LIMIT 1`);
      tablesExist = true;
    } catch {
      // Tables don't exist, will create them below
    }

    // Check if cities are seeded
    if (tablesExist) {
      const cityCount = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM "City"`) as { count: number }[];
      if (cityCount[0]?.count >= 200) {
        return NextResponse.json({ status: "ok", message: "Tabelas e cidades já existem" });
      }
    }

    // Create all tables
    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "city" TEXT,
        "isSupporter" BOOLEAN NOT NULL DEFAULT false,
        "supportedAt" TIMESTAMP(3),
        "isAdmin" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")
    `);

    await prisma.$queryRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "City" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "latitude" DOUBLE PRECISION NOT NULL,
        "longitude" DOUBLE PRECISION NOT NULL,
        "population" INTEGER,
        "supporters" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "City_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "City_name_key" ON "City"("name")
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Event" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "cityId" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "endDate" TIMESTAMP(3),
        "location" TEXT,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'scheduled',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Event_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Event_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Suggestion" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "userId" TEXT,
        "authorName" TEXT,
        "category" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "moderatedBy" TEXT,
        "moderatedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "DownloadItem" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "category" TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "fileSize" INTEGER,
        "fileType" TEXT,
        "thumbnail" TEXT,
        "downloads" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "DownloadItem_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SupportLocation" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "name" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "cityId" TEXT NOT NULL,
        "latitude" DOUBLE PRECISION NOT NULL,
        "longitude" DOUBLE PRECISION NOT NULL,
        "type" TEXT NOT NULL,
        "phone" TEXT,
        "openHours" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SupportLocation_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "SupportLocation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ContentBlock" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "page" TEXT NOT NULL,
        "section" TEXT NOT NULL,
        "title" TEXT,
        "content" JSONB NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
      )
    `);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GovernmentPlan" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "category" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon" TEXT,
        "goals" JSONB NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "GovernmentPlan_pkey" PRIMARY KEY ("id")
      )
    `);

    // Seed cities
    const { maranhaoCities } = await import("@/data/maranhao-cities");
    const existingCities = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM "City"`) as { count: number }[];
    if (!existingCities[0]?.count) {
      for (const city of maranhaoCities) {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "City" ("id", "name", "latitude", "longitude", "population", "supporters")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 0)
           ON CONFLICT ("name") DO NOTHING`,
          city.name, city.latitude, city.longitude, city.population || 0
        );
      }
    }

    return NextResponse.json({ status: "ok", message: `Tabelas criadas e ${maranhaoCities.length} municípios do MA inseridos` });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
