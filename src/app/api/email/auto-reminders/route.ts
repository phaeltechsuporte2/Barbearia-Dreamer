import { NextRequest, NextResponse } from "next/server";
import { supabase, type Plan } from "@/lib/supabase";
import { sendGmail } from "@/lib/gmail";
import { buildReminderEmail, formatBRDate } from "@/lib/plan-emails";

const REMINDER_DAYS = [7, 3, 1];

function daysBetween(fromStr: string, toStr: string): number {
  const a = Date.UTC(
    Number(fromStr.slice(0, 4)),
    Number(fromStr.slice(5, 7)) - 1,
    Number(fromStr.slice(8, 10))
  );
  const b = Date.UTC(
    Number(toStr.slice(0, 4)),
    Number(toStr.slice(5, 7)) - 1,
    Number(toStr.slice(8, 10))
  );
  return Math.round((b - a) / 86400000);
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase.from("plans").select("*");
    if (error) throw error;

    const plans = (data ?? []) as Plan[];
    const todayStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Sao_Paulo",
    });

    let sent = 0;
    const details: Array<{ name: string; email: string; days: number }> = [];
    const skipped = { expired: 0, noEmail: 0, notDue: 0 };

    for (const plan of plans) {
      if (!plan.end_date) continue;
      const remaining = daysBetween(todayStr, plan.end_date);
      if (remaining <= 0) {
        skipped.expired++;
        continue;
      }
      if (!plan.client_email) {
        skipped.noEmail++;
        continue;
      }
      if (!REMINDER_DAYS.includes(remaining)) {
        skipped.notDue++;
        continue;
      }

      await sendGmail(
        plan.client_email,
        `${plan.client_name}, seu plano ${plan.plan_name} esta acabando!`,
        buildReminderEmail({
          clientName: plan.client_name,
          planName: plan.plan_name,
          daysRemaining: remaining,
          expiryDate: formatBRDate(plan.end_date),
        })
      );
      sent++;
      details.push({
        name: plan.client_name,
        email: plan.client_email,
        days: remaining,
      });
    }

    return NextResponse.json({ success: true, sent, details, skipped });
  } catch (error) {
    console.error("Error sending automatic reminders:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Failed to send automatic reminders";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
