"use client";

import { Sprout } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import daikon from "@/assets/veggie-daikon.jpg";
import pakuchi from "@/assets/veggie-pakuchi.jpg";
import corn from "@/assets/veggie-corn.jpg";
import shungiku from "@/assets/veggie-shungiku.jpg";
import tomatoPack from "@/assets/veggie-tomato-pack.jpg";
import potatoField from "@/assets/veggie-potato-field.jpg";
import kyushu from "@/assets/veggie-kyushu.jpg";
import leafy from "@/assets/veggie-leafy.jpg";

type Veggie = {
  ja: string;
  en: string;
  region: string;
  hue: string;
  desc: string;
  image: { src: string };
};

const veggies: Veggie[] = [
  {
    ja: "大根",
    en: "Daikon Radish",
    region: "千葉",
    hue: "from-emerald-100/60 to-lime-200/60",
    desc: "千葉の契約農家から届く太く瑞々しい大根。煮物・サラダ・漬物まで幅広く対応します。",
    image: daikon,
  },
  {
    ja: "パクチー",
    en: "Coriander",
    region: "茨城・千葉",
    hue: "from-lime-100/60 to-green-200/60",
    desc: "ハウス栽培で年間を通じた安定供給。エスニック・サラダ・薬味用途に。",
    image: pakuchi,
  },
  {
    ja: "とうもろこし",
    en: "Sweet Corn",
    region: "山梨・北海道",
    hue: "from-amber-100/60 to-yellow-200/60",
    desc: "勝沼・北海道の契約農家から、糖度の高い品種を旬の時期に直送します。",
    image: corn,
  },
  {
    ja: "春菊",
    en: "Shungiku",
    region: "茨城",
    hue: "from-emerald-100/60 to-teal-200/60",
    desc: "香り高い春菊を、鍋・サラダ・お浸し用に丁寧に選別してお届けします。",
    image: shungiku,
  },
  {
    ja: "葉物野菜",
    en: "Leafy Greens",
    region: "千葉・埼玉",
    hue: "from-green-100/60 to-emerald-200/60",
    desc: "サラダケール・小松菜などの葉物を、産地リレーで通年安定供給します。",
    image: leafy,
  },
  {
    ja: "ミニトマト（出荷）",
    en: "Mini Tomato — Pack",
    region: "全国",
    hue: "from-rose-100/60 to-orange-200/60",
    desc: "1kg小売パックから業務用バルクまで、用途に合わせた荷姿で出荷します。",
    image: tomatoPack,
  },
  {
    ja: "じゃがいも畑",
    en: "Potato — Field",
    region: "茨城",
    hue: "from-amber-100/60 to-stone-200/60",
    desc: "契約農家の収穫直後を出荷。男爵・メークインを大ロットで安定調達します。",
    image: potatoField,
  },
  {
    ja: "九州の野菜",
    en: "Kyushu Produce",
    region: "九州",
    hue: "from-orange-100/60 to-amber-200/60",
    desc: "温暖な九州の協力農家から、季節のオフシーズンも安定して産地リレー。",
    image: kyushu,
  },
];

export const VeggieGallery = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-warm"
    >
      <div className="blob bg-sun/25 w-[360px] h-[360px] -top-20 right-[5%] hidden md:block" />
      <div className="blob bg-matcha/20 w-[300px] h-[300px] bottom-10 -left-20 hidden md:block" style={{ animationDelay: "2s" }} />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-end mb-10 md:mb-16">
          <div className="lg:col-span-7 reveal">
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/10">
              <Sprout className="h-3.5 w-3.5" />
              <span>Seasonal Vegetables</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-[1.15] tracking-tight text-balance">
              全国の<br />
              <span className="italic font-normal text-primary relative inline-block">
                旬の野菜
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              。
            </h2>
          </div>
          <div className="lg:col-span-5 reveal delay-100">
            <p className="text-foreground/75 leading-loose text-sm md:text-[15px]">
              葉物・根菜・果菜まで、産地リレーで季節を問わず安定供給。
              全国の協力農家ネットワークから、必要な品目を必要な分だけお届けします。
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {veggies.map((v, i) => (
            <li
              key={v.ja}
              className="reveal reveal-scale lift-card group relative overflow-hidden bg-background border border-border/60"
              style={{ transitionDelay: `${(i % 4) * 80}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${v.hue}`} aria-hidden />
                <img
                  src={v.image.src}
                  alt={`${v.ja} (${v.en})`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                <div className="absolute top-3 left-3 text-[10px] tracking-[0.3em] uppercase bg-foreground/45 backdrop-blur-sm text-primary-foreground px-2.5 py-1">
                  {v.region}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-primary-foreground">
                  <div className="text-[9px] tracking-[0.3em] uppercase opacity-80">{v.en}</div>
                  <div className="font-serif text-lg md:text-xl font-bold drop-shadow-sm leading-tight">{v.ja}</div>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">{v.desc}</p>
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
