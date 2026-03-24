"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FireIcon,
  HomeIcon,
  Squares2X2Icon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { AddDreamButton } from "@/components/dreams/add-dream-button";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Feed", icon: HomeIcon },
  { href: "/heatmap", label: "Heatmap", icon: Squares2X2Icon },
  { href: "/profile", label: "Profile", icon: UserCircleIcon }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-24 pt-6 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-accent/15 p-2 text-accent">
            <FireIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted">Dream journal network</p>
            <h1 className="text-lg font-semibold tracking-tight">DreamSphere</h1>
          </div>
        </Link>
        {user && <AddDreamButton />}
      </header>

      <main className="flex-1">{children}</main>

      {user ? (
        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-3xl border border-border bg-panel/95 px-4 py-3 shadow-glow backdrop-blur">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-20 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs transition",
                  active ? "bg-accent/15 text-accent" : "text-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
