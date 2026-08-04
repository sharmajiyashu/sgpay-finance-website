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
  href: string;
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
    href: "/admin/enquiries/loans",
    services: mapServices(LOAN_PRODUCTS),
  },
  {
    id: "finance",
    label: "Finance",
    href: "/admin/enquiries/finance",
    services: mapServices(FINANCE_SERVICES),
  },
  {
    id: "insurance",
    label: "Insurance",
    href: "/admin/enquiries/insurance",
    services: mapServices(INSURANCE_SERVICES),
  },
  {
    id: "accounts",
    label: "Accounts",
    href: "/admin/enquiries/accounts",
    services: mapServices(ACCOUNT_SERVICES),
  },
  {
    id: "contact",
    label: "Contact",
    href: "/admin/enquiries/contact",
    services: [
      { slug: "contact", label: "Contact Page" },
      { slug: "homepage", label: "Homepage" },
    ],
  },
  {
    id: "cibil",
    label: "CIBIL Check",
    href: "/admin/enquiries/cibil",
    services: [{ slug: "check-cibil", label: "Check CIBIL Score" }],
  },
  {
    id: "bill-payment",
    label: "Bill Payments",
    href: "/admin/enquiries/bill-payment",
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
    href: "/admin/enquiries/projects",
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
