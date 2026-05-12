"use client";

import Link from "next/link";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Intro } from "@/components/site/Intro";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import farmerHands from "@/assets/farmer-hands.jpg";
import pageHeroAbout from "@/assets/page-hero-about.jpg";
import warehouseImg from "@/assets/warehouse.jpg";
import aboutGreenhouse from "@/assets/about-greenhouse.jpg";
import aboutHarvest from "@/assets/about-harvest.jpg";
import aboutMixed from "@/assets/about-mixed.jpg";

const timeline = [
  { year: "2011", title: "創業", desc: "平成23年12月、安定した野菜供給へのニーズに応えるため創業。" },
  { year: "2015", title: "全国ネットワーク構築", desc: "農協・市場を介さない産直流通の仕組みを全国規模へ拡大。" },
  { year: "2017", title: "カット野菜事業開始", desc: "洗浄・カット・パック詰めなど、業務用加工サービスを開始。" },
  { year: "2022", title: "協力農家 200軒達成", desc: "全国47都道府県に協力農家ネットワークを拡大。" },
  { year: "2026", title: "取扱品目 100種超へ", desc: "葉物・根菜・果菜をはじめ、特産フルーツにも対応。" },
];

// 主な取り扱い品目. Order preserved from the reference copy.
const handledItems = [
  "グリーンリーフ", "水菜", "ミニトマト", "紅芯大根",
  "中国産人参", "国産人参", "大葉", "レッドキャベツ",
  "長ネギ", "ニラ", "小ねぎ", "レタス", "サラダケール",
  "パクチー", "大根", "キャベツ", "豆もやし", "小松菜",
  "さつまいも", "じゃがいも", "玉ねぎ", "ベビーリーフ",
  "茄子", "春菊",
];

const philosophy = [
  { en: "Honesty", ja: "誠実に", desc: "生産者と取引先、双方に対して誠実であること。" },
  { en: "Quality", ja: "品質本位", desc: "流通の質が、食卓の質をつくると信じています。" },
  { en: "Partnership", ja: "共に歩む", desc: "お客様の事業を、真ん中で支え続けます。" },
];

// Company address — 埼玉県越谷市 (東武スカイツリーライン 越谷駅 東口より徒歩8分).
const COMPANY_ADDRESS = "〒343-0813 埼玉県越谷市越ヶ谷3丁目4番5号";
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("埼玉県越谷市越ヶ谷3丁目4番5号");
const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("埼玉県越谷市越ヶ谷3丁目4番5号") +
  "&output=embed";

const companyProfile: { label: string; value: string; link?: { label: string; href: string } }[] = [
  { label: "会社名",   value: "株式会社 W・H" },
  { label: "代表者",   value: "代表取締役社長　島﨑 英彦" },
  { label: "設　立",   value: "平成23年（2011年）12月" },
  { label: "資本金",   value: "2,000万円" },
  { label: "事業内容", value: "産直流通・カット野菜／農水畜産物及び加工品の販売／業務用食品の輸入販売／食品包装資材の販売" },
  {
    label: "所在地",
    value: `${COMPANY_ADDRESS}\nTEL 048-228-6770  FAX 048-960-6815`,
    link: { label: "Google マップで開く", href: GOOGLE_MAPS_URL },
  },
  { label: "アクセス", value: "東武スカイツリーライン「越谷駅」東口より徒歩約8分" },
  {
    label: "取引銀行",
    value: "栃木銀行 越谷支店／足利銀行 越谷支店／埼玉縣信用金庫 越谷支店／りそな銀行 越谷支店",
  },
];

// Representative greeting — shared by 代表取締役社長 島﨑英彦 (令和5年11月).
const greetingBody = `コンビニエンスストアやスーパーでは、毎日同じ値段で手軽にカット野菜が買えるようになりました。しかし、野菜は天候や気温の変化によって、収量が左右される大変デリケートなものです。そこで一年を通して安定して野菜を供給して欲しいというお客様からのニーズにお応えしたいという想いから、平成23年12月に会社を設立いたしました。

私たちの強みは、全国各地の生産者との強い繋がりにあります。そのことは、すなわち年間を通して安定した出荷をお客様にお約束できるということです。また、値段に関しては、「中間流通コスト」である農協や市場を通さないことと、1年を通しての価格を決めさせていただきますので、ご予算に近い価格をご提示できると思います。更には、生産者と関係性を築いておりますことから、「顔の見える生産者」としてお客様からのご要望を直接伝えることで、より、お客様ニーズを商品に反映することができると考えております。

ご存じのことかと思いますが、日本の食料自給率は農林水産省のデータによればカロリーベースで38%（令和4年）とのことです。昭和40年の同データは73%と半分近くまで落ち込んでしまいました。これは就農率の低下も大きな要素と私は考えております。代々農家を営んできた方たちも、「儲からない」や「食べていけない」理由で子供の代で辞めてしまうという生産者を多く見てきました。

我々W・Hは、これまで全国の生産者たちと仕事をしてきました。今後も生産者とお客様とを繋ぐ架け橋として、また日本の就農状況改善のため、ひいては、日本の食料自給率改善のため、より一層努力してまいります。`;

export default function AboutPage() {
  const philosophyRef = useReveal<HTMLDivElement>();
  const greetingRef = useReveal<HTMLDivElement>();
  const historyRef = useReveal<HTMLDivElement>();
  const itemsRef = useReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="02"
          en="About"
          ja="日本の農業と、"
          accentJa="お客様"
          tailJa="をつなぐ。"
          description="私たち株式会社W・Hは、全国の生産者の皆さまと飲食・小売・加工業のお客様をつなぐ、産直流通・カット野菜の専門会社です。"
          breadcrumb={[{ label: "会社概要" }]}
          backgroundImage={pageHeroAbout.src}
          backgroundAlt="北海道の畑の風景"
        />

        <Intro />

        {/* ── 代表挨拶 ─────────────────────────────── */}
        <section ref={greetingRef} className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute -top-8 left-0 w-40 md:w-64 h-56 wa-asanoha opacity-30 pointer-events-none hidden md:block" />

          <div className="container relative">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-14 items-start">
              <div className="reveal">
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                  <img
                    src={farmerHands.src}
                    alt="生産者の手と収穫された農作物"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-foreground/80 to-transparent text-primary-foreground">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-sun mb-1">Representative</div>
                    <div className="font-serif text-lg font-bold">代表取締役社長</div>
                    <div className="font-serif text-xl mt-1">島﨑 英彦</div>
                  </div>
                </div>
              </div>

              <div className="reveal delay-100">
                <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-3">— Message</div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.2] tracking-tight mb-3">
                  産直流通と、
                  <span className="italic font-normal text-primary relative inline-block ml-1">
                    カット野菜
                    <span className="absolute -bottom-1 left-0 right-0 h-[7px] bg-sun/50 -z-10" />
                  </span>
                  で。
                </h2>
                <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/50 mb-8">
                  Since 2011 — 株式会社 W・H
                </p>

                <div className="space-y-6 text-sm md:text-[15px] text-foreground/80 leading-loose whitespace-pre-line">
                  {greetingBody.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <p className="mt-10 text-sm text-foreground/60 italic">令和5年11月　代表取締役社長　島﨑 英彦</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 主な取り扱い品目 ─────────────────────── */}
        <section ref={itemsRef} className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 md:w-64 h-56 wa-shippou opacity-40 pointer-events-none hidden md:block" />

          <div className="container relative">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 md:mb-10 reveal">
                <span className="font-serif text-xs italic text-primary/60">— Main Items</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight mt-2">
                  主な取り扱い<span className="italic font-normal text-primary relative inline-block ml-1">
                    品目
                    <span className="absolute -bottom-1 left-0 right-0 h-[7px] bg-sun/50 -z-10" />
                  </span>
                </h2>
                <p className="mt-4 text-sm md:text-base text-foreground/70 leading-loose max-w-2xl">
                  葉物・根菜・果菜をはじめ、業務用途に合わせた24品目を通年で安定供給しています。
                </p>
              </div>

              <div className="reveal delay-100">
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border border border-border">
                  {handledItems.map((item, i) => (
                    <li
                      key={item}
                      className="bg-background px-4 py-4 flex items-center gap-3 hover:bg-primary/5 transition-smooth"
                    >
                      <span className="font-serif italic text-[11px] text-primary/50 tabular-nums w-6">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm md:text-[15px] text-foreground/85 font-medium">{item}</span>
                    </li>
                  ))}
                  <li className="bg-secondary/40 px-4 py-4 flex items-center justify-center text-xs text-muted-foreground tracking-[0.3em] uppercase">
                    等 / etc.
                  </li>
                </ul>
              </div>

              <p className="mt-8 text-sm md:text-base text-foreground/70 leading-loose reveal delay-200 border-l-2 border-primary/40 pl-4">
                その他ご要望に応じて、適切な産地にて作付けいたします。
              </p>
            </div>
          </div>
        </section>

        {/* ── 産地の風景 photo band ─────────────────── */}
        <section className="relative bg-background">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border max-w-6xl mx-auto">
            <figure className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
              <img
                src={aboutGreenhouse.src}
                alt="ハウス栽培の風景"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-foreground/65 text-primary-foreground text-[10px] md:text-xs tracking-[0.25em] uppercase">
                ハウス栽培 — Greenhouse
              </figcaption>
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
              <img
                src={aboutHarvest.src}
                alt="収穫した野菜の選別"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-foreground/65 text-primary-foreground text-[10px] md:text-xs tracking-[0.25em] uppercase">
                収穫・選別 — Harvest
              </figcaption>
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden bg-secondary/20 sm:col-span-2 lg:col-span-1">
              <img
                src={warehouseImg.src}
                alt="物流拠点での出荷準備"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-foreground/65 text-primary-foreground text-[10px] md:text-xs tracking-[0.25em] uppercase">
                出荷拠点 — Distribution
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── 会社外観 (photo band) ─────────────────── */}
        <section className="relative bg-background">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <figure className="relative overflow-hidden bg-secondary/30 min-h-[200px]">
                <img
                  src={warehouseImg.src}
                  alt="株式会社W・Hの物流・出荷拠点"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 px-5 py-3 md:px-7 md:py-4 bg-foreground/70 text-primary-foreground text-[11px] md:text-xs tracking-[0.25em] uppercase backdrop-blur-sm flex items-center gap-3">
                  <span className="h-px w-6 bg-sun" />
                  埼玉 越谷 ― Head Office &amp; Distribution Center
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── 会社情報 ─────────────────────────────── */}
        <section className="py-20 md:py-28 bg-secondary/40">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 md:mb-10">
                <span className="font-serif text-xs italic text-primary/60">— Company Profile</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight mt-2">
                  会社情報
                </h2>
              </div>
              <div className="border border-border bg-background">
                {companyProfile.map((item) => (
                  <div key={item.label} className="grid md:grid-cols-[180px_1fr] border-b last:border-b-0 border-border">
                    <div className="px-5 md:px-6 py-4 md:py-5 bg-secondary/40 text-sm md:text-base font-medium text-foreground">
                      {item.label}
                    </div>
                    <div className="px-5 md:px-6 py-4 md:py-5 text-sm md:text-base text-foreground/80 leading-loose whitespace-pre-line">
                      {item.value}
                      {item.link && (
                        <a
                          href={item.link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-primary hover:text-primary/70 transition-smooth font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {item.link.label}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── アクセス (Google Map) ──────────────────── */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 md:mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="font-serif text-xs italic text-primary/60">— Access</span>
                  <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight mt-2">
                    アクセス
                  </h2>
                  <p className="mt-3 text-sm text-foreground/70 leading-loose max-w-xl">
                    {COMPANY_ADDRESS}<br />
                    東武スカイツリーライン「越谷駅」東口より徒歩約8分。
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-foreground text-primary-foreground hover:bg-primary rounded-none h-11 px-6 tracking-[0.15em] uppercase text-xs"
                >
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer noopener">
                    <MapPin className="h-4 w-4 mr-2" />
                    Google Maps で開く
                  </a>
                </Button>
              </div>

              <div className="relative w-full aspect-[16/9] border border-border overflow-hidden bg-secondary/30">
                <iframe
                  title="株式会社W・H 所在地 Google マップ"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Philosophy ──────────────────────────── */}
        <section ref={philosophyRef} className="py-20 md:py-32 bg-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-80 h-full wa-asanoha opacity-40 pointer-events-none hidden md:block" />
          <div className="blob bg-matcha/20 w-[320px] h-[320px] -top-10 -left-10 hidden md:block" />

          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 mb-12 md:mb-16">
              <div className="lg:col-span-2 reveal">
                <div className="flex lg:flex-col items-center lg:items-start gap-3">
                  <span className="font-serif text-xs italic text-primary/60">— Philosophy</span>
                </div>
              </div>
              <div className="lg:col-span-7 reveal delay-100">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  私たちが、<br />
                  <span className="italic font-normal text-primary relative inline-block">
                    大切にしている
                    <span className="absolute -bottom-1 left-0 right-0 h-[8px] bg-sun/50 -z-10" />
                  </span>
                  こと。
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-border max-w-5xl mx-auto">
              {philosophy.map((p, i) => (
                <div
                  key={p.en}
                  className="bg-background p-6 md:p-8 group hover:bg-primary hover:text-primary-foreground transition-smooth reveal"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-serif text-xs italic opacity-60">— 0{i + 1}</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase opacity-70">{p.en}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 tracking-tight">{p.ja}</h3>
                  <p className="text-sm leading-loose opacity-80">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Photo band between philosophy & history ─────── */}
        <section className="relative h-44 md:h-72 overflow-hidden">
          <img
            src={aboutMixed.src}
            alt="様々な産地の野菜"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
          <div className="absolute bottom-4 md:bottom-8 left-0 right-0 container">
            <div className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-sun mb-1 md:mb-2">— Story</div>
            <div className="font-serif text-xl md:text-3xl font-bold text-primary-foreground">日本の食卓を支えて、これまでも、これからも。</div>
          </div>
        </section>

        {/* ── History ─────────────────────────────── */}
        <section ref={historyRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute -top-2 right-0 text-[110px] sm:text-[180px] md:text-[260px] font-serif font-bold leading-none select-none pointer-events-none [-webkit-text-stroke:1px_hsl(var(--primary)/0.08)] text-transparent">
            History
          </div>

          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 mb-12 md:mb-16">
              <div className="lg:col-span-2">
                <span className="font-serif text-xs italic text-primary/60">— History</span>
              </div>
              <div className="lg:col-span-10">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  これまでの、<br />
                  <span className="italic font-normal text-primary">歩み</span>。
                </h2>
              </div>
            </div>

            <ol className="max-w-4xl mx-auto relative">
              <div className="absolute left-3 md:left-28 top-2 bottom-2 w-px bg-border" aria-hidden />
              {timeline.map((t, i) => (
                <li
                  key={t.year}
                  className="relative grid grid-cols-[auto_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-10 py-6 md:py-8 items-start reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="relative z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-sun" />
                    </span>
                    <span className="font-serif italic text-primary text-lg md:text-xl hidden md:inline">{t.year}</span>
                  </div>
                  <div>
                    <span className="font-serif italic text-primary text-lg md:hidden block mb-1">{t.year}</span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold mb-1 tracking-tight">{t.title}</h3>
                    <p className="text-foreground/70 text-sm leading-loose">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-gradient-editorial text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 wa-seigaiha-light pointer-events-none" />
          <div className="container relative text-center">
            <h3 className="font-serif text-3xl md:text-5xl font-bold mb-6 tracking-tight text-balance">
              もっと、私たちを
              <br />
              <span className="italic text-sun">知る</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-sun text-foreground hover:bg-sun/90 rounded-none h-14 px-7 tracking-wider">
                <Link href="/services">
                  業務内容を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-none h-14 px-7 tracking-wider">
                <Link href="/contact">お問い合わせ</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
