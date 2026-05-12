"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment, usePathname } from "next/navigation";
import { LayoutDashboard, Users, Newspaper, LogOut, Menu, X, ExternalLink, MapPin, Package, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useIsAdmin, useSession } from "@/hooks/use-auth";
import { useEffect } from "react";

const sidebarItems = [
  { to: "/admin", label: "ダッシュボード", en: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/regions", label: "地域ネットワーク", en: "Regions", icon: MapPin, exact: false },
  { to: "/admin/producers", label: "生産者", en: "Producers", icon: Users, exact: false },
  { to: "/admin/products", label: "取扱品目", en: "Products", icon: Package, exact: false },
  { to: "/admin/news", label: "ニュース", en: "News", icon: Newspaper, exact: false },
  { to: "/admin/media", label: "メディアライブラリ", en: "Media", icon: ImageIcon, exact: false },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/admin";
  const segment = useSelectedLayoutSegment();
  const { user, loading } = useSession();
  const { data: isAdmin, isLoading: checking } = useIsAdmin(user);
  const [mobileOpen, setMobileOpen] = useState(false);

  // /admin/login must stay reachable without the guard.
  const isLoginRoute = segment === "login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (loading || checking) return;
    if (!user || !isAdmin) {
      const qs = new URLSearchParams({ from: pathname }).toString();
      router.replace(`/admin/login?${qs}`);
    }
  }, [isLoginRoute, loading, checking, user, isAdmin, pathname, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground tracking-wider">Loading…</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  const isItemActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <aside className="hidden lg:flex w-64 bg-foreground text-primary-foreground flex-col relative overflow-hidden">
        <div className="absolute inset-0 wa-seigaiha-light opacity-60 pointer-events-none" />
        <div className="relative p-6 border-b border-primary-foreground/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-sun flex items-center justify-center text-foreground font-serif font-bold text-lg group-hover:rotate-6 transition-smooth">
              W
            </div>
            <div className="leading-tight">
              <div className="font-serif font-bold text-base">W・H Admin</div>
              <div className="text-[9px] text-primary-foreground/50 tracking-[0.2em]">CONTENT MANAGEMENT</div>
            </div>
          </Link>
        </div>

        <nav className="relative flex-1 p-4 space-y-1">
          {sidebarItems.map(({ to, label, en, icon: Icon, exact }) => {
            const active = isItemActive(to, exact);
            return (
              <Link
                key={to}
                href={to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm transition-smooth group",
                  active
                    ? "bg-sun/15 text-sun border-l-2 border-sun"
                    : "text-primary-foreground/70 hover:text-sun hover:bg-primary-foreground/5 border-l-2 border-transparent"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.7} />
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-[9px] tracking-[0.2em] opacity-60 uppercase">{en}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="relative p-4 border-t border-primary-foreground/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-primary-foreground/60 hover:text-sun transition-smooth px-2 py-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            公開サイトを開く
          </a>
          <div className="px-2 py-1 text-[10px] text-primary-foreground/40 tracking-wider break-all">
            {user.email}
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-primary-foreground/70 hover:text-sun hover:bg-primary-foreground/5 rounded-none h-9"
          >
            <LogOut className="h-4 w-4 mr-2" />
            サインアウト
          </Button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-foreground text-primary-foreground border-b border-primary-foreground/10">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sun flex items-center justify-center text-foreground font-serif font-bold">W</div>
            <span className="font-serif font-bold text-sm">W・H Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-primary-foreground/10 p-2 space-y-1">
            {sidebarItems.map(({ to, label, icon: Icon, exact }) => {
              const active = isItemActive(to, exact);
              return (
                <Link
                  key={to}
                  href={to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm",
                    active ? "bg-sun/15 text-sun" : "text-primary-foreground/75 hover:bg-primary-foreground/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-primary-foreground/75 rounded-none"
            >
              <LogOut className="h-4 w-4 mr-2" />
              サインアウト
            </Button>
          </nav>
        )}
      </div>

      <main className="flex-1 min-w-0 lg:ml-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
