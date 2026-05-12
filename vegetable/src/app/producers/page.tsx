import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageHero } from "@/components/site/PageHero";
import { ProducersDirectory } from "@/components/site/ProducersDirectory";
import pageHeroProducers from "@/assets/page-hero-producers.jpg";

export default function ProducersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          number="06"
          en="Producers"
          ja="顔の見える、"
          accentJa="生産者"
          tailJa="たち。"
          description="北海道から沖縄まで。県ごとに、協力農家の顔・主な生産野菜・畑の風景をご紹介します。"
          breadcrumb={[{ label: "生産者紹介" }]}
          backgroundImage={pageHeroProducers.src}
          backgroundAlt="北海道の畑と生産者の風景"
        />
        <ProducersDirectory />
      </main>
      <Footer />
    </div>
  );
}
