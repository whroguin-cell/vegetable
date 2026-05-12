"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useRegions } from "@/hooks/use-content";

export const Network = () => {
  const ref = useReveal<HTMLDivElement>();
  const { data: regions = [], isLoading } = useRegions();

  return (
    <section
      id="producers"
      ref={ref}
      className="py-20 md:py-36 bg-gradient-editorial text-primary-foreground relative overflow-hidden grain"
    >
      {/* Seigaiha wave pattern full-bleed — subtle */}
      <div className="absolute inset-0 wa-seigaiha-light pointer-events-none" />
      <div className="blob bg-sun/15 w-[400px] h-[400px] top-[30%] -left-24 hidden md:block" />
      <div className="blob bg-primary-glow/15 w-[340px] h-[340px] bottom-10 right-[8%] hidden md:block" style={{ animationDelay: "3s" }} />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-12 md:mb-16">
          <div className="lg:col-span-2 reveal">
            <div className="flex lg:flex-col items-center lg:items-start gap-3">
              <span className="font-serif text-xs italic text-primary-foreground/60">— 05</span>
              <span className="text-[10px] tracking-[0.4em] text-sun font-medium uppercase">Network</span>
            </div>
          </div>
          <div className="lg:col-span-7 reveal delay-100">
            <div className="inline-flex items-center gap-2 mb-4 tag-pill bg-primary-foreground/10 text-sun">
              <MapPin className="h-3.5 w-3.5" />
              <span>Nationwide</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight text-balance">
              全国の<br />
              <span className="italic font-normal text-sun relative inline-block">
                生産者
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/30 -z-10" />
              </span>
              ネットワーク。
            </h2>
          </div>
          <div className="lg:col-span-3 flex items-end reveal delay-200">
            <p className="text-primary-foreground/70 leading-loose text-sm">
              北海道から沖縄まで。各地の協力農家との連携が、季節を問わない安定供給を支えています。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-primary-foreground/10">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-foreground p-5 md:p-8 h-40 animate-pulse" />
            ))}
          {regions.map((r, i) => (
            <div
              key={r.area}
              className="group relative overflow-hidden bg-foreground p-5 md:p-8 hover:bg-primary/40 transition-smooth reveal reveal-scale"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-sun/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="flex items-baseline justify-between mb-4 md:mb-5">
                <span className="font-serif text-xs italic text-sun/80">— {r.num}</span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-primary-foreground/50">{r.en}</span>
              </div>
              <div className="font-serif text-xl md:text-2xl font-bold mb-4 md:mb-5 tracking-tight group-hover:translate-x-1 transition-transform">
                {r.area}
              </div>
              <ul className="space-y-2 text-xs text-primary-foreground/70">
                {r.farms.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-3 h-px bg-sun" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-10 md:mt-12 reveal">
          <p className="text-xs text-primary-foreground/50 tracking-wider">
            ※ 一部のみ掲載しています / Showing partial network
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-sun text-sun hover:bg-sun hover:text-foreground rounded-none font-medium tracking-wider bg-transparent group"
          >
            <Link href="/producers">
              VIEW ALL PRODUCERS
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
