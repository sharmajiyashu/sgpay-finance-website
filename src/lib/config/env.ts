/**
 * Single config module — reads ONLY from root `.env`
 * (Do not use .env.local; keep one `.env` file at project root.)
 */

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getEnv(val: string | undefined, fallback = ""): string {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return fallback;
}

const API_ROOT = trimTrailingSlash(
  getEnv(process.env.NEXT_PUBLIC_API_BASE_URL)
);

const API_TIMEOUT_MS = Number(getEnv(process.env.NEXT_PUBLIC_API_TIMEOUT, "10000"));

/** Backend API URLs — derived from NEXT_PUBLIC_API_BASE_URL */
export const API_CONFIG = {
  root: API_ROOT,
  app: trimTrailingSlash(getEnv(process.env.NEXT_PUBLIC_APP_API_URL, `${API_ROOT}/app`)),
  admin: trimTrailingSlash(getEnv(process.env.NEXT_PUBLIC_ADMIN_API_URL, `${API_ROOT}/admin`)),
  agent: trimTrailingSlash(getEnv(process.env.NEXT_PUBLIC_AGENT_API_URL, `${API_ROOT}/agent`)),
  timeout: Number.isFinite(API_TIMEOUT_MS) ? API_TIMEOUT_MS : 10000,
} as const;

/** Site + contact info defaults (dynamic settings loaded via API) */
export const SITE_CONFIG = {
  url: getEnv(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  name: "Sg Pay 4u",
  address: "PLOT NO 112/39, SECTOR 11, PRATAP NAGAR, SANGANER, JAIPUR, RAJASTHAN 302033",
  phone: "+91 9887199532",
  phoneRaw: "+91-9887199532",
  email: "info@sgpay4u.com",
  workingHours: "9.00 am - 9.00 pm",
  socials: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
} as const;

/** Roar Bank share URL — host always follows NEXT_PUBLIC_SITE_URL. */
export function buildRoarReferralUrl(code: string): string {
  const base = trimTrailingSlash(SITE_CONFIG.url).replace(/\/login$/i, "");
  return `${base}/finance/credit-card?roarRef=${encodeURIComponent(code)}#roar-bank`;
}

/**
 * Partner credit card apply URLs (see also `creditCards.ts` for full product details).
 * Override with NEXT_PUBLIC_ROAR_CREDIT_CARD_APPLY_URL in root `.env` if needed.
 */
export const CREDIT_CARD_APPLY_URLS = {
  roar: getEnv(
    process.env.NEXT_PUBLIC_ROAR_CREDIT_CARD_APPLY_URL,
    "https://wee.bnking.in/c/MTVmZTMxO"
  ),
} as const;

/** Choice Connect widget (public website only — secrets stay in SG-Backend .env) */
export const CHOICE_CONNECT_CONFIG = {
  apiBaseUrl: getEnv(
    process.env.NEXT_PUBLIC_CHOICE_CONNECT_API_BASE_URL,
    "https://api.choiceconnect.in"
  ),
  widgetBaseUrl: getEnv(
    process.env.NEXT_PUBLIC_CHOICE_CONNECT_WIDGET_BASE_URL,
    "https://embed.choiceconnect.in"
  ),
  clientCode: getEnv(process.env.NEXT_PUBLIC_CHOICE_CONNECT_CLIENT_CODE, "t girshapay"),
  cbaCode: getEnv(process.env.NEXT_PUBLIC_CHOICE_CONNECT_CBA_CODE, "C0002020"),
  /** Alias used by widget integration */
  agentCode: getEnv(process.env.NEXT_PUBLIC_CHOICE_CONNECT_CBA_CODE, "C0002020"),
} as const;

/** Relative paths under the public app API */
export const APP_API_PATHS = {
  enquiries: "/enquiries",
  health: "/health",
  agentRegister: "/agents/register",
  choiceConnectLeads: "/choice-connect/leads",
  choiceConnectConfig: "/choice-connect/config",
  insuranceConfig: "/insurance/config",
  insuranceLeads: "/insurance/leads",
  siteSettings: "/site-settings",
} as const;

/** Relative paths under the admin API */
export const ADMIN_API_PATHS = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  changePassword: "/change-password",
  health: "/health",
  dashboardStats: "/dashboard/stats",
  sidebarCounts: "/sidebar-counts",
  users: "/users",
  enquiries: "/enquiries",
  enquiryStatus: (id: string) => `/enquiries/${id}/status`,
  enquiryById: (id: string) => `/enquiries/${id}`,
  userById: (id: string) => `/users/${id}`,
  agents: "/agents",
  agentById: (id: string) => `/agents/${id}`,
  agentStatus: (id: string) => `/agents/${id}/status`,
  agentKyc: (id: string) => `/agents/${id}/kyc`,
  agentRegeneratePassword: (id: string) => `/agents/${id}/regenerate-password`,
  teams: "/teams",
  teamsTree: "/teams/tree",
  teamById: (id: string) => `/teams/${id}`,
  teamRegeneratePassword: (id: string) => `/teams/${id}/regenerate-password`,
  roles: "/roles",
  roleById: (id: string) => `/roles/${id}`,
  permissionsCatalog: "/permissions/catalog",
  commissionRates: "/commissions/rates",
  commissionRules: "/commissions/rules",
  commissionLedger: "/commissions/ledger",
  commissionLedgerStatus: (id: string) => `/commissions/ledger/${id}/status`,
  commissionGenerate: (leadId: string) => `/commissions/generate/${leadId}`,
  commissionSyncChoiceLoans: "/commissions/sync-choice-loans",
  commissionWallet: "/commissions/wallet",
  commissionTransactions: "/commissions/transactions",
  commissionWithdrawals: "/commissions/withdrawals",
  commissionWithdrawalStatus: (id: string) => `/commissions/withdrawals/${id}/status`,
  choiceConnectConfig: "/choice-connect/config",
  choiceConnectLeads: "/choice-connect/leads",
  choiceConnectLeadStatus: (id: string) => `/choice-connect/leads/${id}/status`,
  choiceConnectSummary: "/choice-connect/summary",
  choiceConnectSsoPayload: "/choice-connect/sso-payload",
  choiceConnectReferralLinks: "/choice-connect/referral-links",
  choiceConnectOnboard: "/choice-connect/onboard",
  choiceConnectDiagnostics: "/choice-connect/diagnostics",
  insuranceConfig: "/insurance/config",
  insuranceLeads: "/insurance/leads",
  insuranceSummary: "/insurance/summary",
  insuranceReferralLinks: "/insurance/referral-links",
  roarReferralLink: "/roar-referral-link",
  roarReferralStats: "/roar-referral-stats",
  roarReferralTree: "/roar-referral-tree",
  siteSettings: "/site-settings",
} as const;

/** Relative paths under the agent API */
export const AGENT_API_PATHS = {
  me: "/me",
  profileImage: "/profile-image",
  changePassword: "/change-password",
  downline: "/downline",
  commissions: "/commissions",
  commissionRates: "/commissions/rates",
  commissionWallet: "/commissions/wallet",
  commissionTransactions: "/commissions/transactions",
  commissionWithdrawals: "/commissions/withdrawals",
  enquiries: "/enquiries",
  choiceConnectConfig: "/choice-connect/config",
  choiceConnectLeads: "/choice-connect/leads",
  choiceConnectSummary: "/choice-connect/summary",
  choiceConnectSsoPayload: "/choice-connect/sso-payload",
  choiceConnectReferralLinks: "/choice-connect/referral-links",
  insuranceConfig: "/insurance/config",
  insuranceLeads: "/insurance/leads",
  insuranceSummary: "/insurance/summary",
  insuranceReferralLinks: "/insurance/referral-links",
  roarReferralLink: "/roar-referral-link",
  roarReferralStats: "/roar-referral-stats",
} as const;
