import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Sprout, Users } from "lucide-react";
import pageHeroCareers from "@/assets/page-hero-careers.jpg";
import careersTeam from "@/assets/careers-team.jpg";
import careersField from "@/assets/careers-field.jpg";

const jobs = [
  {
    title: "法人営業（青果流通）",
    type: "正社員",
    location: "埼玉県越谷市",
    hours: "8:30 - 17:30",
    description:
      "外食・小売・給食向けに、野菜の仕入れ提案と供給計画の提案を担当します。生産者・物流・取引先をつなぐポジションです。",
  },
  {
    title: "品質管理スタッフ",
    type: "正社員",
    location: "埼玉県越谷市",
    hours: "7:00 - 16:00",
    description:
      "入荷検品、温度管理、衛生チェックを中心に、安全で安定した出荷を支える仕事です。食品業界の品質業務経験者を歓迎します。",
  },
  {
    title: "物流・出荷オペレーション",
    type: "正社員 / 契約社員",
    location: "埼玉県越谷市",
    hours: "シフト制",
    description:
      "在庫確認、ピッキング、出荷手配、配送調整までを担当します。チームで連携しながら、正確で迅速な配送を実現します。",
  },
];

const benefits = [
  "各種社会保険完備",
  "交通費支給（規定あり）",
  "昇給・賞与あり（業績連動）",
  "資格取得支援制度",
  "産地視察・研修制度",
  "慶弔休暇 / 有給休暇",
];

const steps = [
  { title: "エントリー", body: "お問い合わせフォームまたはお電話からご連絡ください。" },
  { title: "書類選考", body: "履歴書・職務経歴書を確認し、3営業日以内にご連絡します。" },
  { title: "面接（1〜2回）", body: "現場責任者および代表が、経験や志向を丁寧に伺います。" },
  { title: "内定", body: "入社時期・条件をすり合わせの上、内定をご案内します。" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="08"
          en="Careers"
          ja="食を支える"
          accentJa="仲間"
          tailJa="を募集しています。"
          description="産地と食卓をつなぐ現場で、地域と農業の未来を一緒につくりませんか。営業・品質・物流の各ポジションで採用を行っています。"
          breadcrumb={[{ label: "採用情報" }]}
          backgroundImage={pageHeroCareers.src}
          backgroundAlt="出荷拠点で働くスタッフの様子"
        />

        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 md:w-72 h-64 wa-shippou opacity-40 pointer-events-none hidden md:block" />
          <div className="container relative">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14 items-center">
              <div className="lg:col-span-7">
                <span className="tag-pill bg-primary/5 text-primary">Message</span>
                <h2 className="mt-4 font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  農業と流通の
                  <span className="italic font-normal text-primary">価値</span>
                  を、次世代へ。
                </h2>
                <p className="mt-5 text-foreground/75 leading-loose">
                  私たちは、生産者の想いを正しく届けること、そして取引先の現場が安心して使える品質を守ることを使命にしています。
                  現場目線を大切にしながら、改善を積み重ねていける方を歓迎します。
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] overflow-hidden border border-border/60">
                  <img
                    src={careersTeam.src}
                    alt="出荷拠点で働くスタッフ"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/70 to-transparent text-primary-foreground">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-sun">Team</div>
                    <div className="font-serif text-base font-bold">現場で支え合うチーム</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div className="border border-border p-6 bg-secondary/30">
                <Users className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-serif text-2xl font-bold mb-2">チームで動く</h3>
                <p className="text-sm text-foreground/70 leading-loose">営業・品質・物流が密に連携し、無理のない供給体制を作ります。</p>
              </div>
              <div className="border border-border p-6 bg-secondary/30">
                <Sprout className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-serif text-2xl font-bold mb-2">産地に学ぶ</h3>
                <p className="text-sm text-foreground/70 leading-loose">協力農家との対話を重ね、一次産業の実態を理解しながら提案力を磨けます。</p>
              </div>
              <div className="border border-border p-6 bg-secondary/30">
                <BriefcaseBusiness className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-serif text-2xl font-bold mb-2">長く働ける</h3>
                <p className="text-sm text-foreground/70 leading-loose">制度整備と業務改善を進め、継続的に働きやすい環境づくりを行っています。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 wa-asanoha opacity-35 pointer-events-none" />
          <div className="container relative">
            <div className="mb-8 md:mb-12">
              <span className="tag-pill bg-primary/10 text-primary">Open Positions</span>
              <h2 className="mt-4 font-serif text-3xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                募集職種
              </h2>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <article key={job.title} className="bg-background border border-border p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">{job.title}</h3>
                    <span className="inline-flex items-center self-start px-3 py-1 text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-5 text-sm text-foreground/70 mb-4">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary" />
                      {job.hours}
                    </span>
                  </div>
                  <p className="text-foreground/80 leading-loose">{job.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative h-48 md:h-72 overflow-hidden">
          <img
            src={careersField.src}
            alt="協力農家の畑で収穫を学ぶ"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
          <div className="absolute bottom-4 md:bottom-8 left-0 right-0 container">
            <div className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-sun mb-1 md:mb-2">— Field Visit</div>
            <div className="font-serif text-xl md:text-3xl font-bold text-primary-foreground">産地に学ぶ研修制度</div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-6">福利厚生・制度</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground/80">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-6">選考フロー</h2>
              <ol className="space-y-3">
                {steps.map((step, idx) => (
                  <li key={step.title} className="border border-border bg-secondary/30 p-4">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-primary mb-1">Step {idx + 1}</div>
                    <h3 className="font-serif text-xl font-bold mb-1">{step.title}</h3>
                    <p className="text-sm text-foreground/75 leading-loose">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-editorial text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 wa-seigaiha-light pointer-events-none" />
          <div className="container relative text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-5">
              応募・お問い合わせは
              <br />
              こちらから
            </h2>
            <p className="text-primary-foreground/80 leading-loose max-w-2xl mx-auto mb-8">
              ご応募前のご質問も歓迎しています。仕事内容や働き方について、気になる点があればお気軽にご相談ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-xl sm:max-w-none mx-auto">
              <Button asChild size="lg" className="bg-sun text-foreground hover:bg-sun/90 rounded-none h-14 px-6 sm:px-7 tracking-wider w-full sm:w-auto">
                <Link href="/contact">
                  お問い合わせフォームへ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700 rounded-none h-14 sm:h-16 px-6 sm:px-10 tracking-wider w-full sm:w-auto">
                <a href="tel:048-228-6770" className="text-xl sm:text-2xl md:text-3xl leading-none font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif] whitespace-nowrap">
                  048-228-6770
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
