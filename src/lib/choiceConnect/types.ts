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

export interface ChoiceLead {
  _id: string;
  uuid?: string;
  productType: ChoiceProductType;
  sourceChannel: ChoiceSourceChannel;
  sourceLabel: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: string;
  subStatus?: string;
  createdAt: string;
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
  status?: string;
  subStatus?: string;
  state?: string;
  district?: string;
  createdAt?: string;
  updatedAt?: string;
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
