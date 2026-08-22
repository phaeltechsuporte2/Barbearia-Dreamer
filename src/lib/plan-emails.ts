const LOGO_URL = "https://barbearia-dreamer-gules.vercel.app/images/logo-email.jpg";
const SITE_URL = "https://barbearia-dreamer-gules.vercel.app";

export function formatBRDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

function shell(innerHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;" bgcolor="#0a0a0a">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0a" style="background-color:#0a0a0a;padding:40px 20px;">
        <tr>
          <td align="center" bgcolor="#0a0a0a">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:16px;border:1px solid rgba(249,115,22,0.2);overflow:hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #F97316, #F59E0B); padding:30px; text-align:center;">
                  <img
                    src="${LOGO_URL}"
                    alt="Logo Barbearia Dreamer"
                    width="100"
                    style="display:block;margin:0 auto 14px;width:100px;height:auto;border-radius:12px;border:3px solid rgba(10,10,10,0.85);"
                  />
                  <h1 style="color:#0a0a0a;margin:0;font-size:24px;font-weight:800;">Barbearia Dreamer</h1>
                  <p style="color:#0a0a0a;margin:5px 0 0;opacity:0.8;font-size:14px;">Seu Estilo, Nossa Arte</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">${innerHtml}</td>
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
}

function infoTable(rows: Array<[string, string, string?]>): string {
  const cells = rows
    .map(
      ([label, value, valueColor], i) => `
        ${i > 0 ? '<tr><td colspan="2"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:0;"></td></tr>' : ""}
        <tr>
          <td style="padding:8px 0;color:#6B7280;font-size:13px;">${label}</td>
          <td style="padding:8px 0;color:${valueColor ?? "#ffffff"};font-size:14px;font-weight:600;text-align:right;">${value}</td>
        </tr>`
    )
    .join("");
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border-radius:12px;border:1px solid rgba(255,255,255,0.05);margin-bottom:25px;">
      <tr>
        <td style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0">${cells}</table>
        </td>
      </tr>
    </table>
  `;
}

export function buildPlanActivatedEmail(data: {
  clientName: string;
  planName: string;
  planType: string;
  amountPaid: number;
  startDate: string;
  endDate: string;
}): string {
  const { clientName, planName, planType, amountPaid, startDate, endDate } = data;
  const inner = `
    <div style="text-align:center;margin-bottom:30px;">
      <div style="width:60px;height:60px;background-color:rgba(249,115,22,0.2);border-radius:50%;margin:0 auto 15px;">
        <span style="color:#F97316;font-size:28px;line-height:60px;"><img src="${SITE_URL}/images/icons/icon-check-orange.png" width="28" height="28" alt="" style="display:block;margin:0 auto;padding-top:16px;" /></span>
      </div>
      <h2 style="color:#ffffff;margin:0;font-size:22px;">Seu plano foi ativado!</h2>
      <p style="color:#9CA3AF;margin:8px 0 0;font-size:14px;">Bem-vindo ao clube Dreamer</p>
    </div>

    <p style="color:#D1D5DB;font-size:14px;line-height:22px;text-align:center;margin:0 0 25px;">
      Olá <strong style="color:#ffffff;">${clientName}</strong>! Seu plano
      <strong style="color:#F97316;">${planName}</strong> (${planType}) está ativo.
      Aproveite todos os benefícios até <strong style="color:#F97316;">${endDate}</strong>.
    </p>

    ${infoTable([
      ["Cliente", clientName],
      ["Plano", planName, "#F97316"],
      ["Período", planType],
      ["Valor pago", `R$ ${amountPaid.toFixed(2).replace(".", ",")}`],
      ["Início", startDate],
      ["Válido até", endDate],
    ])}

    <div style="text-align:center;">
      <p style="color:#6B7280;font-size:12px;margin:0;">Até logo na Barbearia Dreamer!</p>
    </div>
  `;
  return shell(inner);
}

export function buildReminderEmail(data: {
  clientName: string;
  planName: string;
  daysRemaining: number;
  expiryDate: string;
}): string {
  const { clientName, planName, daysRemaining, expiryDate } = data;
  const inner = `
    <div style="text-align:center;margin-bottom:30px;">
      <div style="width:60px;height:60px;background-color:rgba(249,115,22,0.2);border-radius:50%;margin:0 auto 15px;">
        <span style="color:#F97316;font-size:28px;line-height:60px;"><img src="${SITE_URL}/images/icons/icon-bell-orange.png" width="28" height="28" alt="" style="display:block;margin:0 auto;padding-top:16px;" /></span>
      </div>
      <h2 style="color:#ffffff;margin:0;font-size:22px;">Seu plano está acabando!</h2>
      <p style="color:#9CA3AF;margin:8px 0 0;font-size:14px;">Não deixe seu estilo para trás</p>
    </div>

    <p style="color:#D1D5DB;font-size:14px;line-height:22px;text-align:center;margin:0 0 25px;">
      Olá <strong style="color:#ffffff;">${clientName}</strong>, seu plano
      <strong style="color:#F97316;">${planName}</strong> termina em
      <strong style="color:#F97316;">${daysRemaining} dias</strong> (${expiryDate}).
      Não se esqueça de renovar para continuar aproveitando nossos serviços!
    </p>

    ${infoTable([
      ["Cliente", clientName],
      ["Plano", planName, "#F97316"],
      ["Dias restantes", String(daysRemaining), "#F97316"],
      ["Data de expiração", expiryDate],
    ])}

    <div style="text-align:center;">
      <p style="color:#6B7280;font-size:12px;margin:0;">Renove agora e continue no estilo Barbearia Dreamer!</p>
    </div>
  `;
  return shell(inner);
}

export function buildFeedbackRequestEmail(data: {
  clientName: string;
  serviceName: string;
  dateBR: string;
}): string {
  const { clientName, serviceName, dateBR } = data;
  const inner = `
    <div style="text-align:center;margin-bottom:30px;">
      <div style="width:60px;height:60px;background-color:rgba(249,115,22,0.2);border-radius:50%;margin:0 auto 15px;">
        <span style="color:#F97316;font-size:28px;line-height:60px;"><img src="${SITE_URL}/images/icons/icon-scissors-orange.png" width="28" height="28" alt="" style="display:block;margin:0 auto;padding-top:16px;" /></span>
      </div>
      <h2 style="color:#ffffff;margin:0;font-size:22px;">Seu corte já foi feito!</h2>
      <p style="color:#9CA3AF;margin:8px 0 0;font-size:14px;">Esperamos que esteja amando o resultado</p>
    </div>

    <p style="color:#D1D5DB;font-size:14px;line-height:22px;text-align:center;margin:0 0 25px;">
      Olá <strong style="color:#ffffff;">${clientName}</strong>! Seu
      <strong style="color:#F97316;">${serviceName}</strong> de
      <strong style="color:#ffffff;">${dateBR}</strong> foi concluído.
      Queremos saber como ficou: deixe sua avaliação e ajude outros clientes a conhecerem nosso trabalho!
    </p>

    ${infoTable([
      ["Cliente", clientName],
      ["Serviço", serviceName, "#F97316"],
      ["Data", dateBR],
    ])}

    <div style="text-align:center;margin-bottom:18px;">
      <a
        href="${SITE_URL}/#reviews"
        style="display:inline-block;background:linear-gradient(135deg,#F97316,#F59E0B);color:#0a0a0a;font-size:15px;font-weight:800;padding:14px 36px;border-radius:999px;text-decoration:none;"
      >Deixar minha avaliação</a>
    </div>

    <p style="color:#4B5563;font-size:11px;text-align:center;margin:0 0 20px;">
      Se o botão não funcionar, copie e cole no navegador:<br />
      <span style="color:#9CA3AF;">${SITE_URL}/#reviews</span>
    </p>
  `;
  return shell(inner);
}

export function buildWelcomeEmail(name: string | null): string {
  const displayName = name ? name.split(" ")[0] : "";
  const inner = `
    <div style="text-align:center;margin-bottom:30px;">
      <div style="width:60px;height:60px;background-color:rgba(249,115,22,0.2);border-radius:50%;margin:0 auto 15px;">
        <span style="color:#F97316;font-size:28px;line-height:60px;"><img src="${SITE_URL}/images/icons/icon-thumbsup-orange.png" width="28" height="28" alt="" style="display:block;margin:0 auto;padding-top:16px;" /></span>
      </div>
      <h2 style="color:#ffffff;margin:0;font-size:22px;">Bem-vindo(a), ${displayName || "cliente"}!</h2>
      <p style="color:#9CA3AF;margin:8px 0 0;font-size:14px;">Sua conta foi criada com sucesso</p>
    </div>

    <p style="color:#D1D5DB;font-size:14px;line-height:22px;text-align:center;margin:0 0 25px;">
      Olá${displayName ? ` <strong style="color:#ffffff;">${displayName}</strong>` : ""}! Obrigado por criar sua conta na
      <strong style="color:#F97316;">Barbearia Dreamer</strong>. Agora você pode agendar seus cortes,
      assinar planos exclusivos e acompanhar tudo em um só lugar.
    </p>

    <div style="text-align:center;">
      <p style="color:#6B7280;font-size:12px;margin:0;">Seu Estilo, Nossa Arte!</p>
    </div>
  `;
  return shell(inner);
}
