import { CHOICE_CONNECT_CONFIG } from "@/lib/config/env";

/** Partner API base — official swagger: choiceconnect.in/sso/ref_api_doc/swagger.json */
export const CHOICE_CONNECT_BASE_URL = CHOICE_CONNECT_CONFIG.apiBaseUrl;

export const CHOICE_CONNECT_ENDPOINTS = {
  token: `${CHOICE_CONNECT_BASE_URL}/connect/api/ptr/token`,
  onboard: `${CHOICE_CONNECT_BASE_URL}/api/partners/registration`,
  summaryReport: `${CHOICE_CONNECT_BASE_URL}/api/partners/summary-report`,
  loanSummaryReport: `${CHOICE_CONNECT_BASE_URL}/api/partners/loan-summary-report`,
  referralLink: `${CHOICE_CONNECT_BASE_URL}/api/partners/generate-referral-link/v1`,
  ssoAutologinLive: "https://choiceconnect.in/sso/autologin",
  ssoAutologinUat: "https://commondev.choiceconnect.in/sso/autologin",
} as const;
