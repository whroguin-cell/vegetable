/**
 * One-shot maintenance script.
 *
 * Downloads stock photos of each product from Unsplash and uploads them to the
 * Supabase Storage bucket `media` under `products/<slug>.jpg`. Prints the
 * resulting public URLs so they can be referenced from the frontend.
 *
 * Run with:
 *   node scripts/upload-product-photos.mjs
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

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const STRENGTH_PHOTOS = {
  // Section: Strengths (services page) — replace lucide icons with Japanese fruit photos.
  "stable-supply":  "https://images.unsplash.com/photo-1497587285970-432d79cee5f3?auto=format&fit=crop&w=600&q=80", // Nashi pear
  "quality-control": "https://images.unsplash.com/photo-1613011392704-f8da2f20794a?auto=format&fit=crop&w=600&q=80", // Peach (momo)
  "fair-pricing":   "https://images.unsplash.com/photo-1674942315891-0fd4abf58251?auto=format&fit=crop&w=600&q=80", // Mikan (mandarin)
};

const PRODUCT_PHOTOS = {
  "Green Leaf":  "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80",
  "Mizuna":      "https://images.unsplash.com/photo-1576181256399-834e3b3a49bf?auto=format&fit=crop&w=800&q=80",
  "Mini Tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "Red Radish":  "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=800&q=80",
  "Carrot":      "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80",
  "Naga-negi":   "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  "Lettuce":     "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?auto=format&fit=crop&w=800&q=80",
  "Komatsuna":   "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
  "Potato":      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  "Onion":       "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
  "Spinach":     "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "Cabbage":     "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=800&q=80",
  "Hakusai":     "https://images.unsplash.com/photo-1693500383614-5c8ce8a3075c?auto=format&fit=crop&w=800&q=80",
  "Broccoli":    "https://images.unsplash.com/photo-1614336215203-05a588f74627?auto=format&fit=crop&w=800&q=80",
  "Daikon":      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
  "Cucumber":    "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
};

const slugify = (en) => en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function uploadOne(folder, key, sourceUrl) {
  const slug = folder === "products" ? slugify(key) : key;
  const objectPath = `${folder}/${slug}.jpg`;
  console.log(`→ ${folder}/${key}: fetching ${sourceUrl}`);
  const resp = await fetch(sourceUrl);
  if (!resp.ok) throw new Error(`Fetch failed for ${key}: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  const { error } = await supabase.storage
    .from("media")
    .upload(objectPath, buf, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(objectPath);
  console.log(`   uploaded → ${data.publicUrl}`);
  return [key, data.publicUrl];
}

async function main() {
  const products = {};
  for (const [en, url] of Object.entries(PRODUCT_PHOTOS)) {
    const [name, publicUrl] = await uploadOne("products", en, url);
    products[name] = publicUrl;
  }
  const strengths = {};
  for (const [key, url] of Object.entries(STRENGTH_PHOTOS)) {
    const [name, publicUrl] = await uploadOne("strengths", key, url);
    strengths[name] = publicUrl;
  }
  console.log("\n--- products map ---");
  for (const [k, v] of Object.entries(products)) console.log(`  ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
  console.log("\n--- strengths map ---");
  for (const [k, v] of Object.entries(strengths)) console.log(`  ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
