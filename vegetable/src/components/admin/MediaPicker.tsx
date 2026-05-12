"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Link2, Image as ImageIcon, Loader2, Search, X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  importUrl,
  listMedia,
  uploadMedia,
  type MediaFile,
} from "@/lib/media-api";

type Tab = "library" | "upload" | "url";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the chosen public URL. */
  onPick: (url: string) => void;
  /** Optional default folder used for new uploads / imports. */
  folder?: string;
  /** Restrict picking to image files (default: true). */
  imagesOnly?: boolean;
  title?: string;
};

const isImage = (m: MediaFile) =>
  (m.mimetype || "").startsWith("image/") ||
  /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(m.name);

export const MediaPicker = ({
  open,
  onOpenChange,
  onPick,
  folder = "uploads",
  imagesOnly = true,
  title = "メディアを選択",
}: Props) => {
  const [tab, setTab] = useState<Tab>("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh listing whenever the dialog opens or the tab returns to "library".
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await listMedia("");
        if (cancelled) return;
        setFiles(data.files);
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "読み込みに失敗しました");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, tab]);

  const filtered = files
    .filter((f) => (imagesOnly ? isImage(f) : true))
    .filter((f) => (search ? f.path.toLowerCase().includes(search.toLowerCase()) : true));

  const handlePick = (url: string) => {
    onPick(url);
    onOpenChange(false);
  };

  const handleFileUpload = async (selected: FileList | File[] | null) => {
    if (!selected || (selected instanceof FileList && selected.length === 0)) return;
    const list = Array.from(selected);
    if (list.length === 0) return;
    setBusy(true);
    try {
      const result = await uploadMedia(list, folder);
      if (result.errors.length > 0) {
        for (const e of result.errors) toast.error(`${e.name}: ${e.error}`);
      }
      if (result.uploaded.length > 0) {
        toast.success(`${result.uploaded.length} 件アップロードしました`);
        // Auto-pick when single file uploaded.
        if (result.uploaded.length === 1) {
          handlePick(result.uploaded[0].url);
          return;
        }
        setTab("library");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImportUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      // Treat as a literal URL — don't import, just pick it.
      handlePick(trimmed);
      return;
    }
    setBusy(true);
    try {
      const result = await importUrl(trimmed, folder);
      toast.success("メディアライブラリに保存しました");
      handlePick(result.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "URLの取り込みに失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            ライブラリから選択するか、新しい画像をアップロード、または URL を貼り付けて取り込めます。
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b border-border -mt-2">
          {[
            { id: "library", label: "ライブラリ", icon: FolderOpen },
            { id: "upload", label: "アップロード", icon: Upload },
            { id: "url", label: "URLから取り込み", icon: Link2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id as Tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs tracking-[0.15em] uppercase border-b-2 transition-colors",
                tab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          {tab === "library" && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ファイル名で絞り込む…"
                  className="pl-9 rounded-none h-10"
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> 読み込み中…
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-12">
                  画像が見つかりません。「アップロード」または「URLから取り込み」から追加できます。
                </div>
              ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((f) => (
                    <li key={f.path}>
                      <button
                        type="button"
                        onClick={() => handlePick(f.url)}
                        className="group block w-full text-left border border-border hover:border-primary transition-colors bg-muted/30"
                        title={f.path}
                      >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {isImage(f) ? (
                            <img
                              src={f.url}
                              alt={f.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                              {f.name}
                            </div>
                          )}
                        </div>
                        <div className="px-2 py-1.5">
                          <div className="text-[11px] text-foreground truncate">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{f.path}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {tab === "upload" && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border bg-muted/30 p-10 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFileUpload(e.dataTransfer.files);
                }}
                role="button"
                tabIndex={0}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-foreground font-medium">クリックまたはドラッグ＆ドロップ</p>
                <p className="text-xs text-muted-foreground mt-1">画像 / フォントファイル (各 25MB まで)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,font/*,.woff,.woff2,.ttf,.otf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <p className="text-[11px] text-muted-foreground">
                保存先フォルダ: <code className="bg-muted px-1 py-0.5">{folder || "(root)"}</code>
              </p>
              {busy && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> 処理中…
                </p>
              )}
            </div>
          )}

          {tab === "url" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="picker-url">画像URL</Label>
                <Input
                  id="picker-url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://…/image.jpg"
                  className="mt-1.5 rounded-none h-11"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  「URLを取り込んで保存」を押すと、画像をダウンロードしてメディアライブラリに保存します。
                  URL のままサイトで使用したい場合は「このURLを使用」を押してください。
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleImportUrl}
                  disabled={busy || !urlInput.trim()}
                  className="bg-foreground text-primary-foreground hover:bg-primary rounded-none"
                >
                  {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  URLを取り込んで保存
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => urlInput.trim() && handlePick(urlInput.trim())}
                  disabled={!urlInput.trim()}
                  className="rounded-none"
                >
                  このURLを使用
                </Button>
              </div>
              {urlInput && (
                <div className="border border-border bg-muted/30 p-3">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">プレビュー</div>
                  <img
                    src={urlInput}
                    alt="preview"
                    className="max-h-48 w-auto mx-auto block"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Convenience: an Input that accepts either a URL or opens the MediaPicker.
 * Used in admin forms to replace plain image-URL inputs.
 */
export const MediaUrlInput = ({
  id,
  value,
  onChange,
  folder = "uploads",
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  folder?: string;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://…/image.jpg または ライブラリから選ぶ"}
          className="rounded-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-2 inline-flex items-center text-muted-foreground hover:text-destructive"
            aria-label="クリア"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="rounded-none whitespace-nowrap"
        >
          <ImageIcon className="h-4 w-4 mr-1.5" />
          選ぶ / アップロード
        </Button>
      </div>
      {value && (
        <div className="border border-border bg-muted/20 p-2 inline-block">
          <img
            src={value}
            alt="preview"
            className="h-16 w-auto object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <MediaPicker open={open} onOpenChange={setOpen} onPick={onChange} folder={folder} />
    </div>
  );
};
