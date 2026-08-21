const services = [
  {
    name: "Corte Classico",
    description: "Corte masculino tradicional com acabamento perfeito.",
    price: "R$ 45",
    duration: "30 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    name: "Corte + Barba",
    description: "Combo completo: corte masculino com barba feita na navalha.",
    price: "R$ 70",
    duration: "50 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m16 10-4 4-4-4" />
      </svg>
    ),
  },
  {
    name: "Barba Completa",
    description: "Barba feita com navalha, hidratacao e acabamento.",
    price: "R$ 35",
    duration: "25 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    name: "Degradê",
    description: "Degradê moderno com transicao suave e acabamento impecavel.",
    price: "R$ 55",
    duration: "40 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
  {
    name: "Corte Infantil",
    description: "Corte para criancas com atendimento especial e divertido.",
    price: "R$ 30",
    duration: "25 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h.01" />
        <path d="M15 12h.01" />
        <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
        <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
      </svg>
    ),
  },
  {
    name: "Sobrancelha",
    description: "Design e alinhamento de sobrancelha com navalha.",
    price: "R$ 15",
    duration: "10 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" />
        <path d="m9 9 6 6" />
      </svg>
    ),
  },
  {
    name: "Hidratacao Capilar",
    description: "Tratamento completo para deixar o cabelo saudavel e macio.",
    price: "R$ 40",
    duration: "30 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
  },
  {
    name: "Pigmentacao",
    description: "Pigmentacao para cobertura de fios brancos ou destaque.",
    price: "R$ 50",
    duration: "35 min",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-brand-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Nossos{" "}
            <span className="text-brand-orange">Servicos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Oferecemos uma linha completa de servicos para cuidar do seu visual
            com qualidade e estilo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.name}
              className={`bg-brand-dark rounded-2xl p-6 border border-white/5 hover:border-brand-orange/40 shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all group cursor-pointer flex flex-col items-start h-full animate-fade-in-up delay-${(index + 2) * 100}`}
            >
              <div className="w-12 h-12 bg-white/5 group-hover:bg-brand-orange/10 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <span className="text-brand-orange group-hover:text-brand-orange-light transition-colors">
                  {service.icon}
                </span>
              </div>
              <h4 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-brand-orange transition-colors">
                {service.name}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                {service.description}
              </p>
              <div className="flex items-center justify-between w-full mt-auto">
                <div>
                  <span className="text-brand-orange font-bold text-xl">
                    {service.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    {service.duration}
                  </span>
                </div>
                <span className="text-brand-orange text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Agendar <span>&rarr;</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
