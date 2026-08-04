import {
  IconLayoutDashboard,
  IconUser,
  IconCreditCard,
  IconList,
} from "@tabler/icons-react";

export interface AgentSidebarNavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
}

export interface AgentSidebarNavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  items: AgentSidebarNavItem[];
}

export type AgentSidebarNavEntry = AgentSidebarNavItem | AgentSidebarNavSection;

export function isAgentSidebarNavSection(
  entry: AgentSidebarNavEntry
): entry is AgentSidebarNavSection {
  return "items" in entry && Array.isArray(entry.items);
}

export const agentSidebarNav: AgentSidebarNavEntry[] = [
  { title: "Dashboard", href: "/agent/dashboard", icon: IconLayoutDashboard },
  {
    title: "Choice Connect",
    href: "/agent/choice-connect/summary",
    icon: IconCreditCard,
    items: [
      { title: "Summary", href: "/agent/choice-connect/summary", icon: IconList },
      { title: "Credit Card", href: "/agent/choice-connect/credit-card" },
      { title: "Loans", href: "/agent/choice-connect/loans" },
    ],
  },
  { title: "Profile", href: "/agent/profile", icon: IconUser },
];
