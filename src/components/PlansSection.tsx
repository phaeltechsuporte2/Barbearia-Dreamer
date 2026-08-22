"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { createPlan } from "@/lib/actions";

type Period = "mensal" | "trimestral" | "semestral" | "anual";

const periodLabels: Record<Period, string> = {
  mensal: "Mensal",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
};

const periodDiscounts: Record<Period, number> = {
  mensal: 0,
  trimestral: 10,
  semestral: 20,
  anual: 30,
};

const PLAN_DAYS: Record<Period, number> = {
  mensal: 30,
  trimestral: 90,
  semestral: 180,
  anual: 365,
};

const plans = [
  {
    name: "Basico",
    description: "Ideal para quem quer manter o visual em dia",
    monthlyPrice: 79.90,
    features: [
      { text: "2 Cortes por mes", included: true },
      { text: "1 Barba por mes", included: true },
      { text: "Sobrancelha inclusa", included: true },
      { text: "Corte infantil", included: false },
      { text: "Hidratacao capilar", included: false },
      { text: "Pigmentacao", included: false },
      { text: "Prioridade no agendamento", included: false },
      { text: "Desconto em produtos", included: false },
    ],
    color: "gray",
    popular: false,
  },
  {
    name: "Premium",
    description: "O mais escolhido pelos nossos clientes",
    monthlyPrice: 149.90,
    features: [
      { text: "4 Cortes por mes", included: true },
      { text: "4 Barbas por mes", included: true },
      { text: "Sobrancelha inclusa", included: true },
      { text: "Corte infantil", included: true },
      { text: "Hidratacao capilar", included: true },
      { text: "Pigmentacao", included: false },
      { text: "Prioridade no agendamento", included: true },
      { text: "Desconto em produtos", included: false },
    ],
    color: "orange",
    popular: true,
  },
  {
    name: "VIP",
    description: "Experiencia completa e exclusiva",
    monthlyPrice: 249.90,
    features: [
      { text: "Cortes ilimitados", included: true },
      { text: "Barbas ilimitadas", included: true },
      { text: "Sobrancelha inclusa", included: true },
      { text: "Corte infantil", included: true },
      { text: "Hidratacao capilar", included: true },
      { text: "Pigmentacao", included: true },
      { text: "Prioridade no agendamento", included: true },
      { text: "20% desconto em produtos", included: true },
    ],
    color: "gold",
    popular: false,
  },
];

function getPrice(monthly: number, period: Period): number {
  const multiplier =
    period === "mensal"
      ? 1
      : period === "trimestral"
        ? 3
        : period === "semestral"
          ? 6
          : 12;
  const discount = periodDiscounts[period] / 100;
  return monthly * multiplier * (1 - discount);
}

function getPerMonth(monthly: number, period: Period): number {
  const total = getPrice(monthly, period);
  const months =
    period === "mensal"
      ? 1
      : period === "trimestral"
        ? 3
        : period === "semestral"
          ? 6
          : 12;
  return total / months;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PlansSection() {
  const { user, loading: authLoading } = useAuth();
  const [period, setPeriod] = useState<Period>("mensal");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata;
      if (meta?.name && !clientName) setClientName(meta.name);
    }
  }, [user]);

  const maskPhone = (value: string) => {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  async function handleSubscribe(planName: string) {
    if (!user) return;
    if (!clientName.trim() || !clientPhone.trim()) {
      setError("Preencha nome e telefone.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const today = getTodayStr();
      const plan = plans.find((p) => p.name === planName)!;
      await createPlan({
        client_name: clientName.trim(),
        client_email: user.email || "",
        client_phone: clientPhone.trim(),
        plan_name: planName,
        plan_type: periodLabels[period],
        amount_paid: getPrice(plan.monthlyPrice, period),
        start_date: today,
        end_date: addDays(today, PLAN_DAYS[period]),
      });
      setSuccess(true);
      setSelectedPlan(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar plano. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <section id="plans" className="py-24 bg-brand-black relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section id="plans" className="py-24 bg-brand-black relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="max-w-md mx-auto bg-brand-dark rounded-2xl p-8 border border-[var(--border-subtle)]">
            <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Faca Login para Assinar</h3>
            <p className="text-[var(--text-secondary)] mb-6">Voce precisa estar logado para assinar um plano.</p>
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" className="w-full min-h-[44px] flex items-center justify-center px-6 py-3 bg-brand-orange text-brand-black rounded-full font-bold hover:bg-brand-orange-light transition-all">
                Entrar
              </Link>
              <Link href="/auth/register" className="w-full min-h-[44px] flex items-center justify-center px-6 py-3 border border-brand-orange text-brand-orange rounded-full font-semibold hover:bg-brand-orange/10 transition-all">
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section id="plans" className="py-24 bg-brand-black relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="max-w-md mx-auto bg-brand-dark rounded-2xl p-8 border border-green-500/30">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Plano Cadastrado!</h3>
            <p className="text-[var(--text-secondary)] mb-6">Seu plano foi cadastrado com sucesso.</p>
            <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-brand-orange text-brand-black rounded-full font-bold hover:bg-brand-orange-light transition-all">
              Ver Outros Planos
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="plans" className="py-24 bg-brand-black relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 500px 500px at 50% 50%, rgba(249,115,22,0.05), transparent)",
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Nossos <span className="text-brand-orange">Planos</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Economize assinando um plano. Quanto maior o periodo, maior o
            desconto!
          </p>

          <div className="inline-flex items-center bg-brand-dark rounded-full p-1 border border-[var(--border-main)]">
            {(["mensal", "trimestral", "semestral", "anual"] as Period[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    period === p
                      ? "bg-brand-orange text-brand-black shadow-lg"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {periodLabels[p]}
                  {p !== "mensal" && (
                    <span
                      className={`absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        period === p
                          ? "bg-brand-black text-brand-orange"
                          : "bg-brand-orange/20 text-brand-orange"
                      }`}
                    >
                      -{periodDiscounts[p]}%
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const total = getPrice(plan.monthlyPrice, period);
            const perMonth = getPerMonth(plan.monthlyPrice, period);
            const months =
              period === "mensal"
                ? 1
                : period === "trimestral"
                  ? 3
                  : period === "semestral"
                    ? 6
                    : 12;

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 transition-all ${
                  plan.popular
                    ? "bg-brand-dark border-2 border-brand-orange shadow-[0_0_40px_rgba(249,115,22,0.15)] scale-105"
                    : "bg-brand-dark border border-[var(--border-main)] hover:border-[var(--border-main)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-orange text-brand-black text-xs font-bold rounded-full">
                    MAIS POPULAR
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      plan.color === "orange"
                        ? "text-brand-orange"
                        : plan.color === "gold"
                          ? "text-brand-gold"
                          : "text-[var(--text-primary)]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[var(--text-muted)] text-lg">R$</span>
                    <span
                      className={`text-5xl font-bold ${
                        plan.color === "orange"
                          ? "text-brand-orange"
                          : plan.color === "gold"
                            ? "text-brand-gold"
                            : "text-[var(--text-primary)]"
                      }`}
                    >
                      {perMonth.toFixed(0).replace(".", ",")}
                    </span>
                    <span className="text-[var(--text-muted)]">,90</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    por mes{period !== "mensal" && ` (${months}x)`}
                  </p>
                  {period !== "mensal" && (
                    <div className="mt-2">
                      <span className="text-[var(--text-muted)] text-xs line-through">
                        R${" "}
                        {(plan.monthlyPrice * months)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                      <span className="text-green-400 text-xs ml-2 font-medium">
                        Economize R${" "}
                        {(
                          plan.monthlyPrice * months -
                          total
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-center gap-3"
                    >
                      {feature.included ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={
                            plan.color === "orange"
                              ? "#F97316"
                              : plan.color === "gold"
                                ? "#F59E0B"
                                : "#22C55E"
                          }
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4B5563"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                    plan.popular
                      ? "bg-brand-orange text-brand-black hover:bg-brand-orange-light shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                      : plan.color === "gold"
                        ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20"
                        : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-main)] hover:bg-[var(--bg-subtle-hover)]"
                  }`}
                >
                  Assinar {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-[var(--text-muted)] text-sm">
            Todos os planos possuem cancelamento a qualquer momento. Sem
            multa ou fidelidade.
          </p>
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => { setSelectedPlan(null); setError(""); }}>
          <div className="bg-brand-dark rounded-2xl p-6 md:p-8 border border-[var(--border-main)] max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Assinar {selectedPlan}
              </h3>
              <button onClick={() => { setSelectedPlan(null); setError(""); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="bg-[var(--bg-subtle)] rounded-xl p-4 mb-6 text-center">
              <p className="text-[var(--text-muted)] text-sm">Plano {periodLabels[period]}</p>
              <p className="text-2xl font-bold text-brand-orange mt-1">
                R$ {getPrice(plans.find((p) => p.name === selectedPlan)!.monthlyPrice, period).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-[var(--text-muted)] text-xs mt-1">
                {PLAN_DAYS[period]} dias de duracao
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubscribe(selectedPlan); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Nome</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-orange/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(maskPhone(e.target.value))}
                  inputMode="numeric"
                  maxLength={16}
                  placeholder="(11) 98834-6626"
                  className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-orange/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl text-[var(--text-muted)] opacity-60 cursor-not-allowed"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] px-6 py-3 bg-brand-orange text-brand-black rounded-full font-bold hover:bg-brand-orange-light transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Cadastrando..." : "Confirmar Assinatura"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
