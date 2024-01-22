/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        user: {
            email: string | undefined,
            id: string,
            roles: string[];
        } | undefined,
    }
}