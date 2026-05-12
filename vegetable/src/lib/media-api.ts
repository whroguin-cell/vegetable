// Browser-side helper that calls the /api/admin/media/* routes with the
// signed-in user's bearer token. The server routes verify the token and use
// the service-role key to perform the storage operation.

import { supabase } from "./supabase";

export type MediaFile = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  mimetype: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export type MediaFolder = {
  name: string;
  path: string;
};

export type MediaListResponse = {
  files: MediaFile[];
  folders: MediaFolder[];
};

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in.");
  return { Authorization: `Bearer ${token}` };
}

async function expectJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned non-JSON (${res.status}).`);
  }
  if (!res.ok) {
    const msg = (body as { error?: string })?.error || `Request failed (${res.status}).`;
    throw new Error(msg);
  }
  return body as T;
}

export async function listMedia(prefix = ""): Promise<MediaListResponse> {
  const headers = await authHeaders();
  const qs = prefix ? `?prefix=${encodeURIComponent(prefix)}` : "";
  const res = await fetch(`/api/admin/media/list${qs}`, { headers, cache: "no-store" });
  return expectJson<MediaListResponse>(res);
}

export type UploadResult = {
  uploaded: { path: string; url: string; name: string; size: number }[];
  errors: { name: string; error: string }[];
};

export async function uploadMedia(files: File[], folder = ""): Promise<UploadResult> {
  const headers = await authHeaders();
  const fd = new FormData();
  fd.append("folder", folder);
  for (const f of files) fd.append("files", f, f.name);
  const res = await fetch(`/api/admin/media/upload`, { method: "POST", headers, body: fd });
  return expectJson<UploadResult>(res);
}

export async function deleteMedia(paths: string[]): Promise<{ removed: { name: string }[] }> {
  const headers = { ...(await authHeaders()), "Content-Type": "application/json" };
  const res = await fetch(`/api/admin/media/delete`, {
    method: "POST",
    headers,
    body: JSON.stringify({ paths }),
  });
  return expectJson(res);
}

export async function renameMedia(from: string, to: string): Promise<{ ok: boolean; path: string; url: string }> {
  const headers = { ...(await authHeaders()), "Content-Type": "application/json" };
  const res = await fetch(`/api/admin/media/rename`, {
    method: "POST",
    headers,
    body: JSON.stringify({ from, to }),
  });
  return expectJson(res);
}

export async function importUrl(
  url: string,
  folder = "imported",
  name?: string,
): Promise<{ path: string; url: string; mime: string; size: number }> {
  const headers = { ...(await authHeaders()), "Content-Type": "application/json" };
  const res = await fetch(`/api/admin/media/import-url`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url, folder, name }),
  });
  return expectJson(res);
}
