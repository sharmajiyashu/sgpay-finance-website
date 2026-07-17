  import {
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconShieldLock,
  IconPackage,
  IconUsersGroup,
  IconReceipt2,
  IconHelp,
  IconAlertTriangle,
  IconUserMinus,
  IconClock,
  IconListDetails,
  IconBell
} from "@tabler/icons-react";

export interface SidebarNavItem {
  titleKey: string;
  href: string;
  icon?: React.ElementType;
}

export interface SidebarNavSection {
  titleKey: string;
  href: string;
  items: SidebarNavItem[];
  icon?: React.ElementType;
}

export type SidebarNavEntry = SidebarNavItem | SidebarNavSection;

export function isNavSection(
  item: SidebarNavEntry
): item is SidebarNavSection {
  return "items" in item && Array.isArray((item as SidebarNavSection).items);
}

/** Sidebar navigation config for A-ledD Admin Panel. titleKey matches i18n messages. */
export const sidebarNav: SidebarNavEntry[] = [
  { titleKey: "nav.dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { titleKey: "nav.userManagement", href: "/user-management", icon: IconUsersGroup },
  { titleKey: "nav.subscriptions", href: "/subscriptions", icon: IconReceipt2 },
  { titleKey: "nav.enquiries", href: "/enquiries", icon: IconHelp },
  { titleKey: "nav.reports", href: "/reports", icon: IconAlertTriangle },
  { titleKey: "nav.accountDeletions", href: "/account-deletions", icon: IconUserMinus },
  { titleKey: "nav.notifications", href: "/notifications", icon: IconBell },
  {
    titleKey: "nav.administration",
    href: "/administration",
    icon: IconSettings,
    items: [
      { titleKey: "nav.users", href: "/administration/users", icon: IconUsers },
      { titleKey: "nav.roles", href: "/administration/roles", icon: IconShieldLock },
      { titleKey: "nav.activityLogs", href: "/administration/activity-logs", icon: IconClock },
      { titleKey: "nav.packages", href: "/administration/packages", icon: IconPackage },
      { titleKey: "nav.settingOptions", href: "/administration/setting-options", icon: IconListDetails },
    ],
  },
];
