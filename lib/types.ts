export type ProjectType = "Web corporativa" | "Catálogo" | "E-commerce" | "Landing page" | "Portal / sistema web" | "Rediseño de web existente";
export type Brief = {
  company: string; contact_name: string; email: string; phone: string;
  project_type: ProjectType | ""; sections: string[]; other_section: string; page_count: string;
  product_count: string; product_features: string[]; commerce_type: string; commerce_features: string[];
  admin_features: string[]; brand_status: string; reference_urls: string[];
  available_content: string[]; content_help: string[]; integrations: string[]; integration_notes: string;
  domain_status: string; hosting_status: string; email_status: string; email_accounts: string;
  deadline: string; deadline_date: string; budget: string; notes: string;
};
export type ComplexityLevel = "Baja" | "Media" | "Alta" | "Muy alta";
export const emptyBrief: Brief = {
  company: "", contact_name: "", email: "", phone: "", project_type: "", sections: [], other_section: "", page_count: "",
  product_count: "", product_features: [], commerce_type: "", commerce_features: [], admin_features: [], brand_status: "",
  reference_urls: [], available_content: [], content_help: [], integrations: [], integration_notes: "", domain_status: "",
  hosting_status: "", email_status: "", email_accounts: "", deadline: "", deadline_date: "", budget: "", notes: ""
};
