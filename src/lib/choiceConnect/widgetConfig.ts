import { CHOICE_CONNECT_CONFIG } from "@/lib/config/env";
import type {
  ChoiceSourceChannel,
  ChoiceVehicleType,
  ChoiceWidgetConfig,
} from "@/lib/choiceConnect/types";

export interface WidgetPartnerConfigOptions {
  uuid?: string;
  productType?: string;
  vehicleType?: ChoiceVehicleType;
}

/** Build partner_config for Choice Connect widget.js (per integration PDF). */
export function buildWidgetPartnerConfig(
  config: ChoiceWidgetConfig,
  options: WidgetPartnerConfigOptions = {}
): Record<string, string> {
  const isMotor = options.productType === "motor-insurance";

  const partner_config: Record<string, string> = {
    CLIENT_CODE: config.clientCode.trim(),
    // Motor Insurance doc uses SOURCE=connect; credit-card/loans use PARTNER_WEB.
    SOURCE: isMotor ? "connect" : "PARTNER_WEB",
    AGENT_CODE: config.agentCode.trim(),
  };

  if (isMotor && config.xApiKey?.trim()) {
    partner_config.X_API_KEY = config.xApiKey.trim();
  }

  // PDF: UUID only when continuing an existing enquiry from summary API.
  if (options.uuid?.trim()) {
    partner_config.UUID = options.uuid.trim();
  }

  // PDF: customer-based website journey — keep SUB_AGENT_CODE empty.
  if (config.subAgentCode?.trim()) {
    partner_config.SUB_AGENT_CODE = config.subAgentCode.trim();
  }

  if (isMotor && options.vehicleType) {
    partner_config.VEHICLE_TYPE = options.vehicleType;
  }

  if (
    options.productType &&
    options.productType !== "credit-card" &&
    options.productType !== "motor-insurance"
  ) {
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

export function validateWidgetConfig(
  config: ChoiceWidgetConfig,
  productType?: string
): string | null {
  if (!config.clientCode?.trim()) return "CLIENT_CODE (partner_id) is not configured.";
  if (!config.agentCode?.trim()) {
    return "CBA code (AGENT_CODE) is required. Set NEXT_PUBLIC_CHOICE_CONNECT_CBA_CODE.";
  }
  if (!config.widgetBaseUrl?.trim()) return "Widget base URL is not configured.";
  if (productType === "motor-insurance" && !config.xApiKey?.trim()) {
    return "X_API_KEY is required for Motor Insurance. Ensure Choice Connect API credentials are configured on SG-Backend.";
  }
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
