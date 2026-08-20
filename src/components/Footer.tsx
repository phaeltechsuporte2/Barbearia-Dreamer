import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <img
                src="/images/logo.svg"
                alt="Barbearia Dreamer"
                className="w-10 h-10 group-hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-gold">
                Barbearia Dreamer
              </span>
            </Link>
            <p className="text-gray-400 text-center md:text-left max-w-sm">
              Seu Estilo, Nosso Arte. Barbearia premium com atendimento de
              primeira linha.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold text-lg mb-4">
              Links Rapidos
            </h4>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Servicos
                </a>
              </li>
              <li>
                <a
                  href="#scheduling"
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Agendamento
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold text-lg mb-4">Contato</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/barbeariadreamer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://wa.me/5511999999999?text=Ola!%20Gostaria%20de%20agendar!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@barbeariadreamer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.96a8.21 8.21 0 0 0 4.76 1.52V7.03a4.84 4.84 0 0 1-1-.34z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center">
            &copy; 2026 Barbearia Dreamer. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs text-center">
            Horario de funcionamento: Seg-Sab 09:00 - 19:00
          </p>
        </div>
      </div>
    </footer>
  );
}
