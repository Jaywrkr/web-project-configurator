import Link from "next/link";
import type { StoredBrief } from "@/lib/types";

export function AdminList({ briefs }: { briefs: StoredBrief[] }) {
  if (!briefs.length) return <div className="admin-empty">Todavía no hay solicitudes. Aparecerán aquí cuando se envíe el primer brief.</div>;
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Empresa</th><th>Contacto</th><th>Tipo de proyecto</th><th>Complejidad</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>{briefs.map((brief) => <tr key={brief.id}><td><Link href={`/admin/${brief.id}`}>{brief.company} ↗</Link></td><td>{brief.contact_name}</td><td>{brief.project_type}</td><td>{brief.complexity_level}</td><td>{new Intl.DateTimeFormat("es", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(brief.created_at))}</td><td><span className="status-pill">{brief.status === "new" ? "Nuevo" : brief.status}</span></td></tr>)}</tbody></table></div>;
}
