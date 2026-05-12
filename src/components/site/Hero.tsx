"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Leaf, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end overflow-hidden bg-foreground"
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0)` }}
      >
        <img
          src={heroImage.src}
          alt="日本の青々とした野菜畑の風景"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover kenburns opacity-90"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />

      {/* Floating leaves — subtle motion accents */}
      <div className="absolute top-[22%] right-[15%] text-sun/70 hidden md:block float-slow" aria-hidden>
        <Leaf className="h-10 w-10 rotate-12" strokeWidth={1.5} />
      </div>
      <div className="absolute top-[60%] left-[8%] text-leaf/80 hidden md:block float-medium" style={{ animationDelay: "1.5s" }} aria-hidden>
        <Sparkles className="h-7 w-7" strokeWidth={1.5} />
      </div>

      {/* Vertical label — left edge */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center gap-3 text-primary-foreground/70">
        <span className="writing-vertical text-[10px] tracking-[0.4em] uppercase font-medium">
          W·H Inc. — Fresh Produce Network / Since 2011
        </span>
      </div>

      {/* Index marker — top right */}
      <div className="absolute top-28 right-4 md:right-12 z-10 text-primary-foreground/80 text-right hidden md:block animate-fade-in">
        <div className="text-[10px] tracking-[0.4em] uppercase mb-2">— 01 / Hero</div>
        <div className="font-serif text-sm leading-tight max-w-[180px] ml-auto">
          全国200を超える
          <br />
          協力農家ネットワーク
        </div>
      </div>

      <div className="container relative z-10 pb-16 md:pb-28 pt-28 md:pt-32 text-primary-foreground">
        <div className="max-w-5xl animate-fade-up">
          <div className="flex items-center gap-4 mb-6 md:mb-10">
            <span className="h-px w-10 md:w-12 bg-sun animate-draw-line origin-left" />
            <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-medium text-sun">
              Fresh · Trusted · Since 2011
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2rem,9vw,2.75rem)] sm:text-6xl md:text-8xl lg:text-[8.5rem] font-bold leading-[0.95] text-balance mb-8 md:mb-10 tracking-tight">
            私たちは日本の農業を
            <br />
            応援します
          </h1>

          <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-end max-w-4xl">
            <p className="text-[15px] md:text-lg text-primary-foreground/90 leading-loose max-w-xl font-light">
              「大量の野菜を、安定して仕入れたい。」
              <br className="hidden sm:block" />
              そんなご要望に、全国の生産者ネットワークでお応えします。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="bg-sun text-foreground hover:bg-sun/90 rounded-none font-medium text-sm h-14 px-7 tracking-wider group shadow-pop"
              >
                <Link href="/services">
                  VIEW SERVICES
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent backdrop-blur-sm border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-none font-medium text-sm h-14 px-7 tracking-wider"
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4 text-green-500" />
                  CONTACT
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rotating badge — bottom left */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 hidden sm:flex">
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          <div className="absolute inset-0 rounded-full bg-sun flex items-center justify-center shadow-pop">
            <div className="text-foreground font-serif font-bold text-center leading-tight">
              <div className="text-[9px] tracking-[0.2em] uppercase">Fresh</div>
              <div className="text-2xl md:text-3xl italic">200+</div>
              <div className="text-[9px] tracking-[0.2em] uppercase">Farms</div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 right-6 md:right-8 z-10 hidden md:flex flex-col items-center gap-3 text-primary-foreground/60">
        <span className="writing-vertical text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-primary-foreground/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-sun animate-pulse" />
        </div>
      </div>
    </section>
  );
};
