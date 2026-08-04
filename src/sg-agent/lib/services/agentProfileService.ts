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
  status?: string;
  profileImage?: { url?: string } | string;
  createdAt?: string;
  lastLoginAt?: string;
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

function profileImageUrl(profile: AgentProfile): string | null {
  const img = profile.profileImage;
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url ?? null;
}

export { profileImageUrl };
