import { get } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";

export interface RoarReferralLink {
  code: string;
  url: string;
}

export interface RoarReferralStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  link: RoarReferralLink;
}

export async function getRoarReferralLink(): Promise<RoarReferralLink> {
  return get<RoarReferralLink>(AGENT_API_PATHS.roarReferralLink);
}

export async function getRoarReferralStats(): Promise<RoarReferralStats> {
  return get<RoarReferralStats>(AGENT_API_PATHS.roarReferralStats);
}
