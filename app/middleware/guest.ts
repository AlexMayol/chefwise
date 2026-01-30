/**
 * Guest Middleware
 *
 * For pages that should only be accessible to unauthenticated users
 * (e.g., login, register pages).
 * Redirects authenticated users to the dashboard.
 *
 * Usage in pages:
 * definePageMeta({
 *   middleware: 'guest'
 * })
 */
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();

  // If the user is already authenticated, redirect to dashboard
  if (user.value) {
    return navigateTo("/dashboard");
  }
});
