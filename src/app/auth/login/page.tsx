"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

function translateError(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (message.includes("Email not confirmed")) {
    return "E-mail não confirmado. Verifique sua caixa de entrada.";
  }
  if (message.includes("Too many requests")) {
    return "Muitas tentativas. Tente novamente em instantes.";
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const err = await signIn(email, password);
    if (err) {
      setError(translateError(err));
      setLoading(false);
      return;
    }

    router.push("/");
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Não foi possível entrar com Google. Tente novamente.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md mx-auto bg-brand-dark border border-white/5 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/logo.jpg"
            alt="Barbearia Dreamer"
            className="rounded-full w-16 h-16 object-cover mb-4"
          />
          <h1 className="text-3xl font-bold text-white">Entrar</h1>
          <p className="text-gray-400 mt-1">Acesse sua conta</p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 min-h-[44px] bg-brand-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-orange/50 focus:outline-none transition-colors"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 min-h-[44px] bg-brand-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-orange/50 focus:outline-none transition-colors"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 min-h-[44px] rounded-full font-bold bg-brand-orange text-brand-black hover:bg-brand-orange-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            ou
          </span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading || googleLoading}
          className="w-full py-3 min-h-[44px] rounded-full font-bold bg-white text-brand-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {googleLoading ? (
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.06.56 4.2 1.66l3.13-3.13C17.45 1.79 14.97.75 12 .75 7.6.75 3.8 3.27 1.96 6.96l3.66 2.84c.87-2.6 3.32-4.76 6.38-4.76z"
                />
                <path
                  fill="#4285F4"
                  d="M23.25 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.32-5.17 3.32-8.82z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.62 14.2c-.22-.66-.35-1.37-.35-2.2s.13-1.54.35-2.2L1.96 6.96C1.15 8.46.75 10.18.75 12s.4 3.54 1.21 5.04l3.66-2.84z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.86-3c-1.07.72-2.44 1.15-3.6 1.15-3.06 0-5.51-2.16-6.38-4.76l-3.66 2.84c1.84 3.69 5.64 6.49 10.04 6.49z"
                />
              </svg>
              Entrar com Google
            </>
          )}
        </button>

        <div className="mt-8 space-y-3 text-center text-sm">
          <p>
            <Link
              href="/auth/forgot"
              className="text-brand-orange hover:text-brand-orange-light transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </p>
          <p className="text-gray-400">
            Não tem conta?{" "}
            <Link
              href="/auth/register"
              className="text-brand-orange hover:text-brand-orange-light transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
