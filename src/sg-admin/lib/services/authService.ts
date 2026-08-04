import { post, setAuthUser, setToken, type AuthUser } from "@/sg-admin/lib/api";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import type { AdminLoginDto } from "@/sg-admin/lib/validations/admin-login";

export interface AdminLoginPayload {
  token: string;
  user: Record<string, unknown>;
}

export async function adminLogin(body: AdminLoginDto): Promise<AdminLoginPayload> {
  const data = await post<AdminLoginPayload>(ADMIN_API_PATHS.login, body);
  if (data?.token) setToken(data.token);

  const u = data?.user;
  if (u && typeof u === "object") {
    const firstName = typeof u.firstName === "string" ? u.firstName : "";
    const lastName = typeof u.lastName === "string" ? u.lastName : "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    const authUser: AuthUser = {
      name: fullName || (typeof u.email === "string" ? u.email : undefined),
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: typeof u.email === "string" ? u.email : undefined,
      userRole: typeof u.userRole === "string" ? u.userRole : undefined,
      roleName: "Admin",
    };
    setAuthUser(authUser);
  }

  return data;
}
