"use client";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 flex justify-center animate-fade-in-left opacity-0">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-brand-orange/30 shadow-[0_0_40px_rgba(249,115,22,0.2)] overflow-hidden">
              <img
                src="/images/logo.svg"
                alt="Barbearia Dreamer"
                className="w-full h-full object-cover p-8"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 animate-fade-in-right opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Bem-vindo a{" "}
              <span className="text-brand-orange">Barbearia Dreamer</span>
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                Somos uma barbearia que nasceu da paixao por transformar visuais
                e criar experiencias unicas. Aqui, cada corte e cada barba sao
                tratados como uma obra de arte.
              </p>
              <p>
                Nossa equipe de profissionais e constantemente capacitada para
                trazer as tendencias mais modernas do mercado, sempre
                respeitando o estilo e a personalidade de cada cliente.
              </p>
              <p>
                Com um ambiente <strong className="text-brand-orange">acolhedor</strong> e{" "}
                <strong className="text-brand-orange">modern</strong>, oferecemos
                muito mais que um servico - oferecemos uma experiencia completa.
                Venha nos conhecer!
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-brand-orange">
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
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="font-medium">Profissionais Certificados</span>
              </div>
              <div className="flex items-center gap-2 text-brand-orange">
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
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="font-medium">Produtos de Qualidade</span>
              </div>
              <div className="flex items-center gap-2 text-brand-orange">
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
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="font-medium">Agendamento Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
