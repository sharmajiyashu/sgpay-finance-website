import type { InsuranceVehicleType, InsuranceWidgetConfig } from "@/modules/insurance/types";

export interface MotorPartnerConfigOptions {
  uuid?: string;
  vehicleType: InsuranceVehicleType;
}

/**
 * Choice Connect Motor Insurance partner_config (integration PDF).
 * X_API_KEY must be the access token from ptr/token (via SG-Backend).
 */
export function buildMotorPartnerConfig(
  config: InsuranceWidgetConfig,
  options: MotorPartnerConfigOptions
): Record<string, string> {
  const partner_config: Record<string, string> = {
    X_API_KEY: config.xApiKey.trim(),
    CLIENT_CODE: config.clientCode.trim() || "choice_connect",
    SOURCE: "connect",
    AGENT_CODE: config.agentCode.trim(),
    VEHICLE_TYPE: options.vehicleType,
  };

  if (options.uuid?.trim()) {
    partner_config.UUID = options.uuid.trim();
  }

  if (config.subAgentCode?.trim()) {
    partner_config.SUB_AGENT_CODE = config.subAgentCode.trim();
  }

  return partner_config;
}

export function validateMotorWidgetConfig(config: InsuranceWidgetConfig): string | null {
  if (!config.clientCode?.trim()) return "CLIENT_CODE is not configured on SG-Backend.";
  if (!config.agentCode?.trim()) return "AGENT_CODE (CBA) is not configured on SG-Backend.";
  if (!config.widgetBaseUrl?.trim()) return "Widget base URL is not configured on SG-Backend.";
  if (!config.xApiKey?.trim()) {
    return "X_API_KEY is required for Motor Insurance. Ensure Choice Connect ptr/token credentials are configured on SG-Backend.";
  }
  return null;
}
