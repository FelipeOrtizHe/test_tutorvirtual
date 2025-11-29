export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const apiFetch = $fetch.create({ baseURL: config.public.apiBase });

  // Redefinir $fetch global para apuntar al backend Express
  globalThis.$fetch = apiFetch;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api")) {
      return apiFetch(input as any, init as any) as any;
    }
    return originalFetch(input, init);
  }) as typeof fetch;
});
