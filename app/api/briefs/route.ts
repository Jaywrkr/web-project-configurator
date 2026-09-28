import { NextResponse } from "next/server";
import { calculateComplexity } from "@/lib/complexity";
import { BriefValidationError, parseBrief } from "@/lib/brief-input";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 50000) return NextResponse.json({ error: "La solicitud es demasiado grande." }, { status: 413 });
    const brief = parseBrief(JSON.parse(raw));
    const complexity = calculateComplexity(brief);
    const { error } = await getSupabaseAdmin().from("web_briefs").insert({ ...brief, deadline_date: brief.deadline_date || null, complexity_score: complexity.score, complexity_level: complexity.level });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (cause) {
    if (cause instanceof SyntaxError) return NextResponse.json({ error: "El formato de la solicitud no es válido." }, { status: 400 });
    if (cause instanceof BriefValidationError) return NextResponse.json({ error: cause.message }, { status: 400 });
    console.error("Brief submission failed", cause);
    return NextResponse.json({ error: "No se pudo guardar la solicitud." }, { status: 500 });
  }
}
