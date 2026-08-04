import { AgentAuthGuard } from "@/sg-agent/components/AgentAuthGuard";
import { AgentShell } from "@/sg-agent/components/AgentShell";

export default function AgentPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentAuthGuard>
      <AgentShell>{children}</AgentShell>
    </AgentAuthGuard>
  );
}
