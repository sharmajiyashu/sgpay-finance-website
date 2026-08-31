import { get, patch, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import { extractTeamList } from "@/sg-admin/lib/team-utils";
import type { CreateTreeNode, CreateTreeStats } from "@/sg-admin/lib/types/create-tree";
import type { TeamMember, TeamTreeNode } from "@/sg-admin/lib/types/hierarchy";

export interface TeamDetailResponse {
  member: TeamMember;
  stats: CreateTreeStats;
  tree: CreateTreeNode[];
}

export interface TeamListResponse {
  teams: TeamMember[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function getTeams(url: string): Promise<TeamListResponse> {
  const data = await get<TeamListResponse | TeamMember[] | Record<string, unknown>>(url);
  const teams = extractTeamList(data);
  const pagination =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as TeamListResponse).pagination
      : undefined;
  return {
    teams,
    pagination: pagination ?? {
      page: 1,
      limit: teams.length || 20,
      total: teams.length,
      totalPages: 1,
    },
  };
}

export async function getTeamTree(): Promise<{ tree: TeamTreeNode[]; total: number }> {
  const data = await get<{ tree?: TeamTreeNode[]; total?: number } | TeamTreeNode[]>(
    ADMIN_API_PATHS.teamsTree
  );
  if (Array.isArray(data)) {
    return { tree: data, total: data.length };
  }
  const tree = Array.isArray(data?.tree) ? data.tree : extractTeamList(data);
  return { tree, total: data?.total ?? tree.length };
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

export async function getTeamDetail(id: string): Promise<TeamDetailResponse> {
  return get<TeamDetailResponse>(ADMIN_API_PATHS.teamById(id));
}
