"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function ForgotPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const err = await resetPassword(email);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
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
          <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
          <p className="text-gray-400 mt-1 text-center">
            Enviamos um link para redefinir sua senha
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mb-4 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
          >
            Link enviado! Verifique sua caixa de entrada.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 min-h-[44px] bg-brand-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-orange/50 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
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
                Enviando...
              </>
            ) : (
              "Enviar Link"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm">
          <Link
            href="/auth/login"
            className="text-brand-orange hover:text-brand-orange-light transition-colors"
          >
            Voltar ao login
          </Link>
        </p>
      </div>
    </main>
  );
}
