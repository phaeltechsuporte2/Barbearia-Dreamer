"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeProvider";

const NAV_LINKS = [
  { href: "#home", label: "Inicio" },
  { href: "#about", label: "Sobre" },
  { href: "#services", label: "Servicos" },
  { href: "#plans", label: "Planos" },
  { href: "#scheduling", label: "Agendamento" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstName = user
    ? (user.user_metadata?.name as string | undefined)?.split(" ")[0] ||
      user.email?.split("@")[0]
    : null;

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  };

  const headerBg = scrolled
    ? isDark
      ? "bg-brand-black/90 py-3 shadow-lg shadow-brand-orange/5"
      : "bg-white/90 py-3 shadow-lg shadow-black/5"
    : "bg-transparent py-6";

  const navLinkColor = isDark
    ? "text-gray-300 hover:text-brand-orange"
    : "text-gray-600 hover:text-brand-orange";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/images/logo.jpg"
            alt="Barbearia Dreamer"
            className="w-12 h-12 rounded-full object-cover transition-transform group-hover:scale-110"
          />
          <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-gold">
            Barbearia Dreamer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors font-medium ${navLinkColor}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            className={`w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${
              isDark
                ? "text-gray-300 hover:text-brand-orange hover:bg-white/10"
                : "text-gray-600 hover:text-brand-orange hover:bg-black/5"
            }`}
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className={`px-4 py-2 rounded-full font-medium transition-colors ${navLinkColor}`}
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 rounded-full bg-brand-orange text-brand-black font-semibold hover:bg-brand-orange-light transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
              >
                Criar Conta
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <span
                className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Ola, {firstName}
              </span>
              <button
                onClick={handleSignOut}
                className={`px-4 py-2 rounded-full border font-medium transition-colors ${
                  isDark
                    ? "border-[var(--border-main)] text-gray-300 hover:text-brand-orange hover:border-brand-orange"
                    : "border-gray-300 text-gray-600 hover:text-brand-orange hover:border-brand-orange"
                }`}
              >
                Sair
              </button>
            </div>
          )}

          <button
            aria-label="Abrir menu"
            className={`md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
              isDark ? "text-gray-300 hover:text-brand-orange" : "text-gray-800 hover:text-brand-orange"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={`md:hidden border-t mt-2 ${
            isDark ? "bg-brand-dark/95 border-[var(--border-subtle)]" : "bg-white/95 border-gray-200"
          }`}
        >
          <nav className="flex flex-col items-center gap-5 py-8 px-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`transition-colors font-medium text-lg ${navLinkColor}`}
              >
                {link.label}
              </a>
            ))}

            <div
              className={`w-full max-w-xs h-px my-2 ${
                isDark ? "bg-white/10" : "bg-gray-200"
              }`}
            />

            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className={`w-full max-w-xs flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-colors ${
                isDark
                  ? "text-gray-300 hover:text-brand-orange hover:bg-white/5"
                  : "text-gray-600 hover:text-brand-orange hover:bg-black/5"
              }`}
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
              {isDark ? "Tema Claro" : "Tema Escuro"}
            </button>

            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`w-full max-w-xs text-center py-3 rounded-full font-medium transition-colors ${navLinkColor}`}
            >
              Painel Admin
            </Link>

            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className={`w-full max-w-xs text-center py-3 rounded-full border font-medium transition-colors ${
                    isDark
                      ? "border-[var(--border-main)] text-gray-300 hover:border-brand-orange hover:text-brand-orange"
                      : "border-gray-300 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full max-w-xs text-center py-3 rounded-full bg-brand-orange text-brand-black font-bold text-lg hover:bg-brand-orange-light transition-all"
                >
                  Criar Conta
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className={`w-full max-w-xs py-3 rounded-full border font-medium transition-colors ${
                  isDark
                    ? "border-[var(--border-main)] text-gray-300 hover:border-brand-orange hover:text-brand-orange"
                    : "border-gray-300 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                Sair
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
