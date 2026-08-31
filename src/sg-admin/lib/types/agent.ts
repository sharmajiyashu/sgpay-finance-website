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
  agentType?: "super_distributor" | "distributor" | "retailer";
  commissionPercent?: number | null;
  kycStatus?: "pending" | "submitted" | "approved" | "rejected";
  kycReviewNote?: string;
  kycReviewedAt?: string;
  aadhaarCardNumber?: string;
  panCardFile?: { url?: string } | string;
  aadhaarFrontFile?: { url?: string } | string;
  aadhaarBackFile?: { url?: string } | string;
  bankPassbookFile?: { url?: string } | string;
  createdBy?: { _id?: string; firstName?: string; lastName?: string; email?: string; designation?: string; agentType?: string } | string;
  parentId?: { _id?: string; firstName?: string; lastName?: string; email?: string; agentType?: string } | string;
  managedById?: { _id?: string; firstName?: string; lastName?: string; email?: string; designation?: string } | string;
  profileImage?: { url?: string } | string;
  createdAt?: string;
  lastLoginAt?: string;
  choiceConnectProfile?: {
    onboarded: boolean;
    agentCode?: string;
    oprId?: string;
    subjectId?: string;
    onboardedAt?: string;
  };
}

export function agentFullName(agent: Agent): string {
  return [agent.firstName, agent.lastName].filter(Boolean).join(" ").trim() || agent.email || "—";
}
