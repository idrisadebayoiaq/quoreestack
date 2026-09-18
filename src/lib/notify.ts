type LeadPayload = {
  name: string;
  email: string;
  subject?: string | null;
  serviceInterest?: string | null;
  budget?: string | null;
  message: string;
};

function formatLeadText(lead: LeadPayload) {
  return [
    `New QuoreStack lead`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Subject: ${lead.subject || "—"}`,
    `Service: ${lead.serviceInterest || "—"}`,
    `Budget: ${lead.budget || "—"}`,
    ``,
    lead.message,
  ].join("\n");
}

async function notifyDiscord(lead: LeadPayload) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhookUrl) return { attempted: false as const, sent: false as const };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: null,
      embeds: [
        {
          title: "New QuoreStack lead",
          color: 0x1ad4a8,
          fields: [
            { name: "Name", value: lead.name, inline: true },
            { name: "Email", value: lead.email, inline: true },
            { name: "Subject", value: lead.subject || "—", inline: false },
            { name: "Service", value: lead.serviceInterest || "—", inline: true },
            { name: "Budget", value: lead.budget || "—", inline: true },
            {
              name: "Message",
              value: lead.message.slice(0, 1000) || "—",
              inline: false,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("Discord notification failed", response.status, await response.text());
    return { attempted: true as const, sent: false as const };
  }

  return { attempted: true as const, sent: true as const };
}

async function notifyTelegram(lead: LeadPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return { attempted: false as const, sent: false as const };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadText(lead),
    }),
  });

  if (!response.ok) {
    console.error("Telegram notification failed", response.status, await response.text());
    return { attempted: true as const, sent: false as const };
  }

  return { attempted: true as const, sent: true as const };
}

async function notifyGenericWebhook(lead: LeadPayload) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!webhookUrl) return { attempted: false as const, sent: false as const };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "contact.submitted",
      lead,
      text: formatLeadText(lead),
    }),
  });

  if (!response.ok) {
    console.error("Lead webhook failed", response.status, await response.text());
    return { attempted: true as const, sent: false as const };
  }

  return { attempted: true as const, sent: true as const };
}

/**
 * Notify on new contact submissions.
 * Configure any of: Discord webhook, Telegram bot, or a generic webhook.
 * Leads are always stored in Admin → Contacts either way.
 */
export async function notifyNewLead(lead: LeadPayload) {
  try {
    const results = await Promise.all([
      notifyDiscord(lead),
      notifyTelegram(lead),
      notifyGenericWebhook(lead),
    ]);

    const attempted = results.some((result) => result.attempted);
    const sent = results.some((result) => result.sent);

    if (!attempted) {
      console.info(
        "Lead saved to Admin → Contacts. No alert channel configured (set DISCORD_WEBHOOK_URL or TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID).",
        { email: lead.email, subject: lead.subject },
      );
      return { sent: false as const, reason: "no_channel_configured" };
    }

    return { sent, reason: sent ? "ok" : "channel_error" };
  } catch (error) {
    console.error("Lead notification error", error);
    return { sent: false as const, reason: "exception" };
  }
}
