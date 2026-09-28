import Link from "next/link";
import type { StoredBrief } from "@/lib/types";
import { Summary } from "./Summary";

export function AdminDetail({ brief }: { brief: StoredBrief }) {
  return <main className="admin-shell"><header className="admin-top"><Link href="/admin" className="brand">web<span>project</span><i>.</i></Link><span>ÁREA INTERNA</span></header><div className="admin-content"><Link href="/admin" className="back-link">← Todas las solicitudes</Link><div className="admin-heading"><div><span className="eyebrow">BRIEF / {new Intl.DateTimeFormat("es", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(brief.created_at)).toUpperCase()}</span><h1>{brief.company}</h1><p>{brief.project_type} · {brief.contact_name}</p></div><span className="status-pill">{brief.status === "new" ? "Nuevo" : brief.status}</span></div><Summary brief={brief} admin storedComplexity={{ score: brief.complexity_score, level: brief.complexity_level }} /></div></main>;
}
