import { get, patch, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { TeamMember, TeamTreeNode } from "@/sg-admin/lib/types/hierarchy";

export interface TeamListResponse {
  teams: TeamMember[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function getTeams(url: string): Promise<TeamListResponse> {
  return get<TeamListResponse>(url);
}

export async function getTeamTree(): Promise<{ tree: TeamTreeNode[]; total: number }> {
  return get<{ tree: TeamTreeNode[]; total: number }>(ADMIN_API_PATHS.teamsTree);
}

export async function createTeamMember(body: {
  fullName: string;
  email: string;
  mobile: string;
  designation: "state_head" | "asm" | "rm";
  parentId?: string;
  stateCode?: string;
  territory?: string;
  address?: string;
  city?: string;
  panCard?: string;
}): Promise<TeamMember> {
  return post<TeamMember>(ADMIN_API_PATHS.teams, body);
}

export async function updateTeamMember(
  id: string,
  body: Partial<{
    fullName: string;
    mobile: string;
    address: string;
    city: string;
    stateCode: string;
    territory: string;
    isActive: boolean;
  }>
): Promise<TeamMember> {
  return patch<TeamMember>(ADMIN_API_PATHS.teamById(id), body);
}

export async function regenerateTeamPassword(id: string): Promise<TeamMember> {
  return post<TeamMember>(ADMIN_API_PATHS.teamRegeneratePassword(id));
}
