import { redirect } from "next/navigation";

export default function AdminAgentsRejectedPage() {
  redirect("/admin/agents?status=rejected");
}
