// src/backend/src/modules/notifications/notification-templates.ts

export interface NotificationTemplate {
    title: string;
    message: string;
    emailSubject: string;
    emailHtml: string;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function baseHtml(title: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1)">
        <tr><td style="background:#0f62fe;padding:24px 32px">
          <h1 style="margin:0;color:#fff;font-size:22px">MedHub</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:18px">${title}</h2>
          <p style="margin:0;color:#444;line-height:1.6">${body}</p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f4f6f9;color:#888;font-size:12px">
          Este e-mail foi enviado automaticamente pelo MedHub. Não responda a esta mensagem.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function appointmentCreatedTemplate(
    patientName: string,
    doctorName: string,
    date: Date,
): NotificationTemplate {
    const d = formatDate(date);
    const p = escapeHtml(patientName);
    const dr = escapeHtml(doctorName);
    return {
        title: "Consulta agendada",
        message: `Sua consulta com ${doctorName} foi agendada para ${d}.`,
        emailSubject: "MedHub — Consulta agendada",
        emailHtml: baseHtml(
            "Consulta agendada",
            `Olá, <strong>${p}</strong>!<br><br>
       Sua consulta com o(a) Dr(a). <strong>${dr}</strong> foi agendada para:<br>
       <strong>${d}</strong><br><br>
       Fique de olho nas próximas atualizações.`,
        ),
    };
}

export function appointmentConfirmedTemplate(
    patientName: string,
    doctorName: string,
    date: Date,
): NotificationTemplate {
    const d = formatDate(date);
    const p = escapeHtml(patientName);
    const dr = escapeHtml(doctorName);
    return {
        title: "Consulta confirmada",
        message: `Sua consulta com ${doctorName} em ${d} foi confirmada.`,
        emailSubject: "MedHub — Consulta confirmada",
        emailHtml: baseHtml(
            "Consulta confirmada ✓",
            `Olá, <strong>${p}</strong>!<br><br>
       Sua consulta com o(a) Dr(a). <strong>${dr}</strong> em <strong>${d}</strong> foi <strong>confirmada</strong>.<br><br>
       Lembre-se de comparecer com 15 minutos de antecedência.`,
        ),
    };
}

export function appointmentCancelledTemplate(
    patientName: string,
    doctorName: string,
    date: Date,
): NotificationTemplate {
    const d = formatDate(date);
    const p = escapeHtml(patientName);
    const dr = escapeHtml(doctorName);
    return {
        title: "Consulta cancelada",
        message: `Sua consulta com ${doctorName} em ${d} foi cancelada.`,
        emailSubject: "MedHub — Consulta cancelada",
        emailHtml: baseHtml(
            "Consulta cancelada",
            `Olá, <strong>${p}</strong>!<br><br>
       Infelizmente, sua consulta com o(a) Dr(a). <strong>${dr}</strong> agendada para <strong>${d}</strong> foi <strong>cancelada</strong>.<br><br>
       Acesse o MedHub para reagendar.`,
        ),
    };
}

export function appointmentRescheduledTemplate(
    patientName: string,
    doctorName: string,
    oldDate: Date,
    newDate: Date,
): NotificationTemplate {
    const oldD = formatDate(oldDate);
    const newD = formatDate(newDate);
    const p = escapeHtml(patientName);
    const dr = escapeHtml(doctorName);
    return {
        title: "Consulta remarcada",
        message: `Sua consulta com ${doctorName} foi remarcada de ${oldD} para ${newD}.`,
        emailSubject: "MedHub — Consulta remarcada",
        emailHtml: baseHtml(
            "Consulta remarcada",
            `Olá, <strong>${p}</strong>!<br><br>
       Sua consulta com o(a) Dr(a). <strong>${dr}</strong> foi <strong>remarcada</strong>:<br>
       <s style="color:#999">${oldD}</s><br>
       <strong>${newD}</strong>`,
        ),
    };
}
