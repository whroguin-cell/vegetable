"use client";

import { Sprout } from "lucide-react";
import vegetables from "@/assets/vegetables.jpg";
import { useReveal } from "@/hooks/use-reveal";

export const Intro = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 md:py-40 bg-background relative overflow-hidden"
    >
      {/* decorative outline text */}
      <div className="absolute -top-2 md:-top-4 right-[-20px] text-[120px] sm:text-[180px] md:text-[280px] font-serif font-bold leading-none select-none pointer-events-none [-webkit-text-stroke:1px_hsl(var(--primary)/0.10)] text-transparent">
        About
      </div>

      {/* ambient blobs */}
      <div className="blob bg-matcha/25 w-[300px] h-[300px] top-1/3 -left-20 hidden md:block" />
      <div className="blob bg-sun/20 w-[260px] h-[260px] bottom-10 right-[10%] hidden md:block" style={{ animationDelay: "4s" }} />

      {/* Asanoha accent strip — top right */}
      <div className="absolute top-0 right-0 w-40 md:w-72 h-40 md:h-56 wa-asanoha opacity-40 pointer-events-none" />
      {/* Seigaiha accent strip — bottom left */}
      <div className="absolute bottom-0 left-0 w-32 md:w-56 h-24 md:h-40 wa-seigaiha opacity-50 pointer-events-none hidden sm:block" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-2 lg:pt-2 reveal">
            <div className="flex lg:flex-col items-center lg:items-start gap-3">
              <span className="font-serif text-xs italic text-primary/60">— 02</span>
              <span className="text-[10px] tracking-[0.4em] text-primary font-medium uppercase">About</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 mb-6 text-primary/80 tag-pill bg-primary/5">
                <Sprout className="h-3.5 w-3.5" />
                <span>Our Story</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.2] mb-8 md:mb-10 text-balance tracking-tight">
                日本の農業と<br />
                お客様の食卓を、<br />
                <span className="italic font-normal text-primary relative inline-block">
                  まっすぐ
                  <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
                </span>
                つなぐ。
              </h2>
            </div>
            <div className="space-y-5 text-foreground/75 leading-loose text-[15px] max-w-xl reveal delay-200">
              <p>
                私たち株式会社W・Hは、全国の生産者の皆さまと飲食・小売・加工業のお客様をつなぐ、産直流通の専門会社です。
              </p>
              <p>
                年間を通じた安定供給、中間流通コストを抑えたご提案、そして顔の見える生産者との連携を大切に。日本の農業を応援する企業として、お客様の事業を真ん中で支えていきます。
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border max-w-lg reveal delay-300">
              {[
                { value: "全国", label: "Producer Network" },
                { value: "365", label: "Days Stable Supply" },
                { value: "100+", label: "Item Categories" },
              ].map((s) => (
                <div key={s.label} className="group">
                  <div className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight group-hover:text-primary transition-smooth">
                    {s.value}
                  </div>
                  <div className="text-[10px] tracking-[0.15em] text-muted-foreground mt-2 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 relative lg:-mt-8 reveal reveal-right delay-400">
            <div className="relative group">
              <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-full h-full border-2 border-sun/60 hidden md:block" />
              <div className="relative overflow-hidden shadow-elegant">
                <img
                  src={vegetables.src}
                  alt="新鮮な野菜の盛り合わせ"
                  loading="lazy"
                  width={960}
                  height={1280}
                  className="relative w-full aspect-[3/4] object-cover grayscale-0 transition-transform group-hover:scale-105"
                  style={{ transitionDuration: "1500ms" }}
                />
              </div>
              <div className="absolute -bottom-6 -left-4 md:-left-6 bg-background border-l-2 border-sun p-4 md:p-5 max-w-[220px] shadow-card">
                <div className="text-[10px] tracking-[0.3em] text-primary/60 uppercase mb-2">Our Belief</div>
                <div className="font-serif text-sm md:text-base font-bold text-foreground leading-snug">
                  顔の見える流通を、<br />当たり前に。
                </div>
              </div>
              <div className="absolute -top-4 -right-2 md:-right-6 hanko text-[11px]">
                産直<br />直送
              </div>
              {/* rotating stamp */}
              <div className="absolute -bottom-10 -right-8 w-24 h-24 hidden lg:block">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow text-primary/80">
                  <defs>
                    <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                  </defs>
                  <text className="text-[9px] tracking-[0.3em] font-medium fill-current" textLength="220">
                    <textPath href="#circlePath">FRESH · LOCAL · DELIVERED · FRESH · LOCAL ·</textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
