import { publicGet, publicPost, APP_API_PATHS } from "@/lib/public-api";
import type {
  CreateInsuranceLeadInput,
  InsuranceWidgetConfig,
} from "@/modules/insurance/types";

export async function getWebsiteInsuranceConfig(
  refId?: string
): Promise<InsuranceWidgetConfig> {
  const qs = refId?.trim() ? `?refId=${encodeURIComponent(refId.trim())}` : "";
  return publicGet<InsuranceWidgetConfig>(`${APP_API_PATHS.insuranceConfig}${qs}`, {
    timeout: 20000,
  });
}

export async function createWebsiteInsuranceLead(
  input: CreateInsuranceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return publicPost<{ _id: string; uuid?: string }>(APP_API_PATHS.insuranceLeads, input);
}
