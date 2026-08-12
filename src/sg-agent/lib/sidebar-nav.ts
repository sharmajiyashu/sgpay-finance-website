import {
  IconLayoutDashboard,
  IconUser,
  IconCreditCard,
  IconList,
  IconUsersGroup,
  IconCoin,
  IconShield,
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
  { title: "Downline", href: "/agent/downline", icon: IconUsersGroup },
  { title: "Commissions", href: "/agent/commissions", icon: IconCoin },
  {
    title: "Credit Card",
    href: "/agent/choice-connect/credit-card",
    icon: IconCreditCard,
    items: [
      { title: "Choice Connect", href: "/agent/choice-connect/credit-card" },
      { title: "Roar Bank Enquiry", href: "/agent/choice-connect/roar-bank-enquiry" },
      { title: "Roar Referral Link", href: "/agent/choice-connect/roar-referral-link" },
      { title: "Summary", href: "/agent/choice-connect/summary", icon: IconList },
      { title: "Loans", href: "/agent/choice-connect/loans" },
      { title: "Referral Links", href: "/agent/choice-connect/referral-links" },
    ],
  },
  {
    title: "Insurance",
    href: "/agent/insurance/motor",
    icon: IconShield,
    items: [
      { title: "Motor Apply", href: "/agent/insurance/motor" },
      { title: "Summary", href: "/agent/insurance/summary", icon: IconList },
      { title: "Referral Links", href: "/agent/insurance/referral-links" },
    ],
  },
  { title: "Profile", href: "/agent/profile", icon: IconUser },
];
