import "server-only";

import { siteConfig } from "@/lib/site-config";
import type { SolarCalculatorResult } from "@/lib/solar/calculate";
import type { SolarCalculatorFormInput } from "@/lib/validations/lead";
import {
  formatChf,
  formatChfRange,
  formatKwh,
  formatKwp,
  formatPercent,
  formatYearsRange,
} from "@/lib/solar/format";

type LeadPayload = {
  name?: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  heatingType?: string | null;
  message?: string | null;
  source?: string;
  topic?: string;
  ipHash?: string | null;
  userAgent?: string | null;
};

const heatingLabels: Record<string, string> = {
  oel: "Ölheizung",
  gas: "Gasheizung",
  waermepumpe: "Wärmepumpe",
  fernwaerme: "Fernwärme",
  holz: "Holz / Pellet",
  elektro: "Elektroheizung",
  andere: "Andere / unbekannt",
};

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      (process.env.LEAD_NOTIFY_TO ?? siteConfig.contact.email) &&
      process.env.LEAD_NOTIFY_FROM,
  );
}

async function sendViaResend(args: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: args.from,
        to: [args.to],
        reply_to: args.replyTo ? [args.replyTo] : undefined,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${detail.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function leadHeaderRows(lead: LeadPayload): { html: string; text: string } {
  const rows: [string, string | null | undefined][] = [
    ["Name", lead.name],
    ["E-Mail", lead.email],
    ["Telefon", lead.phone || null],
    ["Adresse", lead.address || null],
    [
      "Heizart",
      lead.heatingType ? heatingLabels[lead.heatingType] ?? lead.heatingType : null,
    ],
    ["Anliegen", lead.topic || null],
    ["Quelle", lead.source || null],
    ["User-Agent", lead.userAgent || null],
    ["IP-Hash (anonym.)", lead.ipHash || null],
  ];
  const html = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#667085;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
          k,
        )}</td><td style="padding:6px 0;color:#101828;font-size:14px;font-weight:500">${escapeHtml(
          String(v),
        )}</td></tr>`,
    )
    .join("");
  const text = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return { html, text };
}

function shellHtml(args: {
  preheader: string;
  title: string;
  bodyHtml: string;
  ctaHref?: string;
  ctaLabel?: string;
}): string {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(args.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif;color:#101828">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${escapeHtml(args.preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e7eaee;border-radius:14px;overflow:hidden">
          <tr><td style="background:#0b1f33;padding:22px 28px">
            <div style="display:inline-flex;align-items:center;gap:10px">
              <div style="width:32px;height:32px;background:#f5b841;border-radius:8px"></div>
              <div style="color:#f8faf7;font-weight:600;font-size:16px;letter-spacing:-0.01em">DoubleA Solar Solutions</div>
            </div>
          </td></tr>
          <tr><td style="padding:28px">
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#101828">${escapeHtml(args.title)}</h1>
            ${args.bodyHtml}
            ${
              args.ctaHref && args.ctaLabel
                ? `<p style="margin:24px 0 0"><a href="${escapeHtml(
                    args.ctaHref,
                  )}" style="display:inline-block;background:#0b1f33;color:#f8faf7;text-decoration:none;padding:10px 16px;border-radius:10px;font-size:14px;font-weight:500">${escapeHtml(
                    args.ctaLabel,
                  )}</a></p>`
                : ""
            }
          </td></tr>
          <tr><td style="padding:18px 28px;border-top:1px solid #eef0f3;color:#667085;font-size:12px;line-height:1.5">
            Diese Nachricht wurde automatisch von <a href="${escapeHtml(siteConfig.url)}" style="color:#0e7a5f;text-decoration:none">${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}</a> generiert.<br/>
            Antworten Sie direkt auf diese E-Mail – die Antwort geht an die anfragende Person.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

/**
 * Sende eine Benachrichtigung über einen neuen Lead. Wird im Hintergrund
 * vom API-Handler aufgerufen; failure führt nicht zum Abbruch der Anfrage.
 */
export async function sendLeadNotification(lead: LeadPayload): Promise<void> {
  if (!isEmailConfigured()) return;

  const { html: rowsHtml, text: rowsText } = leadHeaderRows(lead);
  const subject = `Neue Anfrage: ${lead.name || lead.email}${lead.topic ? ` (${lead.topic})` : ""}`;
  const preheader = `Neue ${lead.source || "Website"}-Anfrage von ${lead.name || lead.email}`;

  const messageHtml = lead.message
    ? `<div style="margin-top:18px;padding:14px 16px;background:#f8faf7;border:1px solid #eef0f3;border-radius:10px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#667085;margin-bottom:6px">Nachricht</div><div style="font-size:14px;line-height:1.55;color:#101828;white-space:pre-wrap">${escapeHtml(lead.message)}</div></div>`
    : "";

  const html = shellHtml({
    preheader,
    title: "Neue Anfrage über die Website",
    bodyHtml: `
      <p style="margin:0 0 14px;color:#667085;font-size:14px;line-height:1.55">Eine neue Anfrage ist eingetroffen. Antworten Sie direkt auf diese E-Mail, um mit der Person Kontakt aufzunehmen.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsHtml}</table>
      ${messageHtml}
    `,
    ctaHref: `mailto:${lead.email}`,
    ctaLabel: `An ${lead.name || lead.email} antworten`,
  });

  const text = `Neue Anfrage über die Website\n\n${rowsText}${
    lead.message ? `\n\nNachricht:\n${lead.message}` : ""
  }\n\n— ${siteConfig.url}`;

  await sendNotification({
    subject,
    html,
    text,
    replyTo: lead.email,
  });
}

/**
 * Sende eine Benachrichtigung über eine neue Solarrechner-Anfrage inkl.
 * vollständiger Erstauswertung.
 */
export async function sendSolarCalculationNotification(args: {
  lead?: LeadPayload | null;
  input: SolarCalculatorFormInput;
  result: SolarCalculatorResult;
}): Promise<void> {
  if (!isEmailConfigured()) return;

  const { lead, input, result } = args;

  const headerRows = lead
    ? leadHeaderRows(lead)
    : { html: "", text: "(Lead-Daten nicht erfasst – nur Berechnung)" };

  const inputRows: [string, string][] = [
    ["Gebäudetyp", input.buildingType],
    ["Kanton", input.canton],
    ["PLZ / Ort", `${input.postalCode || "–"} ${input.city || ""}`.trim()],
    ["Dachfläche", `${input.roofAreaM2} m² · ${input.usableRoofPercent}% nutzbar`],
    ["Ausrichtung / Neigung", `${input.orientation} · ${input.tilt}°`],
    ["Verschattung", input.shading],
    ["Stromverbrauch", `${input.annualConsumptionKwh} kWh/Jahr`],
    ["Wärmepumpe", input.hasHeatPump ? "ja" : "nein"],
    ["Elektroauto", input.hasEv ? "ja" : "nein"],
    ["Batterie gewünscht", input.wantsBattery],
    [
      "Strompreis / Einspeisung",
      `${input.electricityPriceRappen ?? 30} / ${input.feedInTariffRappen ?? 10} Rp./kWh`,
    ],
    ["Finanzierung", input.financingInterest ?? "–"],
  ];

  const resultRows: [string, string][] = [
    ["Empfohlene Anlage", `${formatKwp(result.recommendedKwp)} (${result.usableAreaM2} m²)`],
    [
      "Jahresproduktion",
      `${formatKwh(result.annualProductionKwh.realistic)} (${formatKwh(result.annualProductionKwh.conservative)} – ${formatKwh(result.annualProductionKwh.optimistic)})`,
    ],
    ["Eigenverbrauch", `${formatPercent(result.selfConsumptionShare)} · ${formatKwh(result.selfConsumedKwh)} direkt`],
    [
      "Jährliche Ersparnis",
      `${formatChf(result.annualSavingsChf.realistic)} (${formatChfRange(result.annualSavingsChf.conservative, result.annualSavingsChf.optimistic)})`,
    ],
    ["Investition", formatChfRange(result.investmentChf.low, result.investmentChf.high)],
    [
      "Förderspanne (indikativ)",
      formatChfRange(result.estimatedSubsidyRangeChf.low, result.estimatedSubsidyRangeChf.high),
    ],
    [
      "Amortisation (indikativ)",
      formatYearsRange(result.paybackYears.fast, result.paybackYears.slow),
    ],
    ["Batterie", result.recommendation.battery + (result.recommendedBatteryKwh ? ` · ${result.recommendedBatteryKwh} kWh` : "")],
    ["CO₂-Einsparung", `${result.co2SavedKgPerYear} kg/Jahr (indikativ)`],
  ];

  function rowsToHtml(rows: [string, string][]): string {
    return rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#667085;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
            k,
          )}</td><td style="padding:6px 0;color:#101828;font-size:14px;font-weight:500">${escapeHtml(v)}</td></tr>`,
      )
      .join("");
  }
  function rowsToText(rows: [string, string][]): string {
    return rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  }

  const subject = lead
    ? `Solarrechner-Anfrage: ${lead.name || lead.email} (${formatKwp(result.recommendedKwp)})`
    : `Anonyme Solarrechner-Berechnung (${formatKwp(result.recommendedKwp)})`;

  const html = shellHtml({
    preheader: `Solarrechner-Anfrage – ${formatKwp(result.recommendedKwp)} empfohlen`,
    title: "Neue Solarrechner-Anfrage",
    bodyHtml: `
      ${
        lead
          ? `<div style="margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#0e7a5f">Kontakt</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">${headerRows.html}</table>`
          : `<p style="margin:0 0 18px;color:#667085;font-size:13px">Keine Kontaktdaten erfasst – Person hat nur die Berechnung gestartet.</p>`
      }

      <div style="margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#0e7a5f">Eingaben</div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">${rowsToHtml(inputRows)}</table>

      <div style="margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#0e7a5f">Auswertung</div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rowsToHtml(resultRows)}</table>

      ${
        result.recommendation.notes.length
          ? `<div style="margin-top:18px;padding:14px 16px;background:#fff8e6;border:1px solid #f5b841;border-radius:10px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#0b1f33;margin-bottom:6px">Hinweise</div><ul style="margin:0;padding-left:18px;color:#101828;font-size:14px;line-height:1.55">${result.recommendation.notes
              .map((n) => `<li>${escapeHtml(n)}</li>`)
              .join("")}</ul></div>`
          : ""
      }
    `,
    ctaHref: lead ? `mailto:${lead.email}` : undefined,
    ctaLabel: lead ? `An ${lead.name || lead.email} antworten` : undefined,
  });

  const text = `Neue Solarrechner-Anfrage\n\n${
    lead ? `Kontakt:\n${headerRows.text}\n\n` : "Keine Kontaktdaten erfasst.\n\n"
  }Eingaben:\n${rowsToText(inputRows)}\n\nAuswertung:\n${rowsToText(resultRows)}${
    result.recommendation.notes.length
      ? `\n\nHinweise:\n- ${result.recommendation.notes.join("\n- ")}`
      : ""
  }\n\n— ${siteConfig.url}`;

  await sendNotification({
    subject,
    html,
    text,
    replyTo: lead?.email,
  });
}

async function sendNotification(args: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const to = process.env.LEAD_NOTIFY_TO ?? siteConfig.contact.email;
  const from = process.env.LEAD_NOTIFY_FROM!;
  const result = await sendViaResend({
    to,
    from,
    replyTo: args.replyTo,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });
  if (!result.ok) {
    console.warn("[email] notification failed:", result.error);
  }
}
