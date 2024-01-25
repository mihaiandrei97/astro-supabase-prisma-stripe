/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        user: {
            email: string | undefined,
            id: string,
            role: import("@prisma/client").Role;
        } | undefined,
    }
}