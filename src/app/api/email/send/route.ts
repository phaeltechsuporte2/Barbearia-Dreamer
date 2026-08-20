import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, serviceName, barberName, date, time } = body;

    if (!clientName || !serviceName || !barberName || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendConfirmationEmail({
      clientName,
      clientPhone,
      serviceName,
      barberName,
      date,
      time,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
