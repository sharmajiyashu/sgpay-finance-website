import { get, post } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";
import type {
  CreateInsuranceLeadInput,
  InsuranceReferralLinkItem,
  InsuranceSummaryResponse,
  InsuranceWidgetConfig,
} from "@/modules/insurance/types";

export async function getAgentInsuranceConfig(): Promise<InsuranceWidgetConfig> {
  return get<InsuranceWidgetConfig>(AGENT_API_PATHS.insuranceConfig);
}

export async function createAgentInsuranceLead(
  input: CreateInsuranceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return post<{ _id: string; uuid?: string }>(AGENT_API_PATHS.insuranceLeads, input);
}

export async function getAgentInsuranceSummary(
  params: Record<string, string | number | undefined>
): Promise<InsuranceSummaryResponse> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return get<InsuranceSummaryResponse>(
    `${AGENT_API_PATHS.insuranceSummary}${qs ? `?${qs}` : ""}`,
    { timeout: 60000 }
  );
}

export async function getAgentInsuranceReferralLinks(
  agentCode?: string
): Promise<{
  links: InsuranceReferralLinkItem[];
  agentCode?: string;
  referrerName?: string;
  referrerRole?: string;
}> {
  const qs = agentCode ? `?agentCode=${encodeURIComponent(agentCode)}` : "";
  return get(`${AGENT_API_PATHS.insuranceReferralLinks}${qs}`);
}

export const agentInsuranceApi = {
  getConfig: getAgentInsuranceConfig,
  createLead: createAgentInsuranceLead,
  getSummary: getAgentInsuranceSummary,
  getReferralLinks: getAgentInsuranceReferralLinks,
};
