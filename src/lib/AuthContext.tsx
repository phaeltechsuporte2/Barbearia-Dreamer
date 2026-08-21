"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<string | null>;
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

function getSupabase() {
  const { createClient } = require("./supabase-browser") as typeof import("./supabase-browser");
  return createClient();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let sub: { unsubscribe: () => void } | null = null;

    try {
      const supabase = getSupabase();

      supabase.auth
        .getSession()
        .then(({ data: { session } }: { data: { session: { user: User } | null } }) => {
          if (active) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) setLoading(false);
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (_event: string, session: { user: User } | null) => {
          if (active) setUser(session?.user ?? null);
        }
      );

      sub = subscription;
    } catch {
      if (active) setLoading(false);
    }

    return () => {
      active = false;
      sub?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return error.message;
      return null;
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) return error.message;
    return null;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword }),
    [user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
