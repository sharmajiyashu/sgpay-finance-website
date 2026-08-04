export type ChoiceProductType =
  | "credit-card"
  | "personal-loan"
  | "business-loan"
  | "home-loan"
  | "other-loan";

export type ChoiceSourceChannel = "website" | "admin" | "agent";

export interface ChoiceWidgetConfig {
  clientCode: string;
  agentCode: string;
  subAgentCode: string;
  sourceChannel: ChoiceSourceChannel;
  sourceLabel: string;
  widgetBaseUrl: string;
  configured?: boolean;
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

export interface ChoiceRemoteSummary {
  available: boolean;
  error?: string;
  overall: {
    totalRecords: number;
    statusCounts: Record<string, number>;
    subServiceCounts: Record<string, number>;
  };
  enquiries: ChoiceRemoteEnquiry[];
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
}

export const CHOICE_LOAN_PRODUCTS = [
  { value: "personal-loan" as const, label: "Personal Loan" },
  { value: "business-loan" as const, label: "Business Loan" },
  { value: "home-loan" as const, label: "Home Loan" },
  { value: "other-loan" as const, label: "Other Loan" },
];

export function formatProductLabel(productType: string): string {
  if (productType === "credit-card") return "Credit Card";
  const loan = CHOICE_LOAN_PRODUCTS.find((p) => p.value === productType);
  return loan?.label ?? productType.replace(/-/g, " ");
}

export function formatSourceLabel(lead: ChoiceLead): string {
  return lead.sourceLabel || lead.sourceChannel;
}
