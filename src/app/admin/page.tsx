"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAppointments,
  getRevenueStats,
  updateAppointmentStatus,
} from "@/lib/actions";
import type { Appointment } from "@/lib/supabase";

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
  const [filter, setFilter] = useState<"todos" | "hoje" | "semana">("todos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [appointmentsData, statsData] = await Promise.all([
        getAppointments(),
        getRevenueStats(),
      ]);
      setAppointments(appointmentsData);
      setStats(statsData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    id: string,
    newStatus: "confirmado" | "concluido" | "cancelado"
  ) {
    try {
      await updateAppointmentStatus(id, newStatus);
      await loadData();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments.filter((apt) => {
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

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "concluido":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-orange text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex">
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-dark border-r border-white/5 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="text-lg font-bold text-white">Dreamer</h1>
              <p className="text-xs text-gray-500">Painel Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-orange/10 text-brand-orange font-medium">
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Dashboard
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
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
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
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
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-gray-400"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Dashboard
                </h2>
                <p className="text-gray-500 mt-1">
                  Visao geral do seu negocio
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-lg hover:bg-brand-orange/20 transition-colors text-sm font-medium"
            >
              Atualizar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-brand-orange/10 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">
                R$ {stats.todayRevenue.toFixed(0)}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Faturamento Hoje</p>
            </div>

            <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.pendingCount}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Pendentes Hoje</p>
            </div>
          </div>

          <div className="bg-brand-dark rounded-2xl p-6 border border-white/5 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Faturamento Total
              </h3>
              <span className="text-sm text-gray-500">
                Todos os registros
              </span>
            </div>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-brand-orange">
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
                <div className="text-xs text-gray-500 mt-1">Concluidos</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {stats.totalConfirmed}
                </div>
                <div className="text-xs text-gray-500 mt-1">Confirmados</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {stats.totalAppointments}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark rounded-2xl border border-white/5">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Agendamentos</h3>
              <div className="flex gap-2">
                {(["todos", "hoje", "semana"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? "bg-brand-orange text-brand-black"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f === "hoje" ? "Hoje" : f === "semana" ? "Semana" : "Todos"}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                      Cliente
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                      Servico
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                      Barbeiro
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                      Horario
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                      Valor
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {apt.client_name}
                        </div>
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
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(
                          apt.appointment_date + "T12:00:00"
                        ).toLocaleDateString("pt-BR")}{" "}
                        {apt.appointment_time?.slice(0, 5)}
                      </td>
                      <td className="px-6 py-4 text-brand-orange font-medium">
                        R$ {apt.services?.price}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={apt.status}
                          onChange={(e) =>
                            handleStatusChange(
                              apt.id,
                              e.target.value as
                                | "confirmado"
                                | "concluido"
                                | "cancelado"
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor(apt.status)} bg-transparent cursor-pointer focus:outline-none`}
                        >
                          <option value="confirmado">Confirmado</option>
                          <option value="concluido">Concluido</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
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
        </div>
      </main>
    </div>
  );
}
