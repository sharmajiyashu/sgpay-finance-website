"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getFilteredSidebarNav,
  isSidebarNavSection,
  type SidebarNavItem,
} from "@/sg-admin/lib/sidebar-nav";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { clearToken, getAuthUser } from "@/sg-admin/lib/api";
import { SITE_CONFIG } from "@/lib/config/env";

function NavLink({
  item,
  pathname,
}: {
  item: SidebarNavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/admin/enquiries" && pathname.startsWith(`${item.href}/`)) ||
    (item.href === "/admin/enquiries" && pathname === "/admin/enquiries");

  return (
    <Link
      href={item.href}
      scroll={false}
      className={twMerge(
        "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300",
        isActive
          ? "sg-admin-nav-active text-white shadow-lg"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      )}
    >
      {isActive && (
        <span
          className="absolute inset-y-2 left-0 w-1 rounded-full bg-white"
          aria-hidden
        />
      )}
      {Icon && (
        <Icon
          className={twMerge(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            isActive ? "scale-110" : "group-hover:scale-105"
          )}
        />
      )}
      <span>{item.title}</span>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.startsWith("/admin/enquiries")) {
      setOpenSections((prev) => ({ ...prev, Enquiries: true }));
    }
    if (pathname.startsWith("/admin/choice-connect")) {
      setOpenSections((prev) => ({ ...prev, "Credit Card": true }));
    }
    if (pathname.startsWith("/admin/commissions")) {
      setOpenSections((prev) => ({ ...prev, Commissions: true }));
    }
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const navEntries = getFilteredSidebarNav(getAuthUser());

  return (
    <aside className="sg-admin-sidebar flex h-full w-full flex-col text-white">
      <div className="sg-admin-sidebar-header flex shrink-0 items-center justify-center border-b border-white/10 px-5 py-5">
        <Link
          href="/admin/dashboard"
          className="flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 shadow-md transition-transform hover:scale-[1.02]"
        >
          <Image
            src="/img/logo.png"
            alt={SITE_CONFIG.name}
            width={170}
            height={44}
            className="h-11 w-auto max-w-[170px] object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        {navEntries.map((entry) => {
          if (isSidebarNavSection(entry)) {
            const SectionIcon = entry.icon;
            const isSectionActive = pathname.startsWith(entry.href);
            const isOpen = openSections[entry.title] ?? isSectionActive;

            return (
              <div key={entry.title} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(entry.title)}
                  className={twMerge(
                    "group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300",
                    isSectionActive
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <SectionIcon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-left">{entry.title}</span>
                  <IconChevronDown
                    className={twMerge(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="ml-3 space-y-0.5 border-l border-white/15 pl-2">
                    {entry.items.map((item) => (
                      <NavLink key={item.href} item={item} pathname={pathname} />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return <NavLink key={entry.href} item={entry} pathname={pathname} />;
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-white/80 transition-all hover:bg-red-500/20 hover:text-white"
        >
          <IconLogout className="h-5 w-5 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
