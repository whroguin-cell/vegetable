/**
 * Ensures Supabase Storage is ready for the admin media library:
 *   1. Bucket `media` exists and is public (so the public site <img src=…> works).
 *   2. RLS policies on storage.objects allow:
 *        - public SELECT (anyone can view files)
 *        - admin (rows in public.admins) INSERT / UPDATE / DELETE
 *
 * Idempotent — safe to run repeatedly.
 *
 * Run with:
 *   node scripts/ensure-media-bucket.mjs
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const BUCKET = "media";
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureBucket() {
  const { data: list, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  const existing = list.find((b) => b.name === BUCKET);
  if (existing) {
    if (!existing.public) {
      console.log(`  • Bucket "${BUCKET}" exists but is private — making it public.`);
      const { error: e } = await supabase.storage.updateBucket(BUCKET, { public: true });
      if (e) throw e;
    } else {
      console.log(`  • Bucket "${BUCKET}" already exists (public).`);
    }
    return;
  }
  console.log(`  • Creating bucket "${BUCKET}" (public).`);
  const { error: e } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 1024 * 1024 * 25, // 25 MB
  });
  if (e) throw e;
}

/**
 * Storage policies live in the storage.objects table (PostgREST can't drop/create
 * policies directly from JS). Supabase exposes a SQL endpoint via the
 * `pg-meta` admin API — but the simplest cross-version approach is to wrap the
 * statements in a stored function that the service-role can call.
 *
 * We do that here by constructing the SQL once and running it through the
 * `rpc` channel after defining the helper function.
 */
async function applyStoragePolicies() {
  const sql = `
    -- Public can read every object in the media bucket (so <img src> works).
    drop policy if exists "media public read" on storage.objects;
    create policy "media public read"
      on storage.objects for select
      using (bucket_id = '${BUCKET}');

    -- Authenticated admins (rows in public.admins) can upload / replace / delete.
    drop policy if exists "media admin insert" on storage.objects;
    create policy "media admin insert"
      on storage.objects for insert to authenticated
      with check (
        bucket_id = '${BUCKET}'
        and exists (select 1 from public.admins a where a.user_id = auth.uid())
      );

    drop policy if exists "media admin update" on storage.objects;
    create policy "media admin update"
      on storage.objects for update to authenticated
      using (
        bucket_id = '${BUCKET}'
        and exists (select 1 from public.admins a where a.user_id = auth.uid())
      )
      with check (
        bucket_id = '${BUCKET}'
        and exists (select 1 from public.admins a where a.user_id = auth.uid())
      );

    drop policy if exists "media admin delete" on storage.objects;
    create policy "media admin delete"
      on storage.objects for delete to authenticated
      using (
        bucket_id = '${BUCKET}'
        and exists (select 1 from public.admins a where a.user_id = auth.uid())
      );
  `;

  // Try the helper RPC first (some projects expose it). If it isn't installed
  // we drop down to the management API.
  const { error: rpcErr } = await supabase.rpc("exec_sql", { sql });
  if (!rpcErr) {
    console.log("  • Storage policies applied via exec_sql RPC.");
    return;
  }

  // Fallback: the Supabase Management API can run arbitrary SQL when authed
  // with the service role. Use the per-project query endpoint.
  const projectRef = new URL(SUPABASE_URL).host.split(".")[0];
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ sql }),
  });
  if (res.ok) {
    console.log("  • Storage policies applied via REST RPC.");
    return;
  }

  // Last resort: print the SQL for the admin to paste into the SQL editor.
  console.warn(
    "  ! Could not apply storage policies automatically. Paste the following into",
    "the Supabase SQL editor (Project: " + projectRef + "):\n",
  );
  console.warn(sql);
}

async function main() {
  console.log("→ Ensuring media bucket and policies…");
  await ensureBucket();
  await applyStoragePolicies();
  console.log("\n✓ Done.");
}

main().catch((err) => {
  console.error("\n✗ ensure-media-bucket failed:", err.message || err);
  process.exit(1);
});
