-- ============================================================
-- Schema do Banco de Dados - Barbearia Dreamer
-- Execute este SQL no Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Tabela de Barbeiros
CREATE TABLE barbers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(200) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Servicos
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Agendamentos
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  service_id BIGINT NOT NULL REFERENCES services(id),
  barber_id BIGINT NOT NULL REFERENCES barbers(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'concluido', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices para performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_barber ON appointments(barber_id);

-- ============================================================
-- Dados iniciais (Seed)
-- ============================================================

-- Inserir Barbeiros
INSERT INTO barbers (name, specialty) VALUES
  ('Carlos', 'Degradê e Cortes Modernos'),
  ('Rafael', 'Barba e Navalha'),
  ('Lucas', 'Cortes Classicos');

-- Inserir Servicos
INSERT INTO services (name, description, price, duration_minutes) VALUES
  ('Corte Classico', 'Corte masculino tradicional com acabamento perfeito.', 45.00, 30),
  ('Corte + Barba', 'Combo completo: corte masculino com barba feita na navalha.', 70.00, 50),
  ('Barba Completa', 'Barba feita com navalha, hidratacao e acabamento.', 35.00, 25),
  ('Degradê', 'Degradê moderno com transicao suave e acabamento impecavel.', 55.00, 40),
  ('Corte Infantil', 'Corte para criancas com atendimento especial e divertido.', 30.00, 25),
  ('Sobrancelha', 'Design e alinhamento de sobrancelha com navalha.', 15.00, 10),
  ('Hidratacao Capilar', 'Tratamento completo para deixar o cabelo saudavel e macio.', 40.00, 30),
  ('Pigmentacao', 'Pigmentacao para cobertura de fios brancos ou destaque.', 50.00, 35);

-- ============================================================
-- RLS (Row Level Security) - Desabilitado para desenvolvimento
-- Habilite em producao com as politicas apropriadas
-- ============================================================
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Politicas publicas para leitura (desenvolvimento)
CREATE POLICY "Barbeiros sao visiveis publicamente" ON barbers FOR SELECT USING (true);
CREATE POLICY "Servicos sao visiveis publicamente" ON services FOR SELECT USING (true);
CREATE POLICY "Agendamentos sao visiveis publicamente" ON appointments FOR SELECT USING (true);

-- Politicas de insercao (qualquer um pode agendar)
CREATE POLICY "Qualquer um pode criar agendamento" ON appointments FOR INSERT WITH CHECK (true);

-- Politicas de atualizacao (apenas para agendamentos proprios ou admin)
CREATE POLICY "Pode atualizar agendamentos" ON appointments FOR UPDATE USING (true);
