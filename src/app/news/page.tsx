"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";
import { useNews } from "@/hooks/use-content";
import pageHeroNews from "@/assets/page-hero-news.jpg";

type Category = "All" | "Shipping" | "Notice" | "Company" | "Producer";

const categories: Category[] = ["All", "Shipping", "Notice", "Company", "Producer"];

export default function NewsPage() {
  const [active, setActive] = useState<Category>("All");
  const ref = useReveal<HTMLDivElement>();
  const { data: news = [], isLoading } = useNews();

  const filtered = useMemo(() => {
    if (active === "All") return news;
    return news.filter((n) => n.category === active);
  }, [active, news]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="09"
          en="News"
          ja="最新の"
          accentJa="お知らせ"
          tailJa="。"
          description="出荷情報・会社情報・生産者便りなど、株式会社W・Hからの最新の情報をお届けします。"
          breadcrumb={[{ label: "ニュース" }]}
          backgroundImage={pageHeroNews.src}
          backgroundAlt="新鮮な野菜原料の入荷"
        />

        <section ref={ref} className="py-16 md:py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 md:w-64 h-48 wa-asanoha opacity-40 pointer-events-none" />

          <div className="container relative">
            <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12 border-b border-border pb-4 overflow-x-auto reveal">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={cn(
                    "px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-smooth border whitespace-nowrap",
                    active === c
                      ? "bg-foreground text-primary-foreground border-foreground"
                      : "bg-transparent text-foreground/60 border-border hover:border-foreground hover:text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="border-t border-border max-w-5xl">
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="py-8 border-b border-border animate-pulse">
                    <div className="h-4 bg-muted w-3/4 mb-2" />
                    <div className="h-3 bg-muted w-full" />
                  </div>
                ))}
              {filtered.map((n, i) => (
                <article
                  key={n.id}
                  className="grid md:grid-cols-[100px_140px_1fr_auto] gap-2 md:gap-8 items-start py-6 md:py-9 group hover:md:px-4 border-b border-border transition-all duration-500 cursor-pointer reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <time className="text-xs font-medium text-muted-foreground tabular-nums tracking-wider">{n.date}</time>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">{n.category}</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-base md:text-lg text-foreground/90 group-hover:text-primary transition-smooth leading-snug font-medium mb-2">
                      {n.title}
                    </h2>
                    <p className="text-sm text-foreground/70 leading-loose line-clamp-2 md:line-clamp-none">{n.body}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-smooth hidden md:block mt-1" />
                </article>
              ))}

              {filtered.length === 0 && !isLoading && (
                <p className="py-12 text-center text-muted-foreground text-sm">該当するお知らせはありません。</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
