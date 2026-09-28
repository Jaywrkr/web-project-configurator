"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/admin-auth";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const allowedId = process.env.ADMIN_USER_ID;
  const auth = await createAuthClient();
  if (!auth || !allowedId || !email || !password) redirect("/admin/login?error=1");
  const { data, error } = await auth.auth.signInWithPassword({ email, password });
  if (error || data.user?.id !== allowedId) {
    if (data.user) await auth.auth.signOut();
    redirect("/admin/login?error=1");
  }
  redirect("/admin");
}

export async function signOut() {
  const auth = await createAuthClient();
  if (auth) await auth.auth.signOut();
  redirect("/admin/login");
}
