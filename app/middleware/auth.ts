/**
 * Authentication Middleware
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the login page.
 *
 * Usage in pages:
 * definePageMeta({
 *   middleware: 'auth'
 * })
 */
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();

  // If the user is not authenticated, redirect to login
  if (!user.value) {
    return navigateTo("/login");
  }
});
