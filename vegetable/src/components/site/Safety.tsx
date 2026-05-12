"use client";

import { ShieldCheck } from "lucide-react";
import qualityImg from "@/assets/quality-check.jpg";
import { useReveal } from "@/hooks/use-reveal";

const points = [
  { en: "Cultivation Records", ja: "栽培履歴書のご提出に対応" },
  { en: "Input Traceability", ja: "肥料・農薬などの情報把握" },
  { en: "Inspection System", ja: "入荷時の品質確認・検品体制" },
  { en: "Shared Commitment", ja: "生産者と共有する安心・安全への姿勢" },
];

export const Safety = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-20 md:py-36 bg-secondary relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 md:w-80 h-full wa-seigaiha opacity-50 pointer-events-none hidden md:block" />
      <div className="blob bg-matcha/20 w-[360px] h-[360px] -top-10 -left-20 hidden md:block" style={{ animationDelay: "2s" }} />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="relative lg:col-span-5 order-2 lg:order-1 reveal reveal-left">
            <div className="relative group">
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-sun/60 hidden md:block" />
              <div className="relative overflow-hidden shadow-elegant">
                <img
                  src={qualityImg.src}
                  alt="品質管理の様子"
                  loading="lazy"
                  width={960}
                  height={1280}
                  className="w-full aspect-[4/5] object-cover transition-transform group-hover:scale-105"
                  style={{ transitionDuration: "1500ms" }}
                />
              </div>
              <div className="absolute -top-4 -left-2 md:-left-4 bg-foreground text-primary-foreground px-3 md:px-4 py-2 text-[10px] tracking-[0.3em] uppercase font-medium shadow-pop">
                Quality First
              </div>
              <div className="absolute -bottom-6 -left-4 bg-sun text-foreground p-4 md:p-5 max-w-[220px] shadow-card hidden md:block">
                <ShieldCheck className="h-6 w-6 mb-2" strokeWidth={1.5} />
                <div className="font-serif text-sm font-bold leading-snug">
                  トレーサビリティを、<br />すべてに。
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8 order-1 lg:order-2 reveal reveal-right">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-serif text-xs italic text-primary/60">— 07</span>
              <span className="text-[10px] tracking-[0.4em] text-primary font-medium uppercase">Safety &amp; Quality</span>
            </div>
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Safety &amp; Quality</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] mb-6 md:mb-8 text-balance tracking-tight text-foreground">
              安心と安全を、<br />
              <span className="italic font-normal text-primary relative inline-block">
                あたりまえ
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              に。
            </h2>
            <p className="text-foreground/75 leading-loose mb-8 md:mb-10 text-[15px] max-w-xl">
              お客様に自信を持ってお届けするため、生産者との情報共有と検品体制を徹底。
              栽培履歴書の提出にも対応し、トレーサビリティを大切にしています。
            </p>

            <div className="grid sm:grid-cols-2 gap-px bg-border">
              {points.map((p, i) => (
                <div
                  key={p.en}
                  className="bg-background p-5 md:p-6 group hover:bg-primary hover:text-primary-foreground transition-smooth reveal"
                  style={{ transitionDelay: `${i * 80 + 200}ms` }}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-serif text-xs italic opacity-60">— 0{i + 1}</span>
                    <span className="text-[9px] tracking-[0.25em] uppercase opacity-70">{p.en}</span>
                  </div>
                  <div className="font-serif text-base font-bold leading-snug">{p.ja}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
