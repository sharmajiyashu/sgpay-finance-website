import { get, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type {
  ChoiceOnboardInput,
  ChoiceOnboardResult,
  ChoiceReferralLinksResponse,
  ChoiceSsoPayload,
  ChoiceSummaryResponse,
  ChoiceWidgetConfig,
  CreateChoiceLeadInput,
} from "@/lib/choiceConnect/types";

export async function getChoiceConnectConfig(): Promise<ChoiceWidgetConfig> {
  return get<ChoiceWidgetConfig>(ADMIN_API_PATHS.choiceConnectConfig);
}

export async function createChoiceConnectLead(
  input: CreateChoiceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return post<{ _id: string; uuid?: string }>(ADMIN_API_PATHS.choiceConnectLeads, input);
}

export async function getChoiceConnectSummary(
  params: Record<string, string | number | undefined>
): Promise<ChoiceSummaryResponse> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return get<ChoiceSummaryResponse>(
    `${ADMIN_API_PATHS.choiceConnectSummary}${qs ? `?${qs}` : ""}`,
    { timeout: 60000 }
  );
}

export async function getChoiceConnectSsoPayload(): Promise<ChoiceSsoPayload> {
  return get<ChoiceSsoPayload>(ADMIN_API_PATHS.choiceConnectSsoPayload);
}

export async function getChoiceConnectReferralLinks(
  agentCode?: string
): Promise<ChoiceReferralLinksResponse> {
  const qs = agentCode ? `?agentCode=${encodeURIComponent(agentCode)}` : "";
  return get<ChoiceReferralLinksResponse>(`${ADMIN_API_PATHS.choiceConnectReferralLinks}${qs}`);
}

export async function onboardChoiceConnectAgent(
  input: ChoiceOnboardInput
): Promise<ChoiceOnboardResult> {
  return post<ChoiceOnboardResult>(ADMIN_API_PATHS.choiceConnectOnboard, input);
}

export async function getChoiceConnectDiagnostics(): Promise<{
  steps: NonNullable<ChoiceSummaryResponse["remote"]["debug"]>["steps"];
  reportText: string;
  config: Record<string, string | boolean>;
}> {
  return get(ADMIN_API_PATHS.choiceConnectDiagnostics);
}

export const adminChoiceConnectApi = {
  getConfig: getChoiceConnectConfig,
  createLead: createChoiceConnectLead,
  getSummary: getChoiceConnectSummary,
  getSsoPayload: getChoiceConnectSsoPayload,
  getReferralLinks: getChoiceConnectReferralLinks,
  onboardAgent: onboardChoiceConnectAgent,
};
