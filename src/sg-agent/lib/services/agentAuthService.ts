import { post } from "@/sg-agent/lib/api";
import { AGENT_API_PATHS } from "@/lib/config/env";

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function changeAgentPassword(input: ChangePasswordInput): Promise<void> {
  await post<{ changed: boolean }>(AGENT_API_PATHS.changePassword, input);
}
