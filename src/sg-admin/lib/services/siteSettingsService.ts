import { get, put, ADMIN_API_PATHS } from "../api";

export interface SiteSettingsData {
  siteName: string;
  address: string;
  phone: string;
  phoneRaw: string;
  email: string;
  workingHours: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchSiteSettings(): Promise<SiteSettingsData> {
  return get<SiteSettingsData>(ADMIN_API_PATHS.siteSettings);
}

export async function updateSiteSettings(
  data: Partial<SiteSettingsData>
): Promise<SiteSettingsData> {
  return put<SiteSettingsData>(ADMIN_API_PATHS.siteSettings, data);
}
