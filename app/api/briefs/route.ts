import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { calculateComplexity } from "@/lib/complexity";
import { BriefValidationError, parseBrief } from "@/lib/brief-input";
import { formatBriefEmail } from "@/lib/brief-email";
import { estimatePrice } from "@/lib/pricing";
import { createQuotePdf } from "@/lib/quote-pdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 50000) return NextResponse.json({ error: "La solicitud es demasiado grande." }, { status: 413 });
    const payload: unknown = JSON.parse(raw);
    const brief = parseBrief(payload);
    const complexity = calculateComplexity(brief);
    const user = process.env.GMAIL_USER;
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    if (!user || !appPassword) throw new Error("Gmail no configurado.");
    const estimate = estimatePrice(brief);
    const reference = `JWK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const email = formatBriefEmail(brief, complexity, estimate, reference);
    const pdf = await createQuotePdf(brief, estimate, reference);
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: appPassword },
      connectionTimeout: 10000,
      socketTimeout: 15000
    });
    await transport.sendMail({
      from: user,
      to: user,
      replyTo: brief.email,
      ...email,
      attachments: [{ filename: `cotizacion-preliminar-${reference}.pdf`, content: pdf, contentType: "application/pdf" }]
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (cause) {
    if (cause instanceof SyntaxError) return NextResponse.json({ error: "El formato de la solicitud no es válido." }, { status: 400 });
    if (cause instanceof BriefValidationError) return NextResponse.json({ error: cause.message }, { status: 400 });
    console.error("Brief submission failed", cause);
    return NextResponse.json({ error: "No se pudo enviar la solicitud." }, { status: 500 });
  }
}
