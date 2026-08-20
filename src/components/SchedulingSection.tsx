"use client";

import { useState } from "react";

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const barbers = [
  { id: 1, name: "Carlos", specialty: "Degradê e Cortes Modernos" },
  { id: 2, name: "Rafael", specialty: "Barba e Navalha" },
  { id: 3, name: "Lucas", specialty: "Cortes Classicos" },
];

export default function SchedulingSection() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && selectedBarber && selectedService && clientName && clientPhone) {
      setShowConfirm(true);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <section id="scheduling" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up opacity-0">
            Agende seu{" "}
            <span className="text-brand-orange">Horario</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100 opacity-0">
            Escolha o melhor horario para voce. Rapido, facil e pratico.
          </p>
        </div>

        {showConfirm ? (
          <div className="max-w-lg mx-auto bg-brand-black rounded-2xl p-8 border border-brand-orange/30 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Agendamento Confirmado!
            </h3>
            <p className="text-gray-400 mb-6">
              Seu horario foi agendado com sucesso. Enviamos os detalhes para seu WhatsApp.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Servico:</span></div>
                <div className="text-white font-medium">{selectedService}</div>
                <div><span className="text-gray-500">Barbeiro:</span></div>
                <div className="text-white font-medium">{barbers.find(b => b.id === selectedBarber)?.name}</div>
                <div><span className="text-gray-500">Data:</span></div>
                <div className="text-white font-medium">{new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")}</div>
                <div><span className="text-gray-500">Horario:</span></div>
                <div className="text-white font-medium">{selectedTime}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowConfirm(false);
                setSelectedDate("");
                setSelectedTime("");
                setSelectedBarber(null);
                setSelectedService("");
                setClientName("");
                setClientPhone("");
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
                  <label className="block text-white font-semibold mb-3">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    Servico
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  >
                    <option value="">Selecione o servico</option>
                    <option value="Corte Classico - R$45">Corte Classico - R$ 45</option>
                    <option value="Corte + Barba - R$70">Corte + Barba - R$ 70</option>
                    <option value="Barba Completa - R$35">Barba Completa - R$ 35</option>
                    <option value="Degradê - R$55">Degradê - R$ 55</option>
                    <option value="Corte Infantil - R$30">Corte Infantil - R$ 30</option>
                    <option value="Sobrancelha - R$15">Sobrancelha - R$ 15</option>
                    <option value="Hidratacao Capilar - R$40">Hidratacao Capilar - R$ 40</option>
                    <option value="Pigmentacao - R$50">Pigmentacao - R$ 50</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
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
                            : "border-white/10 bg-brand-black text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div className="text-white font-medium text-sm">{barber.name}</div>
                        <div className="text-xs mt-1 opacity-70">{barber.specialty.split(" ")[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-4 py-3 bg-brand-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    Horario
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isUnavailable =
                        (time === "12:00" || time === "12:30" || time === "19:00");
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isUnavailable
                              ? "bg-white/3 text-gray-600 cursor-not-allowed line-through"
                              : selectedTime === time
                                ? "bg-brand-orange text-brand-black"
                                : "bg-brand-black border border-white/10 text-gray-400 hover:border-brand-orange/30"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 px-8 py-4 bg-brand-orange text-brand-black rounded-full font-bold text-lg hover:bg-brand-orange-light transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]"
                >
                  Confirmar Agendamento
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Voce recebera uma confirmacao via WhatsApp
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
