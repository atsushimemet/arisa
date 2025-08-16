-- CreateEnum
CREATE TYPE "Area" AS ENUM ('SHIBUYA', 'SHINJUKU', 'GINZA', 'ROPPONGI', 'IKEBUKURO', 'AKASAKA', 'KABUKICHO', 'OTHER');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('KYABA', 'GIRLS_BAR', 'SNACK', 'LOUNGE', 'CLUB', 'OTHER');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_10K', 'FROM_10K_TO_20K', 'FROM_20K_TO_30K', 'FROM_30K_TO_50K', 'OVER_50K');

-- CreateTable
CREATE TABLE "casts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "snsLink" TEXT NOT NULL,
    "storeLink" TEXT,
    "area" "Area" NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "budgetRange" "BudgetRange" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "casts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "casts_snsLink_key" ON "casts"("snsLink");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");