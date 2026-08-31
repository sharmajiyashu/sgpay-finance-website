import { redirect } from "next/navigation";

export default async function AdminTeamDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/teams/view/${id}`);
}
