export interface Agent {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  panCard?: string;
  status?: "pending" | "approved" | "rejected";
  isActive?: boolean;
  generatedPassword?: string;
  profileImage?: { url?: string } | string;
  createdAt?: string;
  lastLoginAt?: string;
}

export function agentFullName(agent: Agent): string {
  return [agent.firstName, agent.lastName].filter(Boolean).join(" ").trim() || agent.email || "—";
}
