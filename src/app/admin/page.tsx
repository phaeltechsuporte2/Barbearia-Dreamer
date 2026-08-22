"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  getAppointments,
  getRevenueStats,
  updateAppointmentStatus,
  getPlans,
  createPlan as createPlanAction,
} from "@/lib/actions";
import type { Appointment, Plan } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-browser";

type Tab = "dashboard" | "agendamentos" | "historico" | "planos" | "lembretes";
type PlanType = "Mensal" | "Trimestral" | "Semestral" | "Anual";

const PLAN_DURATIONS: Record<PlanType, number> = {
  Mensal: 30,
  Trimestral: 90,
  Semestral: 180,
  Anual: 365,
};

const PLAN_TYPE_OPTIONS: PlanType[] = [
  "Mensal",
  "Trimestral",
  "Semestral",
  "Anual",
];

const STATUS_STYLES: Record<Appointment["status"], string> = {
  confirmado: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  concluido: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<Appointment["status"], string> = {
  confirmado: "Confirmado",
  concluido: "Concluido",
  cancelado: "Cancelado",
};

function getTodayStr(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T12:00:00").getTime();
  const now = new Date(getTodayStr() + "T12:00:00").getTime();
  return Math.ceil((target - now) / 86400000);
}

function formatDateBR(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR");
}

function Icon({
  children,
  size = 20,
  stroke = "currentColor",
  className = "",
}: {
  children: ReactNode;
  size?: number;
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatusToggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Marcar como confirmado" : "Marcar como concluido"}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 disabled:opacity-40 disabled:pointer-events-none before:absolute before:-inset-2 before:rounded-full before:content-[''] ${
        checked ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-out ${
          checked ? "translate-x-[26px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

const NAV_ITEMS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </>
    ),
  },
  {
    id: "agendamentos",
    label: "Agendamentos",
    icon: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
  },
  {
    id: "historico",
    label: "Historico",
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </>
    ),
  },
  {
    id: "planos",
    label: "Planos",
    icon: (
      <>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </>
    ),
  },
  {
    id: "lembretes",
    label: "Lembretes",
    icon: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
];

const TAB_TITLES: Record<Tab, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Visao geral do seu negocio" },
  agendamentos: {
    title: "Agendamentos",
    subtitle: "Gerencie os agendamentos",
  },
  historico: {
    title: "Historico",
    subtitle: "Todos os atendimentos passados",
  },
  planos: { title: "Planos", subtitle: "Gerencie os planos dos clientes" },
  lembretes: {
    title: "Lembretes",
    subtitle: "Planos proximos do vencimento",
  },
};

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    todayCount: 0,
    completedCount: 0,
    pendingCount: 0,
    totalAppointments: 0,
    totalCompleted: 0,
    totalConfirmed: 0,
  });
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filter, setFilter] = useState<"todos" | "hoje" | "semana">("todos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [historySearch, setHistorySearch] = useState("");
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [planName, setPlanName] = useState("");
  const [planEmail, setPlanEmail] = useState("");
  const [planPhone, setPlanPhone] = useState("");
  const [planPlanName, setPlanPlanName] = useState("Basico");
  const [planType, setPlanType] = useState<PlanType>("Mensal");
  const [planAmount, setPlanAmount] = useState("");
  const [planStartDate, setPlanStartDate] = useState(getTodayStr());
  const [planError, setPlanError] = useState("");

  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);

  const [previewPlan, setPreviewPlan] = useState<(Plan & { daysRemaining: number }) | null>(null);

  async function loadData() {
    try {
      const [appointmentsData, statsData, plansData] = await Promise.all([
        getAppointments(),
        getRevenueStats(),
        getPlans(),
      ]);
      setAppointments(appointmentsData);
      setStats(statsData);
      setPlans(plansData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  const loadDataRef = useRef(loadData);
  loadDataRef.current = loadData;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          loadDataRef.current();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "plans" },
        () => {
          loadDataRef.current();
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      loadDataRef.current();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  async function handleStatusChange(
    id: string,
    newStatus: "confirmado" | "concluido" | "cancelado"
  ) {
    setUpdatingId(id);
    try {
      const updated = await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updated : apt))
      );
      const statsData = await getRevenueStats();
      setStats(statsData);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleAddPlan(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(planAmount);
    if (
      !planName.trim() ||
      !planEmail.trim() ||
      !planStartDate ||
      isNaN(amount) ||
      amount <= 0
    ) {
      setPlanError("Preencha todos os campos corretamente.");
      return;
    }
    setPlanError("");
    try {
      const newPlan = await createPlanAction({
        client_name: planName.trim(),
        client_email: planEmail.trim(),
        client_phone: planPhone.trim(),
        plan_name: planPlanName,
        plan_type: planType,
        amount_paid: amount,
        start_date: planStartDate,
        end_date: addDays(planStartDate, PLAN_DURATIONS[planType]),
      });
      setPlans((prev) => [newPlan, ...prev]);
      setPlanName("");
      setPlanEmail("");
      setPlanPhone("");
      setPlanAmount("");
      setPlanPlanName("Basico");
      setPlanType("Mensal");
      setPlanStartDate(getTodayStr());
    } catch (err) {
      console.error("Erro ao criar plano:", err);
      setPlanError("Erro ao criar plano. Tente novamente.");
    }
  }

  async function sendReminder(id: string) {
    setSendingId(id);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRemindedIds((prev) => new Set(prev).add(id));
    setSendingId(null);
  }

  async function sendAllReminders() {
    setSendingAll(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setRemindedIds(new Set(expiringPlans.map((p) => p.id)));
    setSendingAll(false);
  }

  async function confirmSendPlanEmail() {
    if (!previewPlan) return;
    setSendingId(previewPlan.id);
    try {
      await fetch("/api/email/reminder", {
        method: "POST",
        body: JSON.stringify({
          clientName: previewPlan.client_name,
          clientEmail: previewPlan.client_email,
          planName: previewPlan.plan_name || previewPlan.plan_type,
          daysRemaining: previewPlan.daysRemaining,
          expiryDate: previewPlan.end_date,
        }),
      });
      setRemindedIds((prev) => new Set(prev).add(previewPlan.id));
    } catch (err) {
      console.error("Erro ao enviar email:", err);
    } finally {
      setSendingId(null);
      setPreviewPlan(null);
    }
  }

  const today = getTodayStr();

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (filter === "hoje") return apt.appointment_date === today;
      if (filter === "semana") {
        const aptDate = new Date(apt.appointment_date);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return aptDate >= weekStart && aptDate <= weekEnd;
      }
      return true;
    });
  }, [appointments, filter, today]);

  const historyAppointments = useMemo(() => {
    const search = historySearch.trim().toLowerCase();
    return appointments.filter((apt) => {
      if (apt.status !== "concluido" && apt.status !== "cancelado")
        return false;
      if (search && !apt.client_name.toLowerCase().includes(search))
        return false;
      if (historyFrom && apt.appointment_date < historyFrom) return false;
      if (historyTo && apt.appointment_date > historyTo) return false;
      return true;
    });
  }, [appointments, historySearch, historyFrom, historyTo]);

  const historySummary = useMemo(() => {
    return {
      total: historyAppointments.length,
      completed: historyAppointments.filter(
        (apt) => apt.status === "concluido"
      ).length,
      cancelled: historyAppointments.filter(
        (apt) => apt.status === "cancelado"
      ).length,
    };
  }, [historyAppointments]);

  const clientHistory = useMemo(() => {
    if (!selectedClient) return [];
    return appointments.filter(
      (apt) => apt.client_name === selectedClient
    );
  }, [appointments, selectedClient]);

  const clientStats = useMemo(() => {
    return {
      total: clientHistory.length,
      completed: clientHistory.filter((apt) => apt.status === "concluido")
        .length,
      cancelled: clientHistory.filter((apt) => apt.status === "cancelado")
        .length,
      totalSpent: clientHistory
        .filter((apt) => apt.status === "concluido")
        .reduce((sum, apt) => sum + (apt.services?.price ?? 0), 0),
    };
  }, [clientHistory]);

  const plansWithMeta = useMemo(() => {
    return plans
      .map((plan) => ({
        ...plan,
        daysRemaining: daysUntil(plan.end_date),
        expired: daysUntil(plan.end_date) < 0,
      }))
      .sort((a, b) => a.end_date.localeCompare(b.end_date));
  }, [plans]);

  const expiringPlans = useMemo(() => {
    return plansWithMeta
      .filter((plan) => plan.daysRemaining >= 0 && plan.daysRemaining <= 7)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [plansWithMeta]);

  const fieldClasses =
    "admin-field w-full min-h-[44px] rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 text-base focus:outline-none focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/20 transition-colors";

  const inputStyleBlock = (
    <style>{`
      .admin-field {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        color-scheme: dark;
      }
      .admin-field::-webkit-calendar-picker-indicator {
        filter: invert(60%);
        cursor: pointer;
      }
    `}</style>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-orange text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex">
      {inputStyleBlock}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-dark border-r border-white/5 flex flex-col transform transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-bold text-white">Dreamer</h1>
              <p className="text-xs text-gray-500">Painel Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl transition-colors font-medium ${
                tab === item.id
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20}>{item.icon}</Icon>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
            <Icon size={20}>
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </Icon>
            Voltar ao Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[calc(env(safe-area-inset-bottom)+2rem)] md:p-8">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <button
                className="md:hidden text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
              >
                <Icon size={24}>
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </Icon>
              </button>
              <div className="min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white truncate">
                  {TAB_TITLES[tab].title}
                </h2>
                <p className="text-gray-500 mt-1 truncate">
                  {TAB_TITLES[tab].subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 min-h-[44px] bg-brand-orange/10 text-brand-orange rounded-lg hover:bg-brand-orange/20 transition-colors text-sm font-medium shrink-0"
            >
              Atualizar
            </button>
          </div>

          <div key={tab} className="animate-fade-in-up">
            {tab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-brand-orange/10 rounded-xl">
                        <Icon size={24} stroke="#F97316">
                          <line x1="12" x2="12" y1="20" y2="10" />
                          <line x1="18" x2="18" y1="20" y2="4" />
                          <line x1="6" x2="6" y1="20" y2="16" />
                        </Icon>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      R$ {stats.todayRevenue.toFixed(0)}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Faturamento Hoje
                    </p>
                  </div>

                  <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Icon size={24} stroke="#3B82F6">
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="4"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </Icon>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      {stats.todayCount}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Agendamentos Hoje
                    </p>
                  </div>

                  <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-500/10 rounded-xl">
                        <Icon size={24} stroke="#22C55E">
                          <path d="M20 6 9 17l-5-5" />
                        </Icon>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      {stats.completedCount}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Concluidos Hoje</p>
                  </div>

                  <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-yellow-500/10 rounded-xl">
                        <Icon size={24} stroke="#EAB308">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </Icon>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      {stats.pendingCount}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Pendentes Hoje</p>
                  </div>
                </div>

                <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Faturamento Total
                    </h3>
                    <span className="text-sm text-gray-500">
                      Todos os registros
                    </span>
                  </div>
                  <div className="flex items-end gap-4 flex-wrap">
                    <span className="text-4xl md:text-5xl font-bold text-brand-orange break-all">
                      R$ {stats.totalRevenue.toFixed(2)}
                    </span>
                    <span className="text-green-400 text-lg font-medium mb-1">
                      Total acumulado
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-white">
                        {stats.totalCompleted}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Concluidos
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-white">
                        {stats.totalConfirmed}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Confirmados
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-white">
                        {stats.totalAppointments}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Total</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === "agendamentos" && (
              <div className="bg-brand-dark rounded-2xl border border-white/5">
                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-white">
                    Agendamentos
                  </h3>
                  <div className="flex gap-2">
                    {(["todos", "hoje", "semana"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                          filter === f
                            ? "bg-brand-orange text-brand-black"
                            : "bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {f === "hoje"
                          ? "Hoje"
                          : f === "semana"
                            ? "Semana"
                            : "Todos"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                          Cliente
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                          Servico
                        </th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                          Barbeiro
                        </th>
                        <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                          Horario
                        </th>
                        <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                          Valor
                        </th>
                        <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                          Concluido
                        </th>
                        <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                          Acoes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((apt) => (
                        <tr
                          key={apt.id}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 md:px-6 py-4">
                            <div className="font-medium text-white">
                              {apt.client_name}
                            </div>
                            {apt.client_email && (
                              <div className="text-xs text-gray-500">
                                {apt.client_email}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 md:hidden">
                              {apt.services?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                            {apt.services?.name}
                          </td>
                          <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                            {apt.barbers?.name}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-gray-400 whitespace-nowrap">
                            {formatDateBR(apt.appointment_date)}{" "}
                            {apt.appointment_time?.slice(0, 5)}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-brand-orange font-medium whitespace-nowrap">
                            R$ {apt.services?.price}
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <StatusToggle
                                checked={apt.status === "concluido"}
                                disabled={
                                  updatingId === apt.id ||
                                  apt.status === "cancelado"
                                }
                                onChange={(checked) =>
                                  handleStatusChange(
                                    apt.id,
                                    checked ? "concluido" : "confirmado"
                                  )
                                }
                              />
                              <StatusBadge status={apt.status} />
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <button
                              onClick={() =>
                                handleStatusChange(apt.id, "cancelado")
                              }
                              disabled={
                                apt.status === "cancelado" ||
                                updatingId === apt.id
                              }
                              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                              aria-label="Cancelar agendamento"
                              title="Cancelar agendamento"
                            >
                              <Icon size={18}>
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                              </Icon>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredAppointments.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            Nenhum agendamento encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "historico" && (
              <div className="space-y-6">
                {selectedClient ? (
                  <div className="bg-brand-dark rounded-2xl border border-white/5">
                    <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-white truncate">
                          Historico de {selectedClient}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Todos os agendamentos deste cliente
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedClient(null)}
                        className="w-full sm:w-auto px-4 py-2 min-h-[44px] bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-sm font-medium shrink-0"
                      >
                        Voltar
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">
                          {clientStats.total}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {clientStats.completed}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Concluidos
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {clientStats.cancelled}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Cancelados
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-brand-orange break-all">
                          R$ {clientStats.totalSpent.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total Gasto
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                              Servico
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                              Barbeiro
                            </th>
                            <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                              Data
                            </th>
                            <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                              Valor
                            </th>
                            <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientHistory.map((apt) => (
                            <tr
                              key={apt.id}
                              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="px-4 md:px-6 py-4 text-gray-400">
                                {apt.services?.name}
                              </td>
                              <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                                {apt.barbers?.name}
                              </td>
                              <td className="px-4 md:px-6 py-4 text-gray-400 whitespace-nowrap">
                                {formatDateBR(apt.appointment_date)}{" "}
                                {apt.appointment_time?.slice(0, 5)}
                              </td>
                              <td className="px-4 md:px-6 py-4 text-brand-orange font-medium whitespace-nowrap">
                                R$ {apt.services?.price}
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <StatusBadge status={apt.status} />
                              </td>
                            </tr>
                          ))}
                          {clientHistory.length === 0 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-6 py-12 text-center text-gray-500"
                              >
                                Nenhum agendamento encontrado para este cliente
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                <>
                <div className="bg-brand-dark rounded-2xl p-4 md:p-6 border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Buscar cliente
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={historySearch}
                          onChange={(e) => setHistorySearch(e.target.value)}
                          placeholder="Nome do cliente..."
                          className={`${fieldClasses} pr-11`}
                        />
                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                          <Icon size={18}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </Icon>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        De
                      </label>
                      <input
                        type="date"
                        value={historyFrom}
                        onChange={(e) => setHistoryFrom(e.target.value)}
                        className={fieldClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Ate
                      </label>
                      <input
                        type="date"
                        value={historyTo}
                        onChange={(e) => setHistoryTo(e.target.value)}
                        className={fieldClasses}
                      />
                    </div>
                  </div>
                  {(historySearch || historyFrom || historyTo) && (
                    <button
                      onClick={() => {
                        setHistorySearch("");
                        setHistoryFrom("");
                        setHistoryTo("");
                      }}
                      className="mt-4 text-sm text-brand-orange hover:text-brand-orange-light transition-colors font-medium min-h-[44px]"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-brand-dark rounded-2xl p-4 md:p-6 border border-white/5 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {historySummary.total}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">
                      Total
                    </div>
                  </div>
                  <div className="bg-brand-dark rounded-2xl p-4 md:p-6 border border-white/5 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-green-400">
                      {historySummary.completed}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">
                      Concluidos
                    </div>
                  </div>
                  <div className="bg-brand-dark rounded-2xl p-4 md:p-6 border border-white/5 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-red-400">
                      {historySummary.cancelled}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">
                      Cancelados
                    </div>
                  </div>
                </div>

                <div className="bg-brand-dark rounded-2xl border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Cliente
                          </th>
                          <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                            Servico
                          </th>
                          <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                            Barbeiro
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Data
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Valor
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyAppointments.map((apt) => (
                          <tr
                            key={apt.id}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-4 md:px-6 py-4">
                              <button
                                onClick={() => setSelectedClient(apt.client_name)}
                                className="font-medium text-white hover:text-brand-orange transition-colors text-left"
                                title="Ver historico do cliente"
                              >
                                {apt.client_name}
                              </button>
                              <div className="text-xs text-gray-500">
                                {apt.client_phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                              {apt.services?.name}
                            </td>
                            <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                              {apt.barbers?.name}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-gray-400 whitespace-nowrap">
                              {formatDateBR(apt.appointment_date)}{" "}
                              {apt.appointment_time?.slice(0, 5)}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-brand-orange font-medium whitespace-nowrap">
                              R$ {apt.services?.price}
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <StatusBadge status={apt.status} />
                            </td>
                          </tr>
                        ))}
                        {historyAppointments.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              Nenhum registro no historico
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                </>
                )}
              </div>
            )}

            {tab === "planos" && (
              <div className="space-y-6">
                <div className="bg-brand-dark rounded-2xl p-4 md:p-6 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-6">
                    Adicionar Plano
                  </h3>
                  <form onSubmit={handleAddPlan}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Nome do Cliente
                        </label>
                        <input
                          type="text"
                          value={planName}
                          onChange={(e) => setPlanName(e.target.value)}
                          placeholder="Nome do cliente"
                          className={fieldClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Email do Cliente
                        </label>
                        <input
                          type="email"
                          value={planEmail}
                          onChange={(e) => setPlanEmail(e.target.value)}
                          placeholder="email@exemplo.com"
                          className={fieldClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={planPhone}
                          onChange={(e) => setPlanPhone(e.target.value)}
                          placeholder="(11) 98834-6626"
                          className={fieldClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Plano
                        </label>
                        <div className="relative">
                          <select
                            value={planPlanName}
                            onChange={(e) => setPlanPlanName(e.target.value)}
                            className={`${fieldClasses} pr-10`}
                          >
                            <option value="Basico">Basico</option>
                            <option value="Premium">Premium</option>
                            <option value="VIP">VIP</option>
                          </select>
                          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                            <Icon size={16}>
                              <path d="m6 9 6 6 6-6" />
                            </Icon>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Periodo
                        </label>
                        <div className="relative">
                          <select
                            value={planType}
                            onChange={(e) =>
                              setPlanType(e.target.value as PlanType)
                            }
                            className={`${fieldClasses} pr-10`}
                          >
                            {PLAN_TYPE_OPTIONS.map((type) => (
                              <option key={type} value={type}>
                                {type} ({PLAN_DURATIONS[type]} dias)
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                            <Icon size={16}>
                              <path d="m6 9 6 6 6-6" />
                            </Icon>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Valor Pago (R$)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={planAmount}
                          onChange={(e) => setPlanAmount(e.target.value)}
                          placeholder="0,00"
                          className={fieldClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Data de Inicio
                        </label>
                        <input
                          type="date"
                          value={planStartDate}
                          onChange={(e) => setPlanStartDate(e.target.value)}
                          className={fieldClasses}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-brand-orange text-brand-black rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors"
                        >
                          <Icon size={18}>
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </Icon>
                          Adicionar
                        </button>
                      </div>
                    </div>
                    {planError && (
                      <p className="mt-4 text-sm text-red-400">{planError}</p>
                    )}
                  </form>
                </div>

                <div className="bg-brand-dark rounded-2xl border border-white/5">
                  <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">Planos</h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {plansWithMeta.length}{" "}
                      {plansWithMeta.length === 1
                        ? "plano cadastrado"
                        : "planos cadastrados"}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Cliente
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Plano
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Valor Pago
                          </th>
                          <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                            Inicio
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Fim
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Restam
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Status
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500 min-w-[140px]">
                            Progresso
                          </th>
                          <th className="text-left px-4 md:px-6 py-4 text-sm font-medium text-gray-500">
                            Acoes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {plansWithMeta.map((plan) => {
                          const totalDays = PLAN_DURATIONS[plan.plan_type as PlanType];
                          const elapsed = totalDays - plan.daysRemaining;
                          const percent = Math.max(
                            0,
                            Math.min(100, (elapsed / totalDays) * 100)
                          );
                          const remainingPercent = 100 - percent;
                          const barColor = plan.expired
                            ? "bg-gray-500"
                            : remainingPercent > 50
                              ? "bg-green-500"
                              : remainingPercent > 20
                                ? "bg-yellow-500"
                                : "bg-red-500";
                          const reminded = remindedIds.has(plan.id);
                          return (
                            <tr
                              key={plan.id}
                              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            >
                            <td className="px-4 md:px-6 py-4 font-medium text-white">
                              {plan.client_name}
                              {plan.client_phone && (
                                <div className="text-xs text-gray-500">{plan.client_phone}</div>
                              )}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-gray-400 whitespace-nowrap">
                              <span className="text-brand-orange font-medium">{plan.plan_name || "—"}</span>
                              <br />
                              <span className="text-xs">{plan.plan_type}</span>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-brand-orange font-medium whitespace-nowrap">
                              R$ {plan.amount_paid.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-gray-400 hidden md:table-cell whitespace-nowrap">
                              {formatDateBR(plan.start_date)}
                            </td>
                            <td className="px-4 md:px-6 py-4 text-gray-400 whitespace-nowrap">
                              {formatDateBR(plan.end_date)}
                            </td>
                            <td
                              className={`px-4 md:px-6 py-4 font-medium whitespace-nowrap ${
                                plan.expired
                                  ? "text-red-400"
                                  : plan.daysRemaining <= 7
                                    ? "text-yellow-400"
                                    : "text-green-400"
                              }`}
                            >
                              {Math.max(0, plan.daysRemaining)} dias
                            </td>
                              <td className="px-4 md:px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                                    plan.expired
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : "bg-green-500/20 text-green-400 border-green-500/30"
                                  }`}
                                >
                                  {plan.expired ? "Expirada" : "Ativa"}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <div className="w-full h-2 bg-white/10 rounded-full">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <span className="block text-xs text-gray-500 mt-1.5 whitespace-nowrap">
                                  {Math.max(0, elapsed)} de {totalDays} dias
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-4">
                                <button
                                  onClick={() => setPreviewPlan(plan)}
                                  disabled={reminded || sendingId === plan.id}
                                  className={`flex items-center justify-center gap-2 px-3 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                                    reminded
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : "bg-brand-orange/10 text-brand-orange border border-brand-orange/30 hover:bg-brand-orange/20"
                                  } disabled:pointer-events-none`}
                                >
                                  {reminded
                                    ? "Enviado!"
                                    : sendingId === plan.id
                                      ? "Enviando..."
                                      : "Enviar Email"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {plansWithMeta.length === 0 && (
                          <tr>
                            <td
                              colSpan={9}
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              Nenhum plano cadastrado ainda
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {tab === "lembretes" && (
              <div className="bg-brand-dark rounded-2xl border border-white/5">
                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Vencimentos Proximos
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Planos que vencem nos proximos 7 dias
                    </p>
                  </div>
                  <button
                    onClick={sendAllReminders}
                    disabled={
                      sendingAll ||
                      expiringPlans.length === 0 ||
                      expiringPlans.every((p) => remindedIds.has(p.id))
                    }
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-brand-orange text-brand-black rounded-xl text-sm font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
                  >
                    <Icon size={16}>
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </Icon>
                    {sendingAll ? "Enviando..." : "Enviar Todos"}
                  </button>
                </div>

                <div>
                  {expiringPlans.map((plan) => {
                    const reminded = remindedIds.has(plan.id);
                    return (
                      <div
                        key={plan.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          <div
                            className={`p-3 rounded-xl shrink-0 ${
                              plan.daysRemaining <= 3
                                ? "bg-red-500/10"
                                : "bg-yellow-500/10"
                            }`}
                          >
                            <Icon
                              size={22}
                              stroke={plan.daysRemaining <= 3 ? "#EF4444" : "#EAB308"}
                            >
                              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </Icon>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-white truncate">
                              {plan.client_name}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              Plano {plan.plan_type} · vence em{" "}
                              {formatDateBR(plan.end_date)}
                            </div>
                            <div
                              className={`text-sm font-medium mt-1 ${
                                plan.daysRemaining <= 3
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {plan.daysRemaining === 0
                                ? "Vence hoje!"
                                : `${plan.daysRemaining} ${
                                    plan.daysRemaining === 1
                                      ? "dia restante"
                                      : "dias restantes"
                                  }`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => sendReminder(plan.id)}
                          disabled={reminded || sendingId === plan.id}
                          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold transition-colors shrink-0 ${
                            reminded
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-brand-orange/10 text-brand-orange border border-brand-orange/30 hover:bg-brand-orange/20"
                          } disabled:pointer-events-none`}
                        >
                          {reminded ? (
                            <>
                              <Icon size={16}>
                                <path d="M20 6 9 17l-5-5" />
                              </Icon>
                              Enviado
                            </>
                          ) : sendingId === plan.id ? (
                            "Enviando..."
                          ) : (
                            <>
                              <Icon size={16}>
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                              </Icon>
                              Enviar Lembrete
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                  {expiringPlans.length === 0 && (
                    <div className="px-6 py-12 text-center text-gray-500">
                      Nenhum plano vencendo nos proximos 7 dias
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {previewPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewPlan(null)}>
          <div className="bg-brand-dark rounded-2xl p-6 md:p-8 border border-[var(--border-main)] max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Previa do Email</h3>
              <button onClick={() => setPreviewPlan(null)} className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Icon size={20}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
              <div style={{background:"linear-gradient(135deg,#F97316,#F59E0B)",padding:"24px",textAlign:"center"}}>
                <h1 style={{color:"#0a0a0a",margin:0,fontSize:"20px",fontWeight:800}}>Barbearia Dreamer</h1>
                <p style={{color:"#0a0a0a",margin:"4px 0 0",opacity:0.8,fontSize:"13px"}}>Seu Estilo, Nossa Arte</p>
              </div>
              <div style={{background:"#111111",padding:"24px"}}>
                <div style={{textAlign:"center",marginBottom:"20px"}}>
                  <div style={{width:"48px",height:"48px",background:"rgba(249,115,22,0.2)",borderRadius:"50%",margin:"0 auto 12px"}}>
                    <span style={{color:"#F97316",fontSize:"22px",lineHeight:"48px"}}>&#9888;</span>
                  </div>
                  <h2 style={{color:"#ffffff",margin:0,fontSize:"18px"}}>Seu plano esta acabando!</h2>
                  <p style={{color:"#9CA3AF",margin:"6px 0 0",fontSize:"13px"}}>Nao deixe seu estilo para tras</p>
                </div>

                <p style={{color:"#D1D5DB",fontSize:"13px",lineHeight:"20px",textAlign:"center",margin:"0 0 20px"}}>
                  Ola <strong style={{color:"#ffffff"}}>{previewPlan.client_name}</strong>, seu plano
                  <strong style={{color:"#F97316"}}> {previewPlan.plan_name || previewPlan.plan_type}</strong> termina em
                  <strong style={{color:"#F97316"}}> {Math.max(0, previewPlan.daysRemaining)} dias</strong> ({formatDateBR(previewPlan.end_date)}).
                  Nao se esqueca de renovar!
                </p>

                <div style={{background:"#0a0a0a",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.05)",padding:"16px",marginBottom:"20px"}}>
                  <table style={{width:"100%"}}>
                    <tbody>
                      <tr><td style={{padding:"6px 0",color:"#6B7280",fontSize:"12px"}}>Cliente</td><td style={{padding:"6px 0",color:"#ffffff",fontSize:"13px",fontWeight:600,textAlign:"right"}}>{previewPlan.client_name}</td></tr>
                      <tr><td colSpan={2}><hr style={{border:"none",borderTop:"1px solid rgba(255,255,255,0.05)",margin:0}}/></td></tr>
                      <tr><td style={{padding:"6px 0",color:"#6B7280",fontSize:"12px"}}>Plano</td><td style={{padding:"6px 0",color:"#F97316",fontSize:"13px",fontWeight:600,textAlign:"right"}}>{previewPlan.plan_name || previewPlan.plan_type}</td></tr>
                      <tr><td colSpan={2}><hr style={{border:"none",borderTop:"1px solid rgba(255,255,255,0.05)",margin:0}}/></td></tr>
                      <tr><td style={{padding:"6px 0",color:"#6B7280",fontSize:"12px"}}>Dias restantes</td><td style={{padding:"6px 0",color:"#F97316",fontSize:"14px",fontWeight:700,textAlign:"right"}}>{Math.max(0, previewPlan.daysRemaining)}</td></tr>
                      <tr><td colSpan={2}><hr style={{border:"none",borderTop:"1px solid rgba(255,255,255,0.05)",margin:0}}/></td></tr>
                      <tr><td style={{padding:"6px 0",color:"#6B7280",fontSize:"12px"}}>Data de expiracao</td><td style={{padding:"6px 0",color:"#ffffff",fontSize:"13px",fontWeight:600,textAlign:"right"}}>{formatDateBR(previewPlan.end_date)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPreviewPlan(null)}
                className="flex-1 min-h-[44px] px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSendPlanEmail}
                disabled={sendingId === previewPlan.id}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 bg-brand-orange text-brand-black rounded-xl font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
              >
                {sendingId === previewPlan.id ? "Enviando..." : "Confirmar Envio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
