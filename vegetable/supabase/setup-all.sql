-- =============================================================
-- W·H Inc. — Unified Supabase setup script
-- Includes:
--   1) schema.sql
--   2) producers v2 upgrade + consolidated seed
--   3) create-admin.sql
--
-- Run this single file in Supabase SQL Editor.
-- =============================================================

-- =============================================================
-- 1) schema.sql
-- =============================================================

-- Enable extensions
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- 1) Tables
-- -------------------------------------------------------------

create table if not exists public.regions (
  id          uuid primary key default gen_random_uuid(),
  num         text not null,
  area        text not null,
  en          text not null,
  farms       text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.producers (
  id          uuid primary key default gen_random_uuid(),
  num         text not null,
  name        text not null,
  name_en     text not null,
  region      text not null,
  image_url   text,
  items       text[] not null default '{}',
  note        text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  ja          text not null,
  en          text not null,
  emoji       text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  date         text not null,
  category     text not null,
  category_ja  text,
  title        text not null,
  body         text,
  published    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_regions_updated_at on public.regions;
create trigger trg_regions_updated_at before update on public.regions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_producers_updated_at on public.producers;
create trigger trg_producers_updated_at before update on public.producers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_news_updated_at on public.news;
create trigger trg_news_updated_at before update on public.news
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- 1.5) Producers v2 columns (safe/idempotent)
-- -------------------------------------------------------------
alter table public.producers
  add column if not exists prefecture      text,
  add column if not exists main_produce    text,
  add column if not exists characteristics text,
  add column if not exists photo1_url      text,
  add column if not exists photo1_caption  text,
  add column if not exists photo2_url      text,
  add column if not exists photo2_caption  text,
  add column if not exists photo3_url      text,
  add column if not exists photo3_caption  text;

-- -------------------------------------------------------------
-- 2) RLS
-- -------------------------------------------------------------

alter table public.regions   enable row level security;
alter table public.producers enable row level security;
alter table public.products  enable row level security;
alter table public.news      enable row level security;
alter table public.admins    enable row level security;

drop policy if exists "regions read all"   on public.regions;
drop policy if exists "producers read all" on public.producers;
drop policy if exists "products read all"  on public.products;
drop policy if exists "news read public"   on public.news;

create policy "regions read all"   on public.regions   for select using (true);
create policy "producers read all" on public.producers for select using (true);
create policy "products read all"  on public.products  for select using (true);
create policy "news read public"   on public.news      for select using (published = true);

drop policy if exists "admins read own" on public.admins;
create policy "admins read own" on public.admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "regions admin write"   on public.regions;
drop policy if exists "producers admin write" on public.producers;
drop policy if exists "products admin write"  on public.products;
drop policy if exists "news admin write"      on public.news;
drop policy if exists "news admin read all"   on public.news;

create policy "regions admin write" on public.regions
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "producers admin write" on public.producers
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "products admin write" on public.products
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "news admin write" on public.news
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "news admin read all" on public.news
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- -------------------------------------------------------------
-- 2.5) Storage bucket + policies for the admin Media Library
-- -------------------------------------------------------------
-- Public bucket so <img src="…/storage/v1/object/public/media/…"> works on
-- the live site. Admin pages can also call the storage SDK directly to
-- upload / rename / delete via the policies below; the in-app server API
-- routes (using the service role key) bypass RLS as a fallback.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read"   on storage.objects;
drop policy if exists "media admin insert"  on storage.objects;
drop policy if exists "media admin update"  on storage.objects;
drop policy if exists "media admin delete"  on storage.objects;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

create policy "media admin update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  )
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

-- -------------------------------------------------------------
-- 3) Base seed data
-- -------------------------------------------------------------

insert into public.products (ja, en, emoji, sort_order) values
  ('グリーンリーフ','Green Leaf','🥬', 10),
  ('水菜',         'Mizuna',    '🌿', 20),
  ('ミニトマト',    'Mini Tomato','🍅', 30),
  ('紅芯大根',     'Red Radish',  '🌸', 40),
  ('国産人参',     'Carrot',      '🥕', 50),
  ('長ネギ',       'Naga-negi',   '🌱', 60),
  ('レタス',       'Lettuce',     '🥬', 70),
  ('小松菜',       'Komatsuna',   '🌿', 80),
  ('じゃがいも',    'Potato',      '🥔', 90),
  ('玉ねぎ',       'Onion',       '🧅', 100),
  ('ほうれん草',    'Spinach',     '🌱', 110),
  ('キャベツ',     'Cabbage',     '🥬', 120),
  ('白菜',         'Hakusai',     '🌿', 130),
  ('ブロッコリー',  'Broccoli',    '🥦', 140),
  ('大根',         'Daikon',      '⚪',  150),
  ('きゅうり',     'Cucumber',    '🥒', 160)
on conflict do nothing;

-- =============================================================
-- 2) Consolidated seed data (regions + producers v2 + news)
-- =============================================================

-- Keep final state deterministic on rerun.
delete from public.producers;
delete from public.news;
delete from public.regions;

insert into public.regions (num, area, en, farms, sort_order) values
  ('04', '中部',          'Chubu',             array['長野高原農園','静岡フレッシュ','山梨フルーツ'],                     40),
  ('07', '九州・沖縄',    'Kyushu & Okinawa',  array['熊本グリーン','鹿児島農園','沖縄野菜村','宮崎太陽ファーム'],        70),
  ('01', '北海道',        'Hokkaido',          array['十勝青果','美瑛農園','富良野ポテト'],                               10),
  ('05', '関西',          'Kansai',            array['淡路島農園','京野菜の里','和歌山みかん園'],                         50),
  ('02', '東北',          'Tohoku',            array['みちのく青果','山形ファーム','秋田アップル'],                        20),
  ('06', '中国・四国',    'Chugoku & Shikoku', array['瀬戸内ファーム','高知太陽農園','愛媛みかん'],                        60),
  ('03', '関東',          'Kanto',             array['茨城農園','千葉グリーン','埼玉農場','群馬高原ファーム'],             30);

insert into public.producers
  (num, name, name_en, region, prefecture, image_url,
   main_produce, characteristics, items, note, sort_order,
   photo1_url, photo1_caption,
   photo2_url, photo2_caption,
   photo3_url, photo3_caption)
values
  ('01', '高橋 美佳',   'Mika Takahashi',    '北海道', '北海道', 'https://images.unsplash.com/photo-1587810451787-0c58e490080c?auto=format&fit=crop&w=1200&q=80', 'じゃがいも・玉ねぎ・アスパラガス', '十勝の広大な大地と雪解け水が、素材本来の甘みを育てます。', array['じゃがいも','玉ねぎ','アスパラガス'], '十勝の大地で、素材の旨みを引き出す根菜作り。雪解け水が甘みをひきたてます。', 10, 'https://images.unsplash.com/photo-1764587492501-bf8b61c09792?auto=format&fit=crop&w=900&q=80', '収穫期のじゃがいも畑。', 'https://images.unsplash.com/photo-1656486081163-a77f720a2789?auto=format&fit=crop&w=900&q=80', '澄んだ空気と北海道の農地。', 'https://images.unsplash.com/photo-1526678114169-b276d04ee180?auto=format&fit=crop&w=900&q=80', '朝採りのアスパラガス。'),
  ('02', '木村 誠',     'Makoto Kimura',     '東北', '青森県', 'https://images.unsplash.com/photo-1760243875549-d49e7a1b3281?auto=format&fit=crop&w=1200&q=80', 'りんご・長芋・にんにく', '津軽の寒暖差が育む、濃厚な旨みと歯ごたえ。', array['りんご','長芋','にんにく'], '岩木山を望む農園で、津軽の名産を自然栽培で育てています。', 20, 'https://images.unsplash.com/photo-1745962417587-365bef211257?auto=format&fit=crop&w=900&q=80', 'たわわに実るふじりんご。', 'https://images.unsplash.com/photo-1600917000152-ff5d44a22c2e?auto=format&fit=crop&w=900&q=80', '収穫期のりんご園。', 'https://images.unsplash.com/photo-1471512175124-9790649b4143?auto=format&fit=crop&w=900&q=80', '青森産にんにくの収穫。'),
  ('03', '佐々木 翔',   'Sho Sasaki',        '東北', '秋田県', 'https://images.unsplash.com/photo-1559439080-b6037bc5f8fb?auto=format&fit=crop&w=1200&q=80', 'あきたこまち・枝豆・じゅんさい', '田んぼの水が澄み、米も野菜も雑味なく甘く育ちます。', array['枝豆','じゅんさい','あきたこまち'], '清流と雪解け水に育まれた秋田の農産物を、丁寧に出荷しています。', 30, 'https://images.unsplash.com/photo-1773393878458-e793434a80cc?auto=format&fit=crop&w=900&q=80', '棚田の稲刈り風景。', 'https://images.unsplash.com/photo-1649257171206-37625b1f3b2f?auto=format&fit=crop&w=900&q=80', '早朝の枝豆収穫。', 'https://images.unsplash.com/photo-1623078788671-f168da577997?auto=format&fit=crop&w=900&q=80', '清流に育む里山の風景。'),
  ('04', '田中 健一',   'Kenichi Tanaka',    '関東', '茨城県', 'https://images.unsplash.com/photo-1761839257946-4616bcfafec7?auto=format&fit=crop&w=1200&q=80', '小松菜・ほうれん草・水菜', '無化学肥料30年。土づくりから徹底した葉物野菜の名手。', array['小松菜','ほうれん草','水菜'], '土づくりからこだわった、葉物野菜の名手。無化学肥料で30年。', 40, 'https://images.unsplash.com/photo-1578283343206-3f7a1d347581?auto=format&fit=crop&w=900&q=80', 'みずみずしい小松菜の栽培。', 'https://images.unsplash.com/photo-1515363578674-99f41329ab4c?auto=format&fit=crop&w=900&q=80', '有機栽培の葉物野菜。', 'https://images.unsplash.com/photo-1547058606-7eb25508e7e0?auto=format&fit=crop&w=900&q=80', '早朝の収穫風景。'),
  ('05', '鈴木 一郎',   'Ichiro Suzuki',     '関東', '千葉県', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=1200&q=80', '人参・じゃがいも・大根', '海風と砂地がつくる、独特の食感と自然な甘み。', array['人参','じゃがいも','大根'], '甘みのある根菜を、丁寧に育てています。海風と砂地がつくる、独特の食感。', 50, 'https://images.unsplash.com/photo-1594400315019-a03cc9acb85a?auto=format&fit=crop&w=900&q=80', '鮮やかなオレンジの人参。', 'https://images.unsplash.com/photo-1563012678-bdfec255931b?auto=format&fit=crop&w=900&q=80', '砂地でのびのび育つじゃがいも。', 'https://images.unsplash.com/photo-1478900160460-2bfa23c92a4a?auto=format&fit=crop&w=900&q=80', '収穫したての大根。'),
  ('06', '渡辺 浩司',   'Koji Watanabe',     '中部', '長野県', 'https://images.unsplash.com/photo-1541046469329-51deaf7358e8?auto=format&fit=crop&w=1200&q=80', 'レタス・セロリ・ブロッコリー', '標高1,000mの高原で育つ、シャキッと歯ごたえのある高原野菜。', array['レタス','セロリ','ブロッコリー'], '標高1,000mの高原で育つ、シャキシャキ野菜。朝霧が旨みを閉じ込めます。', 60, 'https://images.unsplash.com/photo-1528607950896-30d92379b592?auto=format&fit=crop&w=900&q=80', '朝霧に包まれる高原畑のレタス。', 'https://images.unsplash.com/photo-1689666190477-259395cd4f21?auto=format&fit=crop&w=900&q=80', '収穫直後のブロッコリー。', 'https://images.unsplash.com/photo-1578283343206-3f7a1d347581?auto=format&fit=crop&w=900&q=80', '高原畑の葉物野菜。'),
  ('07', '小林 友里',   'Yuri Kobayashi',    '中部', '静岡県', 'https://images.unsplash.com/photo-1751203658229-1cfd3b20ec05?auto=format&fit=crop&w=1200&q=80', 'みつば・わさび菜・クレソン', '富士山の湧水で育つ、香り豊かな葉物野菜。', array['みつば','わさび菜','クレソン'], '富士山の湧水で育む、香り豊かな葉物。料亭からの指名も多い、若手の注目農家。', 70, 'https://images.unsplash.com/photo-1755384866790-60200f33e55f?auto=format&fit=crop&w=900&q=80', '富士山の湧水で育つわさび菜。', 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=80', '富士山を望む静岡の畑。', 'https://images.unsplash.com/photo-1582745741856-1a5d68158ba3?auto=format&fit=crop&w=900&q=80', '摘みたてのクレソン。'),
  ('08', '山本 真由美', 'Mayumi Yamamoto',   '関西', '京都府', 'https://images.unsplash.com/photo-1752724411531-4588050c2e22?auto=format&fit=crop&w=1200&q=80', '京野菜・九条ねぎ・聖護院かぶ', '祖父の代から受け継ぐ畑で、京の伝統野菜を現代へ。', array['京野菜','九条ねぎ','聖護院かぶ'], '京の伝統野菜を、現代の食卓へ。祖父の代から受け継ぐ畑で育てています。', 80, 'https://images.unsplash.com/photo-1737507844233-9bad00475be8?auto=format&fit=crop&w=900&q=80', '九条ねぎの畝（緑鮮やかな春ネギ）。', 'https://images.unsplash.com/photo-1559836833-2a2c99b1f54f?auto=format&fit=crop&w=900&q=80', '収穫した九条ねぎ。', 'https://images.unsplash.com/photo-1760706950806-ee006a4a5427?auto=format&fit=crop&w=900&q=80', '京都の里山風景（秋のコスモスと山並み）。'),
  ('09', '伊藤 大輔',   'Daisuke Ito',       '関西', '兵庫県', 'https://images.unsplash.com/photo-1760549255949-767d18981890?auto=format&fit=crop&w=1200&q=80', '淡路玉ねぎ', '三年がかりの土づくりで生まれる、生で食べられる極甘玉ねぎ。', array['玉ねぎ'], '三年がかりの土づくりが育む、極甘の淡路玉ねぎ。生でかじれる、と評判です。', 90, 'https://images.unsplash.com/photo-1760627587430-cd25f0b2d7a5?auto=format&fit=crop&w=900&q=80', '収穫後に干された淡路玉ねぎ。', 'https://images.unsplash.com/photo-1570980457205-f54f8167650b?auto=format&fit=crop&w=900&q=80', '収穫かごの玉ねぎ。', 'https://images.unsplash.com/photo-1699031847231-fda6325b2363?auto=format&fit=crop&w=900&q=80', '淡路島の瀬戸内海と船。'),
  ('10', '岡田 優子',   'Yuko Okada',        '中国・四国', '広島県', 'https://images.unsplash.com/photo-1726537625265-886486fe2827?auto=format&fit=crop&w=1200&q=80', 'レモン・ブロッコリー・キャベツ', '瀬戸内海の陽光と潮風が、爽やかな柑橘と甘い葉物を育てます。', array['レモン','ブロッコリー','キャベツ'], '瀬戸内の温暖な気候を活かした、環境に優しい農業を実践しています。', 100, 'https://images.unsplash.com/photo-1670625940495-901694675a2b?auto=format&fit=crop&w=900&q=80', 'レモンの木に実るフレッシュレモン。', 'https://images.unsplash.com/photo-1761772310837-323c7aece269?auto=format&fit=crop&w=900&q=80', '熟したレモンが鈴なりのレモン畑。', 'https://images.unsplash.com/photo-1699031847231-fda6325b2363?auto=format&fit=crop&w=900&q=80', '瀬戸内海の島々と海。'),
  ('11', '松本 拓也',   'Takuya Matsumoto',  '中国・四国', '高知県', 'https://images.unsplash.com/photo-1714070705532-3f81f7733a1b?auto=format&fit=crop&w=1200&q=80', 'なす・ピーマン・ししとう', '太陽の恵みをたっぷり浴びた、ハリのある夏野菜。', array['なす','ピーマン','ししとう'], '年間を通して温暖な高知で、太陽の恵みをそのままに出荷します。', 110, 'https://images.unsplash.com/photo-1604488943825-f95dc6796ca5?auto=format&fit=crop&w=900&q=80', '艶やかなピーマン・ししとう。', 'https://images.unsplash.com/photo-1643711038299-3a4588e2264f?auto=format&fit=crop&w=900&q=80', 'ハウス内の整然とした緑の野菜。', 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=900&q=80', '彩り豊かなパプリカ・ピーマン。'),
  ('12', '佐藤 みどり', 'Midori Sato',       '九州・沖縄', '熊本県', 'https://images.unsplash.com/photo-1762512217552-653d0eab7a18?auto=format&fit=crop&w=1200&q=80', 'ミニトマト・中玉トマト', '糖度は常に8度以上。阿蘇の伏流水が甘みを引き出します。', array['ミニトマト','中玉トマト'], '甘みと酸味のバランスにこだわる、トマト専業農家。糖度は常に8度以上。', 120, 'https://images.unsplash.com/photo-1776222075107-235373ff809d?auto=format&fit=crop&w=900&q=80', 'ミニトマトの房。', 'https://images.unsplash.com/photo-1683008952458-dc02ac67f382?auto=format&fit=crop&w=900&q=80', 'ハウスのトマト栽培。', 'https://images.unsplash.com/photo-1686278895718-26a2331d7297?auto=format&fit=crop&w=900&q=80', '完熟トマトのたわわな収穫。'),
  ('13', '中村 剛',     'Tsuyoshi Nakamura', '九州・沖縄', '鹿児島県', 'https://images.unsplash.com/photo-1600506443328-39120935a68a?auto=format&fit=crop&w=1200&q=80', 'さつまいも・大根', '黒土と潮風が育てる、ほくほく食感と辛味のバランス。', array['さつまいも','大根'], '黒土と潮風が生む、ほくほくのさつまいもと、辛味ある桜島大根。', 130, 'https://images.unsplash.com/photo-1570723735746-c9bd51bd7c40?auto=format&fit=crop&w=900&q=80', '掘りたてのさつまいも。', 'https://images.unsplash.com/photo-1673533537845-7f7498faf85f?auto=format&fit=crop&w=900&q=80', '収穫かごのさつまいも。', 'https://images.unsplash.com/photo-1626548752000-afb81286797e?auto=format&fit=crop&w=900&q=80', '桜島火山のシルエット（鹿児島のシンボル）。'),
  ('14', '吉田 亜希',   'Aki Yoshida',       '九州・沖縄', '沖縄県', 'https://images.unsplash.com/photo-1607909572148-533d0fbd6f89?auto=format&fit=crop&w=1200&q=80', 'ゴーヤ・ハンダマ・島らっきょう', '琉球野菜を次世代へ。年中出荷できる、沖縄ならではの強み。', array['ゴーヤ','ハンダマ','島らっきょう'], '琉球野菜を受け継ぎ、未来へつなぐ。年中出荷できるのが沖縄の強み。', 140, 'https://images.unsplash.com/photo-1766714534617-b3cffc7f9085?auto=format&fit=crop&w=900&q=80', 'つややかなゴーヤ（沖縄産苦瓜）。', 'https://images.unsplash.com/photo-1764415438484-b5b28e5234be?auto=format&fit=crop&w=900&q=80', 'ゴーヤの蔓。', 'https://images.unsplash.com/photo-1649290927725-129d71e65094?auto=format&fit=crop&w=900&q=80', '沖縄の海岸風景。')
on conflict do nothing;

insert into public.news (date, category, category_ja, title, body, published, sort_order) values
  ('2026.04.22', 'Shipping', '出荷情報', '春キャベツ・新玉ねぎの出荷ピークを迎えました。', '関東・淡路島産地より、甘みの乗った春キャベツと新玉ねぎの出荷量が最大となっております。業務向け大口のご注文は、お早めに営業担当までご連絡ください。', true, 10),
  ('2026.04.18', 'Producer', '生産者', '広島県・岡田農園が協力ネットワークに加わりました。', '瀬戸内の温暖な気候を活かしたレモン・ブロッコリー・キャベツの通年安定供給が可能となりました。柑橘系を中心にメニュー開発中の飲食店様にお薦めです。', true, 20),
  ('2026.04.15', 'Shipping', '出荷情報', '春野菜の出荷が本格スタート。グリーンリーフ・水菜の安定供給を開始しました。', '4月に入り、関東・東北エリアの春野菜の出荷が本格化しました。本年もグリーンリーフ・水菜・小松菜を中心に、安定した供給体制を整えてまいります。', true, 30),
  ('2026.04.10', 'Notice', 'お知らせ', 'GW期間中 (5月3日〜5日) の物流スケジュールについて。', '誠に勝手ながら、GW期間中は一部配送便の運行を変更いたします。5月3日(日)〜5日(火)は休配となります。受注締切は5月2日(土)17時まで。', true, 40),
  ('2026.04.05', 'Company', '会社情報', '川口センターに冷蔵保管庫を増設いたしました。', '夏場の需要増に備え、川口物流センターの冷蔵保管スペースを約1.4倍に拡張しました。これにより、多品目の同時受注にも余裕をもって対応いたします。', true, 50),
  ('2026.04.01', 'Notice', 'お知らせ', '新年度のご挨拶 ― 本年も生産者と取引先の皆さまの架け橋として尽力します。', '平素より格別のお引き立てを賜り、厚く御礼申し上げます。本年度も、全国の生産者の皆さまと取引先の皆さまをまっすぐつなぐ架け橋として、誠心誠意取り組んでまいります。', true, 60),
  ('2026.03.28', 'Shipping', '出荷情報', '春の山菜フェア (たらの芽・こごみ・ふきのとう) 受付を開始しました。', '東北産地より、摘みたての春の山菜をお届けします。数量限定・期間限定となりますので、メニューに取り入れたい飲食店様はお早めにご相談ください。', true, 70),
  ('2026.03.25', 'Producer', '生産者', '京都・山本農園との新パートナーシップを締結しました。', '長年京野菜の生産に携わる山本農園さまと、通年での供給契約を新たに締結いたしました。九条ねぎ・聖護院かぶなど、京の伝統野菜を安定してお届けいたします。', true, 80),
  ('2026.03.20', 'Company', '会社情報', '川口センターの営業時間変更について (4月1日より)。', '2026年4月1日より、川口センターの営業時間を下記のとおり変更いたします。平日: 6:00 – 17:00 / 土曜: 7:00 – 15:00。ご不便をおかけしますが、何卒ご理解のほどよろしくお願い申し上げます。', true, 90),
  ('2026.03.15', 'Shipping', '出荷情報', '寒締めほうれん草の出荷が最終週となります。', '冷気で糖度を高めた寒締めほうれん草、いよいよ今季最終週のご案内です。ご希望の店舗様は営業担当までご連絡ください。', true, 100),
  ('2026.03.10', 'Notice', 'お知らせ', '請求書フォーマットを一部変更いたします (4月分より)。', 'インボイス対応のため、4月分のご請求書より記載項目を一部変更いたします。経理ご担当者様にご確認のうえ、お早めにシステム側の設定変更をお願いいたします。', true, 110),
  ('2026.03.05', 'Producer', '生産者', '熊本県・佐藤農園が協力ネットワークに加わりました。', '熊本県で代々トマト栽培に取り組んでいらっしゃる佐藤農園さまが、当社の協力農家ネットワークに加わりました。3月下旬より中玉トマト・ミニトマトの出荷を予定しております。', true, 120),
  ('2026.02.28', 'Shipping', '出荷情報', 'いちごの出荷量が例年の1.3倍に伸びています。', '今季は天候に恵まれ、熊本・静岡産地のいちご出荷が好調に推移しています。パティシエさま向けの特選パックもご用意しておりますので、ぜひご相談ください。', true, 130),
  ('2026.02.22', 'Company', '会社情報', 'SDGs報告書2025を公開いたしました。', '昨年度の食品ロス削減実績、トラック輸送のCO2削減への取組みなどをまとめた報告書を公開いたしました。本サイトの「会社情報」ページよりご覧いただけます。', true, 140),
  ('2026.02.18', 'Shipping', '出荷情報', '寒波の影響による葉物野菜の出荷状況について。', '2月中旬の寒波により、一部の産地における葉物野菜の出荷に遅れが発生しております。影響を受けるお客様には個別にご連絡を差し上げておりますが、ご不明点は営業担当までお問い合わせください。', true, 150),
  ('2026.02.14', 'Notice', 'お知らせ', 'WEB受注システムを5月よりリニューアルいたします。', '現行のFAX・電話受注に加え、より使いやすいWEB受注システムを5月に公開予定です。既存のお客様には個別にログイン情報をご案内いたします。', true, 160),
  ('2026.02.05', 'Notice', 'お知らせ', '決算期休業のお知らせ (3月28日〜30日)。', '誠に勝手ながら、決算業務のため 3月28日(土)〜30日(月) を臨時休業とさせていただきます。休業期間中のご注文は4月1日以降、順次対応いたします。', true, 170),
  ('2026.02.01', 'Producer', '生産者', '長野・渡辺農園の冬レタス出荷が最終段階に入りました。', '標高1,000mの高原で育てた冬レタスは今月末で出荷終了となります。シャキッとした食感で飲食店様より高評価をいただいた今季、誠にありがとうございました。', true, 180),
  ('2026.01.25', 'Company', '会社情報', 'ISO22000食品安全マネジメント認証を更新いたしました。', '川口センターにおけるISO22000認証を昨年に引き続き更新いたしました。今後も食品安全の徹底と品質管理に努めてまいります。', true, 190),
  ('2026.01.20', 'Notice', 'お知らせ', 'WEBサイトをリニューアルいたしました。', 'このたび、当社の公式ウェブサイトを全面的にリニューアルいたしました。生産者紹介や取扱品目のページを拡充し、より分かりやすい構成に改めております。今後とも、どうぞよろしくお願い申し上げます。', true, 200),
  ('2026.01.15', 'Shipping', '出荷情報', '冬の根菜 (大根・人参・じゃがいも) 特選便、受付中です。', '北海道・千葉・青森産地より、冬の根菜三点セットを特選便でお届けしています。スープ・煮込み料理のメニュー展開にぜひご活用ください。', true, 210),
  ('2026.01.10', 'Company', '会社情報', '新年のご挨拶 ― 2026年も、日本の農業に愛を込めて。', '旧年中は格別のご高配を賜り、誠にありがとうございました。本年も全国の生産者の皆さまと、お客様のお役に立てるよう精進してまいります。', true, 220),
  ('2026.01.05', 'Producer', '生産者', '沖縄・吉田農園の島野菜フェアを1月下旬から開催します。', 'ハンダマ・島らっきょう・ナーベラーなど、飲食店メニューを彩る沖縄の島野菜を一挙にご紹介。詳細は営業担当までお問い合わせください。', true, 230),
  ('2025.12.28', 'Notice', 'お知らせ', '年末年始休業のお知らせ (12月30日〜1月4日)。', '誠に勝手ながら、12月30日(火)〜1月4日(日)を年末年始休業とさせていただきます。年明けは1月5日(月)より順次出荷を再開いたします。', true, 240),
  ('2025.12.22', 'Shipping', '出荷情報', '冬季限定「雪下人参」の受付を開始しました。', '北海道・十勝から、雪の下で熟成させた糖度10度超の人参をお届けします。年内の出荷分は限定数となります。お早めにお問い合わせください。', true, 250),
  ('2025.12.15', 'Producer', '生産者', '広島・岡田農園のレモン出荷が最盛期に入りました。', '瀬戸内の温暖な気候が育てた香り高いレモンを、業務用のスライス・ホール両方でご用意しております。カクテル・ドレッシング用途に最適です。', true, 260),
  ('2025.12.05', 'Shipping', '出荷情報', '年末年始向け、大口注文の締切は12月22日です。', '年末年始の営業に向けた大口のご注文は、12月22日(月)の17時までにいただければ、年内最終便に確実にお乗せいたします。', true, 270),
  ('2025.11.25', 'Company', '会社情報', '大阪にサテライトオフィスを開設いたしました。', '関西圏のお客様対応を強化するため、大阪市中央区にサテライトオフィスを開設いたしました。訪問・商談のご希望は関西営業担当までお気軽にご連絡ください。', true, 280),
  ('2025.11.15', 'Producer', '生産者', '沖縄・吉田農園の島野菜ラインナップが拡充されました。', 'ハンダマ・島らっきょう・ナーベラーなど、沖縄ならではの島野菜の通年出荷が可能になりました。飲食店の皆さまからのご要望にお応えしてまいります。', true, 290),
  ('2025.11.05', 'Shipping', '出荷情報', '新米「あきたこまち」入荷しました。', '秋田・佐々木農園より、2025年度産の新米あきたこまちが入荷しました。ご飯と相性の良い漬物野菜などと合わせたご提案も可能です。', true, 300),
  ('2025.10.20', 'Notice', 'お知らせ', 'ハロウィン向けかぼちゃの特別価格ご案内。', '北海道産の大玉かぼちゃを、ハロウィンディスプレイ向けに特別価格でご提供いたします。10月25日までのご注文が対象です。', true, 310),
  ('2025.10.10', 'Shipping', '出荷情報', '秋の根菜出荷、本格始動。', '北海道・長野・茨城より、秋の旬を迎えた根菜類の出荷が始まりました。糖度の高い人参・玉ねぎ・じゃがいもを、産地直送でお届けします。', true, 320)
on conflict do nothing;

-- =============================================================
-- 3) create-admin.sql
-- =============================================================

do $$
declare
  v_email    text := 'admin@gmail.com';
  v_password text := 'Admin@gmail.com';
  v_user_id  uuid;
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, email_change, email_change_token_new, recovery_token,
      is_super_admin, is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated', 'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', '',
      false, false
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      jsonb_build_object(
        'sub', v_user_id::text,
        'email', v_email,
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      v_user_id::text,
      now(), now(), now()
    );
  else
    update auth.users
    set encrypted_password   = crypt(v_password, gen_salt('bf')),
        email_confirmed_at   = coalesce(email_confirmed_at, now()),
        updated_at           = now()
    where id = v_user_id;
  end if;

  insert into public.admins (user_id, email)
  values (v_user_id, v_email)
  on conflict (user_id) do update set email = excluded.email;
end
$$;
