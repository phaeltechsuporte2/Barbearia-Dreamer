import { NextRequest, NextResponse } from "next/server";
import { sendGmail } from "@/lib/gmail";
import { buildReminderEmail, formatBRDate } from "@/lib/plan-emails";

interface ReminderData {
  clientName: string;
  clientEmail: string;
  planName: string;
  daysRemaining: number;
  expiryDate?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, planName, daysRemaining } =
      body as ReminderData;

    if (!clientName || !clientEmail || !planName || daysRemaining === undefined || daysRemaining === null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expiryDate = body.expiryDate
      ? formatBRDate(String(body.expiryDate))
      : formatBRDate(
          new Date(Date.now() + daysRemaining * 86400000)
            .toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
        );

    const htmlContent = buildReminderEmail({
      clientName,
      planName,
      daysRemaining,
      expiryDate,
    });

    await sendGmail(
      clientEmail,
      `${clientName}, seu plano ${planName} esta acabando!`,
      htmlContent
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to send reminder email";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
