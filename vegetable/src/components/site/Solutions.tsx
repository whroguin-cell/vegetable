"use client";

import { ArrowRight, HelpCircle } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import solutionSupply from "@/assets/solution-supply.jpg";
import solutionProcessing from "@/assets/solution-processing.jpg";
import solutionPricing from "@/assets/solution-pricing.jpg";

const pairs = [
  {
    problem: "原料の欠品で困っている",
    solution: "全国の協力農場と連携した供給体制で、年間を通じた安定調達を実現します。",
    image: solutionSupply.src,
    imageAlt: "出荷拠点に並ぶ野菜の在庫",
  },
  {
    problem: "下処理・加工まで対応してほしい",
    solution: "カット・洗浄・パック詰めなど、お客様のご要望に応じた加工対応が可能です。",
    image: solutionProcessing.src,
    imageAlt: "じゃがいもの加工処理の様子",
  },
  {
    problem: "予算内で安定的に調達したい",
    solution: "中間流通コストを抑え、ご予算に応じた最適価格でのご提案が可能です。",
    image: solutionPricing.src,
    imageAlt: "収穫した野菜の出荷準備",
  },
];

export const Solutions = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-20 md:py-36 bg-background relative overflow-hidden"
    >
      <div className="absolute -top-2 md:-top-4 left-0 text-[110px] sm:text-[180px] md:text-[280px] font-serif font-bold leading-none select-none pointer-events-none [-webkit-text-stroke:1px_hsl(var(--primary)/0.08)] text-transparent">
        Solutions
      </div>

      <div className="blob bg-leaf/20 w-[360px] h-[360px] top-[30%] -right-20 hidden md:block" style={{ animationDelay: "2s" }} />
      {/* Asanoha accent — left edge */}
      <div className="absolute top-20 left-0 w-28 md:w-40 h-64 md:h-96 wa-asanoha opacity-50 pointer-events-none hidden md:block" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-12 md:mb-16">
          <div className="lg:col-span-2 reveal">
            <div className="flex lg:flex-col items-center lg:items-start gap-3">
              <span className="font-serif text-xs italic text-primary/60">— 04</span>
              <span className="text-[10px] tracking-[0.4em] text-primary font-medium uppercase">Solutions</span>
            </div>
          </div>
          <div className="lg:col-span-10 reveal delay-100">
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Solutions</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.15] tracking-tight text-balance">
              こんなお悩み、<br />
              <span className="italic font-normal text-primary relative inline-block">
                ありませんか
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              ？
            </h2>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {pairs.map((p, i) => (
            <div
              key={i}
              className="group grid md:grid-cols-[140px_1fr_1fr] gap-4 md:gap-8 items-start py-8 md:py-12 border-t border-border last:border-b hover:bg-secondary/60 hover:px-4 md:hover:px-6 transition-all duration-500 px-2 md:px-6 -mx-2 md:-mx-6 reveal"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex md:flex-col items-start gap-3 md:gap-4">
                <span className="font-serif text-3xl md:text-4xl text-primary/30 italic group-hover:text-primary/70 transition-smooth shrink-0">
                  0{i + 1}.
                </span>
                <div className="relative w-32 md:w-full aspect-[4/3] overflow-hidden border border-border/60 bg-secondary/30">
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">Issue</div>
                <div className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug group-hover:text-primary transition-smooth">
                  {p.problem}
                </div>
              </div>
              <div className="md:pl-8 md:border-l border-border mt-2 md:mt-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.3em] text-primary uppercase font-medium">Our Answer</span>
                  <ArrowRight className="h-3 w-3 text-primary group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="text-foreground/80 leading-loose text-[15px]">{p.solution}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
