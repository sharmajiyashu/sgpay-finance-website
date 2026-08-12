export type InsuranceVehicleType = "bike" | "car";

export type InsuranceSourceChannel = "website" | "admin" | "agent";

export interface InsuranceWidgetConfig {
  clientCode: string;
  agentCode: string;
  subAgentCode: string;
  sourceChannel: InsuranceSourceChannel;
  sourceLabel: string;
  widgetBaseUrl: string;
  /** Choice Connect ptr/token access token → widget X_API_KEY */
  xApiKey: string;
  configured?: boolean;
  authConfigured?: boolean;
}

export interface CreateInsuranceLeadInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  uuid?: string;
  refId?: string;
  metadata?: Record<string, unknown>;
}

export interface InsuranceLead {
  _id: string;
  uuid?: string;
  productType: "motor-insurance";
  sourceChannel: InsuranceSourceChannel;
  sourceLabel: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface InsuranceRemoteEnquiry {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface InsuranceSummaryResponse {
  configured: boolean;
  authConfigured?: boolean;
  productType?: string;
  local: {
    leads: InsuranceLead[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  remote: {
    available: boolean;
    error?: string;
    overall: {
      totalRecords: number;
      statusCounts: Record<string, number>;
      subServiceCounts: Record<string, number>;
    };
    enquiries: InsuranceRemoteEnquiry[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  widgetDefaults?: InsuranceWidgetConfig;
}

export interface InsuranceReferralLinkItem {
  title?: string;
  description?: string;
  link?: string;
  productType?: string;
}

export const INSURANCE_VEHICLE_TYPES: { value: InsuranceVehicleType; label: string }[] = [
  { value: "bike", label: "Bike (2W)" },
  { value: "car", label: "Car (4W)" },
];
