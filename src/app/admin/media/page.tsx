"use client";

import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Trash2,
  Pencil,
  Search,
  Link2,
  Copy,
  ExternalLink,
  RefreshCw,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  deleteMedia,
  importUrl,
  listMedia,
  renameMedia,
  uploadMedia,
  type MediaFile,
} from "@/lib/media-api";

const isImage = (m: MediaFile) =>
  (m.mimetype || "").startsWith("image/") ||
  /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(m.name);

function formatSize(bytes: number | null) {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<{ name: string; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState<string>("");
  const [uploadFolder, setUploadFolder] = useState("uploads");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renameTarget, setRenameTarget] = useState<MediaFile | null>(null);
  const [renameTo, setRenameTo] = useState("");
  const [deleteOne, setDeleteOne] = useState<MediaFile | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importUrlInput, setImportUrlInput] = useState("");
  const [importFolder, setImportFolder] = useState("imported");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listMedia("");
      setFiles(data.files);
      setFolders(data.folders);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = files.filter((f) => {
    if (folderFilter && !f.path.startsWith(`${folderFilter}/`)) return false;
    if (search && !f.path.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const allVisiblePaths = filtered.map((f) => f.path);
      const allSelected = allVisiblePaths.every((p) => prev.has(p));
      const next = new Set(prev);
      if (allSelected) {
        for (const p of allVisiblePaths) next.delete(p);
      } else {
        for (const p of allVisiblePaths) next.add(p);
      }
      return next;
    });
  };

  const handleFileUpload = async (selectedFiles: FileList | File[] | null) => {
    if (!selectedFiles) return;
    const list = Array.from(selectedFiles);
    if (list.length === 0) return;
    setBusy(true);
    try {
      const result = await uploadMedia(list, uploadFolder);
      for (const e of result.errors) toast.error(`${e.name}: ${e.error}`);
      if (result.uploaded.length > 0) {
        toast.success(`${result.uploaded.length} 件アップロードしました`);
        await refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    const url = importUrlInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      toast.error("有効な http(s) URL を入力してください");
      return;
    }
    setBusy(true);
    try {
      await importUrl(url, importFolder);
      toast.success("URL をライブラリに保存しました");
      setImportDialogOpen(false);
      setImportUrlInput("");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "URLの取り込みに失敗しました");
    } finally {
      setBusy(false);
    }
  };

  const handleRename = async () => {
    if (!renameTarget) return;
    const to = renameTo.trim();
    if (!to || to === renameTarget.path) {
      setRenameTarget(null);
      return;
    }
    setBusy(true);
    try {
      await renameMedia(renameTarget.path, to);
      toast.success("名前を変更しました");
      setRenameTarget(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "名前変更に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (paths: string[]) => {
    if (paths.length === 0) return;
    setBusy(true);
    try {
      await deleteMedia(paths);
      toast.success(`${paths.length} 件削除しました`);
      setSelected((prev) => {
        const next = new Set(prev);
        for (const p of paths) next.delete(p);
        return next;
      });
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setBusy(false);
      setDeleteOne(null);
      setConfirmBulkDelete(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URLをコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  const allFolders = ["", ...folders.map((f) => f.path)];

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">
            Media Library
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            メディア<span className="italic font-normal text-primary">ライブラリ</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Supabase Storage の <code className="text-xs bg-muted px-1">media</code>{" "}
            バケットを管理します。アップロード・URLからの取り込み・名前変更・削除が行えます。
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={refresh}
            className="rounded-none h-11"
            disabled={loading || busy}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            更新
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="rounded-none h-11"
          >
            <Link2 className="h-4 w-4 mr-2" />
            URLから取り込み
          </Button>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-foreground text-primary-foreground hover:bg-primary rounded-none h-11 tracking-[0.15em] uppercase text-xs"
            disabled={busy}
          >
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            アップロード
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,font/*,.woff,.woff2,.ttf,.otf"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      <div className="bg-background border border-border p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ファイル名 / パスで検索"
            className="pl-9 rounded-none h-10"
          />
        </div>
        <div>
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="w-full h-10 px-3 border border-input bg-background text-sm"
          >
            <option value="">すべてのフォルダ</option>
            {allFolders
              .filter((f) => f)
              .map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
          </select>
        </div>
        <div>
          <Input
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value.replace(/[^\w/\-]/g, ""))}
            placeholder="アップロード先フォルダ"
            className="rounded-none h-10"
          />
        </div>
      </div>

      {selected.size > 0 && (
        <div className="bg-primary/5 border border-primary/30 px-4 py-2 mb-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-foreground">
            <span className="font-medium">{selected.size} 件</span> 選択中
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none"
              onClick={() => setSelected(new Set())}
            >
              選択解除
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="rounded-none"
              onClick={() => setConfirmBulkDelete(true)}
              disabled={busy}
            >
              <Trash2 className="h-4 w-4 mr-1" /> 一括削除
            </Button>
          </div>
        </div>
      )}

      <div
        className="bg-background border border-border min-h-[300px] relative"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> 読み込み中…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-20">
            ファイルがありません。アップロードまたはURLから取り込んでください。
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <>
            <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={toggleAllVisible}
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                {filtered.every((f) => selected.has(f.path)) ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                すべて選択 ({filtered.length})
              </button>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
              {filtered.map((f) => {
                const checked = selected.has(f.path);
                return (
                  <li
                    key={f.path}
                    className={cn(
                      "border bg-muted/20 transition-colors",
                      checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted group">
                      {isImage(f) ? (
                        <img
                          src={f.url}
                          alt={f.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                          {f.name}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleSelect(f.path)}
                        className="absolute top-1.5 left-1.5 bg-background/90 text-foreground p-1 hover:bg-background"
                        aria-label="選択"
                      >
                        {checked ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-foreground/70 to-transparent">
                        <button
                          type="button"
                          onClick={() => copyUrl(f.url)}
                          className="flex-1 bg-background/90 hover:bg-background text-foreground text-[10px] py-1 inline-flex items-center justify-center gap-1"
                          title="URLをコピー"
                        >
                          <Copy className="h-3 w-3" /> URL
                        </button>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-background/90 hover:bg-background text-foreground text-[10px] px-2 py-1 inline-flex items-center justify-center"
                          title="新しいタブで開く"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setRenameTarget(f);
                            setRenameTo(f.path);
                          }}
                          className="bg-background/90 hover:bg-background text-foreground text-[10px] px-2 py-1 inline-flex items-center justify-center"
                          title="名前変更 / フォルダ移動"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteOne(f)}
                          className="bg-destructive/90 hover:bg-destructive text-destructive-foreground text-[10px] px-2 py-1 inline-flex items-center justify-center"
                          title="削除"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="px-2 py-2 text-[11px]">
                      <div className="truncate font-medium" title={f.name}>{f.name}</div>
                      <div className="text-muted-foreground truncate" title={f.path}>
                        {f.path}
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        {formatSize(f.size)} {f.mimetype && <span className="ml-1">· {f.mimetype}</span>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        ヒント: ドラッグ＆ドロップでもアップロードできます。
      </p>

      {/* Rename dialog */}
      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">名前変更 / 移動</DialogTitle>
            <DialogDescription>
              新しいパスを入力してください。フォルダごと変更できます (例: <code>uploads/new-name.jpg</code>)。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>現在のパス</Label>
              <div className="text-xs bg-muted px-2 py-1 mt-1 truncate">{renameTarget?.path}</div>
            </div>
            <div>
              <Label htmlFor="rename-to">新しいパス</Label>
              <Input
                id="rename-to"
                value={renameTo}
                onChange={(e) => setRenameTo(e.target.value)}
                className="mt-1.5 rounded-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setRenameTarget(null)}>
              キャンセル
            </Button>
            <Button
              onClick={handleRename}
              disabled={busy}
              className="bg-foreground text-primary-foreground hover:bg-primary rounded-none"
            >
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              変更する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single delete */}
      <AlertDialog open={!!deleteOne} onOpenChange={(o) => !o && setDeleteOne(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>このファイルを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteOne?.path}」を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOne && handleDelete([deleteOne.path])}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete */}
      <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selected.size} 件のファイルを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              選択中の全ファイルが削除されます。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(Array.from(selected))}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import URL dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">URLから取り込み</DialogTitle>
            <DialogDescription>
              指定した URL の画像 / フォントをダウンロードして、メディアライブラリに保存します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="import-url">URL</Label>
              <Input
                id="import-url"
                value={importUrlInput}
                onChange={(e) => setImportUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className="mt-1.5 rounded-none"
              />
            </div>
            <div>
              <Label htmlFor="import-folder">保存先フォルダ</Label>
              <Input
                id="import-folder"
                value={importFolder}
                onChange={(e) => setImportFolder(e.target.value.replace(/[^\w/\-]/g, ""))}
                className="mt-1.5 rounded-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setImportDialogOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleImport}
              disabled={busy || !importUrlInput.trim()}
              className="bg-foreground text-primary-foreground hover:bg-primary rounded-none"
            >
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              取り込む
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
