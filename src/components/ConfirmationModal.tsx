"use client";

import { useEffect, type ReactNode } from "react";

export default function ConfirmationModal({
  open,
  onClose,
  title,
  message,
  children,
  actionLabel,
  onAction,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-8 text-center bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.15)] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
        >
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22C55E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 pr-8">
          {title}
        </h3>
        {message && (
          <p className="text-[var(--text-secondary)] mb-5">{message}</p>
        )}
        {children}

        {actionLabel && (
          <button
            onClick={onAction ?? onClose}
            className="mt-6 w-full min-h-[48px] px-6 py-3 bg-brand-orange text-brand-black rounded-full font-bold hover:bg-brand-orange-light transition-all active:scale-[0.98]"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
