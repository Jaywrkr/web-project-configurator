import type { Brief } from "./types";

export type PricingConfig = {
  enabled: boolean;
  basePrice: Record<string, number>;
  pagesCost: Record<string, number>;
  catalogCost: Record<string, number>;
  adminCost: number;
  integrationCost: Record<string, number>;
  contentCost: Record<string, number>;
  urgencyCost: Record<string, number>;
};

export const pricingConfig: PricingConfig = {
  enabled: false,
  basePrice: {}, pagesCost: {}, catalogCost: {}, adminCost: 0,
  integrationCost: {}, contentCost: {}, urgencyCost: {}
};

export function estimatePrice(brief: Brief, config = pricingConfig): number | null {
  if (!config.enabled) return null;
  return brief.project_types.reduce((sum, type) => sum + (config.basePrice[type] ?? 0), 0)
    + (config.pagesCost[brief.page_count] ?? 0)
    + (config.catalogCost[brief.product_count] ?? 0)
    + brief.admin_features.length * config.adminCost
    + brief.integrations.reduce((sum, key) => sum + (config.integrationCost[key] ?? 0), 0)
    + brief.content_help.reduce((sum, key) => sum + (config.contentCost[key] ?? 0), 0)
    + (config.urgencyCost[brief.deadline] ?? 0);
}
