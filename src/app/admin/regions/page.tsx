"use client";

import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { useRegions, useUpsertRegion, useDeleteRegion } from "@/hooks/use-content";
import type { Region } from "@/lib/database.types";

type FormState = {
  id?: string;
  num: string;
  area: string;
  en: string;
  farms: string;
  sort_order: number;
};

const empty: FormState = {
  num: "",
  area: "",
  en: "",
  farms: "",
  sort_order: 10,
};

export default function AdminRegionsPage() {
  const { data: regions = [], isLoading } = useRegions();
  const upsert = useUpsertRegion();
  const del = useDeleteRegion();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [deleteTarget, setDeleteTarget] = useState<Region | null>(null);

  const openNew = () => {
    setForm({ ...empty, sort_order: (regions.at(-1)?.sort_order ?? 0) + 10 });
    setDialogOpen(true);
  };

  const openEdit = (r: Region) => {
    setForm({
      id: r.id,
      num: r.num,
      area: r.area,
      en: r.en,
      farms: r.farms.join(", "),
      sort_order: r.sort_order,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync({
        id: form.id,
        num: form.num,
        area: form.area,
        en: form.en,
        farms: form.farms.split(",").map((s) => s.trim()).filter(Boolean),
        sort_order: Number(form.sort_order) || 0,
      });
      toast.success(form.id ? "更新しました" : "地域を追加しました");
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

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-2">Regions</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            地域ネットワーク<span className="italic font-normal text-primary">管理</span>
          </h1>
        </div>
        <Button onClick={openNew} className="bg-foreground text-primary-foreground hover:bg-primary rounded-none h-11 tracking-[0.15em] uppercase text-xs">
          <Plus className="h-4 w-4 mr-2" />
          新規追加
        </Button>
      </div>

      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-left">
              <th className="p-3 md:p-4 w-16">No.</th>
              <th className="p-3 md:p-4">地域</th>
              <th className="p-3 md:p-4">English</th>
              <th className="p-3 md:p-4">農園名</th>
              <th className="p-3 md:p-4 w-16">Order</th>
              <th className="p-3 md:p-4 w-24 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  読み込み中…
                </td>
              </tr>
            )}
            {!isLoading && regions.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-secondary/40">
                <td className="p-3 md:p-4">{r.num}</td>
                <td className="p-3 md:p-4 font-medium">{r.area}</td>
                <td className="p-3 md:p-4 text-muted-foreground">{r.en}</td>
                <td className="p-3 md:p-4 text-muted-foreground">{r.farms.join(", ")}</td>
                <td className="p-3 md:p-4 tabular-nums">{r.sort_order}</td>
                <td className="p-3 md:p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(r)}>
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
            <DialogTitle className="font-serif text-2xl">{form.id ? "地域を編集" : "地域を追加"}</DialogTitle>
            <DialogDescription>公開サイトの地域ネットワーク情報を入力してください。</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="num">番号</Label>
                <Input id="num" value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} required className="mt-1.5 rounded-none" />
              </div>
              <div>
                <Label htmlFor="sort_order">表示順</Label>
                <Input id="sort_order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} required className="mt-1.5 rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">地域名</Label>
                <Input id="area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required className="mt-1.5 rounded-none" />
              </div>
              <div>
                <Label htmlFor="en">英語表記</Label>
                <Input id="en" value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} required className="mt-1.5 rounded-none" />
              </div>
            </div>
            <div>
              <Label htmlFor="farms">農園リスト (カンマ区切り)</Label>
              <Input id="farms" value={form.farms} onChange={(e) => setForm({ ...form, farms: e.target.value })} className="mt-1.5 rounded-none" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="rounded-none" onClick={() => setDialogOpen(false)}>キャンセル</Button>
              <Button type="submit" disabled={upsert.isPending} className="bg-foreground text-primary-foreground hover:bg-primary rounded-none">
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
            <AlertDialogTitle>この地域を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>「{deleteTarget?.area}」を削除します。この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
