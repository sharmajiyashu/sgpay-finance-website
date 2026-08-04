"use client";

import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "@/sg-admin/components/DashboardSidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getAuthUser, type AuthUser } from "@/sg-admin/lib/api";

function displayName(user: AuthUser | null): string {
  if (!user) return "—";
  return user.name ?? user.email ?? "—";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    queueMicrotask(() => setAuthUserState(getAuthUser()));
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5">
      <aside
        className={`shrink-0 overflow-hidden transition-[width] duration-500 ease-out ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="flex h-full w-64 flex-col overflow-hidden shadow-xl">
          <DashboardSidebar />
        </div>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? (
              <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
            ) : (
              <IconLayoutSidebarLeftExpand className="h-5 w-5" />
            )}
          </button>
          <div className="flex flex-1 items-center justify-end gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-card-foreground hover:bg-muted">
                <span className="max-w-[180px] truncate">
                  {displayName(authUser)}
                </span>
                <IconChevronDown className="h-4 w-4 opacity-60" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[180px] rounded-lg border border-border bg-background p-1 shadow-lg"
                  sideOffset={6}
                  align="end"
                >
                  <div className="px-2 py-2 text-sm font-medium">
                    {displayName(authUser)}
                  </div>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground outline-none hover:bg-muted"
                    onSelect={() => {
                      clearToken();
                      router.push("/login");
                    }}
                  >
                    <IconLogout className="h-4 w-4" />
                    Log out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>
        <main
          ref={mainRef}
          className="min-h-0 flex-1 overflow-auto p-6"
          id="main-content"
        >
          <div
            key={pathname}
            className="mx-auto max-w-7xl animate-in fade-in duration-200"
          >
            {children}
          </div>
        </main>
        <footer className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-7xl text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sg Pay 4u
          </div>
        </footer>
      </div>
    </div>
  );
}
