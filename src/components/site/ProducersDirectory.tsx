"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, MapPin, Sparkles } from "lucide-react";
import producer1 from "@/assets/producer-1.jpg";
import producer2 from "@/assets/producer-2.jpg";
import producer3 from "@/assets/producer-3.jpg";
import producer4 from "@/assets/producer-4.jpg";
import producer5 from "@/assets/producer-5.jpg";
import producer6 from "@/assets/producer-6.jpg";
import farmerHands from "@/assets/farmer-hands.jpg";
import qualityCheck from "@/assets/quality-check.jpg";
import vegetables from "@/assets/vegetables.jpg";
import fieldHokkaido from "@/assets/field-hokkaido.jpg";
import fieldOita from "@/assets/field-oita.jpg";
import warehouseImg from "@/assets/warehouse.jpg";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";
import { useProducers } from "@/hooks/use-content";
import type { Producer } from "@/lib/database.types";

const mainFallbacks = [
  producer1.src,
  producer2.src,
  producer3.src,
  producer4.src,
  producer5.src,
  producer6.src,
];
const photoFallbacks = [
  farmerHands.src,
  qualityCheck.src,
  vegetables.src,
  fieldHokkaido.src,
  fieldOita.src,
  warehouseImg.src,
];

// Pulls the "主な生産野菜" line — prefers the explicit column and falls
// back to joining items, so older rows still render correctly.
const producePreview = (p: Producer) =>
  p.main_produce?.trim() ||
  (p.items && p.items.length > 0 ? p.items.join(" ・ ") : "");

// Anchor id safe for querySelector — the same id is used to link the
// left-side prefecture list to the right-side card.
const anchorId = (p: Producer) => `producer-${p.id}`;

export const ProducersDirectory = () => {
  const ref = useReveal<HTMLDivElement>();
  const { data: rows = [], isLoading } = useProducers();
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const producers = useMemo(
    () => [...rows].sort((a, b) => a.sort_order - b.sort_order),
    [rows],
  );

  // Build the "A軸" directory: one entry per producer, labelled by 県名.
  // Only prefectures with at least one producer appear (per the spec:
  // "B軸で紹介している県名のみ表示させる").
  const directory = useMemo(
    () =>
      producers.map((p) => ({
        id: p.id,
        label: p.prefecture?.trim() || p.region,
        sub: p.name,
      })),
    [producers],
  );

  // Highlight the entry whose card is closest to the top of the viewport.
  useEffect(() => {
    if (producers.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) {
          const id = visible.target.id.replace(/^producer-/, "");
          setActiveId(id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    producers.forEach((p) => {
      const el = document.getElementById(anchorId(p));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [producers]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`producer-${id}`);
    if (!el) return;
    // Offset so the card title isn't hidden under the sticky header.
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      <div className="blob bg-sun/10 w-[360px] h-[360px] top-20 right-[3%] hidden md:block" />
      <div className="absolute bottom-0 left-0 right-0 h-32 wa-kikkou opacity-40 pointer-events-none" />

      <div ref={containerRef} className="container relative">
        <div className="mb-10 md:mb-16 reveal">
          <div className="inline-flex items-center gap-2 mb-4 tag-pill bg-primary/5 text-primary/80">
            <MapPin className="h-3.5 w-3.5" />
            <span>Prefecture Directory</span>
          </div>
          <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight tracking-tight max-w-3xl">
            県ごとの<span className="italic font-normal text-primary relative inline-block">
              生産者
              <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-sun/50 -z-10" />
            </span>を、一覧で。
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/70 leading-loose max-w-3xl">
            左の県名をクリックすると、対象の生産者カードの先頭へジャンプします。
            掲載があるのは、現在当社がお取扱いしている県のみです。
          </p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-0 lg:gap-10 border border-border bg-background">
          {/* ---------- A軸 : prefecture list (sticky on desktop) ---------- */}
          <aside className="lg:sticky lg:top-24 self-start border-b lg:border-b-0 lg:border-r border-border">
            <div className="p-4 md:p-5 border-b border-border bg-muted/30">
              <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium">A軸</div>
              <div className="font-serif text-lg font-bold mt-1">県名</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Prefectures</div>
            </div>

            <nav
              className="max-h-[60vh] lg:max-h-[calc(100vh-12rem)] overflow-y-auto"
              aria-label="Prefecture list"
            >
              {isLoading && (
                <ul className="p-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className="h-10 m-2 bg-muted animate-pulse" />
                  ))}
                </ul>
              )}
              {!isLoading && directory.length === 0 && (
                <p className="p-5 text-xs text-muted-foreground">
                  生産者はまだ登録されていません。
                </p>
              )}
              <ul>
                {directory.map((d) => {
                  const active = activeId === d.id;
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => scrollTo(d.id)}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 px-4 md:px-5 py-3 text-left border-b border-border transition-smooth group",
                          active
                            ? "bg-primary/5 text-primary"
                            : "hover:bg-muted/40 text-foreground/80",
                        )}
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block font-serif text-base font-medium truncate">
                            {d.label}
                          </span>
                          <span className="block text-[11px] text-muted-foreground truncate mt-0.5">
                            {d.sub}
                          </span>
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 flex-shrink-0 transition-transform",
                            active ? "translate-x-0.5 text-primary" : "text-muted-foreground/40 group-hover:translate-x-0.5",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* ---------- B軸 : producer cards ---------- */}
          <div className="p-4 md:p-8 space-y-10 md:space-y-14">
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium flex items-center gap-3">
              <span>B軸</span>
              <span className="h-px w-8 bg-primary/30" />
              <span className="font-serif text-sm italic text-foreground/70 not-uppercase tracking-normal">生産者の紹介</span>
            </div>

            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-border animate-pulse">
                  <div className="grid md:grid-cols-[1fr_240px] gap-0">
                    <div className="aspect-[16/10] md:aspect-auto md:min-h-[220px] bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-1/3 bg-muted" />
                      <div className="h-3 w-2/3 bg-muted" />
                      <div className="h-3 w-full bg-muted" />
                    </div>
                  </div>
                </div>
              ))}

            {!isLoading && producers.length === 0 && (
              <p className="py-20 text-center text-muted-foreground text-sm">
                生産者はまだ登録されていません。管理画面から追加してください。
              </p>
            )}

            {producers.map((p, i) => (
              <ProducerCard key={p.id} producer={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProducerCard = ({ producer: p, index }: { producer: Producer; index: number }) => {
  const cardRef = useReveal<HTMLElement>();
  const mainImg = p.image_url || mainFallbacks[index % mainFallbacks.length];

  const photos = [
    {
      url: p.photo1_url || photoFallbacks[0],
      caption: p.photo1_caption || "写真1",
      label: "写真1",
    },
    {
      url: p.photo2_url || photoFallbacks[1],
      caption: p.photo2_caption || "写真2",
      label: "写真2",
    },
    {
      url: p.photo3_url || photoFallbacks[2],
      caption: p.photo3_caption || "写真3",
      label: "写真3",
    },
  ];

  const produce = producePreview(p);
  const characteristics = p.characteristics?.trim() || p.note || "";
  const prefecture = p.prefecture?.trim() || p.region;

  return (
    <article
      ref={cardRef}
      id={anchorId(p)}
      className="group border border-border bg-background reveal scroll-mt-24"
    >
      {/* ── Top row : main photo + headline info ────────────────────── */}
      <div className="grid md:grid-cols-[1.35fr_1fr] gap-0 border-b border-border">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[260px] overflow-hidden bg-secondary/10">
          <img
            src={mainImg}
            alt={`${p.name}さんの農家写真`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
            style={{ transitionDuration: "1200ms" }}
          />
          <div className="absolute top-0 left-0 p-3 md:p-4 flex items-center gap-2 bg-foreground/70 text-primary-foreground">
            <span className="font-serif text-xs italic">— {p.num}</span>
            <span className="h-px w-6 bg-sun" />
            <span className="text-[10px] tracking-[0.3em] uppercase">{p.name_en}</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase bg-foreground/70 text-primary-foreground px-3 py-1">
              農家写真 — Farmer
            </span>
          </div>
        </div>

        <div className="p-5 md:p-7 flex flex-col gap-5 bg-secondary/20">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">
              県名 / Prefecture
            </div>
            <div className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {prefecture}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 tracking-wider">
              {p.name} ・ {p.name_en}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              主な生産野菜
            </div>
            <p className="font-serif text-base md:text-lg text-foreground leading-snug">
              {produce || "—"}
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">
              特徴
            </div>
            <p className="text-sm text-foreground/75 leading-loose">
              {characteristics || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom row : 3 photos with captions ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-border border-t border-border">
        {photos.map((photo) => (
          <figure key={photo.label} className="flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary/10">
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-2 left-2 text-[10px] tracking-[0.25em] uppercase bg-foreground/70 text-primary-foreground px-2 py-1">
                {photo.label}
              </span>
            </div>
            <figcaption className="p-4 md:p-5 border-t border-border text-sm text-foreground/75 leading-relaxed min-h-[64px]">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
};
