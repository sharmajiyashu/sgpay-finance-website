import { publicPost } from "@/lib/public-api";
import { APP_API_PATHS } from "@/lib/config/env";

export interface RegisterAgentInput {
  fullName: string;
  email: string;
  mobile: string;
  address?: string;
  city?: string;
  panCard?: string;
}

export async function registerAgent(input: RegisterAgentInput): Promise<void> {
  await publicPost(APP_API_PATHS.agentRegister, input);
}
