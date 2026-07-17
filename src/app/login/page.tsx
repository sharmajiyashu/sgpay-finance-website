"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { adminLogin } from "@/lib/services/adminAuthService";
import { adminLoginSchema } from "@/lib/validations/admin-login";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImage from "../../public/logo.png";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const result = adminLoginSchema.safeParse({
      email: email.trim(),
      password,
    });

    if (!result.success) {
      const flattened = result.error.flatten();
      const next: Record<string, string> = {};
      for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
        const msg = Array.isArray(messages) ? messages[0] : messages;
        if (typeof msg === "string") next[key] = msg;
      }
      setFieldErrors(next);
      return;
    }

    setLoading(true);
    try {
      await adminLogin(result.data);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("auth.loginFailed")
      );
    } finally {
      setLoading(false);
    }
  }

  const inputBase = twMerge(
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm transition-colors",
    "placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200",
    "disabled:pointer-events-none disabled:opacity-50"
  );
  const labelBase = "mb-1.5 block text-sm font-medium text-neutral-700";
  const errorText =
    "mt-1 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={logoImage}
            alt={t("app.name")}
            priority
            className="h-14 w-auto max-w-[200px] object-contain object-center"
          />
          <h1 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">
            {t("app.name")}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{t("app.tagline")}</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-neutral-900">
              {t("auth.signIn")}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {t("auth.signInDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className={labelBase}>
                {t("auth.email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={twMerge(
                  inputBase,
                  fieldErrors.email && "border-red-300 focus:border-red-400 focus:ring-red-100"
                )}
                placeholder={t("auth.emailPlaceholder")}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className={errorText} role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={labelBase}>
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={twMerge(
                    inputBase,
                    "pr-11",
                    fieldErrors.password &&
                      "border-red-300 focus:border-red-400 focus:ring-red-100"
                  )}
                  placeholder={t("auth.passwordPlaceholder")}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  aria-label={
                    showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                  }
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5" stroke={1.5} aria-hidden />
                  ) : (
                    <IconEye className="h-5 w-5" stroke={1.5} aria-hidden />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className={errorText} role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-center"
                role="alert"
              >
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={twMerge(
                "relative w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors",
                "hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <span
                className={twMerge(
                  "flex items-center justify-center gap-2",
                  loading && "invisible"
                )}
              >
                {t("auth.signIn")}
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden
                  />
                  <span className="sr-only">{t("auth.signingIn")}</span>
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs font-medium uppercase tracking-wide text-neutral-400">
          {t("auth.secureAdminAccess")}
        </p>
      </div>
    </div>
  );
}
