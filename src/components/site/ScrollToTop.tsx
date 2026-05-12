"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const RouteScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

// Floating icon button pinned to the bottom-right. Hidden until the user
// has scrolled past ~1 viewport so it doesn't crowd the hero.
export const TopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="ページトップへ戻る"
      className={cn(
        "fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40",
        "inline-flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full",
        "text-primary-foreground bg-foreground/85 hover:bg-primary shadow-soft backdrop-blur-sm",
        "border border-primary-foreground/20",
        "transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none",
      )}
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
};
