import { get, patch, postForm, AGENT_API_PATHS } from "@/sg-agent/lib/api";

export interface AgentProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  panCard?: string;
  kycStatus?: string;
  aadhaarCardNumber?: string;
  status?: string;
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

export async function getAgentProfile(): Promise<AgentProfile> {
  return get<AgentProfile>(AGENT_API_PATHS.me);
}

export async function updateAgentProfile(body: {
  fullName?: string;
  mobile?: string;
  address?: string;
  city?: string;
  panCard?: string;
}): Promise<AgentProfile> {
  return patch<AgentProfile>(AGENT_API_PATHS.me, body);
}

export async function uploadAgentProfileImage(file: File): Promise<AgentProfile> {
  const formData = new FormData();
  formData.append("image", file);
  return postForm<AgentProfile>(AGENT_API_PATHS.profileImage, formData);
}

export async function uploadKycDocuments(payload: {
  aadhaarCardNumber?: string;
  panCard?: string;
  panCardFile?: File;
  aadhaarFrontFile?: File;
  aadhaarBackFile?: File;
  bankPassbookFile?: File;
}): Promise<AgentProfile> {
  const formData = new FormData();
  if (payload.aadhaarCardNumber) formData.append("aadhaarCardNumber", payload.aadhaarCardNumber);
  if (payload.panCard) formData.append("panCard", payload.panCard);
  if (payload.panCardFile) formData.append("panCardFile", payload.panCardFile);
  if (payload.aadhaarFrontFile) formData.append("aadhaarFrontFile", payload.aadhaarFrontFile);
  if (payload.aadhaarBackFile) formData.append("aadhaarBackFile", payload.aadhaarBackFile);
  if (payload.bankPassbookFile) formData.append("bankPassbookFile", payload.bankPassbookFile);

  return postForm<AgentProfile>("/kyc", formData);
}

function profileImageUrl(profile: AgentProfile): string | null {
  const img = profile.profileImage;
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url ?? null;
}

export { profileImageUrl };
