import { NextResponse } from "next/server";
import { sendGmail } from "@/lib/gmail";
import { buildFeedbackRequestEmail } from "@/lib/plan-emails";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "";
    const clientEmail = typeof body.clientEmail === "string" ? body.clientEmail.trim() : "";
    const serviceName = typeof body.serviceName === "string" ? body.serviceName.trim() : "";
    const dateBR = typeof body.dateBR === "string" ? body.dateBR.trim() : "";

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: "Nome e e-mail do cliente são obrigatórios" },
        { status: 400 }
      );
    }

    await sendGmail(
      clientEmail,
      `${clientName}, seu corte já foi feito? Deixe sua avaliação!`,
      buildFeedbackRequestEmail({
        clientName,
        serviceName: serviceName || "Serviço",
        dateBR,
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending feedback request email:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send feedback request email" },
      { status: 500 }
    );
  }
}
