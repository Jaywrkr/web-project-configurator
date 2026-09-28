import * as choices from "./options";
import { emptyBrief, type Brief, type ProjectType } from "./types";
import { hasProducts, validateStep } from "./validation";

export class BriefValidationError extends Error {}

const clean = (value: unknown, limit = 3000) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const pick = (value: unknown, allowed: readonly string[]) => allowed.includes(value as string) ? value as string : "";
const pickMany = (value: unknown, allowed: readonly string[]) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && allowed.includes(item)))].slice(0, allowed.length) : [];

export function parseBrief(input: unknown): Brief {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new BriefValidationError("Solicitud inválida.");
  const data = input as Record<string, unknown>;
  const brief: Brief = {
    ...emptyBrief,
    company: clean(data.company, 120), contact_name: clean(data.contact_name, 120), email: clean(data.email, 254), phone: clean(data.phone, 40),
    project_types: (Array.isArray(data.project_types) ? pickMany(data.project_types, choices.projectTypes) : [pick(data.project_type, choices.projectTypes)].filter(Boolean)) as ProjectType[],
    sections: pickMany(data.sections, choices.sections), other_section: clean(data.other_section, 120), page_count: pick(data.page_count, choices.pageCounts),
    product_count: pick(data.product_count, choices.productCounts), product_features: pickMany(data.product_features, choices.productFeatures),
    commerce_type: pick(data.commerce_type, choices.commerceTypes), commerce_features: pickMany(data.commerce_features, choices.commerceFeatures),
    admin_features: pickMany(data.admin_features, choices.adminFeatures), brand_status: pick(data.brand_status, choices.brandStatuses),
    reference_urls: Array.isArray(data.reference_urls) ? data.reference_urls.filter((item): item is string => typeof item === "string").slice(0, 5).map((item) => clean(item, 500)) : [],
    available_content: pickMany(data.available_content, choices.availableContent), content_help: pickMany(data.content_help, choices.contentHelp),
    integrations: pickMany(data.integrations, choices.integrations), integration_notes: clean(data.integration_notes, 1000),
    domain_status: pick(data.domain_status, choices.domainStatuses), hosting_status: pick(data.hosting_status, choices.hostingStatuses),
    email_status: pick(data.email_status, choices.emailStatuses), email_accounts: pick(data.email_accounts, choices.emailAccounts),
    deadline: pick(data.deadline, choices.deadlines), deadline_date: clean(data.deadline_date, 10), notes: clean(data.notes)
  };
  if (!hasProducts(brief)) {
    brief.product_count = ""; brief.product_features = []; brief.commerce_type = ""; brief.commerce_features = [];
  }
  if (brief.commerce_type !== "Comprar en línea") brief.commerce_features = [];
  if (!brief.sections.includes("Otra")) brief.other_section = "";
  if (!brief.integrations.some((item) => ["CRM", "ERP", "API externa", "Otro"].includes(item))) brief.integration_notes = "";
  if (brief.email_status !== "Necesitamos correo corporativo") brief.email_accounts = "";
  if (brief.admin_features.includes("No necesito editar nada")) brief.admin_features = ["No necesito editar nada"];
  if (brief.content_help.includes("No")) brief.content_help = ["No"];
  for (const step of [1, 2, 3, ...(hasProducts(brief) ? [4] : []), 5, 6, 7, 8, 9, 10, 11]) {
    const issue = validateStep(step, brief);
    if (issue) throw new BriefValidationError(issue);
  }
  for (const url of brief.reference_urls) {
    try { const parsed = new URL(url); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); }
    catch { throw new BriefValidationError("Una URL de referencia no es válida."); }
  }
  if (brief.deadline_date && !/^\d{4}-\d{2}-\d{2}$/.test(brief.deadline_date)) throw new BriefValidationError("La fecha indicada no es válida.");
  return brief;
}
