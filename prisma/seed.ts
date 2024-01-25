import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  console.time("Running seed script 🌱");
  console.timeEnd("Running seed script 🌱");
}

seed();
