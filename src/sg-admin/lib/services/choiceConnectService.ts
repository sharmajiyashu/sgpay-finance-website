import { get, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type {
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
    `${ADMIN_API_PATHS.choiceConnectSummary}${qs ? `?${qs}` : ""}`
  );
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
};
