import {
  IconLayoutDashboard,
  IconUsers,
  IconHelp,
  IconUsersGroup,
  IconList,
  IconCreditCard,
  IconSettings,
  IconShield,
  IconCoin,
  IconHierarchy,
} from "@tabler/icons-react";
import { ENQUIRY_CATEGORIES } from "@/lib/enquiryCatalog";
import { hasAnyPermission, hasPermission } from "@/sg-admin/lib/permissions";
import type { AuthUser } from "@/sg-admin/lib/api";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  permission?: string | string[];
}

export interface SidebarNavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  items: SidebarNavItem[];
  permission?: string | string[];
}

export type SidebarNavEntry = SidebarNavItem | SidebarNavSection;

export function isSidebarNavSection(entry: SidebarNavEntry): entry is SidebarNavSection {
  return "items" in entry && Array.isArray(entry.items);
}

export const sidebarNav: SidebarNavEntry[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: IconLayoutDashboard,
    permission: "admin:dashboard:get",
  },
  {
    title: "Teams",
    href: "/admin/teams",
    icon: IconHierarchy,
    permission: "admin:team:get",
  },
  {
    title: "Agents",
    href: "/admin/agents",
    icon: IconUsersGroup,
    permission: "admin:agent:get",
  },
  {
    title: "Roles",
    href: "/admin/roles",
    icon: IconShield,
    permission: "admin:roles:get",
  },
  {
    title: "Commissions",
    href: "/admin/commissions/rules",
    icon: IconCoin,
    permission: "admin:commission:get",
    items: [
      { title: "Rules", href: "/admin/commissions/rules", permission: "admin:commission:get" },
      { title: "Ledger", href: "/admin/commissions/ledger", permission: "admin:commission:get" },
    ],
  },
  {
    title: "Enquiries",
    href: "/admin/enquiries",
    icon: IconHelp,
    permission: "admin:enquiry:get",
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
    permission: "admin:choice-connect:get",
    items: [
      { title: "Summary", href: "/admin/choice-connect/summary" },
      { title: "Credit Card", href: "/admin/choice-connect/credit-card" },
      { title: "Loans", href: "/admin/choice-connect/loans" },
      { title: "Referral Links", href: "/admin/choice-connect/referral-links" },
      { title: "Onboarding", href: "/admin/choice-connect/onboarding" },
      { title: "SSO Login", href: "/admin/choice-connect/sso" },
    ],
  },
  {
    title: "Website Settings",
    href: "/admin/settings",
    icon: IconSettings,
    permission: "admin:settings:get",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: IconUsers,
    permission: "admin:user:get",
  },
];

function allowed(permission: string | string[] | undefined, user?: AuthUser | null): boolean {
  if (!permission) return true;
  if (Array.isArray(permission)) return hasAnyPermission(permission, user);
  return hasPermission(permission, user);
}

export function getFilteredSidebarNav(user?: AuthUser | null): SidebarNavEntry[] {
  return sidebarNav
    .filter((entry) => allowed(entry.permission, user))
    .map((entry) => {
      if (!isSidebarNavSection(entry)) return entry;
      return {
        ...entry,
        items: entry.items.filter((item) => allowed(item.permission, user)),
      };
    })
    .filter((entry) => !isSidebarNavSection(entry) || entry.items.length > 0);
}
