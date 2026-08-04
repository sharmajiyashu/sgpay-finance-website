"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAgent } from "@/lib/registerAgentService";
import {
  flattenZodErrors,
  registerAgentSchema,
  type RegisterAgentDto,
} from "@/lib/validations/register-agent";
import {
  AuthAlert,
  AuthField,
  AuthFooterLinks,
  AuthPageLayout,
  AuthSectionTitle,
  AuthSubmitButton,
  authInputClass,
  authTextareaClass,
} from "@/components/auth/AuthPageLayout";

type FormState = RegisterAgentDto;

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
  panCard: "",
};

export default function RegisterAgentPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) validateField(key, { ...form, [key]: value });
  }

  function validateField(key: keyof FormState, values?: FormState) {
    const data = values ?? form;
    const result = registerAgentSchema.safeParse(data);
    if (result.success) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }
    const errors = flattenZodErrors(result.error);
    if (errors[key]) setFieldErrors((prev) => ({ ...prev, [key]: errors[key]! }));
    else setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  }

  function handleBlur(key: keyof FormState) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTouched({ fullName: true, email: true, mobile: true, address: true, city: true, panCard: true });

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      address: form.address?.trim() ?? "",
      city: form.city?.trim() ?? "",
      panCard: form.panCard?.trim().toUpperCase() ?? "",
    };

    const result = registerAgentSchema.safeParse(payload);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      await registerAgent({
        fullName: result.data.fullName,
        email: result.data.email,
        mobile: result.data.mobile,
        address: result.data.address || undefined,
        city: result.data.city || undefined,
        panCard: result.data.panCard || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AuthPageLayout
        variant="register"
        title="Application submitted"
        subtitle="Admin approval ke baad email par password milega"
      >
        <div className="space-y-4">
          <AuthAlert
            type="success"
            title="Success"
            message="Registration submit ho gaya. Approval ke baad login credentials email par bheje jayenge."
          />
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg border border-[#1565a8]/25 bg-[#1565a8]/5 py-2.5 text-xs font-semibold text-[#1565a8] hover:bg-[#1565a8]/10"
          >
            Go to Login
          </Link>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      variant="register"
      title="Agent Registration"
      subtitle="Saari details bhariye — * wale fields required hain"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthSectionTitle>Personal Details</AuthSectionTitle>

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthField
            id="fullName"
            label="Full Name"
            required
            error={touched.fullName ? fieldErrors.fullName : undefined}
            className="sm:col-span-2"
          >
            <input
              id="fullName"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="Name as per ID"
              className={authInputClass(!!(touched.fullName && fieldErrors.fullName))}
            />
          </AuthField>

          <AuthField
            id="email"
            label="Email"
            required
            error={touched.email ? fieldErrors.email : undefined}
          >
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="you@email.com"
              className={authInputClass(!!(touched.email && fieldErrors.email))}
            />
          </AuthField>

          <AuthField
            id="mobile"
            label="Mobile"
            required
            hint="10 digit"
            error={touched.mobile ? fieldErrors.mobile : undefined}
          >
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.mobile}
              onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => handleBlur("mobile")}
              placeholder="9876543210"
              className={authInputClass(!!(touched.mobile && fieldErrors.mobile))}
            />
          </AuthField>
        </div>

        <AuthSectionTitle>Address & Documents</AuthSectionTitle>

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthField
            id="address"
            label="Full Address"
            error={touched.address ? fieldErrors.address : undefined}
            className="sm:col-span-2"
          >
            <textarea
              id="address"
              value={form.address ?? ""}
              onChange={(e) => updateField("address", e.target.value)}
              onBlur={() => handleBlur("address")}
              placeholder="House no., street, area, landmark, pincode"
              rows={3}
              className={authTextareaClass(!!(touched.address && fieldErrors.address))}
            />
          </AuthField>

          <AuthField
            id="city"
            label="City"
            error={touched.city ? fieldErrors.city : undefined}
          >
            <input
              id="city"
              value={form.city ?? ""}
              onChange={(e) => updateField("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              placeholder="City name"
              className={authInputClass(!!(touched.city && fieldErrors.city))}
            />
          </AuthField>

          <AuthField
            id="panCard"
            label="PAN Card"
            hint="ABCDE1234F"
            error={touched.panCard ? fieldErrors.panCard : undefined}
          >
            <input
              id="panCard"
              value={form.panCard ?? ""}
              onChange={(e) => updateField("panCard", e.target.value.toUpperCase().slice(0, 10))}
              onBlur={() => handleBlur("panCard")}
              placeholder="ABCDE1234F"
              className={`${authInputClass(!!(touched.panCard && fieldErrors.panCard))} uppercase tracking-wider`}
            />
          </AuthField>
        </div>

        {error && <AuthAlert type="error" title="Error" message={error} />}

        <AuthSubmitButton loading={loading} loadingText="Submitting...">
          Submit Registration
        </AuthSubmitButton>
      </form>

      <AuthFooterLinks linkHref="/login" linkLabel="Already registered? Sign in" />
    </AuthPageLayout>
  );
}
