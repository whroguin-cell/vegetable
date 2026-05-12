"use client";

import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useNews, useUpsertNews, useDeleteNews } from "@/hooks/use-content";
import type { NewsItem } from "@/lib/database.types";

const CATEGORY_OPTIONS: { value: string; ja: string }[] = [
  { value: "Shipping", ja: "出荷情報" },
  { value: "Notice", ja: "お知らせ" },
  { value: "Company", ja: "会社情報" },
  { value: "Producer", ja: "生産者" },
];

type FormState = {
  id?: string;
  date: string;
  category: string;
  category_ja: string;
  title: string;
  body: string;
  published: boolean;
  sort_order: number;
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const empty: FormState = {
  date: today(),
  category: "Notice",
  category_ja: "お知らせ",
  title: "",
  body: "",
  published: true,
  sort_order: 10,
};

export default function AdminNewsPage() {
  const { data: news = [], isLoading } = useNews({ includeUnpublished: true });
  const upsert = useUpsertNews();
  const del = useDeleteNews();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  const openNew = () => {
    setForm({ ...empty, sort_order: (news.at(0)?.sort_order ?? 0) + 10 });
    setDialogOpen(true);
  };

  const openEdit = (n: NewsItem) => {
    setForm({
      id: n.id,
      date: n.date,
      category: n.category,
      category_ja: n.category_ja ?? "",
      title: n.title,
      body: n.body ?? "",
      published: n.published,
      sort_order: n.sort_order,
    });
    setDialogOpen(true);
  };

  const onCategoryChange = (value: string) => {
    const match = CATEGORY_OPTIONS.find((c) => c.value === value);
    setForm({ ...form, category: value, category_ja: match?.ja ?? form.category_ja });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({
        id: form.id,
        date: form.date,
        category: form.category,
        category_ja: form.category_ja || null,
        title: form.title,
        body: form.body || null,
        published: form.published,
        sort_order: Number(form.sort_order) || 0,
      });
      toast.success(form.id ? "更新しました" : "ニュースを追加しました");
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存に失敗しました");
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await del.mutateAsync(deleteTarget.id);
      toast.success("削除しました");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setDeleteTarget(null);
    }
  };

  const togglePublished = async (n: NewsItem) => {
    try {
      await upsert.mutateAsync({
        id: n.id,
        date: n.date,
        category: n.category,
        category_ja: n.category_ja,
        title: n.title,
        body: n.body,
        published: !n.published,
        sort_order: n.sort_order,
      });
      toast.success(n.published ? "非公開にしました" : "公開しました");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新に失敗しました");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">News</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            ニュース<span className="italic font-normal text-primary">管理</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            公開サイトの「ニュース」ページに表示される記事を管理します。
          </p>
        </div>
        <Button onClick={openNew} className="bg-foreground text-primary-foreground hover:bg-primary rounded-none h-11 tracking-[0.15em] uppercase text-xs">
          <Plus className="h-4 w-4 mr-2" />
          新規追加
        </Button>
      </div>

      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-left">
              <th className="p-3 md:p-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium w-24">Date</th>
              <th className="p-3 md:p-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium w-28">Category</th>
              <th className="p-3 md:p-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Title</th>
              <th className="p-3 md:p-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium w-24">Status</th>
              <th className="p-3 md:p-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium w-28 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  読み込み中…
                </td>
              </tr>
            )}
            {!isLoading && news.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted-foreground text-sm">
                  ニュースはまだ登録されていません。
                </td>
              </tr>
            )}
            {news.map((n) => (
              <tr key={n.id} className="border-b border-border hover:bg-secondary/40 transition-colors">
                <td className="p-3 md:p-4 tabular-nums text-muted-foreground">{n.date}</td>
                <td className="p-3 md:p-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium">{n.category}</span>
                </td>
                <td className="p-3 md:p-4">
                  <div className="font-serif font-medium line-clamp-1">{n.title}</div>
                  {n.body && (
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{n.body}</div>
                  )}
                </td>
                <td className="p-3 md:p-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-medium px-2 py-1",
                      n.published
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {n.published ? "公開" : "非公開"}
                  </span>
                </td>
                <td className="p-3 md:p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => togglePublished(n)}
                      aria-label={n.published ? "非公開にする" : "公開する"}
                    >
                      {n.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(n)}
                      aria-label="編集"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(n)}
                      aria-label="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {form.id ? "ニュースを編集" : "ニュースを追加"}
            </DialogTitle>
            <DialogDescription>
              公開サイトの「ニュース」に表示される情報を入力してください。
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">日付 (YYYY.MM.DD)</Label>
                <Input
                  id="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="2026.04.15"
                  required
                  className="mt-1.5 rounded-none tabular-nums"
                />
              </div>
              <div>
                <Label htmlFor="sort_order">表示順</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  required
                  className="mt-1.5 rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 border border-input bg-background text-sm"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value} ({c.ja})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="category_ja">カテゴリ (日本語)</Label>
                <Input
                  id="category_ja"
                  value={form.category_ja}
                  onChange={(e) => setForm({ ...form, category_ja: e.target.value })}
                  className="mt-1.5 rounded-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="mt-1.5 rounded-none"
              />
            </div>

            <div>
              <Label htmlFor="body">本文</Label>
              <Textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={5}
                className="mt-1.5 rounded-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="published" className="font-normal text-sm cursor-pointer">
                公開する (チェックを外すと下書き)
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => setDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={upsert.isPending}
                className="bg-foreground text-primary-foreground hover:bg-primary rounded-none"
              >
                {upsert.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {form.id ? "更新する" : "追加する"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>このニュースを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.title}」を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
