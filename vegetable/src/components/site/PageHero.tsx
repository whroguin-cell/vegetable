"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type PageHeroProps = {
  number: string;
  en: string;
  ja: string;
  accentJa: string;
  tailJa?: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  /**
   * Optional symbolic image rendered behind the green gradient. Keeps the
   * hero's signature green look while hinting at the page's subject matter
   * (producer fields, warehouse shelves, newspapers, etc).
   */
  backgroundImage?: string;
  backgroundAlt?: string;
};

export const PageHero = ({
  number,
  en,
  ja,
  accentJa,
  tailJa = "",
  description,
  breadcrumb,
  backgroundImage,
  backgroundAlt = "",
}: PageHeroProps) => {
  const hasImage = Boolean(backgroundImage);

  return (
    <section
      className={
        "relative pt-28 md:pt-36 pb-16 md:pb-24 text-primary-foreground overflow-hidden " +
        // When a symbolic image is provided, show it in full and skip the
        // solid green background + seigaiha pattern so the photo reads
        // clearly. Keep only a soft left-side scrim for text contrast.
        (hasImage ? "bg-foreground" : "bg-gradient-editorial grain")
      }
    >
      {hasImage && (
        <>
          <img
            src={backgroundImage}
            alt={backgroundAlt}
            aria-hidden={backgroundAlt === "" ? true : undefined}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // If the symbolic photo fails (network, CDN, etc.), fall back to
              // the green editorial gradient so the hero never renders a blank box.
              const t = e.currentTarget;
              t.style.display = "none";
              t.parentElement?.classList.add("bg-gradient-editorial", "grain");
            }}
          />
          {/* Soft darkening only where the text sits (left → center fade). */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/30 to-transparent pointer-events-none" />
        </>
      )}
      {!hasImage && <div className="absolute inset-0 wa-seigaiha-light pointer-events-none" />}
      <div className="blob bg-sun/25 w-[400px] h-[400px] -top-20 -right-20 hidden md:block" />
      <div className="blob bg-primary-glow/20 w-[300px] h-[300px] bottom-0 left-[15%] hidden md:block" style={{ animationDelay: "3s" }} />

      <div className="container relative">
        <div className="flex items-center gap-2 text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary-foreground/60 mb-8 md:mb-12">
          <Link href="/" className="hover:text-sun transition-smooth">
            Home
          </Link>
          {breadcrumb?.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 opacity-50" />
              {b.to ? (
                <Link href={b.to} className="hover:text-sun transition-smooth">
                  {b.label}
                </Link>
              ) : (
                <span className="text-sun">{b.label}</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-serif text-xs italic text-primary-foreground/60">— {number}</span>
          <span className="h-px w-10 bg-sun" />
          <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-sun font-medium">
            {en}
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-balance max-w-4xl">
          {ja}
          <br />
          <span className="italic font-normal text-sun relative inline-block">
            {accentJa}
            <span className="absolute -bottom-1 left-0 right-0 h-[8px] md:h-[10px] bg-sun/30 -z-10" />
          </span>
          {tailJa}
        </h1>

        {description && (
          <p className="mt-8 md:mt-10 max-w-2xl text-primary-foreground/80 leading-loose text-[15px] md:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};
