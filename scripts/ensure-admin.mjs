/**
 * Ensures the admin login works:
 *   - email:    admin@gmail.com
 *   - password: Admin@gmail.com
 *
 * Idempotent — safe to run repeatedly. On every run it:
 *   1. Looks up the auth user by email.
 *   2. If absent, creates it with email_confirm = true so login works immediately.
 *   3. If present, resets the password to the canonical value and re-confirms email.
 *   4. Inserts (or upserts) the user_id into public.admins so the RLS check passes.
 *
 * Run with:
 *   node scripts/ensure-admin.mjs
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

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@gmail.com";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(email) {
  // listUsers paginates 50 rows at a time. The admin@gmail.com row will land on
  // page 1 in any realistic project, but we still loop to be robust.
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find(
      (u) => (u.email || "").trim().toLowerCase() === email.toLowerCase(),
    );
    if (found) return found;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function ensureAdminsTable(userId, email) {
  // Schema lives in supabase/setup-all.sql. If the table is missing the upsert
  // will fail loud — that's the right signal to run setup-all.sql first.
  const { error } = await supabase
    .from("admins")
    .upsert({ user_id: userId, email }, { onConflict: "user_id" });
  if (error) throw error;
}

async function main() {
  console.log(`→ Ensuring admin user ${ADMIN_EMAIL} …`);
  const existing = await findUserByEmail(ADMIN_EMAIL);

  let userId;
  if (existing) {
    console.log(`  • Found existing user (${existing.id}). Resetting password.`);
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    console.log("  • No existing user. Creating one with email_confirm = true.");
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  }

  console.log("  • Upserting public.admins row.");
  await ensureAdminsTable(userId, ADMIN_EMAIL);

  // Final smoke test — sign in with an anon client to prove the credentials work.
  const anon = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (signInErr) {
    console.error("  ✗ Sign-in smoke test failed:", signInErr.message);
    process.exit(1);
  }
  console.log(`  ✓ Sign-in succeeded for user ${signIn.user.id}.`);
  console.log("\nDone. Admin login is ready:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
}

main().catch((err) => {
  console.error("\n✗ ensure-admin failed:", err.message || err);
  process.exit(1);
});
