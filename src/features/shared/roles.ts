import type { Role } from "@prisma/client";

export function userIsAdmin(user: {role: Role} | undefined) {
    return user?.role === "ADMIN";
}