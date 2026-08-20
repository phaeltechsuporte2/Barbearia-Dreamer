"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  id: string;
  client: string;
  phone: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  price: number;
  status: "confirmado" | "concluido" | "cancelado";
}

const mockAppointments: Appointment[] = [
  { id: "1", client: "Joao Silva", phone: "(11) 99999-1111", service: "Corte + Barba", barber: "Carlos", date: "2026-08-20", time: "09:00", price: 70, status: "concluido" },
  { id: "2", client: "Pedro Santos", phone: "(11) 99999-2222", service: "Degradê", barber: "Rafael", date: "2026-08-20", time: "10:00", price: 55, status: "concluido" },
  { id: "3", client: "Lucas Oliveira", phone: "(11) 99999-3333", service: "Corte Classico", barber: "Lucas", date: "2026-08-20", time: "11:00", price: 45, status: "concluido" },
  { id: "4", client: "Matheus Costa", phone: "(11) 99999-4444", service: "Barba Completa", barber: "Rafael", date: "2026-08-20", time: "13:00", price: 35, status: "concluido" },
  { id: "5", client: "Gabriel Lima", phone: "(11) 99999-5555", service: "Corte + Barba", barber: "Carlos", date: "2026-08-20", time: "14:00", price: 70, status: "concluido" },
  { id: "6", client: "Rafael Souza", phone: "(11) 99999-6666", service: "Degradê", barber: "Lucas", date: "2026-08-20", time: "15:00", price: 55, status: "confirmado" },
  { id: "7", client: "Bruno Almeida", phone: "(11) 99999-7777", service: "Corte Classico", barber: "Carlos", date: "2026-08-21", time: "09:00", price: 45, status: "confirmado" },
  { id: "8", client: "Thiago Ferreira", phone: "(11) 99999-8888", service: "Corte + Barba", barber: "Rafael", date: "2026-08-21", time: "10:00", price: 70, status: "confirmado" },
  { id: "9", client: "Andre Martins", phone: "(11) 99999-9999", service: "Hidratacao Capilar", barber: "Lucas", date: "2026-08-19", time: "11:00", price: 40, status: "concluido" },
  { id: "10", client: "Felipe Rocha", phone: "(11) 99999-0000", service: "Sobrancelha", barber: "Carlos", date: "2026-08-19", time: "14:00", price: 15, status: "concluido" },
];

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<"todos" | "hoje" | "semana">("hoje");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "hoje") return apt.date === today;
    if (filter === "semana") {
      const aptDate = new Date(apt.date);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return aptDate >= weekStart && aptDate <= weekEnd;
    }
    return true;
  });

  const todayRevenue = filteredAppointments
    .filter((apt) => apt.status === "concluido")
    .reduce((sum, apt) => sum + apt.price, 0);

  const totalRevenue = appointments
    .filter((apt) => apt.status === "concluido")
    .reduce((sum, apt) => sum + apt.price, 0);

  const todayAppointments = appointments.filter((apt) => apt.date === today).length;
  const completedToday = appointments.filter((apt) => apt.date === today && apt.status === "concluido").length;
  const pendingToday = appointments.filter((apt) => apt.date === today && apt.status === "confirmado").length;

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "concluido": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelado": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex">
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-dark border-r border-white/5 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo.svg" alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold text-white">Dreamer</h1>
              <p className="text-xs text-gray-500">Painel Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-orange/10 text-brand-orange font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Agendamentos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Clientes
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="20" y2="10" />
              <line x1="18" x2="18" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="16" />
            </svg>
            Relatorios
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div>
              <button
                className="md:hidden text-gray-400 mr-4"
                onClick={() => setSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </svg>
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Dashboard
              </h2>
              <p className="text-gray-500 mt-1">
                Visao geral do seu negocio
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold">
                AD
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-brand-orange/10 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </svg>
                </div>
                <span className="text-green-400 text-sm font-medium">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                R$ {todayRevenue.toFixed(0)}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Faturamento Hoje</p>
            </div>

            <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">{todayAppointments}</h3>
              <p className="text-gray-500 text-sm mt-1">Agendamentos Hoje</p>
            </div>

            <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">{completedToday}</h3>
              <p className="text-gray-500 text-sm mt-1">Concluidos Hoje</p>
            </div>

            <div className="bg-brand-dark rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">{pendingToday}</h3>
              <p className="text-gray-500 text-sm mt-1">Pendentes Hoje</p>
            </div>
          </div>

          <div className="bg-brand-dark rounded-2xl p-6 border border-white/5 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Faturamento Total</h3>
              <span className="text-sm text-gray-500">Todos os registros</span>
            </div>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-brand-orange">
                R$ {totalRevenue.toFixed(2)}
              </span>
              <span className="text-green-400 text-lg font-medium mb-1">
                Total acumulado
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {appointments.filter((a) => a.status === "concluido").length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Concluidos</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">
                  {appointments.filter((a) => a.status === "confirmado").length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Confirmados</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{appointments.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark rounded-2xl border border-white/5">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">Agendamentos</h3>
              <div className="flex gap-2">
                {(["hoje", "semana", "todos"] as const).map((f) => (
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
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cliente</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Servico</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Barbeiro</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Horario</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Valor</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{apt.client}</div>
                        <div className="text-xs text-gray-500 md:hidden">{apt.service}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{apt.service}</td>
                      <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{apt.barber}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(apt.date + "T12:00:00").toLocaleDateString("pt-BR")} {apt.time}
                      </td>
                      <td className="px-6 py-4 text-brand-orange font-medium">
                        R$ {apt.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor(apt.status)}`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
