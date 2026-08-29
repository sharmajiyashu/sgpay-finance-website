export type TeamDesignation = "super_admin" | "state_head" | "asm" | "rm";
export type AgentType = "super_distributor" | "distributor" | "retailer";

export const TEAM_DESIGNATION_LABELS: Record<Exclude<TeamDesignation, "super_admin">, string> = {
  state_head: "State Head (SH)",
  asm: "Sales Manager (ASM)",
  rm: "Relationship Manager (RM)",
};

export const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  super_distributor: "Super Distributor",
  distributor: "Distributor",
  retailer: "Retailer",
};

export const COMMISSION_LEVEL_LABELS: Record<string, string> = {
  state_head: "State Head (SH)",
  asm: "Sales Manager (ASM)",
  rm: "Relationship Manager (RM)",
  super_distributor: "Super Distributor",
  distributor: "Distributor",
  retailer: "Retailer",
};

export interface TeamMember {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  designation?: TeamDesignation;
  stateCode?: string;
  territory?: string;
  city?: string;
  address?: string;
  isActive?: boolean;
  generatedPassword?: string;
  parentId?: { _id?: string; firstName?: string; lastName?: string; email?: string; designation?: string } | string;
  createdAt?: string;
  choiceConnectProfile?: {
    onboarded: boolean;
    agentCode?: string;
    oprId?: string;
    subjectId?: string;
    onboardedAt?: string;
  };
}

export interface TeamTreeNode extends TeamMember {
  id?: string;
  children?: TeamTreeNode[];
}

export function teamFullName(member: Pick<TeamMember, "firstName" | "lastName" | "email">): string {
  return [member.firstName, member.lastName].filter(Boolean).join(" ").trim() || member.email || "—";
}
