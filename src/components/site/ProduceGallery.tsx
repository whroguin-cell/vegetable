"use client";

import { Sprout } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import tomato from "@/assets/produce-tomato.jpg";
import shiso from "@/assets/produce-shiso.jpg";
import cucumber from "@/assets/produce-cucumber.jpg";
import pepper from "@/assets/produce-pepper.jpg";
import lettuce from "@/assets/produce-lettuce.jpg";
import potato from "@/assets/produce-potato.jpg";

type Item = {
  ja: string;
  en: string;
  region: string;
  desc: string;
  image: { src: string };
};

const items: Item[] = [
  {
    ja: "ミニトマト",
    en: "Mini Tomato",
    region: "全国",
    desc: "甘みと酸味のバランスが取れた業務用ミニトマト。出荷前の鮮度確認を徹底しています。",
    image: tomato,
  },
  {
    ja: "大葉",
    en: "Shiso",
    region: "茨城・千葉",
    desc: "香り高い大葉を、必要な数量だけ毎日安定供給。サラダ・薬味・加工用に。",
    image: shiso,
  },
  {
    ja: "胡瓜",
    en: "Cucumber",
    region: "宮崎・群馬",
    desc: "規格に合わせた長さ・太さで通年仕入れ可能。カット野菜の主力品目です。",
    image: cucumber,
  },
  {
    ja: "ピーマン",
    en: "Bell Pepper",
    region: "茨城・高知",
    desc: "肉厚で風味の良いピーマン。業務用バルク出荷にも対応します。",
    image: pepper,
  },
  {
    ja: "レタス",
    en: "Lettuce",
    region: "茨城・長野",
    desc: "産地リレーで年間を通じた安定出荷。季節に合わせて産地を切り替えます。",
    image: lettuce,
  },
  {
    ja: "じゃがいも",
    en: "Potato",
    region: "北海道",
    desc: "北海道の契約農家から、男爵・メークインを大ロットで安定調達。",
    image: potato,
  },
];

export const ProduceGallery = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-warm"
    >
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-end mb-10 md:mb-16">
          <div className="lg:col-span-7 reveal">
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/10">
              <Sprout className="h-3.5 w-3.5" />
              <span>Our Produce</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-[1.15] tracking-tight text-balance">
              四季の恵み、<br />
              <span className="italic font-normal text-primary relative inline-block">
                日本の青果
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              。
            </h2>
          </div>
          <div className="lg:col-span-5 reveal delay-100">
            <p className="text-foreground/75 leading-loose text-sm md:text-[15px]">
              葉物・根菜・果菜まで、業務用カット野菜と産直流通の主力品目を、
              全国の協力農家ネットワークで安定的にお届けします。
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((it, i) => (
            <li
              key={it.ja}
              className="reveal reveal-scale lift-card group relative overflow-hidden bg-background border border-border/60"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={it.image.src}
                  alt={`${it.ja} (${it.en})`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
                <div className="absolute top-3 left-3 text-[10px] tracking-[0.3em] uppercase bg-foreground/45 backdrop-blur-sm text-primary-foreground px-2.5 py-1">
                  {it.region}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-primary-foreground">
                  <div className="text-[9px] tracking-[0.3em] uppercase opacity-80">{it.en}</div>
                  <div className="font-serif text-lg md:text-xl font-bold drop-shadow-sm leading-tight">{it.ja}</div>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">{it.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 md:mt-10 text-center text-xs text-foreground/60 tracking-wider">
          ※ 旬の品目は協力農家との連携でお取り扱い可能です / Seasonal availability via our partner farms
        </p>
      </div>
    </section>
  );
};
