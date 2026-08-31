export type KycStatus = "pending" | "submitted" | "approved" | "rejected";

export function kycLabel(status?: string): string {
  if (status === "approved") return "Verified";
  if (status === "submitted") return "Submitted";
  if (status === "rejected") return "Rejected";
  return "Not verified";
}

export function kycBadgeClass(status?: string): string {
  if (status === "approved") return "bg-emerald-500/10 text-emerald-700";
  if (status === "submitted") return "bg-sky-500/10 text-sky-700";
  if (status === "rejected") return "bg-rose-500/10 text-rose-700";
  return "bg-amber-500/10 text-amber-800";
}
