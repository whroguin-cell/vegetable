"use client";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import pageHeroAccess from "@/assets/page-hero-access.jpg";

const companyInfo = [
  { label: "会社名", value: "株式会社W・H (W・H Inc.)" },
  { label: "設立", value: "2008年4月" },
  { label: "代表取締役", value: "山田 太郎" },
  { label: "資本金", value: "3,000万円" },
  { label: "従業員数", value: "42名 (2026年4月現在)" },
  { label: "事業内容", value: "青果物の仕入・販売、カット野菜の製造・販売、加工事業" },
  { label: "取引銀行", value: "みずほ銀行 木場支店 / 三菱UFJ銀行 門前仲町支店" },
];

const offices = [
  {
    name: "本社 Head Office",
    address: "〒135-0042 東京都江東区木場 4-12-7 木場ビル6F",
    tel: "048-228-6770",
    fax: "03-5432-8762",
    access: "東京メトロ東西線「木場」駅 徒歩4分",
    hours: "9:00 – 18:00 (月〜金)",
  },
  {
    name: "川口センター Kawaguchi Center",
    address: "〒332-0034 埼玉県川口市並木 3-8-15",
    tel: "048-228-6770",
    fax: "048-271-9385",
    access: "JR京浜東北線「西川口」駅 徒歩12分",
    hours: "6:00 – 17:00 (月〜土)",
  },
];

export default function AccessPage() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="07"
          en="Company"
          ja="会社案内と、"
          accentJa="アクセス"
          tailJa="。"
          description="本社および川口センターの所在地・連絡先をご案内します。会社情報についてはこちらをご覧ください。"
          breadcrumb={[{ label: "会社案内" }]}
          backgroundImage={pageHeroAccess.src}
          backgroundAlt="協力農家の畑の風景"
        />

        <section ref={ref} className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-80 h-full wa-seigaiha opacity-40 pointer-events-none hidden md:block" />

          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 mb-12">
              <div className="lg:col-span-2 reveal">
                <div className="inline-flex items-center gap-2 text-primary/80">
                  <Building2 className="h-4 w-4" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Company</span>
                </div>
              </div>
              <div className="lg:col-span-10 reveal delay-100">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  会社<span className="italic font-normal text-primary">概要</span>
                </h2>
              </div>
            </div>

            <dl className="max-w-4xl mx-auto border-t border-border reveal delay-200">
              {companyInfo.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[120px_1fr] md:grid-cols-[220px_1fr] gap-4 md:gap-8 py-5 md:py-6 border-b border-border hover:bg-secondary/60 transition-smooth px-2"
                >
                  <dt className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary font-medium pt-1">
                    {row.label}
                  </dt>
                  <dd className="font-serif text-base md:text-lg text-foreground leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 wa-shippou opacity-50 pointer-events-none" />
          <div className="blob bg-matcha/20 w-[320px] h-[320px] -bottom-10 -left-10 hidden md:block" />

          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-10 mb-12">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 text-primary/80">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Access</span>
                </div>
              </div>
              <div className="lg:col-span-10">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  拠点<span className="italic font-normal text-primary">・</span>アクセス
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              {offices.map((o, i) => (
                <div
                  key={o.name}
                  className="group bg-background p-6 md:p-10 shadow-soft hover:shadow-elegant transition-smooth border-t-2 border-sun"
                >
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-serif italic text-xs text-primary/60">— 0{i + 1}</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-primary/70">Office</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight">
                    {o.name}
                  </h3>

                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3 items-start">
                      <MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
                      <span className="text-foreground/85 leading-relaxed">{o.address}</span>
                    </li>
                    <li className="flex gap-3 items-start flex-wrap">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 mt-1 text-green-600 fill-green-600 shrink-0" />
                      <span className="text-foreground/85 text-base sm:text-lg font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif] break-words">
                        TEL: <a href={`tel:${o.tel}`} className="hover:text-primary transition-smooth">{o.tel}</a>
                        <span className="text-muted-foreground"> / FAX: {o.fax}</span>
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <Clock className="h-4 w-4 mt-1 text-primary shrink-0" />
                      <span className="text-foreground/85">{o.hours}</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mt-1.5 shrink-0 w-10">Access</span>
                      <span className="text-foreground/85 leading-relaxed">{o.access}</span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="privacy" className="py-20 md:py-32 bg-background">
          <div className="container max-w-4xl">
            <div className="grid lg:grid-cols-12 gap-10 mb-12">
              <div className="lg:col-span-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-[1.15] tracking-tight">
                  個人情報保護方針
                </h2>
              </div>
            </div>
            <div className="space-y-5 text-foreground/75 leading-loose text-[15px]">
              <p>
                当社は、個人情報の重要性を認識し、お客様より取得した個人情報を適切に取扱うため、以下の方針に基づき個人情報保護に取り組みます。
              </p>
              <p>
                当社は、個人情報の取得にあたっては、その利用目的を明確にし、適法かつ公正な手段によって取得します。取得した個人情報は、事前にご本人の同意を得た場合を除き、あらかじめ明示した利用目的の範囲内でのみ利用します。
              </p>
              <p>
                当社は、個人情報に関する法令・規範を遵守するとともに、安全管理のため必要かつ適切な措置を講じ、個人情報の漏洩、滅失、毀損などの防止に努めます。
              </p>
            </div>
          </div>
        </section>

        <section id="terms" className="py-20 md:py-32 bg-secondary">
          <div className="container max-w-4xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-[1.15] tracking-tight mb-8">
              利用規約
            </h2>
            <div className="space-y-5 text-foreground/75 leading-loose text-[15px]">
              <p>
                本ウェブサイト (以下「本サイト」) は、株式会社W・H (以下「当社」) が運営しています。本サイトをご利用になる際は、以下の規約を必ずお読みいただき、ご同意いただいた上でご利用ください。
              </p>
              <p>
                本サイトの掲載内容は、予告なく変更・中断・中止されることがあります。また、本サイトのコンテンツ、文章、画像等の著作権は、当社または原著作権者に帰属します。
              </p>
              <p>
                本サイトのご利用により、ご利用者様または第三者に損害が生じた場合においても、当社は一切の責任を負いかねますので、あらかじめご了承ください。
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-editorial text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 wa-seigaiha-light pointer-events-none" />
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 mb-4 text-sun tag-pill bg-primary-foreground/10">
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </div>
            <p className="font-serif text-2xl md:text-3xl">
              <a href="mailto:info@wh-inc.example" className="hover:text-sun transition-smooth">
                info@wh-inc.example
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
