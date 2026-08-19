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
}

export interface ChoiceReferralLinkItem {
  title?: string;
  description?: string;
  link?: string;
  productType?: string;
}

export interface ChoiceReferralLinksResponse {
  links: ChoiceReferralLinkItem[];
  agentCode?: string;
}

export interface ChoiceOnboardInput {
  userId?: string;
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
  subAgentName?: string;
  subAgentCode?: string;
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

export const CHOICE_VEHICLE_TYPES: { value: ChoiceVehicleType; label: string }[] = [
  { value: "bike", label: "Bike (2W)" },
  { value: "car", label: "Car (4W)" },
];

export function formatProductLabel(productType: string): string {
  if (productType === "credit-card") return "Credit Card";
  if (productType === "motor-insurance") return "Motor Insurance";
  const loan = CHOICE_LOAN_PRODUCTS.find((p) => p.value === productType);
  return loan?.label ?? productType.replace(/-/g, " ");
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
