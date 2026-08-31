import type { Agent } from "@/sg-admin/lib/types/agent";
import type { CreateTreeNode, CreateTreeStats } from "@/sg-admin/lib/types/create-tree";
import { get, patch, post } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";

export interface AgentDetailResponse {
  agent: Agent;
  stats: CreateTreeStats;
  tree: CreateTreeNode[];
}

export interface AgentListResponse {
  agents: Agent[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function getAgents(url: string): Promise<AgentListResponse> {
  return get<AgentListResponse>(url);
}

export async function createAgent(body: {
  fullName: string;
  email: string;
  mobile: string;
  address?: string;
  city?: string;
  panCard?: string;
  status?: "pending" | "approved" | "rejected";
  agentType?: "super_distributor" | "distributor" | "retailer";
  parentId?: string;
  managedById?: string;
  commissionPercent?: number | null;
}): Promise<Agent> {
  return post<Agent>(ADMIN_API_PATHS.agents, body);
}

export async function updateAgentStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
  isActive?: boolean
): Promise<Agent> {
  return patch<Agent>(ADMIN_API_PATHS.agentStatus(id), { status, isActive });
}

export async function regenerateAgentPassword(id: string): Promise<Agent> {
  return post<Agent>(ADMIN_API_PATHS.agentRegeneratePassword(id));
}

export async function getAgentDetail(id: string): Promise<AgentDetailResponse> {
  return get<AgentDetailResponse>(ADMIN_API_PATHS.agentById(id));
}

export async function reviewAgentKyc(
  id: string,
  body: { status: "approved" | "rejected"; note?: string }
): Promise<AgentDetailResponse> {
  return patch<AgentDetailResponse>(ADMIN_API_PATHS.agentKyc(id), body);
}
