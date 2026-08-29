import {
  LOAN_PRODUCTS,
  FINANCE_SERVICES,
  INSURANCE_SERVICES,
  ACCOUNT_SERVICES,
} from "@/data/servicesData";

export interface EnquiryServiceOption {
  slug: string;
  label: string;
}

export interface EnquiryCategory {
  id: string;
  label: string;
  services: EnquiryServiceOption[];
}

function mapServices(items: { slug: string; title: string }[]): EnquiryServiceOption[] {
  return items.map((item) => ({ slug: item.slug, label: item.title }));
}

/** Website enquiry categories — `type` stored in DB, `service` = slug or page id */
export const ENQUIRY_CATEGORIES: EnquiryCategory[] = [
  {
    id: "loans",
    label: "Loans",
    services: mapServices(LOAN_PRODUCTS),
  },
  {
    id: "finance",
    label: "Finance",
    services: [
      ...mapServices(FINANCE_SERVICES),
      { slug: "roar-credit-card", label: "Roar Credit Card" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    services: mapServices(INSURANCE_SERVICES),
  },
  {
    id: "accounts",
    label: "Accounts",
    services: mapServices(ACCOUNT_SERVICES),
  },
  {
    id: "contact",
    label: "Contact",
    services: [
      { slug: "contact", label: "Contact Page" },
      { slug: "homepage", label: "Homepage" },
    ],
  },
  {
    id: "cibil",
    label: "CIBIL Check",
    services: [{ slug: "check-cibil", label: "Check CIBIL Score" }],
  },
  {
    id: "bill-payment",
    label: "Bill Payments",
    services: [
      { slug: "electricity", label: "Electricity Bill" },
      { slug: "mobile", label: "Mobile Recharge" },
      { slug: "dth", label: "DTH Connection" },
      { slug: "broadband", label: "Broadband / Landline" },
      { slug: "water", label: "Water Bill Payment" },
      { slug: "gas", label: "LPG Gas / Piped Gas" },
      { slug: "fastag", label: "FASTag Recharge" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    services: [{ slug: "project-enquiry", label: "Real Estate Projects" }],
  },
];

export const ENQUIRY_CATEGORY_IDS = ENQUIRY_CATEGORIES.map((c) => c.id);

export function isEnquiryCategoryId(value: string): value is (typeof ENQUIRY_CATEGORY_IDS)[number] {
  return ENQUIRY_CATEGORY_IDS.includes(value);
}

export function getEnquiryCategory(id: string): EnquiryCategory | undefined {
  return ENQUIRY_CATEGORIES.find((c) => c.id === id);
}

export function getCategoryLabel(type: string): string {
  return getEnquiryCategory(type)?.label ?? type.replace(/-/g, " ");
}

export function getServiceLabel(type: string, serviceSlug?: string): string {
  if (!serviceSlug) return "—";
  const category = getEnquiryCategory(type);
  const match = category?.services.find((s) => s.slug === serviceSlug);
  return match?.label ?? serviceSlug.replace(/-/g, " ");
}

export function getServicesForCategory(categoryId: string): EnquiryServiceOption[] {
  return getEnquiryCategory(categoryId)?.services ?? [];
}

export interface EnquiryFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  pageUrl?: string;
  metadata?: Record<string, unknown>;
}

export function buildEnquiryPayload(
  categoryId: string,
  serviceSlug: string,
  fields: EnquiryFormPayload
) {
  return {
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    subject: fields.subject,
    type: categoryId,
    service: serviceSlug,
    pageUrl: fields.pageUrl,
    message: fields.message,
    metadata: fields.metadata,
  };
}

export function getEnquiryCatalogStats() {
  const servicePages = ENQUIRY_CATEGORIES.reduce((sum, c) => sum + c.services.length, 0);
  return {
    categories: ENQUIRY_CATEGORIES.length,
    servicePages,
  };
}
