import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { isAllowedAdminEmail } from "@/lib/admin-config";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null as User | null, loading };
}

/**
 * Check whether the currently authenticated user is the designated admin.
 * Both must be true:
 *   1. user.email matches the hardcoded ADMIN_EMAIL
 *   2. user_id has a row in public.admins (server-side, gated by RLS)
 *
 * Either check alone would be enough in practice — both together mean that
 * spoofing the email client-side OR manually adding a row to `admins` isn't
 * sufficient to unlock the admin console.
 */
export function useIsAdmin(user: User | null | undefined) {
  const userId = user?.id;
  const email = user?.email;
  const emailAllowed = isAllowedAdminEmail(email);

  return useQuery<boolean>({
    queryKey: ["is-admin", userId, email],
    enabled: !!userId && emailAllowed,
    queryFn: async () => {
      if (!userId || !emailAllowed) return false;
      const { data, error } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    },
    // If the email itself isn't allowed, short-circuit to false without a
    // network call. React-query uses initialData only when enabled=false.
    initialData: emailAllowed ? undefined : false,
  });
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
