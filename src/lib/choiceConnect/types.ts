export type ChoiceProductType =
  | "credit-card"
  | "personal-loan"
  | "business-loan"
  | "home-loan"
  | "other-loan"
  | "motor-insurance";

export type ChoiceVehicleType = "bike" | "car";

export type ChoiceSourceChannel = "website" | "admin" | "agent";

export interface ChoiceConnectProfile {
  onboarded: boolean;
  agentCode?: string;
  oprId?: string;
  subjectId?: string;
  onboardedAt?: string;
}

export interface ChoiceWidgetConfig {
  clientCode: string;
  agentCode: string;
  subAgentCode: string;
  agentName?: string;
  staffRole?: string;
  staffRoleLabel?: string;
  staffEmail?: string;
  staffMobile?: string;
  sourceChannel: ChoiceSourceChannel;
  sourceLabel: string;
  widgetBaseUrl: string;
  /** Choice access token for Motor Insurance widget (X_API_KEY) */
  xApiKey?: string;
  configured?: boolean;
  authConfigured?: boolean;
  ssoConfigured?: boolean;
  choiceConnectProfile?: ChoiceConnectProfile;
}

export interface ChoiceSsoPayload {
  opr_id: string;
  user_type: string;
  unique_request_number: string;
  hash_value: string;
  request_number: string;
  hash: string;
  login_url: string;
  referrerName?: string;
  referrerRole?: string;
  agentCode?: string;
  usingOwnSubject?: boolean;
}

export interface ChoiceReferralLinkItem {
  title?: string;
  description?: string;
  link?: string;
  productType?: string;
  service?: string;
  subService?: string;
}

export interface ChoiceReferralLinksResponse {
  links: ChoiceReferralLinkItem[];
  agentCode?: string;
  referrerName?: string;
  referrerRole?: string;
}

export interface ChoiceOnboardInput {
  userId?: string;
  userType?: "agent" | "team";
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  panCard?: string;
  oprId: string;
  referralCode?: string;
  city?: string;
  agentCode?: string;
}

export interface ChoiceOnboardResult {
  response: unknown;
  choiceSubjectId?: string;
  oprId: string;
}

export interface ChoiceLeadStaff {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  userRole?: string;
  designation?: string;
  agentType?: string;
  city?: string;
  stateCode?: string;
  choiceConnectAgentCode?: string;
}

export interface ChoiceLeadStaffSnapshot {
  userId?: string;
  name?: string;
  email?: string;
  mobile?: string;
  userRole?: string;
  designation?: string;
  agentType?: string;
  roleLabel?: string;
  choiceConnectAgentCode?: string;
}

export interface ChoiceLead {
  _id: string;
  uuid?: string;
  productType: ChoiceProductType;
  sourceChannel: ChoiceSourceChannel;
  sourceLabel: string;
  agentCode?: string;
  subAgentCode?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: string;
  subStatus?: string;
  createdAt: string;
  updatedAt?: string;
  createdByUserId?: string | ChoiceLeadStaff;
  metadata?: {
    staff?: ChoiceLeadStaffSnapshot;
    [key: string]: unknown;
  };
}

export interface ChoiceRemoteEnquiry {
  enquiryId: string;
  uuid?: string;
  customerName?: string;
  customerEmail?: string;
  customerMobile?: string;
  serviceType?: string;
  subService?: string;
  agentName?: string;
  agentCode?: string;
  cbaCode?: string;
  oprId?: string;
  subAgentName?: string;
  subAgentCode?: string;
  referredByName?: string;
  status?: string;
  subStatus?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  remarks?: string;
  bankName?: string;
  cardType?: string;
  createdAt?: string;
  updatedAt?: string;
  raw?: Record<string, unknown>;
}

export interface ChoiceRemotePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  offset: number;
}

export interface ChoiceRemoteSummary {
  available: boolean;
  error?: string;
  overall: {
    totalRecords: number;
    statusCounts: Record<string, number>;
    subServiceCounts: Record<string, number>;
  };
  enquiries: ChoiceRemoteEnquiry[];
  pagination?: ChoiceRemotePagination;
  debug?: {
    steps: Array<{
      step: string;
      success: boolean;
      url?: string;
      httpStatus?: number;
      request?: Record<string, unknown>;
      responsePreview?: string;
      error?: string;
    }>;
    reportText: string;
  };
}

export interface ChoiceSummaryResponse {
  configured: boolean;
  authConfigured?: boolean;
  local: {
    leads: ChoiceLead[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  remote: ChoiceRemoteSummary;
  widgetDefaults: ChoiceWidgetConfig;
}

export interface CreateChoiceLeadInput {
  productType: ChoiceProductType;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  uuid?: string;
  agentCode?: string;
  subAgentCode?: string;
  refId?: string;
  metadata?: Record<string, unknown>;
}

export const CHOICE_LOAN_PRODUCTS = [
  { value: "personal-loan" as const, label: "Personal Loan" },
  { value: "business-loan" as const, label: "Business Loan" },
  { value: "home-loan" as const, label: "Home Loan" },
  { value: "other-loan" as const, label: "Other Loan" },
];

export const COMMISSION_PRODUCT_TYPES = [
  { value: "credit-card" as const, label: "Credit Card" },
  ...CHOICE_LOAN_PRODUCTS,
];

export const LOAN_PRODUCT_TYPE_VALUES = CHOICE_LOAN_PRODUCTS.map((p) => p.value);

export function isLoanProductType(productType?: string | null): boolean {
  if (!productType) return false;
  return (
    productType.endsWith("-loan") ||
    productType.includes("loan") ||
    productType === "solar_installation_loan" ||
    productType === "msme_loan"
  );
}

export function looksLikeAgentCode(value?: string | null): boolean {
  const v = value?.trim() || "";
  if (!v) return false;
  if (/^C\d{5,}$/i.test(v)) return true;
  if (/^SG[A-Z0-9]{4,}$/i.test(v)) return true;
  if (/^[0-9a-f]{24}$/i.test(v)) return true;
  return false;
}

function namesLookSame(left?: string | null, right?: string | null): boolean {
  const a = (left || "").toLowerCase().replace(/[^a-z]/g, "");
  const b = (right || "").toLowerCase().replace(/[^a-z]/g, "");
  return Boolean(a && b && (a === b || a.includes(b) || b.includes(a)));
}

export function resolveReferredByName(enquiry: ChoiceRemoteEnquiry): string {
  const candidates = [enquiry.referredByName, enquiry.subAgentName, enquiry.agentName];
  for (const value of candidates) {
    const name = value?.trim();
    if (!name || looksLikeAgentCode(name)) continue;
    if (namesLookSame(name, enquiry.customerName)) continue;
    return name;
  }
  return "";
}

export const CHOICE_VEHICLE_TYPES: { value: ChoiceVehicleType; label: string }[] = [
  { value: "bike", label: "Bike (2W)" },
  { value: "car", label: "Car (4W)" },
];

export function formatProductLabel(productType: string): string {
  if (productType === "credit-card") return "Credit Card";
  if (productType === "motor-insurance") return "Motor Insurance";
  if (productType === "solar_installation_loan" || productType === "solar-installation-loan") {
    return "Solar Installation Loan";
  }
  if (productType === "msme_loan" || productType === "msme-loan") return "MSME Loan";
  const loan = CHOICE_LOAN_PRODUCTS.find((p) => p.value === productType);
  return loan?.label ?? productType.replace(/[_-]/g, " ");
}

export function mapLoanSlugToProductType(slug: string): ChoiceProductType {
  if (slug.includes("personal")) return "personal-loan";
  if (slug.includes("business") || slug.includes("msme")) return "business-loan";
  if (slug.includes("home") || slug.includes("housing")) return "home-loan";
  return "other-loan";
}

export function referralLinkGroup(item: ChoiceReferralLinkItem): "credit-card" | "loan" | "insurance" | "other" {
  const key = `${item.productType ?? ""} ${item.service ?? ""} ${item.subService ?? ""} ${item.title ?? ""}`.toLowerCase();
  if (key.includes("credit") || key.includes("card")) return "credit-card";
  if (key.includes("loan")) return "loan";
  if (key.includes("insurance")) return "insurance";
  return "other";
}

export function formatSourceLabel(lead: ChoiceLead): string {
  return lead.sourceLabel || lead.sourceChannel;
}

export function formatStaffRole(role?: string | null): string {
  if (!role) return "";
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    state_head: "State Head (SH)",
    asm: "Sales Manager (ASM)",
    rm: "Relationship Manager (RM)",
    super_distributor: "Super Distributor",
    distributor: "Distributor",
    retailer: "Retailer",
    admin: "Admin",
    agent: "Agent",
  };
  return labels[role] || role.replace(/_/g, " ");
}

export function resolveLeadStaff(lead: ChoiceLead): {
  name: string;
  role: string;
  email?: string;
  mobile?: string;
  agentCode?: string;
} {
  const snapshot = lead.metadata?.staff;
  const populated =
    lead.createdByUserId && typeof lead.createdByUserId === "object"
      ? lead.createdByUserId
      : null;

  const name =
    snapshot?.name ||
    (populated
      ? [populated.firstName, populated.lastName].filter(Boolean).join(" ").trim() ||
        populated.email
      : "") ||
    "";

  const roleKey =
    snapshot?.roleLabel ||
    snapshot?.agentType ||
    snapshot?.designation ||
    populated?.agentType ||
    populated?.designation ||
    populated?.userRole ||
    "";

  return {
    name,
    role: snapshot?.roleLabel || formatStaffRole(roleKey),
    email: snapshot?.email || populated?.email,
    mobile: snapshot?.mobile || populated?.mobile,
    agentCode: snapshot?.choiceConnectAgentCode || populated?.choiceConnectAgentCode,
  };
}
