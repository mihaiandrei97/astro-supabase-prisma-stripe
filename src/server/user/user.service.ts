import { db } from "@/lib/db/database";

export async function getOrCreateUserForSession(userId: string) {
  let user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      roles: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
        roles: {
          connectOrCreate: {
            where: { name: "user" },
            create: { name: "user" },
          },
        },
      },
      select: {
        id: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  return { ...user, roles: user.roles.map((role) => role.name) };
}
