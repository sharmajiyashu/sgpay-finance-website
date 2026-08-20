"use client";

import Image from "next/image";
import Link from "next/link";

const CONTAINER_BG = "/img/carousel-1.jpg";

interface AuthPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: "login" | "register";
}

export function AuthPageLayout({
  title,
  subtitle,
  children,
  variant = "login",
}: AuthPageLayoutProps) {
  const maxWidth = variant === "register" ? "max-w-lg" : "max-w-md";

  return (
    <div className="auth-page flex min-h-dvh items-center justify-center overflow-x-hidden bg-slate-100 px-4 py-6 sm:px-4 sm:py-8">
      <div className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl ${maxWidth}`}>
        {/* Background image — container only */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${CONTAINER_BG})` }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-white/92 backdrop-blur-[2px]" aria-hidden />

        <div className="relative p-5 sm:p-7">
          <div className="mb-5 text-center">
            <Image
              src="/img/logo.png"
              alt="Sg Pay 4u"
              width={130}
              height={38}
              className="mx-auto mb-3 h-9 w-auto max-w-[160px] object-contain"
              priority
            />
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthAlert({
  type,
  title,
  message,
}: {
  type: "error" | "success" | "info";
  title?: string;
  message: string;
}) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };

  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${styles[type]}`} role="alert">
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

interface AuthFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthField({ id, label, required, hint, error, children, className }: AuthFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 flex flex-wrap items-center gap-0.5 text-sm font-medium text-slate-600">
        {label}
        {required && <span className="text-red-500" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-0.5 text-[11px] font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function authInputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#1d7ad2] focus:ring-[#1d7ad2]/15"
  }`;
}

export function authTextareaClass(hasError: boolean) {
  return `${authInputClass(hasError)} min-h-[72px] resize-y`;
}

export function AuthSubmitButton({
  loading,
  loadingText,
  children,
}: {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1565a8] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f4c81] disabled:opacity-60"
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
      )}
      {loading ? loadingText : children}
    </button>
  );
}

export function AuthFooterLinks({
  backHref = "/",
  backLabel = "Back to website",
  linkHref,
  linkLabel,
}: {
  backHref?: string;
  backLabel?: string;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-center text-sm sm:flex-row sm:text-left">
      <Link href={backHref} className="text-slate-500 hover:text-slate-800">
        ← {backLabel}
      </Link>
      <Link href={linkHref} className="font-medium text-[#1565a8] hover:underline">
        {linkLabel}
      </Link>
    </div>
  );
}

export function AuthSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-slate-200/80 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}
