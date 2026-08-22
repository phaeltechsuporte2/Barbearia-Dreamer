export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 bg-brand-black"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 600px 600px at 25% 25%, rgba(249,115,22,0.12), transparent), radial-gradient(ellipse 500px 500px at 75% 75%, rgba(245,158,11,0.08), transparent)",
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-main)] text-brand-orange mb-8 animate-fade-in-up">
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm font-medium">Barbearia Premium</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] max-w-4xl tracking-tight leading-tight mb-6 animate-fade-in-up delay-100">
          Seu Estilo, Nossa{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-gold">
            Arte
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-10 animate-fade-in-up delay-200">
          Cortes modernos, barba bem feita e atendimento de primeira. Agende
          agora e transforme seu visual com os melhores profissionais da cidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
          <a
            href="#scheduling"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-brand-orange text-brand-black rounded-full font-bold text-lg hover:bg-brand-orange-light transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]"
          >
            Agendar Horario
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
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="#services"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-main)] rounded-full font-bold text-lg hover:bg-[var(--bg-subtle-hover)] transition-colors"
          >
            Ver Servicos
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-left animate-fade-in-up delay-400">
          <div className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-brand-orange/30 transition-colors">
            <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">Profissionais</h3>
            <p className="text-[var(--text-secondary)] text-sm">Equipe qualificada e experiente</p>
          </div>

          <div className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-brand-orange/30 transition-colors">
            <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">Pontual</h3>
            <p className="text-[var(--text-secondary)] text-sm">Respeitamos seu horario</p>
          </div>

          <div className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-brand-orange/30 transition-colors">
            <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h.01" />
                <path d="M15 12h.01" />
                <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
              </svg>
            </div>
            <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">Ambiente Top</h3>
            <p className="text-[var(--text-secondary)] text-sm">Espaco moderno e confortavel</p>
          </div>
        </div>
      </div>
    </section>
  );
}
