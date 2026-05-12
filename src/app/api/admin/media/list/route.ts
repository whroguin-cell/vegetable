import { NextResponse } from "next/server";
import { supabaseAdmin, withAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "media";

type FileEntry = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  mimetype: string | null;
  updated_at: string | null;
  created_at: string | null;
};

type FolderEntry = {
  name: string;
  path: string;
};

/**
 * Recursively list every file under a prefix.  Supabase Storage's `list` only
 * returns one level at a time, so we walk the tree explicitly.
 */
async function listAll(prefix: string): Promise<{ files: FileEntry[]; folders: FolderEntry[] }> {
  const out: FileEntry[] = [];
  const folders: FolderEntry[] = [];
  const queue: string[] = [prefix];
  const seen = new Set<string>();

  while (queue.length) {
    const current = queue.shift()!;
    if (seen.has(current)) continue;
    seen.add(current);

    let offset = 0;
    const PAGE = 100;
    while (true) {
      const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(current, {
        limit: PAGE,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
      if (error) throw error;
      if (!data || data.length === 0) break;

      for (const item of data) {
        const isFolder = item.id === null && item.metadata === null;
        if (isFolder) {
          const sub = current ? `${current}/${item.name}` : item.name;
          folders.push({ name: item.name, path: sub });
          queue.push(sub);
          continue;
        }
        const path = current ? `${current}/${item.name}` : item.name;
        const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
        out.push({
          name: item.name,
          path,
          url: pub.publicUrl,
          size: item.metadata?.size ?? null,
          mimetype: item.metadata?.mimetype ?? null,
          updated_at: item.updated_at ?? null,
          created_at: item.created_at ?? null,
        });
      }

      if (data.length < PAGE) break;
      offset += PAGE;
    }
  }

  out.sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));
  folders.sort((a, b) => a.path.localeCompare(b.path));
  return { files: out, folders };
}

export const GET = withAdmin(async (request) => {
  const { searchParams } = new URL(request.url);
  const prefix = (searchParams.get("prefix") ?? "").replace(/^\/+|\/+$/g, "");

  try {
    const result = await listAll(prefix);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list files.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
