import { NextResponse } from "next/server";
import { supabaseAdmin, withAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";

export const POST = withAdmin(async (request) => {
  let body: { paths?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const paths = Array.isArray(body.paths)
    ? body.paths.filter((p): p is string => typeof p === "string" && p.length > 0)
    : [];
  if (paths.length === 0) {
    return NextResponse.json({ error: "No paths provided." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).remove(paths);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ removed: data ?? [] });
});
