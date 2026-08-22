"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase-browser";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  resetPassword: async () => null,
});

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) void trackLogin(session.user);
    }).catch(() => {
      if (active) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (session?.user) void trackLogin(session.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function trackLogin(user: User) {
    if (trackedRef.current === user.id) return;
    trackedRef.current = user.id;
    try {
      const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
      const row = {
        auth_user_id: user.id,
        provider: user.app_metadata?.provider ?? "email",
        name: meta.full_name || meta.name || meta.user_name || null,
        email: user.email ?? meta.email ?? null,
        phone: user.phone ?? meta.phone ?? null,
        avatar_url: meta.avatar_url ?? meta.picture ?? null,
        last_login: new Date().toISOString(),
      };

      const { data: existing } = await getSupabase()
        .from("site_users")
        .select("auth_user_id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      await getSupabase()
        .from("site_users")
        .upsert(row, { onConflict: "auth_user_id" });

      if (!existing && row.email) {
        void fetch("/api/email/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: row.name, email: row.email }),
        }).catch(() => {});
      }
    } catch {
      // a captura de dados nao deve bloquear o login
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }

  async function signUp(email: string, password: string, name: string) {
    const { error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return error.message;
    return null;
  }

  async function signInWithGoogle() {
    await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function resetPassword(email: string) {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) return error.message;
    return null;
  }

  async function signOut() {
    await getSupabase().auth.signOut();
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
