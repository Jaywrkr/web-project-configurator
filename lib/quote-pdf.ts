import PDFDocument from "pdfkit";
import type { Brief } from "./types";
import { formatUsd, type PriceEstimate } from "./pricing";

const ink = "#1d241d";
const muted = "#647064";
const accent = "#a4ba83";
const line = "#dce2d8";
const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 48;
const contentWidth = pageWidth - margin * 2;

const short = (value: string, limit = 190) => value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
const pdfText = (value: string) => value.replace(/[‐‑‒–—−]/g, "-");

export async function createQuotePdf(brief: Brief, estimate: PriceEstimate, reference: string): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: false, info: { Title: `Cotización preliminar ${reference}`, Author: "jaywrkr" } });
  const chunks: Buffer[] = [];
  const completed = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  let page = 0;
  let y = 0;

  function footer() {
    doc.moveTo(margin, pageHeight - 47).lineTo(pageWidth - margin, pageHeight - 47).strokeColor(line).lineWidth(1).stroke();
    doc.font("Helvetica").fontSize(8).fillColor(muted).text("JAYWRKR  ·  BORRADOR PARA REVISIÓN INTERNA", margin, pageHeight - 36, { width: contentWidth - 70 });
    doc.text(String(page), pageWidth - margin - 35, pageHeight - 36, { width: 35, align: "right" });
  }

  function addPage() {
    if (page) footer();
    doc.addPage();
    page += 1;
    if (page === 1) {
      doc.rect(0, 0, pageWidth, 182).fill(ink);
      doc.font("Helvetica-Bold").fontSize(11).fillColor(accent).text("JAYWRKR", margin, 42);
      doc.font("Helvetica-Bold").fontSize(27).fillColor("#ffffff").text("Cotización preliminar", margin, 82, { width: contentWidth });
      doc.font("Helvetica").fontSize(10).fillColor("#d4ddcd").text(`Referencia ${reference}  ·  ${new Date().toLocaleDateString("es-EC")}`, margin, 136);
      y = 215;
    } else {
      doc.font("Helvetica-Bold").fontSize(10).fillColor(muted).text(`JAYWRKR  /  ${reference}`, margin, 42);
      y = 76;
    }
  }

  function ensureSpace(height: number) {
    if (y + height > pageHeight - 72) addPage();
  }

  function section(title: string) {
    ensureSpace(43);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(muted).text(title.toUpperCase(), margin, y, { characterSpacing: 1.3 });
    y += 18;
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor(line).lineWidth(1).stroke();
    y += 14;
  }

  function pair(label: string, value: string) {
    const safeValue = pdfText(short(value || "No indicado"));
    doc.font("Helvetica").fontSize(10);
    const height = Math.max(18, doc.heightOfString(safeValue, { width: contentWidth - 158 }) + 3);
    ensureSpace(height + 8);
    doc.font("Helvetica").fontSize(10);
    doc.fillColor(muted).text(pdfText(label), margin, y, { width: 145 });
    doc.fillColor(ink).text(safeValue, margin + 158, y, { width: contentWidth - 158 });
    y += height + 8;
  }

  addPage();
  section("Cliente y proyecto");
  pair("Empresa", brief.company);
  pair("Contacto", brief.contact_name);
  pair("Correo", brief.email);
  pair("Tipos de proyecto", brief.project_types.join(", "));
  pair("Páginas", brief.page_count);
  if (brief.product_count) pair("Productos", brief.product_count);
  if (brief.deadline) pair("Plazo solicitado", brief.deadline);

  y += 12;
  section("Desglose estimado · USD");
  for (const item of estimate.items) {
    doc.font("Helvetica").fontSize(10);
    const label = pdfText(item.label);
    const height = Math.max(18, doc.heightOfString(label, { width: contentWidth - 120 }) + 4);
    ensureSpace(height + 8);
    doc.font("Helvetica").fontSize(10);
    doc.fillColor(ink).text(label, margin, y, { width: contentWidth - 120 });
    doc.font("Helvetica-Bold").text(formatUsd(item.amount), pageWidth - margin - 110, y, { width: 110, align: "right" });
    y += height + 8;
  }
  ensureSpace(74);
  doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor(line).stroke();
  y += 18;
  doc.font("Helvetica-Bold").fontSize(12).fillColor(ink).text("TOTAL ESTIMADO", margin, y);
  doc.fontSize(22).text(formatUsd(estimate.total), pageWidth - margin - 170, y - 5, { width: 170, align: "right" });
  y += 60;

  section("Alcance indicado");
  pair("Secciones", brief.sections.join(", "));
  if (brief.admin_features.length) pair("Administración", brief.admin_features.join(", "));
  if (brief.integrations.length) pair("Integraciones", brief.integrations.join(", "));
  if (brief.content_help.length) pair("Ayuda con contenido", brief.content_help.join(", "));

  if (estimate.reviewReasons.length) {
    y += 9;
    section("Puntos por confirmar");
    for (const reason of estimate.reviewReasons) pair("-", reason);
  }

  ensureSpace(110);
  y += 13;
  doc.roundedRect(margin, y, contentWidth, 92, 5).fill("#eef2e8");
  doc.font("Helvetica-Bold").fontSize(10).fillColor(ink).text("ANTES DE ENVIAR AL CLIENTE", margin + 18, y + 16);
  doc.font("Helvetica").fontSize(9).fillColor("#4e5b4c").text(
    "Revisar alcance, entregables, calendario, impuestos y costos de dominio, hosting, correo o servicios externos. Este documento es un borrador interno basado en el formulario; no constituye una oferta final.",
    margin + 18, y + 36, { width: contentWidth - 36, lineGap: 2 }
  );
  footer();
  doc.end();
  return completed;
}
