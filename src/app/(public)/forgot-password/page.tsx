"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { staffForgotPassword } from "@/lib/staffAuthService";
import { staffForgotPasswordSchema } from "@/lib/validations/staff-auth";
import { flattenZodErrors } from "@/lib/validations/register-agent";
import {
  AuthAlert,
  AuthField,
  AuthPageLayout,
  AuthSubmitButton,
  authInputClass,
} from "@/components/auth/AuthPageLayout";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const result = staffForgotPasswordSchema.safeParse({ email: email.trim() });
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      await staffForgotPassword(result.data);
      router.push(`/reset-password?email=${encodeURIComponent(result.data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageLayout
      variant="login"
      title="Forgot password"
      subtitle="Registered email par 4-digit code bheja jayega"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <AuthField id="email" label="Email" required error={fieldErrors.email}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="name@example.com"
            className={authInputClass(!!fieldErrors.email)}
          />
        </AuthField>

        {error && <AuthAlert type="error" title="Request failed" message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Sending code...">
          Send verification code
        </AuthSubmitButton>
      </form>

      <div className="mt-5 flex flex-col items-center gap-2 border-t border-slate-200/80 pt-4 text-xs">
        <Link href="/login" className="font-medium text-[#1565a8] hover:underline">
          ← Back to login
        </Link>
      </div>
    </AuthPageLayout>
  );
}
