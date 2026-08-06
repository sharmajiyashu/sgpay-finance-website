"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { staffResetPassword } from "@/lib/staffAuthService";
import { staffResetPasswordSchema } from "@/lib/validations/staff-auth";
import { flattenZodErrors } from "@/lib/validations/register-agent";
import {
  AuthAlert,
  AuthField,
  AuthPageLayout,
  AuthSubmitButton,
  authInputClass,
} from "@/components/auth/AuthPageLayout";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      email: email.trim(),
      otp: otp.trim(),
      newPassword,
      confirmPassword,
    };

    const result = staffResetPasswordSchema.safeParse(payload);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      await staffResetPassword(result.data);
      setSuccess("Password reset ho gaya. Ab login kar sakte hain.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageLayout
      variant="login"
      title="Reset password"
      subtitle="Email par aaya 4-digit code aur naya password enter karein"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <AuthField id="email" label="Email" required error={fieldErrors.email}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={authInputClass(!!fieldErrors.email)}
          />
        </AuthField>

        <AuthField id="otp" label="Verification code" required error={fieldErrors.otp}>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="1234"
            className={authInputClass(!!fieldErrors.otp)}
          />
        </AuthField>

        <AuthField id="newPassword" label="New password" required error={fieldErrors.newPassword}>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className={`${authInputClass(!!fieldErrors.newPassword)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-500"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </AuthField>

        <AuthField
          id="confirmPassword"
          label="Confirm password"
          required
          error={fieldErrors.confirmPassword}
        >
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={authInputClass(!!fieldErrors.confirmPassword)}
          />
        </AuthField>

        {error && <AuthAlert type="error" title="Reset failed" message={error} />}
        {success && <AuthAlert type="success" message={success} />}

        <AuthSubmitButton loading={loading} loadingText="Resetting...">
          Reset password
        </AuthSubmitButton>
      </form>

      <div className="mt-5 flex flex-col items-center gap-2 border-t border-slate-200/80 pt-4 text-xs">
        <Link href="/forgot-password" className="text-slate-500 hover:text-slate-800">
          Code nahi mila? Dobara bhejein
        </Link>
        <Link href="/login" className="font-medium text-[#1565a8] hover:underline">
          ← Back to login
        </Link>
      </div>
    </AuthPageLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
