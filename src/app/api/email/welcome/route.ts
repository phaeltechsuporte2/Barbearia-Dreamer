import { NextRequest, NextResponse } from "next/server";
import { sendGmail } from "@/lib/gmail";
import { buildWelcomeEmail } from "@/lib/plan-emails";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body as { name?: string | null; email?: string };

    if (!email) {
      return NextResponse.json({ error: "Email obrigatorio" }, { status: 400 });
    }

    await sendGmail(
      email,
      `Bem-vindo(a) a Barbearia Dreamer!`,
      buildWelcomeEmail(name ?? null)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to send welcome email";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
