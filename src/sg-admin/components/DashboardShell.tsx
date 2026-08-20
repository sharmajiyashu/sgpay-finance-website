"use client";

import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "@/sg-admin/components/DashboardSidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getAuthUser, type AuthUser } from "@/sg-admin/lib/api";

function displayName(user: AuthUser | null): string {
  if (!user) return "—";
  return user.name ?? user.email ?? "—";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    queueMicrotask(() => setAuthUserState(getAuthUser()));
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`z-40 shrink-0 overflow-hidden transition-[width,transform] duration-300 ease-out max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-64 ${
          mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        } ${desktopOpen ? "lg:w-64" : "lg:w-0"}`}
      >
        <div className="flex h-full w-64 flex-col overflow-hidden shadow-xl">
          <DashboardSidebar />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-white/80 px-3 shadow-sm backdrop-blur-md sm:gap-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {mobileOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setDesktopOpen((o) => !o)}
            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
            aria-label={desktopOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {desktopOpen ? (
              <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
            ) : (
              <IconLayoutSidebarLeftExpand className="h-5 w-5" />
            )}
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-card-foreground hover:bg-muted sm:px-3">
                <span className="max-w-[140px] truncate sm:max-w-[180px]">
                  {displayName(authUser)}
                </span>
                <IconChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[180px] rounded-lg border border-border bg-background p-1 shadow-lg"
                  sideOffset={6}
                  align="end"
                >
                  <div className="px-2 py-2 text-sm font-medium break-words">
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
          className="min-h-0 min-w-0 flex-1 overflow-auto p-4 sm:p-6"
          id="main-content"
        >
          <div
            key={pathname}
            className="mx-auto min-w-0 max-w-7xl break-words animate-in fade-in duration-200"
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
