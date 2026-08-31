"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function ReviewActions({
  title,
  description,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  approveConfirm,
  rejectConfirm,
  rejectRequiresNote = false,
  rejectNotePlaceholder = "Reason",
  pending = false,
  disabled = false,
  onApprove,
  onReject,
}: {
  title: string;
  description?: string;
  approveLabel?: string;
  rejectLabel?: string;
  approveConfirm?: string;
  rejectConfirm?: string;
  rejectRequiresNote?: boolean;
  rejectNotePlaceholder?: string;
  pending?: boolean;
  disabled?: boolean;
  onApprove: () => void;
  onReject: (note: string) => void;
}) {
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");

  const close = () => {
    setDialog(null);
    setNote("");
  };

  const confirm = () => {
    if (dialog === "approve") {
      onApprove();
      close();
      return;
    }
    if (rejectRequiresNote && !note.trim()) return;
    onReject(note.trim());
    close();
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || disabled}
          onClick={() => setDialog("approve")}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Saving..." : approveLabel}
        </button>
        <button
          type="button"
          disabled={pending || disabled}
          onClick={() => setDialog("reject")}
          className="rounded-xl border border-rose-300 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
        >
          {rejectLabel}
        </button>
      </div>

      {dialog ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-foreground">
              {dialog === "approve" ? approveLabel : rejectLabel}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {dialog === "approve"
                ? approveConfirm || "Are you sure you want to approve this?"
                : rejectConfirm || "Are you sure you want to reject this?"}
            </p>
            {dialog === "reject" ? (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {rejectRequiresNote ? "Reason *" : "Reason (optional)"}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder={rejectNotePlaceholder}
                />
              </div>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={dialog === "reject" && rejectRequiresNote && !note.trim()}
                onClick={confirm}
                className={twMerge(
                  "rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
                  dialog === "approve" ? "bg-emerald-600" : "bg-rose-600"
                )}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
