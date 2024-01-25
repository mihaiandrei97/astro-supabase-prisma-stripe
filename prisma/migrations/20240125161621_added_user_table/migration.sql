-- CreateEnum
CREATE TYPE "ProPlan" AS ENUM ('BASIC', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stripeCustomerId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "proTier" "ProPlan",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
