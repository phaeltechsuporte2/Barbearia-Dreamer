"use server";

import { supabase, type Appointment, type Plan } from "@/lib/supabase";

export async function getAppointments(filters?: {
  date?: string;
  status?: string;
}) {
  let query = supabase
    .from("appointments")
    .select("*, services(*), barbers(*)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: true });

  if (filters?.date) {
    query = query.eq("appointment_date", filters.date);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Appointment[];
}

export async function createAppointment(appointment: {
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: number;
  barber_id: number;
  appointment_date: string;
  appointment_time: string;
}) {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointment)
    .select("*, services(*), barbers(*)")
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: "confirmado" | "concluido" | "cancelado"
) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select("*, services(*), barbers(*)")
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function getRevenueStats() {
  const { data: allAppointments, error } = await supabase
    .from("appointments")
    .select("*, services(*)");

  if (error) throw error;

  const totalRevenue = allAppointments
    ?.filter((a) => a.status === "concluido")
    .reduce((sum, a) => sum + (a.services?.price || 0), 0) || 0;

  const today = new Date().toISOString().split("T")[0];
  const todayRevenue = allAppointments
    ?.filter((a) => a.status === "concluido" && a.appointment_date === today)
    .reduce((sum, a) => sum + (a.services?.price || 0), 0) || 0;

  const todayCount =
    allAppointments?.filter((a) => a.appointment_date === today).length || 0;

  const completedCount =
    allAppointments?.filter(
      (a) => a.appointment_date === today && a.status === "concluido"
    ).length || 0;

  const pendingCount =
    allAppointments?.filter(
      (a) => a.appointment_date === today && a.status === "confirmado"
    ).length || 0;

  return {
    totalRevenue,
    todayRevenue,
    todayCount,
    completedCount,
    pendingCount,
    totalAppointments: allAppointments?.length || 0,
    totalCompleted:
      allAppointments?.filter((a) => a.status === "concluido").length || 0,
    totalConfirmed:
      allAppointments?.filter((a) => a.status === "confirmado").length || 0,
  };
}

export async function getBarbers() {
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) throw error;
  return data;
}

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) throw error;
  return data;
}

export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Plan[];
}

export async function createPlan(plan: {
  client_name: string;
  client_email: string;
  client_phone?: string;
  plan_name: string;
  plan_type: string;
  amount_paid: number;
  start_date: string;
  end_date: string;
}) {
  const { data, error } = await supabase
    .from("plans")
    .insert(plan)
    .select("*")
    .single();

  if (error) throw error;
  return data as Plan;
}

export async function deletePlan(id: string) {
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) throw error;
}
