import {
  post as adminPost,
  setAuthUser as setAdminAuthUser,
  setToken as setAdminToken,
  clearToken as clearAdminToken,
  type AuthUser,
} from "@/sg-admin/lib/api";
import {
  setAuthUser as setAgentAuthUser,
  setToken as setAgentToken,
  clearToken as clearAgentToken,
} from "@/sg-agent/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { AdminLoginDto } from "@/sg-admin/lib/validations/admin-login";

export interface StaffLoginPayload {
  token: string;
  user: Record<string, unknown>;
}

export interface StaffForgotPasswordInput {
  email: string;
}

export interface StaffResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

function buildAuthUser(user: Record<string, unknown>): AuthUser {
  const firstName = typeof user.firstName === "string" ? user.firstName : "";
  const lastName = typeof user.lastName === "string" ? user.lastName : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const userRole = typeof user.userRole === "string" ? user.userRole : undefined;
  const roleName =
    typeof user.roleName === "string"
      ? user.roleName
      : userRole === "agent"
        ? "Agent"
        : "Admin";

  return {
    name: fullName || (typeof user.email === "string" ? user.email : undefined),
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: typeof user.email === "string" ? user.email : undefined,
    userRole,
    roleName,
    designation: typeof user.designation === "string" ? user.designation : undefined,
    agentType: typeof user.agentType === "string" ? user.agentType : undefined,
    permissions:
      user.permissions && typeof user.permissions === "object"
        ? (user.permissions as Record<string, boolean>)
        : undefined,
  };
}

export async function staffLogin(body: AdminLoginDto): Promise<StaffLoginPayload> {
  clearAdminToken();
  clearAgentToken();

  const data = await adminPost<StaffLoginPayload>(ADMIN_API_PATHS.login, body);
  const user = data?.user;
  const role = user && typeof user.userRole === "string" ? user.userRole : "admin";

  if (data?.token) {
    if (role === "agent") {
      setAgentToken(data.token);
      if (user && typeof user === "object") setAgentAuthUser(buildAuthUser(user));
    } else {
      setAdminToken(data.token);
      if (user && typeof user === "object") setAdminAuthUser(buildAuthUser(user));
    }
  }

  return data;
}

export async function staffForgotPassword(input: StaffForgotPasswordInput): Promise<void> {
  await adminPost<{ sent: boolean }>(ADMIN_API_PATHS.forgotPassword, input);
}

export async function staffResetPassword(input: StaffResetPasswordInput): Promise<void> {
  await adminPost<{ reset: boolean }>(ADMIN_API_PATHS.resetPassword, input);
}

export function getLoginRedirectPath(userRole?: string): string {
  return userRole === "agent" ? "/agent/dashboard" : "/admin/dashboard";
}
