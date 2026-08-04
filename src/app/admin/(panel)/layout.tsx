import { AuthGuard } from "@/sg-admin/components/AuthGuard";
import { DashboardShell } from "@/sg-admin/components/DashboardShell";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
