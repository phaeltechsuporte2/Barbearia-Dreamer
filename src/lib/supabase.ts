import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Barber {
  id: number;
  name: string;
  specialty: string;
  active: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  active: boolean;
}

export interface Plan {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  plan_name: string;
  plan_type: string;
  amount_paid: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: number;
  barber_id: number;
  appointment_date: string;
  appointment_time: string;
  status: "confirmado" | "concluido" | "cancelado";
  created_at: string;
  services?: Service;
  barbers?: Barber;
}
