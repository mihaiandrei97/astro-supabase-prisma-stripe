import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  console.time("Seeding roles");
  await db.role.createMany({
    data: [
      { name: "admin" },
      { name: "pro_basic" },
      { name: "pro_gold" },
      { name: "pro_platinum" },
    ],
  });
  console.timeEnd("Seeding roles");
}

seed();
