export function getBaseUrl(): string {
    return (
        import.meta.env.PUBLIC_VERCEL_URL ||
        `http://localhost:${import.meta.env.PORT ?? 3000}`
    );
}