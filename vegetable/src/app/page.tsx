"use client";

import Link from "next/link";
import { ArrowUpRight, Truck, ShieldCheck, BadgeJapaneseYen, MapPin, Newspaper, Phone, Mail } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Footer } from "@/components/site/Footer";
import { ProduceGallery } from "@/components/site/ProduceGallery";
import { VeggieGallery } from "@/components/site/VeggieGallery";
import { FieldsGallery } from "@/components/site/FieldsGallery";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import { useNews, useProducers } from "@/hooks/use-content";
import vegetables from "@/assets/vegetables.jpg";
import qualityCheck from "@/assets/quality-check.jpg";
import producer1 from "@/assets/producer-1.jpg";
import producer2 from "@/assets/producer-2.jpg";
import producer3 from "@/assets/producer-3.jpg";
import producer4 from "@/assets/producer-4.jpg";
import producer5 from "@/assets/producer-5.jpg";
import producer6 from "@/assets/producer-6.jpg";

const strengthPreview = [
  { icon: Truck, title: "安定供給", en: "Stable Supply" },
  { icon: ShieldCheck, title: "品質管理", en: "Quality Control" },
  { icon: BadgeJapaneseYen, title: "適正価格", en: "Fair Pricing" },
];

const fallbackProducerImgs = [
  producer1.src,
  producer2.src,
  producer3.src,
  producer4.src,
  producer5.src,
  producer6.src,
];

export default function Home() {
  const ref = useReveal<HTMLDivElement>();
  const { data: producers = [] } = useProducers();
  const { data: news = [] } = useNews();

  const producerPreview = producers.slice(0, 3).map((p, i) => ({
    name: p.name,
    region: p.region,
    tag: p.items[0] ?? "野菜",
    img: p.image_url || fallbackProducerImgs[i % fallbackProducerImgs.length],
  }));

  const recentNews = news.slice(0, 3);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />

        {/* About preview */}
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5 reveal reveal-left">
                <div className="relative group">
                  <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-full h-full border-2 border-sun/60 hidden md:block transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
                  <img
                    src={vegetables.src}
                    alt="新鮮な野菜の盛り合わせ"
                    loading="lazy"
                    className="relative w-full aspect-[4/5] object-cover shadow-elegant transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 reveal reveal-right delay-100">
                <div className="inline-flex items-center gap-2 mb-5 text-primary/80 tag-pill bg-primary/5">
                  <span>— About</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] mb-6 md:mb-8 tracking-tight text-balance">
                  日本の農業と<br />
                  お客様の食卓を、<br />
                  <span className="italic font-normal text-primary relative inline-block">
                    まっすぐ
                    <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
                  </span>
                  つなぐ。
                </h2>
                <p className="text-foreground/75 leading-loose text-[15px] max-w-xl mb-8">
                  私たち株式会社W・Hは、全国の生産者の皆さまと飲食・小売・加工業のお客様をつなぐ、産直流通・カット野菜の専門会社です。
                </p>
                <Button asChild variant="outline" className="rounded-none border-foreground hover:bg-foreground hover:text-primary-foreground tracking-[0.15em] uppercase text-xs h-12 px-6 group">
                  <Link href="/about">
                    MORE ABOUT US
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services preview */}
        <section className="py-20 md:py-32 bg-secondary relative overflow-hidden">
          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 items-end mb-12 md:mb-16">
              <div className="lg:col-span-7 reveal">
                <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/10">
                  <span>— Services</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight text-balance">
                  選ばれる、<br />
                  <span className="italic font-normal text-primary relative inline-block">
                    3<span className="absolute -bottom-1 left-0 right-0 h-2 bg-sun/60 -z-10" />
                  </span>
                  つの理由。
                </h2>
              </div>
              <div className="lg:col-span-5 reveal delay-100">
                <p className="text-foreground/70 leading-loose text-sm">
                  生産者と取引先、双方に寄り添う流通スタイル。「供給力・品質・価格」のバランスを大切にしています。
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-0 md:border-t border-border mb-10">
              {strengthPreview.map(({ icon: Icon, title, en }, i) => (
                <div
                  key={title}
                  className="group relative bg-background md:bg-transparent py-8 md:py-12 px-6 md:px-8 md:border-b-0 md:border-r border-border last:border-r-0 hover:bg-background transition-smooth shadow-soft md:shadow-none reveal"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-serif text-xs italic text-primary/60">— 0{i + 1}</span>
                    <Icon className="h-8 w-8 text-primary/80 group-hover:text-primary group-hover:rotate-6 transition-smooth" strokeWidth={1.5} />
                  </div>
                  <div className="text-[10px] tracking-[0.35em] text-primary uppercase mb-2 font-medium">{en}</div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {title}
                  </h3>
                  <div className="mt-4 h-[2px] w-10 bg-sun group-hover:w-20 transition-all duration-500" />
                </div>
              ))}
            </div>

            <div className="flex justify-center reveal">
              <Button asChild className="bg-foreground text-primary-foreground hover:bg-primary rounded-none h-12 px-7 tracking-[0.15em] uppercase text-xs">
                <Link href="/services">
                  VIEW ALL SERVICES
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Produce gallery */}
        <ProduceGallery />

        {/* Seasonal vegetable gallery */}
        <VeggieGallery />

        {/* Regional fields gallery */}
        <FieldsGallery />

        {/* Producers preview */}
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 items-end mb-12 md:mb-16">
              <div className="lg:col-span-7 reveal">
                <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Producers</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight text-balance">
                  顔の見える、<br />
                  <span className="italic font-normal text-primary">生産者</span>たち。
                </h2>
              </div>
              <div className="lg:col-span-5 flex lg:justify-end reveal delay-100">
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

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {producerPreview.map((p, i) => (
                <Link
                  key={p.name}
                  href="/producers"
                  className="group reveal"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="relative overflow-hidden aspect-[3/4] mb-4 shadow-soft">
                    <img
                      src={p.img}
                      alt={`${p.name}さん`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform ease-out"
                      style={{ transitionDuration: "1200ms" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent opacity-55 group-hover:opacity-85 transition-opacity" />
                    <div className="absolute top-3 right-3 text-[10px] tracking-[0.3em] uppercase bg-foreground/40 backdrop-blur-sm px-3 py-1 text-primary-foreground">
                      {p.region}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-sun translate-y-full group-hover:translate-y-0 transition-transform" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
                    {p.name}
                  </h3>
                  <div className="text-[11px] text-muted-foreground tracking-wider mt-1">#{p.tag}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* News preview */}
        <section className="py-20 md:py-32 bg-secondary relative overflow-hidden">
          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 items-end mb-10 md:mb-12">
              <div className="lg:col-span-7 reveal">
                <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
                  <Newspaper className="h-3.5 w-3.5" />
                  <span>News</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight text-balance">
                  最新の<br />
                  <span className="italic font-normal text-primary">お知らせ</span>。
                </h2>
              </div>
              <div className="lg:col-span-5 flex lg:justify-end reveal delay-100">
                <Link
                  href="/news"
                  className="text-xs font-medium text-foreground tracking-[0.2em] uppercase hover:text-primary transition-smooth inline-flex items-center gap-2 group"
                >
                  View All
                  <span className="w-8 h-px bg-foreground group-hover:bg-primary group-hover:w-12 transition-all" />
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="border-t border-border max-w-5xl">
              {recentNews.map((n, i) => (
                <Link
                  key={n.id}
                  href="/news"
                  className="flex flex-col md:grid md:grid-cols-[100px_140px_1fr_auto] gap-2 md:gap-8 items-start md:items-center py-6 md:py-8 group hover:md:px-4 border-b border-border transition-all duration-500 reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <time className="text-xs font-medium text-muted-foreground tabular-nums tracking-wider">{n.date}</time>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">{n.category}</span>
                  </div>
                  <p className="font-serif text-base md:text-lg text-foreground/90 group-hover:text-primary transition-smooth leading-snug font-medium">
                    {n.title}
                  </p>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-smooth hidden md:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-foreground text-primary-foreground relative overflow-hidden">
          <img
            src={qualityCheck.src}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-35 kenburns"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/55 pointer-events-none" />

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-5 text-sun tag-pill bg-primary-foreground/10">
                <span>Contact</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance mb-6">
                まずは、<br />
                <span className="italic font-normal text-sun">お気軽に</span>どうぞ。
              </h2>
              <p className="text-primary-foreground/80 leading-loose mb-10 text-[15px] max-w-2xl mx-auto">
                仕入れのご相談、取扱品目のお問い合わせ、供給体制のご相談など。
                お客様のご要望に合わせた最適なご提案をいたします。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-xl sm:max-w-none mx-auto">
                <Button
                  asChild
                  size="lg"
                  className="bg-sun text-foreground hover:bg-sun/90 rounded-none h-14 px-6 tracking-[0.15em] uppercase text-xs font-medium w-full sm:w-auto"
                >
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    お問い合わせフォーム
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 text-white hover:bg-green-700 rounded-none h-14 px-5 sm:px-6 tracking-[0.05em] text-xs font-medium w-full sm:w-auto"
                >
                  <a href="tel:048-228-6770" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <Phone className="h-4 w-4 fill-white" />
                    <span className="text-base sm:text-lg md:text-xl font-semibold tracking-wider font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif]">
                      048-228-6770
                    </span>
                  </a>
                </Button>
              </div>

              <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-primary-foreground/50">
                Weekdays 9:00 – 17:00
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
