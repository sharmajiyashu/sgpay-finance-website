import { get, post } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";
import type {
  ChoiceReferralLinksResponse,
  ChoiceSsoPayload,
  ChoiceSummaryResponse,
  ChoiceWidgetConfig,
  CreateChoiceLeadInput,
} from "@/lib/choiceConnect/types";

export async function getAgentChoiceConnectConfig(): Promise<ChoiceWidgetConfig> {
  return get<ChoiceWidgetConfig>(AGENT_API_PATHS.choiceConnectConfig);
}

export async function createAgentChoiceConnectLead(
  input: CreateChoiceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return post<{ _id: string; uuid?: string }>(AGENT_API_PATHS.choiceConnectLeads, input);
}

export async function getAgentChoiceConnectSummary(
  params: Record<string, string | number | undefined>
): Promise<ChoiceSummaryResponse> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return get<ChoiceSummaryResponse>(
    `${AGENT_API_PATHS.choiceConnectSummary}${qs ? `?${qs}` : ""}`,
    { timeout: 30000 }
  );
}

export async function getAgentChoiceConnectSsoPayload(): Promise<ChoiceSsoPayload> {
  return get<ChoiceSsoPayload>(AGENT_API_PATHS.choiceConnectSsoPayload);
}

export async function getAgentChoiceConnectReferralLinks(
  agentCode?: string
): Promise<ChoiceReferralLinksResponse> {
  const qs = agentCode ? `?agentCode=${encodeURIComponent(agentCode)}` : "";
  return get<ChoiceReferralLinksResponse>(`${AGENT_API_PATHS.choiceConnectReferralLinks}${qs}`);
}

export const agentChoiceConnectApi = {
  getConfig: getAgentChoiceConnectConfig,
  createLead: createAgentChoiceConnectLead,
  getSummary: getAgentChoiceConnectSummary,
  getSsoPayload: getAgentChoiceConnectSsoPayload,
  getReferralLinks: getAgentChoiceConnectReferralLinks,
};
