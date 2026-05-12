"use client";

import { MapPin } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import hokkaido from "@/assets/region-hokkaido.jpg";
import hokkaido2 from "@/assets/region-hokkaido2.jpg";
import hakodate from "@/assets/region-hakodate.jpg";
import miyagi from "@/assets/region-miyagi.jpg";
import chiba from "@/assets/region-chiba.jpg";
import katsunuma from "@/assets/region-katsunuma.jpg";
import oita from "@/assets/region-oita-field.jpg";
import kyushu from "@/assets/region-kyushu-field.jpg";

type Field = {
  region: string;
  en: string;
  caption: string;
  image: { src: string };
};

const fields: Field[] = [
  { region: "北海道", en: "Hokkaido", caption: "じゃがいも・玉ねぎの広大な畑", image: hokkaido },
  { region: "北海道（6・7月）", en: "Hokkaido — Early Summer", caption: "緑深まる初夏の作付け風景", image: hokkaido2 },
  { region: "函館", en: "Hakodate", caption: "海と山に囲まれた道南の畑", image: hakodate },
  { region: "宮城", en: "Miyagi", caption: "東北の協力農家の圃場", image: miyagi },
  { region: "千葉", en: "Chiba", caption: "首都圏向けの葉物・根菜の主産地", image: chiba },
  { region: "山梨 勝沼", en: "Katsunuma", caption: "盆地気候のとうもろこし産地", image: katsunuma },
  { region: "大分", en: "Oita", caption: "九州の温暖な作付けエリア", image: oita },
  { region: "九州", en: "Kyushu", caption: "オフシーズンを支える南の産地", image: kyushu },
];

export const FieldsGallery = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      <div className="blob bg-matcha/15 w-[360px] h-[360px] -top-10 -left-20 hidden md:block" />
      <div className="absolute top-0 right-0 w-40 md:w-64 h-56 wa-asanoha opacity-30 pointer-events-none hidden md:block" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-end mb-10 md:mb-16">
          <div className="lg:col-span-7 reveal">
            <div className="inline-flex items-center gap-2 mb-4 text-primary/80 tag-pill bg-primary/5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Producer Network</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-[1.15] tracking-tight text-balance">
              全国の<br />
              <span className="italic font-normal text-primary relative inline-block">
                産地から
                <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
              </span>
              。
            </h2>
          </div>
          <div className="lg:col-span-5 reveal delay-100">
            <p className="text-foreground/75 leading-loose text-sm md:text-[15px]">
              北海道から九州まで。各地の協力農家が築く圃場の風景と、産地リレーで支える年間出荷の現場をご紹介します。
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {fields.map((f, i) => (
            <li
              key={f.region}
              className="reveal reveal-scale group relative overflow-hidden border border-border/60 bg-secondary/20"
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={f.image.src}
                  alt={`${f.region}の畑風景`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
                <div className="absolute top-2 left-2 text-[9px] tracking-[0.3em] uppercase bg-foreground/45 backdrop-blur-sm text-primary-foreground px-2 py-0.5">
                  {f.en}
                </div>
                <div className="absolute bottom-2 left-2 right-2 text-primary-foreground">
                  <div className="font-serif text-base md:text-lg font-bold drop-shadow-sm leading-tight">
                    {f.region}
                  </div>
                  <div className="text-[10px] md:text-[11px] opacity-85 leading-tight mt-0.5 line-clamp-2">
                    {f.caption}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 md:mt-10 text-center text-xs text-foreground/60 tracking-wider">
          ※ 一部のみ掲載しています / Showing partial network
        </p>
      </div>
    </section>
  );
};
