import { get, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type {
  CreateInsuranceLeadInput,
  InsuranceReferralLinkItem,
  InsuranceSummaryResponse,
  InsuranceWidgetConfig,
} from "@/modules/insurance/types";

export async function getAdminInsuranceConfig(): Promise<InsuranceWidgetConfig> {
  return get<InsuranceWidgetConfig>(ADMIN_API_PATHS.insuranceConfig);
}

export async function createAdminInsuranceLead(
  input: CreateInsuranceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return post<{ _id: string; uuid?: string }>(ADMIN_API_PATHS.insuranceLeads, input);
}

export async function getAdminInsuranceSummary(
  params: Record<string, string | number | undefined>
): Promise<InsuranceSummaryResponse> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return get<InsuranceSummaryResponse>(
    `${ADMIN_API_PATHS.insuranceSummary}${qs ? `?${qs}` : ""}`,
    { timeout: 60000 }
  );
}

export async function getAdminInsuranceReferralLinks(
  agentCode?: string
): Promise<{ links: InsuranceReferralLinkItem[]; agentCode?: string }> {
  const qs = agentCode ? `?agentCode=${encodeURIComponent(agentCode)}` : "";
  return get(`${ADMIN_API_PATHS.insuranceReferralLinks}${qs}`);
}

export const adminInsuranceApi = {
  getConfig: getAdminInsuranceConfig,
  createLead: createAdminInsuranceLead,
  getSummary: getAdminInsuranceSummary,
  getReferralLinks: getAdminInsuranceReferralLinks,
};
