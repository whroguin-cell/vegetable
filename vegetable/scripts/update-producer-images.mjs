/**
 * Updates all producer image URLs in Supabase to match specialty produce
 * and farm scenery for each prefecture.
 *
 * Run with:
 *   node scripts/update-producer-images.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const envText = readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Image updates keyed by producer num.
// Each entry has images matched to the prefecture's specialty produce and farm scenery.
const updates = [
  {
    num: "01",
    name: "北海道 (高橋 美佳) — じゃがいも・玉ねぎ・アスパラガス",
    image_url:     "https://images.unsplash.com/photo-1587810451787-0c58e490080c?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1764587492501-bf8b61c09792?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"収穫期のじゃがいも畑。",
    photo2_url:    "https://images.unsplash.com/photo-1656486081163-a77f720a2789?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"澄んだ空気と北海道の農地。",
    photo3_url:    "https://images.unsplash.com/photo-1526678114169-b276d04ee180?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"朝採りのアスパラガス。",
  },
  {
    num: "02",
    name: "青森県 (木村 誠) — りんご・長芋・にんにく",
    image_url:     "https://images.unsplash.com/photo-1760243875549-d49e7a1b3281?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1745962417587-365bef211257?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"たわわに実るふじりんご。",
    photo2_url:    "https://images.unsplash.com/photo-1600917000152-ff5d44a22c2e?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"収穫期のりんご園。",
    photo3_url:    "https://images.unsplash.com/photo-1471512175124-9790649b4143?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"青森産にんにくの収穫。",
  },
  {
    num: "03",
    name: "秋田県 (佐々木 翔) — あきたこまち・枝豆・じゅんさい",
    image_url:     "https://images.unsplash.com/photo-1559439080-b6037bc5f8fb?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1773393878458-e793434a80cc?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"棚田の稲刈り風景。",
    photo2_url:    "https://images.unsplash.com/photo-1649257171206-37625b1f3b2f?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"早朝の枝豆収穫。",
    photo3_url:    "https://images.unsplash.com/photo-1623078788671-f168da577997?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"清流に育む里山の風景。",
  },
  {
    num: "04",
    name: "茨城県 (田中 健一) — 小松菜・ほうれん草・水菜",
    image_url:     "https://images.unsplash.com/photo-1761839257946-4616bcfafec7?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1578283343206-3f7a1d347581?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"みずみずしい小松菜の栽培。",
    photo2_url:    "https://images.unsplash.com/photo-1515363578674-99f41329ab4c?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"有機栽培の葉物野菜。",
    photo3_url:    "https://images.unsplash.com/photo-1547058606-7eb25508e7e0?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"早朝の収穫風景。",
  },
  {
    num: "05",
    name: "千葉県 (鈴木 一郎) — 人参・じゃがいも・大根",
    image_url:     "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1594400315019-a03cc9acb85a?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"鮮やかなオレンジの人参。",
    photo2_url:    "https://images.unsplash.com/photo-1563012678-bdfec255931b?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"砂地でのびのび育つじゃがいも。",
    photo3_url:    "https://images.unsplash.com/photo-1478900160460-2bfa23c92a4a?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"収穫したての大根。",
  },
  {
    num: "06",
    name: "長野県 (渡辺 浩司) — レタス・セロリ・ブロッコリー",
    image_url:     "https://images.unsplash.com/photo-1541046469329-51deaf7358e8?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1528607950896-30d92379b592?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"朝霧に包まれる高原畑のレタス。",
    photo2_url:    "https://images.unsplash.com/photo-1689666190477-259395cd4f21?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"収穫直後のブロッコリー。",
    photo3_url:    "https://images.unsplash.com/photo-1578283343206-3f7a1d347581?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"高原畑の葉物野菜。",
  },
  {
    num: "07",
    name: "静岡県 (小林 友里) — みつば・わさび菜・クレソン",
    image_url:     "https://images.unsplash.com/photo-1751203658229-1cfd3b20ec05?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1755384866790-60200f33e55f?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"富士山の湧水で育つわさび菜。",
    photo2_url:    "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"富士山を望む静岡の畑。",
    photo3_url:    "https://images.unsplash.com/photo-1582745741856-1a5d68158ba3?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"摘みたてのクレソン。",
  },
  {
    num: "08",
    name: "京都府 (山本 真由美) — 京野菜・九条ねぎ・聖護院かぶ",
    image_url:     "https://images.unsplash.com/photo-1752724411531-4588050c2e22?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1737507844233-9bad00475be8?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"九条ねぎの畝（緑鮮やかな春ネギ）。",
    photo2_url:    "https://images.unsplash.com/photo-1559836833-2a2c99b1f54f?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"収穫した九条ねぎ。",
    photo3_url:    "https://images.unsplash.com/photo-1760706950806-ee006a4a5427?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"京都の里山風景。",
  },
  {
    num: "09",
    name: "兵庫県 (伊藤 大輔) — 淡路玉ねぎ",
    image_url:     "https://images.unsplash.com/photo-1760549255949-767d18981890?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1760627587430-cd25f0b2d7a5?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"収穫後に干された淡路玉ねぎ。",
    photo2_url:    "https://images.unsplash.com/photo-1570980457205-f54f8167650b?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"収穫かごの玉ねぎ。",
    photo3_url:    "https://images.unsplash.com/photo-1699031847231-fda6325b2363?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"淡路島の瀬戸内海と船。",
  },
  {
    num: "10",
    name: "広島県 (岡田 優子) — レモン・ブロッコリー・キャベツ",
    image_url:     "https://images.unsplash.com/photo-1726537625265-886486fe2827?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1670625940495-901694675a2b?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"レモンの木に実るフレッシュレモン。",
    photo2_url:    "https://images.unsplash.com/photo-1761772310837-323c7aece269?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"熟したレモンが鈴なりのレモン畑。",
    photo3_url:    "https://images.unsplash.com/photo-1699031847231-fda6325b2363?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"瀬戸内海の島々と海。",
  },
  {
    num: "11",
    name: "高知県 (松本 拓也) — なす・ピーマン・ししとう",
    image_url:     "https://images.unsplash.com/photo-1714070705532-3f81f7733a1b?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1604488943825-f95dc6796ca5?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"艶やかなピーマン・ししとう。",
    photo2_url:    "https://images.unsplash.com/photo-1643711038299-3a4588e2264f?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"ハウス内の整然とした緑の野菜。",
    photo3_url:    "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"彩り豊かなパプリカ・ピーマン。",
  },
  {
    num: "12",
    name: "熊本県 (佐藤 みどり) — ミニトマト・中玉トマト",
    image_url:     "https://images.unsplash.com/photo-1762512217552-653d0eab7a18?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1776222075107-235373ff809d?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"ミニトマトの房。",
    photo2_url:    "https://images.unsplash.com/photo-1683008952458-dc02ac67f382?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"ハウスのトマト栽培。",
    photo3_url:    "https://images.unsplash.com/photo-1686278895718-26a2331d7297?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"完熟トマトのたわわな収穫。",
  },
  {
    num: "13",
    name: "鹿児島県 (中村 剛) — さつまいも・大根",
    image_url:     "https://images.unsplash.com/photo-1600506443328-39120935a68a?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1570723735746-c9bd51bd7c40?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"掘りたてのさつまいも。",
    photo2_url:    "https://images.unsplash.com/photo-1673533537845-7f7498faf85f?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"収穫かごのさつまいも。",
    photo3_url:    "https://images.unsplash.com/photo-1626548752000-afb81286797e?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"桜島火山のシルエット（鹿児島のシンボル）。",
  },
  {
    num: "14",
    name: "沖縄県 (吉田 亜希) — ゴーヤ・ハンダマ・島らっきょう",
    image_url:     "https://images.unsplash.com/photo-1607909572148-533d0fbd6f89?auto=format&fit=crop&w=1200&q=80",
    photo1_url:    "https://images.unsplash.com/photo-1766714534617-b3cffc7f9085?auto=format&fit=crop&w=900&q=80",
    photo1_caption:"つややかなゴーヤ（沖縄産苦瓜）。",
    photo2_url:    "https://images.unsplash.com/photo-1764415438484-b5b28e5234be?auto=format&fit=crop&w=900&q=80",
    photo2_caption:"ゴーヤの蔓。",
    photo3_url:    "https://images.unsplash.com/photo-1649290927725-129d71e65094?auto=format&fit=crop&w=900&q=80",
    photo3_caption:"沖縄の海岸風景。",
  },
];

let ok = 0;
let fail = 0;

for (const u of updates) {
  const { num, name, ...fields } = u;
  const { error } = await supabase
    .from("producers")
    .update(fields)
    .eq("num", num);

  if (error) {
    console.error(`✗ [${num}] ${name}:`, error.message);
    fail++;
  } else {
    console.log(`✓ [${num}] ${name}`);
    ok++;
  }
}

console.log(`\nDone: ${ok} updated, ${fail} failed.`);
