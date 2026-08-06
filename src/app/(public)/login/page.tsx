"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { staffLogin, getLoginRedirectPath } from "@/lib/staffAuthService";
import { adminLoginSchema } from "@/sg-admin/lib/validations/admin-login";
import { flattenZodErrors } from "@/lib/validations/register-agent";
import {
  AuthAlert,
  AuthField,
  AuthFooterLinks,
  AuthPageLayout,
  AuthSubmitButton,
  authInputClass,
} from "@/components/auth/AuthPageLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  function validateField(field: "email" | "password", values?: { email: string; password: string }) {
    const data = values ?? { email: email.trim(), password };
    const result = adminLoginSchema.safeParse(data);
    if (result.success) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }
    const errors = flattenZodErrors(result.error);
    if (errors[field]) setFieldErrors((prev) => ({ ...prev, [field]: errors[field]! }));
  }

  function handleBlur(field: "email" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setTouched({ email: true, password: true });

    const result = adminLoginSchema.safeParse({ email: email.trim(), password });
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const data = await staffLogin(result.data);
      const role = typeof data.user?.userRole === "string" ? data.user.userRole : "admin";
      router.push(getLoginRedirectPath(role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageLayout
      variant="login"
      title="Sign in"
      subtitle="Email & password se login karein"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <AuthField
          id="email"
          label="Email"
          required
          error={touched.email ? fieldErrors.email : undefined}
        >
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) validateField("email", { email: e.target.value.trim(), password });
            }}
            onBlur={() => handleBlur("email")}
            autoComplete="email"
            placeholder="name@example.com"
            className={authInputClass(!!(touched.email && fieldErrors.email))}
          />
        </AuthField>

        <AuthField
          id="password"
          label="Password"
          required
          error={touched.password ? fieldErrors.password : undefined}
        >
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) validateField("password", { email: email.trim(), password: e.target.value });
              }}
              onBlur={() => handleBlur("password")}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${authInputClass(!!(touched.password && fieldErrors.password))} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-500 hover:text-slate-800"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mt-1 text-right">
            <Link href="/forgot-password" className="text-[11px] font-medium text-[#1565a8] hover:underline">
              Forgot password?
            </Link>
          </div>
        </AuthField>

        {error && <AuthAlert type="error" title="Login failed" message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Signing in...">
          Sign in
        </AuthSubmitButton>
      </form>

      <AuthFooterLinks linkHref="/register-agent" linkLabel="Register as Agent" />
    </AuthPageLayout>
  );
}
