"use client";

import React, { useState } from "react";
import { IconBell, IconLoader, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useTranslations } from "@/contexts/LanguageContext";
import { sendNotification } from "@/lib/services/notificationService";

export default function NotificationsPage(): React.JSX.Element {
  const { t } = useTranslations();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"marketing" | "security">("marketing");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await sendNotification({ title, body, type });
      setSuccess(true);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("notifications.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("notifications.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("notifications.subtitle")}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t("notifications.formTitle")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notification Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "marketing" | "security")}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="marketing">Marketing</option>
              <option value="security">Security</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New offers available!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Message Body
            </label>
            <textarea
              required
              rows={4}
              placeholder="Type your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
          </div>

          {success && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-500 animate-in fade-in zoom-in-95">
              <IconCheck className="h-4 w-4 shrink-0" />
              {t("notifications.success")}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in zoom-in-95">
              <IconAlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !title.trim() || !body.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <IconLoader className="h-4 w-4 animate-spin" />
            ) : (
              <IconBell className="h-4 w-4" />
            )}
            {loading ? t("notifications.sending") : t("notifications.sendBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
