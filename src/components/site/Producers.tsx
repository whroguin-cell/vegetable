"use client";

import Link from "next/link";
import producer1 from "@/assets/producer-1.jpg";
import producer2 from "@/assets/producer-2.jpg";
import producer3 from "@/assets/producer-3.jpg";
import producer4 from "@/assets/producer-4.jpg";
import producer5 from "@/assets/producer-5.jpg";
import producer6 from "@/assets/producer-6.jpg";
import { ArrowUpRight, Users } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useProducers } from "@/hooks/use-content";

// Fallback images (cycled by producer sort order) when a row has no image_url.
const fallbackImages = [
  producer1.src,
  producer2.src,
  producer3.src,
  producer4.src,
  producer5.src,
  producer6.src,
];

export const Producers = () => {
  const ref = useReveal<HTMLDivElement>();
  const { data: rows = [], isLoading } = useProducers();

  const producers = rows.map((p, i) => ({
    num: p.num,
    img: p.image_url || fallbackImages[i % fallbackImages.length],
    name: p.name,
    nameEn: p.name_en,
    region: p.region,
    items: p.items,
    note: p.note ?? "",
  }));

  return (
    <section
      id="producers-list"
      ref={ref}
      className="py-20 md:py-36 bg-background relative overflow-hidden"
    >
      <div className="blob bg-sun/15 w-[320px] h-[320px] top-10 right-[5%] hidden md:block" />
      {/* Kikkou band — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 wa-kikkou opacity-40 pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-12 md:mb-16">
          <div className="lg:col-span-2 reveal">
            <div className="flex lg:flex-col items-center lg:items-start gap-3">
              <span className="font-serif text-xs italic text-primary/60">— 06</span>
              <span className="text-[10px] tracking-[0.4em] text-primary font-medium uppercase">Producers</span>
            </div>
          </div>
          <div className="lg:col-span-7 reveal delay-100">
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
              <Users className="h-3.5 w-3.5" />
              <span>Faces of our Farms</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.15] tracking-tight text-balance">
              顔の見える、<br />
              <span className="italic font-normal text-primary relative inline-block">
                生産者
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              たち。
            </h2>
          </div>
          <div className="lg:col-span-3 flex justify-start lg:justify-end reveal delay-200">
            <Link
              href="/producers"
              className="text-xs font-medium text-foreground tracking-[0.2em] uppercase hover:text-primary transition-smooth inline-flex items-center gap-2 group"
            >
              View All
              <span className="w-8 h-px bg-foreground group-hover:bg-primary group-hover:w-12 transition-all" />
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-12 md:gap-y-14">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted mb-5" />
                <div className="h-5 bg-muted w-2/3 mb-2" />
                <div className="h-3 bg-muted w-full" />
              </div>
            ))}
          {producers.map((p, i) => (
            <article
              key={p.name}
              className="group cursor-pointer reveal"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative overflow-hidden aspect-[3/4] mb-5 md:mb-6 shadow-soft">
                <img
                  src={p.img}
                  alt={`${p.name}さんの写真`}
                  loading="lazy"
                  width={960}
                  height={1280}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform ease-out"
                  style={{ transitionDuration: "1200ms" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between text-primary-foreground">
                  <span className="font-serif text-xs italic">— {p.num}</span>
                  <span className="text-[10px] tracking-[0.3em] uppercase bg-foreground/40 backdrop-blur-sm px-3 py-1">
                    {p.region}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-primary-foreground opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div className="font-serif text-sm italic">{p.nameEn}</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-sun translate-y-full group-hover:translate-y-0 transition-transform" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-smooth tracking-tight">
                  {p.name}
                </h3>
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hidden sm:inline">{p.nameEn}</span>
              </div>
              <p className="text-sm text-foreground/70 leading-loose mb-4">{p.note}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-3 border-t border-border">
                {p.items.map((it) => (
                  <span key={it} className="text-[11px] text-foreground/60 tracking-wider">
                    #{it}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
