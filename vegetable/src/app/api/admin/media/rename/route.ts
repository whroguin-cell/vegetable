import { NextResponse } from "next/server";
import { supabaseAdmin, withAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";

function sanitizePath(p: string) {
  return p.replace(/^\/+|\/+$/g, "").replace(/\\+/g, "/").replace(/[^\w./\-]/g, "_");
}

export const POST = withAdmin(async (request) => {
  let body: { from?: unknown; to?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  if (typeof body.from !== "string" || typeof body.to !== "string") {
    return NextResponse.json({ error: "from and to must be strings." }, { status: 400 });
  }

  const from = sanitizePath(body.from);
  const to = sanitizePath(body.to);
  if (!from || !to) {
    return NextResponse.json({ error: "Invalid from/to path." }, { status: 400 });
  }
  if (from === to) {
    return NextResponse.json({ ok: true, path: to });
  }

  const { error } = await supabaseAdmin.storage.from(BUCKET).move(from, to);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(to);
  return NextResponse.json({ ok: true, path: to, url: pub.publicUrl });
});
