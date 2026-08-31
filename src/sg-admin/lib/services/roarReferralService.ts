import { get } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";

export interface RoarReferralLink {
  code: string;
  url: string;
}

export interface RoarReferralStatsMine {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  link: RoarReferralLink;
}

export interface RoarReferralStatsGlobal {
  total: number;
  attributed: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface RoarReferralTreeNode {
  id: string;
  name: string;
  email?: string;
  roleLabel: string;
  roleKey: string;
  userRole: string;
  referralCount: number;
  subtreeReferralCount: number;
  commissionPercent?: number;
  payoutType?: "percent" | "flat";
  flatAmount?: number;
  commissionSource?: "override" | "rule" | "none";
  children: RoarReferralTreeNode[];
}

export async function getRoarReferralLink(): Promise<RoarReferralLink> {
  return get<RoarReferralLink>(ADMIN_API_PATHS.roarReferralLink);
}

export async function getRoarReferralStats(): Promise<{
  mine: RoarReferralStatsMine;
  global: RoarReferralStatsGlobal;
}> {
  return get(ADMIN_API_PATHS.roarReferralStats);
}

export async function getRoarReferralTree(): Promise<{
  tree: RoarReferralTreeNode[];
  totalReferrals: number;
  totalStaff: number;
}> {
  return get(ADMIN_API_PATHS.roarReferralTree);
}
