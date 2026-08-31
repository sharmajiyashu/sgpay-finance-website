"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadKycDocuments } from "@/sg-agent/lib/services/agentProfileService";

interface KycDocumentUploadSectionProps {
  kycStatus?: string;
  kycReviewNote?: string;
  panCard?: string;
  aadhaarCardNumber?: string;
}

export function KycDocumentUploadSection({
  kycStatus = "pending",
  kycReviewNote,
  panCard = "",
  aadhaarCardNumber = "",
}: KycDocumentUploadSectionProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    panCard,
    aadhaarCardNumber,
  });

  const [files, setFiles] = useState<{
    panCardFile?: File;
    aadhaarFrontFile?: File;
    aadhaarBackFile?: File;
    bankPassbookFile?: File;
  }>({});

  const uploadMutation = useMutation({
    mutationFn: uploadKycDocuments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-profile"] });
      toast.success("KYC documents uploaded successfully! Sent for verification.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusColor =
    kycStatus === "approved"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : kycStatus === "submitted"
      ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
      : kycStatus === "rejected"
      ? "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">KYC Documents Verification</h2>
          <p className="text-xs text-muted-foreground">
            Upload PAN Card, Aadhaar Card (Front & Back), and Bank Passbook for mandatory KYC.
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusColor}`}
        >
          KYC Status: {kycStatus}
        </span>
      </div>
      {kycStatus === "rejected" && kycReviewNote ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          Review note: {kycReviewNote}
        </p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          uploadMutation.mutate({
            panCard: form.panCard.trim(),
            aadhaarCardNumber: form.aadhaarCardNumber.trim(),
            ...files,
          });
        }}
        className="mt-6 space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              PAN Card Number
            </label>
            <input
              type="text"
              value={form.panCard}
              onChange={(e) => setForm((p) => ({ ...p, panCard: e.target.value.toUpperCase() }))}
              placeholder="ABCDE1234F"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm uppercase"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Aadhaar Card Number
            </label>
            <input
              type="text"
              value={form.aadhaarCardNumber}
              onChange={(e) => setForm((p) => ({ ...p, aadhaarCardNumber: e.target.value }))}
              placeholder="1234 5678 9012"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FileInputCard
            label="PAN Card Copy"
            file={files.panCardFile}
            onChange={(file) => setFiles((p) => ({ ...p, panCardFile: file }))}
          />
          <FileInputCard
            label="Aadhaar Front Copy"
            file={files.aadhaarFrontFile}
            onChange={(file) => setFiles((p) => ({ ...p, aadhaarFrontFile: file }))}
          />
          <FileInputCard
            label="Aadhaar Back Copy"
            file={files.aadhaarBackFile}
            onChange={(file) => setFiles((p) => ({ ...p, aadhaarBackFile: file }))}
          />
          <FileInputCard
            label="Bank Passbook / Cheque"
            file={files.bankPassbookFile}
            onChange={(file) => setFiles((p) => ({ ...p, bankPassbookFile: file }))}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {uploadMutation.isPending ? "Uploading KYC..." : "Submit KYC Documents"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FileInputCard({
  label,
  file,
  onChange,
}: {
  label: string;
  file?: File;
  onChange: (file?: File) => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="mt-2 text-xs text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-medium hover:file:bg-muted/80"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      {file && <p className="mt-1 truncate text-[10px] text-emerald-600 font-medium">{file.name}</p>}
    </div>
  );
}
