"use client";

import { useState } from "react";

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

export default function PlansSection() {
  const [period, setPeriod] = useState<Period>("mensal");

  return (
    <section id="plans" className="py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Nossos <span className="text-brand-orange">Planos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Economize assinando um plano. Quanto maior o periodo, maior o
            desconto!
          </p>

          <div className="inline-flex items-center bg-brand-dark rounded-full p-1 border border-white/10">
            {(["mensal", "trimestral", "semestral", "anual"] as Period[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    period === p
                      ? "bg-brand-orange text-brand-black shadow-lg"
                      : "text-gray-400 hover:text-white"
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
                    : "bg-brand-dark border border-white/10 hover:border-white/20"
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
                          : "text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-gray-500 text-lg">R$</span>
                    <span
                      className={`text-5xl font-bold ${
                        plan.color === "orange"
                          ? "text-brand-orange"
                          : plan.color === "gold"
                            ? "text-brand-gold"
                            : "text-white"
                      }`}
                    >
                      {perMonth.toFixed(0).replace(".", ",")}
                    </span>
                    <span className="text-gray-500">,90</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    por mes{period !== "mensal" && ` (${months}x)`}
                  </p>
                  {period !== "mensal" && (
                    <div className="mt-2">
                      <span className="text-gray-600 text-xs line-through">
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
                          feature.included ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                    plan.popular
                      ? "bg-brand-orange text-brand-black hover:bg-brand-orange-light shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                      : plan.color === "gold"
                        ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20"
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Assinar {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Todos os planos possuem cancelamento a qualquer momento. Sem
            multa ou fidelidade.
          </p>
        </div>
      </div>
    </section>
  );
}
