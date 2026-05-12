import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin, withAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";
const MAX_BYTES = 25 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "font/woff": "woff",
  "font/woff2": "woff2",
  "font/ttf": "ttf",
  "font/otf": "otf",
  "application/font-woff": "woff",
  "application/font-woff2": "woff2",
};

function safeBase(name: string) {
  return (name || "")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

export const POST = withAdmin(async (request) => {
  let body: { url?: unknown; folder?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  if (typeof body.url !== "string" || !/^https?:\/\//i.test(body.url)) {
    return NextResponse.json({ error: "url must be an http(s) URL." }, { status: 400 });
  }
  const remote = body.url;
  const folderRaw = typeof body.folder === "string" ? body.folder : "imported";
  const folder = folderRaw.replace(/^\/+|\/+$/g, "").replace(/[^\w/\-]/g, "");
  const overrideName = typeof body.name === "string" ? body.name : "";

  const res = await fetch(remote, { redirect: "follow" });
  if (!res.ok) {
    return NextResponse.json({ error: `Remote returned ${res.status}.` }, { status: 502 });
  }
  const len = Number(res.headers.get("content-length") || 0);
  if (len && len > MAX_BYTES) {
    return NextResponse.json({ error: "Remote file too large." }, { status: 413 });
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "Remote file too large." }, { status: 413 });
  }
  const mime = (res.headers.get("content-type") || "").split(";")[0].trim() || "application/octet-stream";

  const fromUrlBase = (() => {
    try {
      const u = new URL(remote);
      const last = u.pathname.split("/").filter(Boolean).pop() || "";
      const dot = last.lastIndexOf(".");
      return dot > 0 ? last.slice(0, dot) : last;
    } catch {
      return "import";
    }
  })();
  const baseName = safeBase(overrideName || fromUrlBase || "import") || "import";
  const ext =
    EXT_BY_MIME[mime] ||
    (() => {
      try {
        const u = new URL(remote);
        const last = u.pathname.split("/").filter(Boolean).pop() || "";
        const dot = last.lastIndexOf(".");
        return dot > 0 ? last.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
      } catch {
        return "bin";
      }
    })();
  const hash = createHash("sha1").update(remote).digest("hex").slice(0, 8);
  const finalName = `${baseName}-${hash}.${ext}`;
  const path = folder ? `${folder}/${finalName}` : finalName;

  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: mime, upsert: true });
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ path, url: pub.publicUrl, mime, size: buf.length });
});
