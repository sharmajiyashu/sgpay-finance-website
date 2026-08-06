"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SITE_CONFIG, API_CONFIG, APP_API_PATHS } from "@/lib/config/env";

export interface SiteSettings {
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
}

const defaultSettings: SiteSettings = {
  siteName: SITE_CONFIG.name,
  address: SITE_CONFIG.address,
  phone: SITE_CONFIG.phone,
  phoneRaw: SITE_CONFIG.phoneRaw,
  email: SITE_CONFIG.email,
  workingHours: SITE_CONFIG.workingHours,
  facebookUrl: SITE_CONFIG.socials.facebook,
  twitterUrl: SITE_CONFIG.socials.twitter,
  linkedinUrl: SITE_CONFIG.socials.linkedin,
  youtubeUrl: SITE_CONFIG.socials.youtube,
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const res = await fetch(`${API_CONFIG.app}${APP_API_PATHS.siteSettings}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success && data.data && isMounted) {
          const s = data.data;
          setSettings({
            siteName: s.siteName || defaultSettings.siteName,
            address: s.address || defaultSettings.address,
            phone: s.phone || defaultSettings.phone,
            phoneRaw: s.phoneRaw || defaultSettings.phoneRaw,
            email: s.email || defaultSettings.email,
            workingHours: s.workingHours || defaultSettings.workingHours,
            facebookUrl: s.facebookUrl || defaultSettings.facebookUrl,
            twitterUrl: s.twitterUrl || defaultSettings.twitterUrl,
            linkedinUrl: s.linkedinUrl || defaultSettings.linkedinUrl,
            youtubeUrl: s.youtubeUrl || defaultSettings.youtubeUrl,
          });
        }
      } catch {
        // Fallback to default .env settings
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
