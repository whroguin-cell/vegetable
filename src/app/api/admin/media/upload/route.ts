import { NextResponse } from "next/server";
import { supabaseAdmin, withAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB hard limit per file
const ALLOWED_MIME_PREFIXES = ["image/", "font/", "application/font-", "application/x-font-"];
const ALLOWED_MIME_EXACT = new Set([
  "application/octet-stream",
  "image/svg+xml",
]);

function safeBase(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80) || "file";
}

function uniqueName(original: string) {
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  const ext = dot > 0 ? original.slice(dot).toLowerCase() : "";
  const stamp = Date.now().toString(36);
  return `${safeBase(base)}-${stamp}${ext}`;
}

export const POST = withAdmin(async (request) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const folderRaw = (form.get("folder")?.toString() ?? "").trim();
  const folder = folderRaw.replace(/^\/+|\/+$/g, "").replace(/[^\w/\-]/g, "");

  const files = form.getAll("files").filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  const uploaded: { path: string; url: string; name: string; size: number }[] = [];
  const errors: { name: string; error: string }[] = [];

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      errors.push({ name: file.name, error: `Too large (max ${MAX_BYTES / 1024 / 1024} MB).` });
      continue;
    }
    const mime = file.type || "application/octet-stream";
    const ok =
      ALLOWED_MIME_EXACT.has(mime) || ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
    if (!ok) {
      errors.push({ name: file.name, error: `Unsupported type: ${mime}` });
      continue;
    }

    const finalName = uniqueName(file.name || "file");
    const path = folder ? `${folder}/${finalName}` : finalName;

    const arrayBuffer = await file.arrayBuffer();
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: mime,
        upsert: false,
      });
    if (error) {
      errors.push({ name: file.name, error: error.message });
      continue;
    }

    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    uploaded.push({ path, url: pub.publicUrl, name: finalName, size: file.size });
  }

  return NextResponse.json({ uploaded, errors });
});
