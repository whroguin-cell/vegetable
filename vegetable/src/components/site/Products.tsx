"use client";

import { Carrot } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useProducts } from "@/hooks/use-content";

const MEDIA_BASE =
  "https://bglowrscmypoqxkyxgfe.supabase.co/storage/v1/object/public/media/products";

const PRODUCT_IMAGES: Record<string, string> = {
  "Green Leaf":  `${MEDIA_BASE}/green-leaf.jpg`,
  "Mizuna":      `${MEDIA_BASE}/mizuna.jpg`,
  "Mini Tomato": `${MEDIA_BASE}/mini-tomato.jpg`,
  "Red Radish":  `${MEDIA_BASE}/red-radish.jpg`,
  "Carrot":      `${MEDIA_BASE}/carrot.jpg`,
  "Naga-negi":   `${MEDIA_BASE}/naga-negi.jpg`,
  "Lettuce":     `${MEDIA_BASE}/lettuce.jpg`,
  "Komatsuna":   `${MEDIA_BASE}/komatsuna.jpg`,
  "Potato":      `${MEDIA_BASE}/potato.jpg`,
  "Onion":       `${MEDIA_BASE}/onion.jpg`,
  "Spinach":     `${MEDIA_BASE}/spinach.jpg`,
  "Cabbage":     `${MEDIA_BASE}/cabbage.jpg`,
  "Hakusai":     `${MEDIA_BASE}/hakusai.jpg`,
  "Broccoli":    `${MEDIA_BASE}/broccoli.jpg`,
  "Daikon":      `${MEDIA_BASE}/daikon.jpg`,
  "Cucumber":    `${MEDIA_BASE}/cucumber.jpg`,
};

export const Products = () => {
  const ref = useReveal<HTMLDivElement>();
  const { data: products = [], isLoading } = useProducts();

  return (
    <section
      ref={ref}
      className="py-20 md:py-36 bg-background relative overflow-hidden"
    >
      <div className="absolute -top-2 md:-top-4 right-0 text-[110px] sm:text-[180px] md:text-[280px] font-serif font-bold leading-none select-none pointer-events-none [-webkit-text-stroke:1px_hsl(var(--primary)/0.08)] text-transparent">
        Products
      </div>

      <div className="blob bg-matcha/20 w-[320px] h-[320px] top-[40%] -left-16 hidden md:block" style={{ animationDelay: "1s" }} />
      {/* Uroko scale corners */}
      <div className="absolute top-0 right-0 w-40 h-40 wa-uroko opacity-50 pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-12 md:mb-16">
          <div className="lg:col-span-2 reveal">
            <div className="flex lg:flex-col items-center lg:items-start gap-3">
              <span className="font-serif text-xs italic text-primary/60">— 08</span>
              <span className="text-[10px] tracking-[0.4em] text-primary font-medium uppercase">Products</span>
            </div>
          </div>
          <div className="lg:col-span-7 reveal delay-100">
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
              <Carrot className="h-3.5 w-3.5" />
              <span>Product Lineup</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.15] tracking-tight text-balance">
              主な<br />
              <span className="italic font-normal text-primary relative inline-block">
                取扱
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              品目。
            </h2>
          </div>
          <div className="lg:col-span-3 flex items-end reveal delay-200">
            <p className="text-foreground/70 leading-loose text-sm">
              葉物・根菜・果菜まで幅広く対応。掲載品目以外も調達可能です。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-border max-w-6xl mx-auto">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-r border-b border-border p-5 md:p-8 animate-pulse">
                <div className="aspect-square bg-secondary mb-4" />
                <div className="h-4 bg-secondary mb-2 w-2/3" />
                <div className="h-3 bg-secondary w-1/2" />
              </div>
            ))}
          {products.map((p, i) => {
            const photo = PRODUCT_IMAGES[p.en];
            return (
              <div
                key={p.id}
                className="group border-r border-b border-border p-5 md:p-8 hover:bg-gradient-warm transition-smooth relative cursor-pointer reveal reveal-scale"
                style={{ transitionDelay: `${(i % 4) * 60}ms` }}
              >
                <div className="relative mb-4 aspect-square overflow-hidden bg-secondary">
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt={`${p.ja} (${p.en})`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.style.display = "none";
                          const sib = t.nextElementSibling as HTMLElement | null;
                          if (sib) sib.style.display = "flex";
                        }}
                      />
                      <div
                        className="absolute inset-0 hidden items-center justify-center text-4xl md:text-5xl bg-gradient-to-br from-secondary to-cream/50"
                        aria-hidden
                      >
                        {p.emoji ?? "🥬"}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl bg-gradient-to-br from-secondary to-cream/50">
                      {p.emoji ?? "🥬"}
                    </div>
                  )}
                </div>
                <span className="absolute top-2 md:top-3 right-2 md:right-3 font-serif text-[10px] italic text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="font-serif text-lg md:text-xl font-bold text-foreground mb-1 tracking-tight group-hover:text-primary transition-smooth">
                  {p.ja}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{p.en}</div>
                <div className="h-[2px] w-0 bg-sun mt-3 group-hover:w-12 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 md:mt-10 tracking-wider">
          ※ その他もご要望に応じて対応可能です / Other items available upon request
        </p>

        {/* Marquee ticker */}
        <div className="mt-12 md:mt-20 marquee">
          <div className="marquee__track font-serif text-[clamp(3rem,8vw,8rem)] font-bold text-primary/15 whitespace-nowrap italic leading-none">
            <span>FRESH · LOCAL · SEASONAL ·&nbsp;</span>
            <span>FRESH · LOCAL · SEASONAL ·&nbsp;</span>
            <span>FRESH · LOCAL · SEASONAL ·&nbsp;</span>
          </div>
          <div className="marquee__track font-serif text-[clamp(3rem,8vw,8rem)] font-bold text-primary/15 whitespace-nowrap italic leading-none" aria-hidden>
            <span>FRESH · LOCAL · SEASONAL ·&nbsp;</span>
            <span>FRESH · LOCAL · SEASONAL ·&nbsp;</span>
            <span>FRESH · LOCAL · SEASONAL ·&nbsp;</span>
          </div>
        </div>
      </div>
    </section>
  );
};
