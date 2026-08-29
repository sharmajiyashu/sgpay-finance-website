"use client";

import { useRef, useState } from "react";
import { IconExternalLink, IconLogin } from "@tabler/icons-react";
import { toast } from "sonner";
import type { ChoiceSsoPayload } from "@/lib/choiceConnect/types";

export interface ChoiceConnectSsoApiClient {
  getSsoPayload: () => Promise<ChoiceSsoPayload>;
}

interface ChoiceConnectSsoLoginButtonProps {
  api: ChoiceConnectSsoApiClient;
  label?: string;
  description?: string;
  className?: string;
}

function submitSsoForm(payload: ChoiceSsoPayload) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payload.login_url;
  form.target = "_blank";
  form.style.display = "none";

  const fields: Record<string, string> = {
    opr_id: payload.opr_id,
    user_type: payload.user_type,
    unique_request_number: payload.unique_request_number,
    hash_value: payload.hash_value,
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

export function ChoiceConnectSsoLoginButton({
  api,
  label = "Login to Choice Connect",
  description = "Opens Choice Connect dashboard in a new tab using secure SSO.",
  className = "",
}: ChoiceConnectSsoLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const busyRef = useRef(false);

  async function handleLogin() {
    if (busyRef.current) return;
    busyRef.current = true;
    setLoading(true);

    try {
      const payload = await api.getSsoPayload();
      submitSsoForm(payload);
      const asName = payload.referrerName?.trim();
      toast.success(
        asName
          ? `Opening Choice Connect as ${asName}${payload.referrerRole ? ` · ${payload.referrerRole}` : ""}…`
          : "Redirecting to Choice Connect…"
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "SSO login failed";
      toast.error(message);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div className={`rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Choice Connect SSO</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Portal opens as the logged-in admin, team member, or agent — their referrals
            (cards, loans, insurance) show on their dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            "Preparing login…"
          ) : (
            <>
              <IconLogin className="h-4 w-4" />
              {label}
              <IconExternalLink className="h-4 w-4 opacity-70" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
