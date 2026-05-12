// One-off: copy, resize, and recompress photos from 写真素材WH into src/assets/.
// Run once with: node scripts/process-source-photos.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "写真素材WH");
const OUT = resolve(ROOT, "src/assets");

const jobs = [
  // ── Hero & key landscapes ─────────────────────────────────────────────
  { src: "カネヒデ/2012101213490000.jpg", out: "hero-farm.jpg", width: 2200, height: null, quality: 78 },
  { src: "三好写真/えもい.JPG", out: "vegetables.jpg", width: 1200, height: 1500, quality: 80, fit: "cover" },
  { src: "ポテトかいつか/DSC00433.JPG", out: "quality-check.jpg", width: 2000, height: null, quality: 78 },
  { src: "三好写真/社員写真.jpg", out: "farmer-hands.jpg", width: 1800, height: null, quality: 80 },

  // ── Producer cards (3:4 portrait) ─────────────────────────────────────
  { src: "グリーンエース/DSC00907.JPG", out: "producer-1.jpg", width: 900, height: 1200, quality: 80, fit: "cover" },
  { src: "内田農園/2013-10-24 16.41.17.jpg", out: "producer-2.jpg", width: 900, height: 1200, quality: 80, fit: "cover" },
  { src: "カネヒデ/2012101213500001.jpg", out: "producer-3.jpg", width: 900, height: 1200, quality: 80, fit: "cover" },

  // ── Produce gallery tiles (square) ────────────────────────────────────
  { src: "三好写真/ミニトマト原料.JPG", out: "produce-tomato.jpg", width: 900, height: 900, quality: 80, fit: "cover" },
  { src: "三好写真/大葉原料.JPG", out: "produce-shiso.jpg", width: 900, height: 900, quality: 80, fit: "cover" },
  { src: "三好写真/胡瓜原料.JPG", out: "produce-cucumber.jpg", width: 900, height: 900, quality: 80, fit: "cover" },
  { src: "ピーマン/S__5029917.jpg", out: "produce-pepper.jpg", width: 900, height: 900, quality: 80, fit: "cover" },
  { src: "カネヒデ/2012101213520001.jpg", out: "produce-lettuce.jpg", width: 900, height: 900, quality: 80, fit: "cover" },
  { src: "24年北海道/DSC00504.JPG", out: "produce-potato.jpg", width: 900, height: 900, quality: 80, fit: "cover" },

  // ── Distribution / warehouse ──────────────────────────────────────────
  { src: "グリーンエース/DSC01689.JPG", out: "warehouse.jpg", width: 1600, height: null, quality: 80 },

  // ── Page hero backdrops (wide landscape) ──────────────────────────────
  { src: "24年北海道/DSC00585.JPG", out: "page-hero-about.jpg", width: 2000, height: null, quality: 78 },
  { src: "ポテトかいつか/DSC00441.JPG", out: "page-hero-services.jpg", width: 2000, height: null, quality: 78 },
  { src: "24年北海道/DSC00565.JPG", out: "page-hero-producers.jpg", width: 2000, height: null, quality: 78 },
  { src: "三好写真/野菜原料.JPG", out: "page-hero-news.jpg", width: 2000, height: null, quality: 78 },
  { src: "グリーンエース/DSC01692.JPG", out: "page-hero-careers.jpg", width: 2000, height: null, quality: 78 },
  { src: "内田農園/2017-07-07 14.40.01.jpg", out: "page-hero-access.jpg", width: 2000, height: null, quality: 78 },

  // ── Strengths cards (square crop, used in circular avatars) ───────────
  { src: "グリーンエース/DSC01690.JPG", out: "strength-supply.jpg", width: 600, height: 600, quality: 82, fit: "cover" },
  { src: "ポテトかいつか/DSC00434.JPG", out: "strength-quality.jpg", width: 600, height: 600, quality: 82, fit: "cover" },
  { src: "三好写真/野菜セット.JPG", out: "strength-pricing.jpg", width: 600, height: 600, quality: 82, fit: "cover" },

  // ── Veggie gallery (replaces FruitGallery — portrait tiles) ───────────
  { src: "大根/DSC01653.JPG", out: "veggie-daikon.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "エアウォーター・パクチー/DSC01008.JPG", out: "veggie-pakuchi.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "千葉/13.jpg", out: "veggie-leafy.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "勝沼とうもろこし/DSC00478.JPG", out: "veggie-corn.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "レインボーフューチャー/ﾚｲﾝﾎﾞｰ春菊.JPG", out: "veggie-shungiku.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "三好写真/ミニトマト1kg-1.JPG", out: "veggie-tomato-pack.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "ポテトかいつか/DSC00440.JPG", out: "veggie-potato-field.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },
  { src: "九州/DSC01834.JPG", out: "veggie-kyushu.jpg", width: 900, height: 1100, quality: 80, fit: "cover" },

  // ── Extra producer / field landscapes ─────────────────────────────────
  { src: "ポテトかいつか/DSC00435.JPG", out: "producer-4.jpg", width: 900, height: 1200, quality: 80, fit: "cover" },
  { src: "エアウォーター・パクチー/DSC01015.JPG", out: "producer-5.jpg", width: 900, height: 1200, quality: 80, fit: "cover" },
  { src: "千葉/IMG_4057.JPG", out: "producer-6.jpg", width: 900, height: 1200, quality: 80, fit: "cover" },
  { src: "24年北海道/DSC00582.JPG", out: "field-hokkaido.jpg", width: 1600, height: null, quality: 80 },
  { src: "大分/IMG_5757.JPG", out: "field-oita.jpg", width: 1600, height: null, quality: 80 },

  // ── Regional fields gallery (4:3 landscape) ───────────────────────────
  { src: "宮城県/IMG_1229.JPG", out: "region-miyagi.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "北海道6.7月/DSCF0853.JPG", out: "region-hokkaido2.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "函館2015/DSC01047.JPG", out: "region-hakodate.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "24年北海道/IMG_3812.JPG", out: "region-hokkaido.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "千葉/IMG_4061.JPG", out: "region-chiba.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "九州/DSC01840.JPG", out: "region-kyushu-field.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "大分/IMG_5778.JPG", out: "region-oita-field.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },
  { src: "勝沼とうもろこし/DSC00481.JPG", out: "region-katsunuma.jpg", width: 1200, height: 900, quality: 80, fit: "cover" },

  // ── Solutions cards (16:10 landscape, used as side images) ────────────
  { src: "グリーンエース/DSC01693.JPG", out: "solution-supply.jpg", width: 1000, height: 700, quality: 80, fit: "cover" },
  { src: "ポテトかいつか/DSC00437.JPG", out: "solution-processing.jpg", width: 1000, height: 700, quality: 80, fit: "cover" },
  { src: "カネヒデ/2012101213540001.jpg", out: "solution-pricing.jpg", width: 1000, height: 1334, quality: 80, fit: "cover" },

  // ── Careers & About supporting bands ──────────────────────────────────
  { src: "グリーンエース/IMG_5450.JPG", out: "careers-team.jpg", width: 1600, height: 900, quality: 80, fit: "cover" },
  { src: "内田農園/2018-04-13 16.42.42.jpg", out: "careers-field.jpg", width: 1600, height: 900, quality: 80, fit: "cover" },
  { src: "105MSDCF - コピー/DSC01825.JPG", out: "about-greenhouse.jpg", width: 1600, height: 900, quality: 80, fit: "cover" },
  { src: "内田農園/2020-05-13 14.22.52.jpg", out: "about-harvest.jpg", width: 1600, height: 900, quality: 80, fit: "cover" },
  { src: "三好写真/608928873543368740.jpg", out: "about-mixed.jpg", width: 800, height: 1100, quality: 80, fit: "cover" },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const inPath = resolve(SRC, job.src);
  const outPath = resolve(OUT, job.out);
  const buf = await readFile(inPath);
  let pipeline = sharp(buf).rotate(); // honor EXIF orientation
  pipeline = pipeline.resize({
    width: job.width,
    height: job.height ?? undefined,
    fit: job.fit ?? "inside",
    withoutEnlargement: true,
  });
  const out = await pipeline
    .jpeg({ quality: job.quality, mozjpeg: true, progressive: true })
    .toBuffer();
  await writeFile(outPath, out);
  const meta = await sharp(out).metadata();
  console.log(
    `${job.out.padEnd(28)} ${meta.width}x${meta.height}  ${(out.length / 1024).toFixed(0)} KB`,
  );
}
