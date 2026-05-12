/**
 * One-shot import: pulls every external image URL currently referenced by the
 * site (producers + news placeholders + strengths/products supabase seeds)
 * into the `media` Supabase Storage bucket so they show up in the admin
 * Media Library and are no longer reliant on third-party hosting.
 *
 * Producer rows are then UPDATED to point at the new in-bucket URLs.
 *
 * Idempotent — files are deduped by URL hash; rows aren't updated if they
 * already use the bucket. Safe to re-run.
 *
 * Run with:
 *   node scripts/import-site-images-to-media.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.
 */

import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const BUCKET = "media";
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PUBLIC_PREFIX = `${SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/${BUCKET}/`;

const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

function safeBase(name) {
  return (name || "")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
}

function baseFromUrl(url) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop() || "image";
    const dot = last.lastIndexOf(".");
    return dot > 0 ? last.slice(0, dot) : last;
  } catch {
    return "image";
  }
}

async function importOne(url, folder) {
  if (!url) return null;
  if (url.startsWith(PUBLIC_PREFIX)) return url; // already in bucket

  const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
  const baseName = safeBase(baseFromUrl(url)) || "image";

  // Check if already imported (any file matching the hash suffix in folder).
  const { data: list, error: listErr } = await supabase.storage
    .from(BUCKET)
    .list(folder, { limit: 200, search: hash });
  if (listErr) throw listErr;
  const existing = list?.find((f) => f.name.includes(hash));
  if (existing) {
    const path = `${folder}/${existing.name}`;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return pub.publicUrl;
  }

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.warn(`  ! ${url} → ${res.status}, skipped`);
    return null;
  }
  const mime = (res.headers.get("content-type") || "").split(";")[0].trim() || "image/jpeg";
  const ext = EXT_BY_MIME[mime] || "jpg";
  const finalName = `${baseName}-${hash}.${ext}`;
  const path = `${folder}/${finalName}`;

  const buf = Buffer.from(await res.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: mime, upsert: true });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return pub.publicUrl;
}

async function main() {
  console.log("→ Loading producers from DB…");
  const { data: producers, error } = await supabase
    .from("producers")
    .select("id, name, image_url, photo1_url, photo2_url, photo3_url");
  if (error) throw error;
  console.log(`  • ${producers.length} producers found.`);

  let importedCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;

  for (const p of producers) {
    const updates = {};
    for (const key of ["image_url", "photo1_url", "photo2_url", "photo3_url"]) {
      const orig = p[key];
      if (!orig) continue;
      if (orig.startsWith(PUBLIC_PREFIX)) {
        skippedCount++;
        continue;
      }
      try {
        const newUrl = await importOne(orig, "producers");
        if (newUrl && newUrl !== orig) {
          updates[key] = newUrl;
          importedCount++;
        }
      } catch (err) {
        console.warn(`  ! ${p.name} ${key}: ${err.message}`);
      }
    }
    if (Object.keys(updates).length > 0) {
      const { error: upErr } = await supabase.from("producers").update(updates).eq("id", p.id);
      if (upErr) {
        console.warn(`  ! Update failed for ${p.name}: ${upErr.message}`);
      } else {
        updatedCount++;
        console.log(`  ✓ ${p.name}: ${Object.keys(updates).join(", ")}`);
      }
    }
  }

  console.log(`\n✓ Done. Imported ${importedCount} files, updated ${updatedCount} producer rows, skipped ${skippedCount} already-bucket URLs.`);
}

main().catch((err) => {
  console.error("\n✗ import-site-images-to-media failed:", err.message || err);
  process.exit(1);
});
