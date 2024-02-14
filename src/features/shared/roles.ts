import type { Role, ProTier } from "@prisma/client";

export function userIsAdmin(user: {role: Role} | undefined) {
    return user?.role === "ADMIN";
}

export function userIsPro(user: {proTier: ProTier} | undefined) {
    return !!user?.proTier;
}

export function userIsProTier(user: {proTier: ProTier} | undefined, tier: ProTier) {
    return user?.proTier === tier;
}