import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
}

export async function sendConfirmationEmail(data: EmailData) {
  const formattedDate = new Date(data.date + "T12:00:00").toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

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
                    src="https://barbearia-dreamer-gules.vercel.app/images/logo.jpg"
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
                    <div style="width:60px;height:60px;background-color:rgba(34,197,94,0.2);border-radius:50%;margin:0 auto 15px;">
                      <span style="color:#22C55E;font-size:28px;line-height:60px;">&#10003;</span>
                    </div>
                    <h2 style="color:#ffffff;margin:0;font-size:22px;">Agendamento Confirmado!</h2>
                    <p style="color:#9CA3AF;margin:8px 0 0;font-size:14px;">Um novo agendamento foi realizado</p>
                  </div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border-radius:12px;border:1px solid rgba(255,255,255,0.05);margin-bottom:25px;">
                    <tr>
                      <td style="padding:20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:8px 0;color:#6B7280;font-size:13px;">Cliente</td>
                            <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:600;text-align:right;">${data.clientName}</td>
                          </tr>
                          <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                          <tr>
                            <td style="padding:8px 0;color:#6B7280;font-size:13px;">WhatsApp</td>
                            <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:600;text-align:right;">${data.clientPhone}</td>
                          </tr>
                          <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                          <tr>
                            <td style="padding:8px 0;color:#6B7280;font-size:13px;">Servico</td>
                            <td style="padding:8px 0;color:#F97316;font-size:14px;font-weight:600;text-align:right;">${data.serviceName}</td>
                          </tr>
                          <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                          <tr>
                            <td style="padding:8px 0;color:#6B7280;font-size:13px;">Barbeiro</td>
                            <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:600;text-align:right;">${data.barberName}</td>
                          </tr>
                          <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                          <tr>
                            <td style="padding:8px 0;color:#6B7280;font-size:13px;">Data</td>
                            <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:600;text-align:right;">${formattedDate}</td>
                          </tr>
                          <tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>
                          <tr>
                            <td style="padding:8px 0;color:#6B7280;font-size:13px;">Horario</td>
                            <td style="padding:8px 0;color:#22C55E;font-size:16px;font-weight:700;text-align:right;">${data.time}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="text-align:center;">
                    <p style="color:#6B7280;font-size:12px;margin:0;">Aguardamos voce na Barbearia Dreamer!</p>
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

  try {
    await resend.emails.send({
      from: "Barbearia Dreamer <onboarding@resend.dev>",
      to: "phael.techsuporte2@gmail.com",
      subject: `Novo Agendamento - ${data.clientName} - ${data.serviceName}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error };
  }
}
