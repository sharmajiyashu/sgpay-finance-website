import { CHOICE_CONNECT_CONFIG } from "@/lib/config/env";

/** Partner API base — use SG-Backend routes for authenticated calls. */
export const CHOICE_CONNECT_BASE_URL = CHOICE_CONNECT_CONFIG.apiBaseUrl;
export const CHOICE_CONNECT_API_URL = `${CHOICE_CONNECT_BASE_URL}/sso/connect-partners/v1`;

export const CHOICE_CONNECT_ENDPOINTS = {
  partnerIntegration: `${CHOICE_CONNECT_API_URL}/partner-integration`,
  onboard: `${CHOICE_CONNECT_API_URL}/partner-integration/onboard`,
  summaryReport: `${CHOICE_CONNECT_API_URL}/summary-report`,
  referralLink: `${CHOICE_CONNECT_API_URL}/generate-referral-link`,
} as const;
