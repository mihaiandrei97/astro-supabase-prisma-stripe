export function userHasRole(roles: string[], role: string): boolean {
    return roles.includes(role);
}

export function userIsAdmin(roles: string[]): boolean {
    return userHasRole(roles, "admin");
}