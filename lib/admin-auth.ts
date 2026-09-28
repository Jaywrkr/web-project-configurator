import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

function authConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function createAuthClient() {
  const config = authConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Components cannot write cookies; proxy refreshes sessions. */ }
      }
    }
  });
}

export async function requireAdmin() {
  const allowedId = process.env.ADMIN_USER_ID;
  if (!allowedId) redirect("/admin/login");
  const auth = await createAuthClient();
  if (!auth) redirect("/admin/login");
  const { data, error } = await auth.auth.getUser();
  if (error || data.user?.id !== allowedId) redirect("/admin/login");
  return data.user;
}
