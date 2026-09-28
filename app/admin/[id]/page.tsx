import { notFound } from "next/navigation";
import { AdminDetail } from "@/components/AdminDetail";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { StoredBrief } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBriefPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const { data, error } = await getSupabaseAdmin().from("web_briefs").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("No se pudo cargar el brief.");
  if (!data) notFound();
  return <AdminDetail brief={data as StoredBrief} />;
}
