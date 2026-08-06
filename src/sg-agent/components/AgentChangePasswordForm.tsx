"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changeAgentPassword } from "@/sg-agent/lib/services/agentAuthService";
import { changePasswordFormSchema } from "@/lib/validations/staff-auth";
import { flattenZodErrors } from "@/lib/validations/register-agent";

export function AgentChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: changeAgentPassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFieldErrors({});
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = changePasswordFormSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }
    setFieldErrors({});
    mutation.mutate(result.data);
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Apna password update karein. Kam se kam 8 characters hon.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid max-w-md gap-4">
        <PasswordField
          label="Current password"
          value={form.currentPassword}
          error={fieldErrors.currentPassword}
          onChange={(v) => setForm((p) => ({ ...p, currentPassword: v }))}
        />
        <PasswordField
          label="New password"
          value={form.newPassword}
          error={fieldErrors.newPassword}
          onChange={(v) => setForm((p) => ({ ...p, newPassword: v }))}
        />
        <PasswordField
          label="Confirm new password"
          value={form.confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-fit rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {mutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-muted-foreground">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
