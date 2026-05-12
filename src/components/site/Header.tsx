"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

const navItems = [
  { label: "ホーム", to: "/" },
  { label: "会社概要", to: "/about" },
  { label: "業務内容", to: "/services" },
  { label: "農場紹介", to: "/producers" },
  { label: "採用情報", to: "/careers" },
  { label: "お知らせ", to: "/news" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/60 shadow-soft transition-smooth">
        <div className="flex h-16 sm:h-20 md:h-24 items-center justify-between px-4 sm:px-[5vw] gap-3">
          <Link href="/" className="group shrink-0">
            <img
              src={logoImage.src}
              alt="株式会社W・H ロゴ"
              className="h-9 sm:h-11 md:h-14 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 xl:gap-10">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "text-base font-medium tracking-[0.12em] uppercase transition-smooth relative group py-1",
                    active ? "text-primary" : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute left-0 right-0 -bottom-0.5 h-[1px] origin-left bg-primary transition-transform duration-500",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="tel:048-228-6770"
              className="hidden md:flex items-center gap-2 lg:gap-3 rounded-full bg-green-600 px-4 lg:px-6 h-12 lg:h-14 text-white hover:bg-green-700 transition-smooth"
            >
              <Phone className="h-5 w-5 lg:h-7 lg:w-7 text-white fill-white" />
              <span className="text-base lg:text-2xl leading-none font-medium font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif] whitespace-nowrap">048-228-6770</span>
            </a>
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex rounded-none font-medium text-sm tracking-[0.12em] h-11 px-5 lg:px-6 bg-white text-primary border border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Link href="/contact">お問い合わせ</Link>
            </Button>
            <a
              href="tel:048-228-6770"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white hover:bg-green-700 transition-smooth"
              aria-label="お電話"
            >
              <Phone className="h-5 w-5 fill-white" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "lg:hidden p-2 relative z-[60] transition-colors",
                open ? "text-primary-foreground" : "text-foreground"
              )}
              aria-label="メニュー"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden bg-gradient-editorial transition-opacity duration-500",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 wa-seigaiha-light pointer-events-none" />
        <div className="blob bg-sun/20 w-[300px] h-[300px] top-10 -right-20" />
        <div className="blob bg-primary-glow/15 w-[260px] h-[260px] bottom-0 -left-10" style={{ animationDelay: "2s" }} />

        <nav className="relative h-full flex flex-col justify-center px-[5vw] py-24 overflow-y-auto">
          <div className="text-xs tracking-[0.4em] uppercase text-sun mb-6">Menu</div>
          <ul className="flex flex-col gap-3">
            {navItems.map((item, i) => {
              const active = pathname === item.to;
              return (
                <li
                  key={item.to}
                  style={{
                    transitionDelay: open ? `${i * 70 + 150}ms` : "0ms",
                    transform: open ? "translateY(0)" : "translateY(20px)",
                    opacity: open ? 1 : 0,
                  }}
                  className="transition-all duration-500"
                >
                  <Link
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline py-2 border-b border-primary-foreground/10"
                  >
                    <span
                      className={cn(
                        "font-serif text-3xl sm:text-4xl font-bold tracking-tight transition-smooth",
                        active
                          ? "text-sun"
                          : "text-primary-foreground group-hover:text-sun"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            className="mt-10 flex flex-col gap-4 transition-all duration-500"
            style={{
              transitionDelay: open ? `${navItems.length * 70 + 200}ms` : "0ms",
              transform: open ? "translateY(0)" : "translateY(20px)",
              opacity: open ? 1 : 0,
            }}
          >
            <Button
              asChild
              className="bg-sun text-foreground hover:bg-sun/90 rounded-none h-12 tracking-wider self-start px-7 text-base"
            >
              <Link href="/contact">お問い合わせ</Link>
            </Button>
            <a
              href="tel:048-228-6770"
              className="flex items-center gap-3 bg-green-600 text-white hover:bg-green-700 rounded-full px-5 h-14 self-start"
            >
              <Phone className="h-7 w-7 text-white fill-white" />
              <span className="text-2xl leading-none font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif]">048-228-6770</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
