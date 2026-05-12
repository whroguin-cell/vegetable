// Server-only Supabase client using the service-role key.
// NEVER import this from a "use client" file or component.
// Used by /app/api/admin/** routes after the caller's bearer token has been
// verified to belong to a user listed in public.admins.

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase-admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY — admin storage routes will fail.",
  );
}

export const supabaseAdmin = createClient<Database>(
  url ?? "https://placeholder.supabase.co",
  serviceKey ?? "placeholder-service-key",
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);

export type AdminCtx = { userId: string; email: string };

/**
 * Wraps an admin route handler with bearer-token validation against
 * public.admins. Returns 401/403 NextResponse if unauthorized.
 *
 * Usage:
 *   export const POST = withAdmin(async (req, { userId }) => { ... });
 */
export function withAdmin(
  handler: (request: Request, ctx: AdminCtx) => Promise<Response> | Response,
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const authHeader =
      request.headers.get("authorization") || request.headers.get("Authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json({ error: "Missing bearer token." }, { status: 401 });
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
      return NextResponse.json({ error: "Empty bearer token." }, { status: 401 });
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }
    const user = userData.user;

    const { data: adminRow, error: adminErr } = await supabaseAdmin
      .from("admins")
      .select("user_id, email")
      .eq("user_id", user.id)
      .maybeSingle();
    if (adminErr) {
      return NextResponse.json({ error: adminErr.message }, { status: 500 });
    }
    if (!adminRow) {
      return NextResponse.json({ error: "Forbidden — not an admin." }, { status: 403 });
    }

    return handler(request, { userId: user.id, email: user.email || "" });
  };
}
