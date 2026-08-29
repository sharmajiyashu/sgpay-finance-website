import type { InsuranceVehicleType, InsuranceWidgetConfig } from "@/modules/insurance/types";

export interface MotorPartnerConfigOptions {
  uuid?: string;
  vehicleType: InsuranceVehicleType;
}

/** Default motor embed host — NOT credit-card embed.choiceconnect.in */
export const DEFAULT_MOTOR_WIDGET_BASE_URL = "https://motor.choiceinsurance.in";

/**
 * Choice Connect Motor Insurance partner_config (integration PDF + live Choice Insurance page).
 * X_API_KEY = access token from ptr/token (via SG-Backend).
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

  // Resume existing enquiry (summary / lead_uuid)
  if (options.uuid?.trim()) {
    partner_config.UUID = options.uuid.trim();
  }

  if (config.subAgentCode?.trim()) {
    partner_config.SUB_AGENT_CODE = config.subAgentCode.trim();
  }

  const staffName = config.agentName?.trim() || config.sourceLabel?.trim();
  if (staffName) {
    partner_config.AGENT_NAME = staffName;
    partner_config.SUB_AGENT_NAME = staffName;
  }

  return partner_config;
}

export function resolveMotorWidgetBaseUrl(config: InsuranceWidgetConfig): string {
  const raw = (config.widgetBaseUrl || DEFAULT_MOTOR_WIDGET_BASE_URL).replace(/\/+$/, "");
  // Guard: never use credit-card embed host for motor widget.
  if (/embed\.choiceconnect\.in/i.test(raw)) {
    return DEFAULT_MOTOR_WIDGET_BASE_URL;
  }
  return raw || DEFAULT_MOTOR_WIDGET_BASE_URL;
}

export function validateMotorWidgetConfig(config: InsuranceWidgetConfig): string | null {
  if (!config.clientCode?.trim()) return "CLIENT_CODE is not configured on SG-Backend.";
  if (!config.agentCode?.trim()) return "AGENT_CODE (CBA) is not configured on SG-Backend.";
  if (!config.xApiKey?.trim()) {
    return "X_API_KEY is required for Motor Insurance. Ensure Choice Connect ptr/token credentials are configured on SG-Backend.";
  }
  return null;
}
