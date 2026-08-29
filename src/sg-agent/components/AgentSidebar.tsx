"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  agentSidebarNav,
  isAgentSidebarNavSection,
  type AgentSidebarNavItem,
} from "@/sg-agent/lib/sidebar-nav";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { clearToken } from "@/sg-agent/lib/api";
import { SITE_CONFIG } from "@/lib/config/env";
import { useQuery } from "@tanstack/react-query";
import { getRoarReferralStats } from "@/sg-agent/lib/services/roarReferralService";
import { PendingCountBadge } from "@/components/ui/PendingCountBadge";

function NavLink({
  item,
  pathname,
  badgeCount,
}: {
  item: AgentSidebarNavItem;
  pathname: string;
  badgeCount?: number;
}) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/agent/choice-connect/summary" &&
      pathname.startsWith(`${item.href}/`)) ||
    (item.href === "/agent/choice-connect/summary" &&
      pathname === "/agent/choice-connect/summary");

  return (
    <Link
      href={item.href}
      scroll={false}
      className={twMerge(
        "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
        isActive ? "bg-white/20 text-white shadow-lg" : "text-white/75 hover:bg-white/10 hover:text-white"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1 truncate">{item.title}</span>
      <PendingCountBadge count={badgeCount} />
    </Link>
  );
}

export function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const { data: roarStats } = useQuery({
    queryKey: ["agent-roar-stats"],
    queryFn: getRoarReferralStats,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
  const roarPending = roarStats?.pending ?? 0;

  useEffect(() => {
    if (pathname.startsWith("/agent/choice-connect")) {
      setOpenSections((prev) => ({ ...prev, "Credit Card": true }));
    }
    if (pathname.startsWith("/agent/insurance")) {
      setOpenSections((prev) => ({ ...prev, Insurance: true }));
    }
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="sg-agent-sidebar flex h-full w-full flex-col text-white">
      <div className="flex shrink-0 items-center justify-center border-b border-white/10 px-5 py-5">
        <Link href="/agent/dashboard" className="flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 shadow-md">
          <Image src="/img/logo.png" alt={SITE_CONFIG.name} width={170} height={44} className="h-11 w-auto max-w-[170px] object-contain" priority />
        </Link>
      </div>
      <nav className="sg-sidebar-scroll flex-1 space-y-1.5 px-3 py-5">
        {agentSidebarNav.map((entry) => {
          if (isAgentSidebarNavSection(entry)) {
            const SectionIcon = entry.icon;
            const isSectionActive = pathname.startsWith(entry.href);
            const isOpen = openSections[entry.title] ?? isSectionActive;

            return (
              <div key={entry.title} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(entry.title)}
                  className={twMerge(
                    "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all",
                    isSectionActive ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <SectionIcon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 truncate text-left">{entry.title}</span>
                  <PendingCountBadge
                    count={
                      entry.items.some((item) => item.badgeKey === "roarPending")
                        ? roarPending
                        : 0
                    }
                  />
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
                      <NavLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        badgeCount={item.badgeKey === "roarPending" ? roarPending : 0}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const Icon = entry.icon;
          const isActive = pathname === entry.href || pathname.startsWith(`${entry.href}/`);
          return (
            <Link
              key={entry.href}
              href={entry.href}
              className={twMerge(
                "relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all",
                isActive ? "bg-white/20 text-white shadow-lg" : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              {Icon && <Icon className="h-5 w-5 shrink-0" />}
              <span>{entry.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 p-3">
        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-white/80 hover:bg-red-500/20 hover:text-white">
          <IconLogout className="h-5 w-5 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
