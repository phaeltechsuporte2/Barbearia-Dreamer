"use client";

import { useState, useEffect, useCallback } from "react";
import { createAppointment, getBarbers, getServices } from "@/lib/actions";
import type { Barber, Service } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function SchedulingSection() {
  const { user, loading: authLoading } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [calendarConnected, setCalendarConnected] = useState(false);

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata;
      if (meta?.name && !clientName) setClientName(meta.name);
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      try {
        const [barbersData, servicesData] = await Promise.all([
          getBarbers(),
          getServices(),
        ]);
        setBarbers(barbersData);
        setServices(servicesData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }
    loadData();
  }, []);

  const fetchAvailableSlots = useCallback(async (date: string) => {
    if (!date) return;

    setLoadingSlots(true);
    try {
      const response = await fetch(
        `/api/calendar/available?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.slots);
        setCalendarConnected(true);
      } else {
        setAvailableSlots([
          "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
          "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
          "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
        ]);
        setCalendarConnected(false);
      }
    } catch {
      setAvailableSlots([
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
      ]);
      setCalendarConnected(false);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
      setSelectedTime("");
    }
  }, [selectedDate, fetchAvailableSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (
      !selectedDate ||
      !selectedTime ||
      !selectedBarber ||
      !selectedServiceId ||
      !clientName ||
      !clientPhone
    ) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const service = services.find((s) => s.id === selectedServiceId);
      const barber = barbers.find((b) => b.id === selectedBarber);

      await createAppointment({
        client_name: clientName,
        client_phone: clientPhone,
        client_email: user.email || "",
        service_id: selectedServiceId,
        barber_id: selectedBarber,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
      });

      if (calendarConnected && service && barber) {
        try {
          await fetch("/api/calendar/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              summary: `${service.name} - ${clientName}`,
              description: `Barbeiro: ${barber.name}\nCliente: ${clientName}\nWhatsApp: ${clientPhone}\nServico: ${service.name}\nValor: R$ ${service.price}`,
              date: selectedDate,
              time: selectedTime,
              durationMinutes: service.duration_minutes,
            }),
          });
        } catch (calErr) {
          console.error("Erro ao criar evento no Google Calendar:", calErr);
        }
      }

      try {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName,
            clientPhone,
            serviceName: service?.name,
            barberName: barber?.name,
            date: selectedDate,
            time: selectedTime,
          }),
        });
      } catch (emailErr) {
        console.error("Erro ao enviar email:", emailErr);
      }

      setShowConfirm(true);
    } catch (err) {
      setError("Erro ao agendar. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getSelectedServiceName = () => {
    return services.find((s) => s.id === selectedServiceId)?.name || "";
  };

  const getSelectedBarberName = () => {
    return barbers.find((b) => b.id === selectedBarber)?.name || "";
  };

  const allTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  ];

  if (authLoading) {
    return (
      <section id="scheduling" className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section id="scheduling" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="max-w-md mx-auto bg-brand-black rounded-2xl p-8 border border-[var(--border-subtle)]">
            <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Faca Login para Agendar</h3>
            <p className="text-[var(--text-secondary)] mb-6">Voce precisa estar logado para fazer um agendamento.</p>
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

  return (
    <section
      id="scheduling"
      className="py-24 bg-brand-dark relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 animate-fade-in-up">
            Agende seu{" "}
            <span className="text-brand-orange">Horario</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto animate-fade-in-up delay-100">
            Escolha o melhor horario para voce. Horarios atualizados em tempo
            real.
          </p>
          {calendarConnected && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">
                Sincronizado com Google Calendar
              </span>
            </div>
          )}
        </div>

        {showConfirm ? (
          <div className="max-w-lg mx-auto bg-brand-black rounded-2xl p-8 border border-brand-orange/30 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Agendamento Confirmado!
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Seu horario foi agendado com sucesso
              {calendarConnected && " e sincronizado com o Google Calendar"}.
              Aguardamos voce!
            </p>
            <div className="bg-[var(--bg-subtle)] rounded-xl p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[var(--text-muted)]">Servico:</span>
                </div>
                <div className="text-[var(--text-primary)] font-medium">
                  {getSelectedServiceName()}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Barbeiro:</span>
                </div>
                <div className="text-[var(--text-primary)] font-medium">
                  {getSelectedBarberName()}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Data:</span>
                </div>
                <div className="text-[var(--text-primary)] font-medium">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                    "pt-BR"
                  )}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Horario:</span>
                </div>
                <div className="text-[var(--text-primary)] font-medium">{selectedTime}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowConfirm(false);
                setSelectedDate("");
                setSelectedTime("");
                setSelectedBarber(null);
                setSelectedServiceId(null);
                setClientName("");
                setClientPhone("");
                setAvailableSlots([]);
              }}
              className="px-8 py-3 bg-brand-orange text-brand-black rounded-full font-bold hover:bg-brand-orange-light transition-all"
            >
              Fazer Novo Agendamento
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-3">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-3 bg-brand-black border border-[var(--border-main)] rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-3">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(maskPhone(e.target.value))}
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="(11) 98834-6626"
                    className="w-full px-4 py-3 bg-brand-black border border-[var(--border-main)] rounded-xl text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-3">
                    Servico
                  </label>
                  <select
                    value={selectedServiceId || ""}
                    onChange={(e) =>
                      setSelectedServiceId(Number(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-brand-black border border-[var(--border-main)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  >
                    <option value="">Selecione o servico</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - R$ {service.price} (
                        {service.duration_minutes} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-3">
                    Barbeiro
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {barbers.map((barber) => (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarber(barber.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedBarber === barber.id
                            ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                            : "border-[var(--border-main)] bg-brand-black text-[var(--text-secondary)] hover:border-[var(--border-main)]"
                        }`}
                      >
                        <div className="text-[var(--text-primary)] font-medium text-sm">
                          {barber.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-3">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-4 py-3 bg-brand-black border border-[var(--border-main)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-primary)] font-semibold mb-3">
                    Horario
                    {loadingSlots && (
                      <span className="text-brand-orange text-sm font-normal ml-2">
                        Atualizando...
                      </span>
                    )}
                  </label>
                  {!selectedDate ? (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                      Selecione uma data para ver os horarios disponiveis
                    </div>
                  ) : loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                      <span className="ml-3 text-[var(--text-secondary)]">
                        Carregando horarios...
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {allTimeSlots.map((time) => {
                        const isAvailable = availableSlots.includes(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setSelectedTime(time)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              !isAvailable
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                                : selectedTime === time
                                  ? "bg-brand-orange text-brand-black shadow-lg shadow-brand-orange/30"
                                  : "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 hover:border-green-500/50"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {selectedDate && !loadingSlots && (
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-brand-orange" />
                        <span className="text-[var(--text-muted)]">Selecionado</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-green-500/15 border border-green-500/30" />
                        <span className="text-[var(--text-muted)]">Disponivel</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-gray-800 border border-gray-700" />
                        <span className="text-[var(--text-muted)]">Indisponivel</span>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedTime}
                  className="w-full mt-6 px-8 py-4 bg-brand-orange text-brand-black rounded-full font-bold text-lg hover:bg-brand-orange-light transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Agendando..." : "Confirmar Agendamento"}
                </button>

                <p className="text-center text-[var(--text-muted)] text-sm mt-4">
                  {calendarConnected
                    ? "Sincronizado com Google Calendar"
                    : "Seu horario sera salvo automaticamente"}
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
