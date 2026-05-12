import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { Strengths } from "@/components/site/Strengths";
import { Solutions } from "@/components/site/Solutions";
import { Safety } from "@/components/site/Safety";
import { Products } from "@/components/site/Products";
import pageHeroServices from "@/assets/page-hero-services.jpg";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="03"
          en="Services"
          ja="選ばれる、"
          accentJa="3つ"
          tailJa="の理由。"
          description="生産者と取引先、双方に寄り添う流通スタイル。「供給力・品質・価格」のバランスを大切にしています。"
          breadcrumb={[{ label: "業務内容" }]}
          backgroundImage={pageHeroServices.src}
          backgroundAlt="契約農家のじゃがいも畑の収穫風景"
        />
        <Strengths />
        <Solutions />
        <Safety />
        <Products />
      </main>
      <Footer />
    </div>
  );
}
