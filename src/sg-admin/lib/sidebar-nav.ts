import {
  IconLayoutDashboard,
  IconUsers,
  IconHelp,
  IconUsersGroup,
  IconList,
  IconCreditCard,
  IconSettings,
} from "@tabler/icons-react";
import { ENQUIRY_CATEGORIES } from "@/lib/enquiryCatalog";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
}

export interface SidebarNavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  items: SidebarNavItem[];
}

export type SidebarNavEntry = SidebarNavItem | SidebarNavSection;

export function isSidebarNavSection(entry: SidebarNavEntry): entry is SidebarNavSection {
  return "items" in entry && Array.isArray(entry.items);
}

export const sidebarNav: SidebarNavEntry[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: IconLayoutDashboard },
  { title: "Teams", href: "/admin/teams", icon: IconUsersGroup },
  {
    title: "Enquiries",
    href: "/admin/enquiries",
    icon: IconHelp,
    items: [
      { title: "All Enquiries", href: "/admin/enquiries", icon: IconList },
      ...ENQUIRY_CATEGORIES.map((category) => ({
        title: category.label,
        href: category.href,
      })),
    ],
  },
  {
    title: "Choice Connect",
    href: "/admin/choice-connect/summary",
    icon: IconCreditCard,
    items: [
      { title: "Summary", href: "/admin/choice-connect/summary" },
      { title: "Credit Card", href: "/admin/choice-connect/credit-card" },
      { title: "Loans", href: "/admin/choice-connect/loans" },
      { title: "Referral Links", href: "/admin/choice-connect/referral-links" },
      { title: "Onboarding", href: "/admin/choice-connect/onboarding" },
      { title: "SSO Login", href: "/admin/choice-connect/sso" },
    ],
  },
  { title: "Website Settings", href: "/admin/settings", icon: IconSettings },
  { title: "Users", href: "/admin/users", icon: IconUsers },
];
