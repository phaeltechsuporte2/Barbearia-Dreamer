import { NextRequest, NextResponse } from "next/server";
import { sendGmail } from "@/lib/gmail";

interface ReminderData {
  clientName: string;
  clientEmail: string;
  planName: string;
  daysRemaining: number;
  expiryDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, planName, daysRemaining, expiryDate } =
      body as ReminderData;

    if (!clientName || !clientEmail || !planName || !expiryDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:16px;border:1px solid rgba(249,115,22,0.2);overflow:hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #F97316, #F59E0B); padding:30px; text-align:center;">
                    <img
                      src="https://barbearia-dreamer-gules.vercel.app/images/logo-email.jpg"
                      alt="Logo Barbearia Dreamer"
                      width="100"
                      style="display:block;margin:0 auto 14px;width:100px;height:auto;border-radius:12px;border:3px solid rgba(10,10,10,0.85);"
                    />
                    <h1 style="color:#0a0a0a;margin:0;font-size:24px;font-weight:800;">Barbearia Dreamer</h1>
                    <p style="color:#0a0a0a;margin:5px 0 0;opacity:0.8;font-size:14px;">Seu Estilo, Nossa Arte</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;">
                    <div style="text-align:center;margin-bottom:30px;">
                      <div style="width:60px;height:60px;background-color:rgba(249,115,22,0.2);border-radius:50%;margin:0 auto 15px;">
                        <span style="color:#F97316;font-size:28px;line-height:60px;">&#9888;</span>
                      </div>
                      <h2 style="color:#ffffff;margin:0;font-size:22px;">Seu plano esta acabando!</h2>
                      <p style="color:#9CA3AF;margin:8px 0 0;font-size:14px;">Nao deixe seu estilo para tras</p>
                    </div>

                    <p style="color:#D1D5DB;font-size:14px;line-height:22px;text-align:center;margin:0 0 25px;">
                      Ola <strong style="color:#ffffff;">${clientName}</strong>, seu plano
                      <strong style="color:#F97316;">${planName}</strong> termina em
                      <strong style="color:#F97316;">${daysRemaining} dias</strong> (${expiryDate}).
                      Nao se esqueca de renovar para continuar aproveitando nossos servicos!
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border-radius:12px;border:1px solid rgba(255,255,255,0.05);margin-bottom:25px;">
                      <tr>
                        <td style="padding:20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:8px 0;color:#6B7280;font-size:13px;">Cliente</td>
                              <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:600;text-align:right;">${clientName}</td>
                            </tr>
                            <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                            <tr>
                              <td style="padding:8px 0;color:#6B7280;font-size:13px;">Plano</td>
                              <td style="padding:8px 0;color:#F97316;font-size:14px;font-weight:600;text-align:right;">${planName}</td>
                            </tr>
                            <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                            <tr>
                              <td style="padding:8px 0;color:#6B7280;font-size:13px;">Dias restantes</td>
                              <td style="padding:8px 0;color:#F97316;font-size:16px;font-weight:700;text-align:right;">${daysRemaining}</td>
                            </tr>
                            <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                            <tr>
                              <td style="padding:8px 0;color:#6B7280;font-size:13px;">Data de expiracao</td>
                              <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:600;text-align:right;">${expiryDate}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align:center;">
                      <p style="color:#6B7280;font-size:12px;margin:0;">Renove agora e continue no estilo Barbearia Dreamer!</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:rgba(255,255,255,0.02);padding:20px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                    <p style="color:#4B5563;font-size:11px;margin:0;">&copy; 2026 Barbearia Dreamer - Todos os direitos reservados</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

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
