"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function RoarEnquiryCreateForm({
  createEnquiry,
  invalidateKeys = [],
  onCreated,
}: {
  createEnquiry: (body: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<{ applyUrl?: string }>;
  invalidateKeys?: unknown[][];
  onCreated?: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const mutation = useMutation({
    mutationFn: () =>
      createEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      }),
    onSuccess: (result) => {
      for (const key of invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: key });
      }
      toast.success("Enquiry saved. Opening Roar Bank apply page.");
      if (result.applyUrl) {
        window.open(result.applyUrl, "_blank", "noopener,noreferrer");
      }
      setForm({ name: "", email: "", phone: "" });
      onCreated?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h2 className="text-lg font-semibold text-foreground">Create customer enquiry</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Save the customer enquiry here first, then the Roar Bank apply link opens so they can
        complete the application.
      </p>

      <form
        className="mt-4 grid gap-3 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <input
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:col-span-3 sm:w-auto"
        >
          {mutation.isPending ? "Saving..." : "Save enquiry and open Roar Bank"}
        </button>
      </form>
    </div>
  );
}
