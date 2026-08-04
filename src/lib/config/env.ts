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

/** Site + contact info (public website) */
export const SITE_CONFIG = {
  url: getEnv(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  name: getEnv(process.env.NEXT_PUBLIC_SITE_NAME, "Sg Pay 4u"),
  address: getEnv(process.env.NEXT_PUBLIC_ADDRESS, "PLOT NO 112/39, SECTOR 11, PRATAP NAGAR, SANGANER, JAIPUR, RAJASTHAN 302033"),
  phone: getEnv(process.env.NEXT_PUBLIC_PHONE, "+91 9887199532"),
  phoneRaw: getEnv(process.env.NEXT_PUBLIC_PHONE_RAW, "+91-9887199532"),
  email: getEnv(process.env.NEXT_PUBLIC_EMAIL, "info@sgpay4u.com"),
  workingHours: getEnv(process.env.NEXT_PUBLIC_HOURS, "9.00 am - 9.00 pm"),
  socials: {
    facebook: getEnv(process.env.NEXT_PUBLIC_FACEBOOK_URL, "https://facebook.com"),
    twitter: getEnv(process.env.NEXT_PUBLIC_TWITTER_URL, "https://twitter.com"),
    linkedin: getEnv(process.env.NEXT_PUBLIC_LINKEDIN_URL, "https://linkedin.com"),
    youtube: getEnv(process.env.NEXT_PUBLIC_YOUTUBE_URL, "https://youtube.com"),
  },
} as const;

/** Choice Connect widget (public website only — secrets stay in SG-Backend .env) */
export const CHOICE_CONNECT_CONFIG = {
  apiBaseUrl: getEnv(process.env.NEXT_PUBLIC_CHOICE_CONNECT_API_BASE_URL, "https://apidev.choiceconnect.in"),
  widgetBaseUrl: getEnv(process.env.NEXT_PUBLIC_CHOICE_CONNECT_WIDGET_BASE_URL, "https://embed-uat.choiceconnect.in"),
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
} as const;

/** Relative paths under the admin API */
export const ADMIN_API_PATHS = {
  login: "/login",
  health: "/health",
  dashboardStats: "/dashboard/stats",
  users: "/users",
  enquiries: "/enquiries",
  enquiryStatus: (id: string) => `/enquiries/${id}/status`,
  enquiryById: (id: string) => `/enquiries/${id}`,
  userById: (id: string) => `/users/${id}`,
  agents: "/agents",
  agentStatus: (id: string) => `/agents/${id}/status`,
  agentRegeneratePassword: (id: string) => `/agents/${id}/regenerate-password`,
  choiceConnectConfig: "/choice-connect/config",
  choiceConnectLeads: "/choice-connect/leads",
  choiceConnectSummary: "/choice-connect/summary",
  choiceConnectSsoPayload: "/choice-connect/sso-payload",
  choiceConnectReferralLinks: "/choice-connect/referral-links",
  choiceConnectDiagnostics: "/choice-connect/diagnostics",
} as const;

/** Relative paths under the agent API */
export const AGENT_API_PATHS = {
  me: "/me",
  profileImage: "/profile-image",
  choiceConnectConfig: "/choice-connect/config",
  choiceConnectLeads: "/choice-connect/leads",
  choiceConnectSummary: "/choice-connect/summary",
  choiceConnectReferralLinks: "/choice-connect/referral-links",
} as const;
