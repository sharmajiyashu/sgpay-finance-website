import { redirect } from "next/navigation";

export default function AdminAgentsApprovedPage() {
  redirect("/admin/agents?status=approved");
}
