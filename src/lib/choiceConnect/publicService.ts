import { publicGet, publicPost, APP_API_PATHS } from "@/lib/public-api";
import type { ChoiceWidgetConfig, CreateChoiceLeadInput } from "@/lib/choiceConnect/types";
import { getWebsiteWidgetConfig } from "@/lib/choiceConnect/widgetConfig";

export async function createWebsiteChoiceLead(
  input: CreateChoiceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return publicPost<{ _id: string; uuid?: string }>(APP_API_PATHS.choiceConnectLeads, input);
}

/** Public config with X_API_KEY from backend; falls back to env-only config. */
export async function getWebsiteChoiceConnectConfig(): Promise<ChoiceWidgetConfig> {
  try {
    const remote = await publicGet<ChoiceWidgetConfig>(APP_API_PATHS.choiceConnectConfig, {
      timeout: 20000,
    });
    const fallback = getWebsiteWidgetConfig();
    return {
      ...fallback,
      ...remote,
      clientCode: remote.clientCode?.trim() || fallback.clientCode,
      agentCode: remote.agentCode?.trim() || fallback.agentCode,
      subAgentCode: "",
      sourceChannel: "website",
      sourceLabel: "Website",
      widgetBaseUrl: remote.widgetBaseUrl?.trim() || fallback.widgetBaseUrl,
      xApiKey: remote.xApiKey?.trim() || "",
    };
  } catch {
    return getWebsiteWidgetConfig();
  }
}
