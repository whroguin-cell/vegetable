// The single email address permitted to access /admin.
// Supabase stores emails lowercase, so we compare in lowercase.
export const ADMIN_EMAIL = "admin@gmail.com";

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
