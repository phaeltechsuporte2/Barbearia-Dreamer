"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Review } from "@/lib/supabase";
import { createReview, getApprovedReviews } from "@/lib/actions";

function StarRating({
  rating,
  onRate,
  interactive = false,
  size = 20,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-colors ${interactive ? "cursor-pointer" : "cursor-default"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= (hover || rating) ? "#F97316" : "none"}
            stroke={star <= (hover || rating) ? "#F97316" : "#4B5563"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const [formName, setFormName] = useState("");
  const [formInstagram, setFormInstagram] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formPhoto, setFormPhoto] = useState<File | null>(null);
  const [formPreview, setFormPreview] = useState<string | null>(null);
  const [formSending, setFormSending] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getApprovedReviews();
        setReviews(data);
      } catch {}
    }
    load();
  }, []);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (reviews.length > 0 ? (prev + 1) % reviews.length : 0));
    }, 5000);
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length > 1) resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reviews.length, resetInterval]);

  const go = (dir: number) => {
    if (reviews.length === 0) return;
    setCurrent((prev) => (prev + dir + reviews.length) % reviews.length);
    resetInterval();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Foto muito grande (max 5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 400;
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = Math.round((h / w) * maxSize);
            w = maxSize;
          } else {
            w = Math.round((w / h) * maxSize);
            h = maxSize;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        setFormPreview(canvas.toDataURL("image/jpeg", 0.5));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    setFormPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Nome e obrigatorio.");
      return;
    }
    if (formRating === 0) {
      setFormError("Selecione a nota de 1 a 5 estrelas.");
      return;
    }
    setFormError("");
    setFormSending(true);

    try {
      let photoUrl = "";

      if (formPreview && formPhoto) {
        const supabase = createClient();
        const ext = formPhoto.name.split(".").pop() || "jpg";
        const fileName = "review-" + Date.now() + "." + ext;

        const res = await fetch(formPreview);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: "image/jpeg" });

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("review-photos")
          .upload(fileName, file);

        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage
            .from("review-photos")
            .getPublicUrl(fileName);
          photoUrl = urlData.publicUrl;
        }
      }

      const result = await createReview({
        client_name: formName.trim(),
        instagram_handle: formInstagram.trim() || undefined,
        photo_url: photoUrl || undefined,
        rating: formRating,
        comment: formComment.trim() || undefined,
      });

      if (!result.success) {
        setFormError("Erro: " + result.error);
        return;
      }

      setFormSent(true);
      setFormName("");
      setFormInstagram("");
      setFormRating(0);
      setFormComment("");
      setFormPhoto(null);
      setFormPreview(null);
    } catch (err: unknown) {
      console.error("Erro ao enviar avaliacao:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setFormError("Erro: " + msg);
    } finally {
      setFormSending(false);
    }
  };

  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Avaliacoes dos Clientes
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Seja o primeiro a deixar sua avaliacao!
            </p>
          </div>
          <ReviewForm
            formName={formName}
            setFormName={setFormName}
            formInstagram={formInstagram}
            setFormInstagram={setFormInstagram}
            formRating={formRating}
            setFormRating={setFormRating}
            formComment={formComment}
            setFormComment={setFormComment}
            formPhoto={formPhoto}
            setFormPhoto={setFormPhoto}
            formPreview={formPreview}
            setFormPreview={setFormPreview}
            handlePhotoChange={handlePhotoChange}
            formSending={formSending}
            formSent={formSent}
            formError={formError}
            handleSubmit={handleSubmit}
          />
        </div>
      </section>
    );
  }

  const review = reviews[current];

  return (
    <section className="py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Avaliacoes dos Clientes
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            O que nossos clientes dizem sobre o nosso trabalho
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto mb-16">
          {reviews.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-subtle)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-subtle)] border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </>
          )}

          <div
            className="overflow-hidden rounded-2xl"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const diff = touchStart - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
              setTouchStart(null);
            }}
          >
            <div
              className="bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-2xl p-8 md:p-10 transition-all duration-500"
              key={review.id}
            >
              <div className="flex flex-col items-center text-center">
                {review.photo_url && (
                  <img
                    src={review.photo_url}
                    alt={`Foto de ${review.client_name}`}
                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl mb-6 cursor-pointer border-2 border-[var(--border-main)] hover:border-brand-orange transition-colors"
                    onClick={() => {
                      setLightboxImg(review.photo_url!);
                      setLightboxAlt(`Foto de ${review.client_name}`);
                    }}
                  />
                )}

                <StarRating rating={review.rating} size={24} />

                {review.comment && (
                  <p className="text-[var(--text-secondary)] mt-4 mb-4 text-lg leading-relaxed max-w-lg italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}

                <div className="mt-2">
                  <p className="font-bold text-[var(--text-primary)] text-lg">
                    {review.client_name}
                  </p>
                  {review.instagram_handle && (
                    <a
                      href={`https://instagram.com/${review.instagram_handle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-orange text-sm hover:underline"
                    >
                      @{review.instagram_handle.replace("@", "")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrent(i);
                    resetInterval();
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? "bg-brand-orange" : "bg-[var(--border-main)]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <ReviewForm
          formName={formName}
          setFormName={setFormName}
          formInstagram={formInstagram}
          setFormInstagram={setFormInstagram}
          formRating={formRating}
          setFormRating={setFormRating}
          formComment={formComment}
          setFormComment={setFormComment}
          formPhoto={formPhoto}
          setFormPhoto={setFormPhoto}
          formPreview={formPreview}
          setFormPreview={setFormPreview}
          handlePhotoChange={handlePhotoChange}
          formSending={formSending}
          formSent={formSent}
          formError={formError}
          handleSubmit={handleSubmit}
        />
      </div>

      {lightboxImg && (
        <Lightbox
          src={lightboxImg}
          alt={lightboxAlt}
          onClose={() => {
            setLightboxImg(null);
            setLightboxAlt("");
          }}
        />
      )}
    </section>
  );
}

function ReviewForm({
  formName,
  setFormName,
  formInstagram,
  setFormInstagram,
  formRating,
  setFormRating,
  formComment,
  setFormComment,
  formPhoto: _formPhoto,
  setFormPhoto,
  formPreview,
  setFormPreview,
  handlePhotoChange,
  formSending,
  formSent,
  formError,
  handleSubmit,
}: {
  formName: string;
  setFormName: (v: string) => void;
  formInstagram: string;
  setFormInstagram: (v: string) => void;
  formRating: number;
  setFormRating: (v: number) => void;
  formComment: string;
  setFormComment: (v: string) => void;
  formPhoto: File | null;
  setFormPhoto: (v: File | null) => void;
  formPreview: string | null;
  setFormPreview: (v: string | null) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formSending: boolean;
  formSent: boolean;
  formError: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  if (formSent) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-2xl">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Avaliacao Enviada!
        </h3>
        <p className="text-[var(--text-secondary)]">
          Sua avaliacao sera exibida apos a aprovacao do admin.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-2xl p-8">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
        Deixe sua Avaliacao
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Seu nome *
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Nome"
            className="w-full min-h-[44px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/20 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            @ Instagram (opcional)
          </label>
          <input
            type="text"
            value={formInstagram}
            onChange={(e) => setFormInstagram(e.target.value)}
            placeholder="@seuusuario"
            className="w-full min-h-[44px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/20 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Nota *
          </label>
          <StarRating rating={formRating} onRate={setFormRating} interactive size={28} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Foto do corte (opcional)
          </label>
          <label className="flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-white/5 border border-dashed border-white/10 px-4 py-3 text-gray-400 hover:border-brand-orange/40 hover:text-brand-orange transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            {formPreview ? "Foto selecionada" : "Escolher foto (max 5MB)"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          {formPreview && (
            <div className="relative inline-block mt-3">
              <img
                src={formPreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-xl border border-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setFormPreview(null);
                  setFormPhoto(null);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
              >
                X
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Comentario (opcional)
          </label>
          <textarea
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            placeholder="Conte sua experiencia..."
            rows={3}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/20 transition-colors resize-none"
          />
        </div>

        {formError && <p className="text-sm text-red-400">{formError}</p>}

        <button
          type="submit"
          disabled={formSending}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-brand-orange text-brand-black rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
        >
          {formSending ? "Enviando..." : "Enviar Avaliacao"}
        </button>
      </form>
    </div>
  );
}
