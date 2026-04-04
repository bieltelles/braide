import { cookies } from "next/headers";

/**
 * Verifica se a requisição é de um admin autenticado via cookie.
 */
export async function requireAdmin(): Promise<boolean> {
  const adminSecret = process.env.ADMIN_SECRET;

  // No ADMIN_SECRET set - allow access (dev mode)
  if (!adminSecret) return true;

  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  return token === adminSecret;
}
