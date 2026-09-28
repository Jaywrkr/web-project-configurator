import { NextResponse } from "next/server";
import { calculateComplexity } from "@/lib/complexity";
import { BriefValidationError, parseBrief } from "@/lib/brief-input";
import { formatBriefEmail } from "@/lib/brief-email";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 50000) return NextResponse.json({ error: "La solicitud es demasiado grande." }, { status: 413 });
    const payload: unknown = JSON.parse(raw);
    const brief = parseBrief(payload);
    const candidateId = payload && typeof payload === "object" && "request_id" in payload ? payload.request_id : null;
    const requestId = typeof candidateId === "string" && /^[0-9a-f-]{36}$/i.test(candidateId) ? candidateId : crypto.randomUUID();
    const complexity = calculateComplexity(brief);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.BRIEF_FROM_EMAIL;
    const to = process.env.BRIEF_TO_EMAIL;
    if (!apiKey || !from || !to) throw new Error("Email no configurado.");
    const email = formatBriefEmail(brief, complexity);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": requestId },
      body: JSON.stringify({ from, to: [to], reply_to: brief.email, ...email }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`Resend rejected email: ${response.status}`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (cause) {
    if (cause instanceof SyntaxError) return NextResponse.json({ error: "El formato de la solicitud no es válido." }, { status: 400 });
    if (cause instanceof BriefValidationError) return NextResponse.json({ error: cause.message }, { status: 400 });
    console.error("Brief submission failed", cause);
    return NextResponse.json({ error: "No se pudo enviar la solicitud." }, { status: 500 });
  }
}
