"use client";

import Link from "next/link";
import logoImage from "@/assets/logo.png";
import warehouseImage from "@/assets/warehouse.jpg";

const footerMenu = [
  { label: "ホーム", to: "/" },
  { label: "会社概要", to: "/about" },
  { label: "業務内容", to: "/services" },
  { label: "農場紹介", to: "/producers" },
  { label: "採用情報", to: "/careers" },
  { label: "お知らせ", to: "/news" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-matcha/15 text-foreground border-t border-matcha/40 overflow-hidden">
      {/* Wide produce photo band */}
      <div
        aria-hidden
        className="relative h-24 sm:h-32 md:h-40 border-b border-matcha/30 overflow-hidden"
      >
        <img
          src={warehouseImage.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matcha/15 via-foreground/15 to-transparent" />
      </div>
      <div className="container relative py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex mb-5">
              <img
                src={logoImage.src}
                alt="株式会社W・H ロゴ"
                className="h-10 md:h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-foreground/70 leading-loose max-w-md">
              産直流通・カット野菜を通じて、日本の農業とお客様をつなぐ、
              <br className="hidden md:block" />
              株式会社W・Hです。
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center mt-6 h-11 px-6 bg-foreground text-primary-foreground hover:bg-primary transition-smooth tracking-[0.15em] uppercase text-xs font-medium"
            >
              お問い合わせ
            </Link>
          </div>

          {/* Offices */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-primary uppercase font-medium mb-2">Head Office</div>
              <div className="text-sm text-foreground/80 leading-relaxed">
                〒343-0813 埼玉県越谷市越ヶ谷 3-4-5
              </div>
              <div className="text-xs text-foreground/60 mt-1 font-['Hiragino_Kaku_Gothic_ProN','Yu_Gothic','Meiryo',sans-serif]">
                TEL 048-228-6770 / FAX 048-960-6815
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] text-primary uppercase font-medium mb-2">Access</div>
              <div className="text-sm text-foreground/80 leading-relaxed">
                東武スカイツリーライン「越谷駅」東口より徒歩約8分
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="lg:col-span-3">
            <div className="text-[10px] tracking-[0.3em] text-primary uppercase font-medium mb-3">Menu</div>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-6">
              {footerMenu.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.to}
                    className="text-sm text-foreground/75 hover:text-primary transition-smooth inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 md:mt-14 pt-5 md:pt-6 border-t border-matcha/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-foreground/60 tracking-wider">
          <div>© {new Date().getFullYear()} W·H Inc. — All Rights Reserved.</div>
          <div className="flex gap-6">
            <Link href="/access#terms" className="hover:text-primary transition-smooth">Terms</Link>
            <Link href="/access#privacy" className="hover:text-primary transition-smooth">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
