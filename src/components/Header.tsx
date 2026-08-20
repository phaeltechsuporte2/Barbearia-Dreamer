"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-black/90 backdrop-blur-md py-3 shadow-lg shadow-brand-orange/5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/logo.png"
            alt="Barbearia Dreamer"
            className="w-10 h-10 transition-transform group-hover:scale-110"
          />
          <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-gold">
            Barbearia Dreamer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-gray-300">
          <a
            href="#home"
            className="hover:text-brand-orange transition-colors font-medium"
          >
            Inicio
          </a>
          <a
            href="#about"
            className="hover:text-brand-orange transition-colors font-medium"
          >
            Sobre
          </a>
          <a
            href="#services"
            className="hover:text-brand-orange transition-colors font-medium"
          >
            Servicos
          </a>
          <a
            href="#plans"
            className="hover:text-brand-orange transition-colors font-medium"
          >
            Planos
          </a>
          <a
            href="#scheduling"
            className="hover:text-brand-orange transition-colors font-medium"
          >
            Agendamento
          </a>
          <Link
            href="/admin"
            className="px-6 py-2 rounded-full bg-brand-orange text-brand-black font-semibold hover:bg-brand-orange-light transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
          >
            Agendar Agora
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-300 hover:text-brand-orange transition-colors"
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

      {menuOpen && (
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-md border-t border-white/5 mt-2">
          <nav className="flex flex-col items-center gap-6 py-8 text-gray-300">
            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
              className="hover:text-brand-orange transition-colors font-medium text-lg"
            >
              Inicio
            </a>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-brand-orange transition-colors font-medium text-lg"
            >
              Sobre
            </a>
            <a
              href="#services"
              onClick={() => setMenuOpen(false)}
              className="hover:text-brand-orange transition-colors font-medium text-lg"
            >
              Servicos
            </a>
            <a
              href="#plans"
              onClick={() => setMenuOpen(false)}
              className="hover:text-brand-orange transition-colors font-medium text-lg"
            >
              Planos
            </a>
            <a
              href="#scheduling"
              onClick={() => setMenuOpen(false)}
              className="hover:text-brand-orange transition-colors font-medium text-lg"
            >
              Agendamento
            </a>
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="px-8 py-3 rounded-full bg-brand-orange text-brand-black font-bold text-lg hover:bg-brand-orange-light transition-all"
            >
              Agendar Agora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
