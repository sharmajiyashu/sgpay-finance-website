import { CHOICE_CONNECT_CONFIG } from "@/lib/config/env";
import type { ChoiceSourceChannel, ChoiceWidgetConfig } from "@/lib/choiceConnect/types";

export interface WidgetPartnerConfigOptions {
  uuid?: string;
  productType?: string;
}

/** Build partner_config for Choice Connect widget.js (per integration PDF). */
export function buildWidgetPartnerConfig(
  config: ChoiceWidgetConfig,
  options: WidgetPartnerConfigOptions = {}
): Record<string, string> {
  const partner_config: Record<string, string> = {
    CLIENT_CODE: config.clientCode.trim(),
    SOURCE: "PARTNER_WEB",
    AGENT_CODE: config.agentCode.trim(),
  };

  // PDF: UUID only when continuing an existing enquiry from summary API.
  if (options.uuid?.trim()) {
    partner_config.UUID = options.uuid.trim();
  }

  // PDF: customer-based website journey — keep SUB_AGENT_CODE empty.
  if (config.subAgentCode?.trim()) {
    partner_config.SUB_AGENT_CODE = config.subAgentCode.trim();
  }

  if (options.productType && options.productType !== "credit-card") {
    partner_config.PRODUCT_TYPE = options.productType;
  }

  return partner_config;
}

export function getWebsiteWidgetConfig(): ChoiceWidgetConfig {
  return {
    clientCode: CHOICE_CONNECT_CONFIG.clientCode,
    agentCode: CHOICE_CONNECT_CONFIG.cbaCode,
    // Customer journey on public website — no sub-agent code (Choice Connect PDF).
    subAgentCode: "",
    sourceChannel: "website" as const,
    sourceLabel: "Website",
    widgetBaseUrl: CHOICE_CONNECT_CONFIG.widgetBaseUrl,
  };
}

export function validateWidgetConfig(config: ChoiceWidgetConfig): string | null {
  if (!config.clientCode?.trim()) return "CLIENT_CODE (partner_id) is not configured.";
  if (!config.agentCode?.trim()) return "CBA code (AGENT_CODE) is required. Set NEXT_PUBLIC_CHOICE_CONNECT_CBA_CODE=C0002020 for UAT.";
  if (!config.widgetBaseUrl?.trim()) return "Widget base URL is not configured.";
  return null;
}

export function getStaffWidgetConfig(
  base: ChoiceWidgetConfig,
  sourceChannel: ChoiceSourceChannel,
  sourceLabel: string,
  subAgentCode: string
): ChoiceWidgetConfig {
  return {
    ...base,
    sourceChannel,
    sourceLabel,
    subAgentCode,
  };
}

export const CHOICE_WIDGET_SCRIPT_URL = `${CHOICE_CONNECT_CONFIG.widgetBaseUrl}/widget/widget.js`;
