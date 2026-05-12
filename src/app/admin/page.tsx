"use client";

import Link from "next/link";
import { Users, Newspaper, Database, ExternalLink, MapPin, Package, Image as ImageIcon } from "lucide-react";
import { useNews, useProducers, useProducts, useRegions } from "@/hooks/use-content";

export default function AdminDashboardPage() {
  const { data: regions = [] } = useRegions();
  const { data: producers = [] } = useProducers();
  const { data: products = [] } = useProducts();
  const { data: news = [] } = useNews({ includeUnpublished: true });

  const published = news.filter((n) => n.published).length;

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium">Dashboard</span>
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-2">
        管理<span className="italic font-normal text-primary">ダッシュボード</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-10 leading-loose">
        公開サイトのコンテンツを管理します。左メニューから対象を選択してください。
      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Link
          href="/admin/regions"
          className="group block bg-background border border-border p-6 md:p-8 hover:shadow-card transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium">Regions</span>
          </div>
          <div className="font-serif text-4xl font-bold tracking-tight mb-2 group-hover:text-primary transition-smooth">
            {regions.length}
          </div>
          <div className="text-sm text-muted-foreground">地域ネットワーク件数</div>
          <div className="mt-6 h-[2px] w-10 bg-sun group-hover:w-24 transition-all duration-500" />
        </Link>

        <Link
          href="/admin/producers"
          className="group block bg-background border border-border p-6 md:p-8 hover:shadow-card transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium">Producers</span>
          </div>
          <div className="font-serif text-4xl font-bold tracking-tight mb-2 group-hover:text-primary transition-smooth">
            {producers.length}
          </div>
          <div className="text-sm text-muted-foreground">生産者の登録件数</div>
          <div className="mt-6 h-[2px] w-10 bg-sun group-hover:w-24 transition-all duration-500" />
        </Link>

        <Link
          href="/admin/products"
          className="group block bg-background border border-border p-6 md:p-8 hover:shadow-card transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium">Products</span>
          </div>
          <div className="font-serif text-4xl font-bold tracking-tight mb-2 group-hover:text-primary transition-smooth">
            {products.length}
          </div>
          <div className="text-sm text-muted-foreground">取扱品目の登録件数</div>
          <div className="mt-6 h-[2px] w-10 bg-sun group-hover:w-24 transition-all duration-500" />
        </Link>

        <Link
          href="/admin/news"
          className="group block bg-background border border-border p-6 md:p-8 hover:shadow-card transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <Newspaper className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium">News</span>
          </div>
          <div className="font-serif text-4xl font-bold tracking-tight mb-2 group-hover:text-primary transition-smooth">
            {news.length} <span className="text-lg text-muted-foreground font-normal">({published} 公開)</span>
          </div>
          <div className="text-sm text-muted-foreground">ニュース・お知らせの件数</div>
          <div className="mt-6 h-[2px] w-10 bg-sun group-hover:w-24 transition-all duration-500" />
        </Link>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/media"
          className="group block bg-background border border-border p-6 md:p-8 hover:shadow-card transition-smooth"
        >
          <div className="flex items-center justify-between mb-4">
            <ImageIcon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium">Media Library</span>
          </div>
          <div className="font-serif text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-smooth">
            画像・フォントを管理する
          </div>
          <div className="text-sm text-muted-foreground">
            Supabase Storage の <code className="text-xs bg-muted px-1">media</code> バケットを CRUD 操作できます。
            アップロード / URL 取り込み / 名前変更 / 削除に対応。
          </div>
          <div className="mt-6 h-[2px] w-10 bg-sun group-hover:w-24 transition-all duration-500" />
        </Link>
      </div>

      <div className="mt-10 bg-background border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-primary" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium">Database</span>
        </div>
        <p className="text-sm text-muted-foreground leading-loose">
          全ての変更は即時に公開サイトへ反映されます。
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline ml-2"
          >
            サイトを確認する <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
