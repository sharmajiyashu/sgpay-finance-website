/** Fill Choice Connect referral URLs with the logged-in user's agent code. */
export function buildShareableReferralLink(link: string, agentCode?: string): string {
  const code = agentCode?.trim();
  if (!link) return "";
  if (!code) return link;

  try {
    const url = new URL(link);
    const emptyOrMissing = ["agent_code", "agentCode", "sac", "subref"] as const;
    for (const key of emptyOrMissing) {
      if (!url.searchParams.has(key) || !url.searchParams.get(key)?.trim()) {
        if (key === "agent_code" || key === "agentCode" || url.searchParams.has(key)) {
          url.searchParams.set(key, code);
        }
      }
    }
    if (!url.searchParams.has("agent_code") && !url.searchParams.has("agentCode")) {
      url.searchParams.set("agent_code", code);
    }
    if (!url.searchParams.get("refId")?.trim()) {
      url.searchParams.set("refId", code);
    }
    return url.toString();
  } catch {
    let next = link;
    const hasQuery = next.includes("?");
    if (!/[?&]agent_code=/.test(next) && !/[?&]agentCode=/.test(next)) {
      next = `${next}${hasQuery ? "&" : "?"}agent_code=${encodeURIComponent(code)}`;
    } else {
      next = next.replace(/([?&](?:agent_code|agentCode)=)(?=&|$)/g, `$1${encodeURIComponent(code)}`);
    }
    if (!/[?&]refId=/.test(next)) {
      next = `${next}&refId=${encodeURIComponent(code)}`;
    }
    return next;
  }
}
