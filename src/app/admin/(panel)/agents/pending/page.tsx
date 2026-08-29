import { redirect } from "next/navigation";

export default function AdminAgentsPendingPage() {
  redirect("/admin/agents?status=pending");
}
