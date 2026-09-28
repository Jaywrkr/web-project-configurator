import Link from "next/link";
import { AdminList } from "@/components/AdminList";
import { signOut } from "./login/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const requestedPage = Number((await searchParams).page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 10000 ? requestedPage : 1;
  const pageSize = 50;
  const { data, error, count } = await getSupabaseAdmin().from("web_briefs").select("id,created_at,company,contact_name,project_type,complexity_level,status", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
  if (error) throw new Error("No se pudieron cargar las solicitudes.");
  return <main className="admin-shell"><header className="admin-top"><Link href="/" className="brand">web<span>project</span><i>.</i></Link><form action={signOut}><button type="submit" className="quiet-button">Cerrar sesión</button></form></header><div className="admin-content"><span className="eyebrow">ÁREA INTERNA / BRIEFS</span><div className="admin-heading"><div><h1>Solicitudes.</h1><p>Revisa el alcance de cada proyecto recibido.</p></div><span className="admin-count">{count ?? 0} briefs</span></div><AdminList briefs={data} /><nav className="admin-pagination" aria-label="Páginas de solicitudes">{page > 1 && <Link href={`/admin?page=${page - 1}`}>← Anterior</Link>}<span>Página {page}</span>{page * pageSize < (count ?? 0) && <Link href={`/admin?page=${page + 1}`}>Siguiente →</Link>}</nav></div></main>;
}
