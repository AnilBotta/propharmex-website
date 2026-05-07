/**
 * Hot-lead alert fan-out. Called from /api/ai/lead-intelligence whenever
 * a freshly persisted brief comes back with intent_band="hot".
 *
 * Server-only. Fire-and-forget — caller wraps with `void notifyHotLead(...)`
 * so a failed Slack post or email never fails the AI request.
 *
 * Channels (independent, both env-gated):
 *   - Slack incoming webhook  → HOT_LEAD_SLACK_WEBHOOK_URL
 *   - Email via Resend        → HOT_LEAD_ALERT_EMAILS (comma-separated)
 *
 * Both unset → no-op (logs once at info level).
 */
import { Resend } from "resend";

import { env, log } from "@propharmex/lib";

interface NotifyHotLeadArgs {
  lead: {
    id: string;
    email: string;
    contact_name: string | null;
    company: string | null;
    source: string;
    service: string | null;
    dosage_form: string | null;
  };
  intelligence: {
    intent_score: number;
    summary: string;
    rationale: string;
  };
}

export async function notifyHotLead(args: NotifyHotLeadArgs): Promise<void> {
  const slackUrl = env.HOT_LEAD_SLACK_WEBHOOK_URL;
  const emailRecipients = parseEmailList(env.HOT_LEAD_ALERT_EMAILS);

  if (!slackUrl && emailRecipients.length === 0) {
    log.info("hot-lead.notify_skipped_no_channels", { leadId: args.lead.id });
    return;
  }

  const text = buildAlertText(args);

  if (slackUrl) {
    await sendSlack(slackUrl, text, args.lead.id);
  }

  if (emailRecipients.length > 0) {
    await sendEmail(emailRecipients, text, args);
  }

  log.info("hot-lead.notified", {
    leadId: args.lead.id,
    intentScore: args.intelligence.intent_score,
    channels: {
      slack: Boolean(slackUrl),
      email: emailRecipients.length,
    },
  });
}

function buildAlertText({ lead, intelligence }: NotifyHotLeadArgs): string {
  const who = lead.contact_name || lead.email;
  const company = lead.company || "—";
  const service = lead.service || "—";
  const dosage = lead.dosage_form || "—";
  const rationale = truncate(intelligence.rationale.replace(/\s+/g, " "), 240);
  const dashboardUrl = `${env.NEXT_PUBLIC_SITE_URL}/dashboard?leadId=${encodeURIComponent(lead.id)}`;

  return [
    `🔥 *Hot lead* — ${who} · ${company} · score ${intelligence.intent_score}/100`,
    `Source: ${lead.source} · Service: ${service} · Dosage: ${dosage}`,
    `Why hot: ${rationale}`,
    `Open: ${dashboardUrl}`,
  ].join("\n");
}

async function sendSlack(
  url: string,
  text: string,
  leadId: string,
): Promise<void> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      log.warn("hot-lead.slack_failed", {
        leadId,
        status: res.status,
      });
    }
  } catch (err) {
    log.warn("hot-lead.slack_error", {
      leadId,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

async function sendEmail(
  recipients: string[],
  text: string,
  args: NotifyHotLeadArgs,
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    log.warn("hot-lead.email_skipped_no_api_key", { leadId: args.lead.id });
    return;
  }
  const fromAddress = env.RESEND_DASHBOARD_FROM_EMAIL ?? env.RESEND_FROM_EMAIL;
  if (!fromAddress) {
    log.warn("hot-lead.email_skipped_no_from", { leadId: args.lead.id });
    return;
  }
  const subjectName = args.lead.contact_name || args.lead.email;
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: fromAddress,
      to: recipients,
      subject: `🔥 Hot lead — ${subjectName}`,
      text,
    });
  } catch (err) {
    log.warn("hot-lead.email_error", {
      leadId: args.lead.id,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

function parseEmailList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.includes("@"));
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}
