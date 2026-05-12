"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, signOut, useIsAdmin, useSession } from "@/hooks/use-auth";
import { isAllowedAdminEmail } from "@/lib/admin-config";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useSession();
  const { data: isAdmin, isLoading: checking } = useIsAdmin(user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      const redirect = searchParams?.get("from") || "/admin";
      router.replace(redirect);
    }
  }, [loading, user, isAdmin, router, searchParams]);

  const signedInButNotAdmin = !!user && !checking && !isAdmin;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!isAllowedAdminEmail(email)) {
      setError("管理者のメールアドレスまたはパスワードが正しくありません。");
      setSubmitting(false);
      return;
    }

    try {
      await signInWithPassword(email, password);
    } catch {
      setError("管理者のメールアドレスまたはパスワードが正しくありません。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-background border border-border shadow-elegant p-8 md:p-10">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium">Admin</span>
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 tracking-tight">
        管理者<span className="italic font-normal text-primary">ログイン</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        指定された管理者アカウントでのみアクセスできます。
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@gmail.com"
            className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-[10px] tracking-[0.25em] uppercase text-primary font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-2 rounded-none h-12 border-border focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {signedInButNotAdmin && !error && (
          <div className="text-sm text-destructive space-y-2">
            <p>このアカウントには管理者権限がありません。</p>
            <button
              type="button"
              onClick={() => signOut()}
              className="underline hover:text-primary transition-smooth"
            >
              別のアカウントでログイン
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-foreground text-primary-foreground hover:bg-primary rounded-none h-12 tracking-[0.2em] uppercase text-xs group"
        >
          {submitting ? "Signing in…" : (
            <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 wa-seigaiha opacity-40 pointer-events-none" />
      <div className="blob bg-matcha/20 w-[320px] h-[320px] top-20 -left-20" />
      <div className="blob bg-sun/20 w-[280px] h-[280px] bottom-20 -right-10" style={{ animationDelay: "2s" }} />

      <Suspense fallback={<div className="relative text-muted-foreground text-sm">Loading…</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
