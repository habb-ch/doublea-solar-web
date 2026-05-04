import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontakt – Solarberatung in der Schweiz",
  description:
    "Kontaktieren Sie DoubleA Solar Solutions in Grenchen. Persönliche Beratung, transparente Offerten, schweizweite Umsetzung.",
};

export default function KontaktPage() {
  const { contact } = siteConfig;
  return (
    <>
      <section className="container-page pt-12 pb-10 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Kontakt
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Sprechen wir über Ihr Solarprojekt.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Wir antworten in der Regel innerhalb eines Werktags. Für dringende
            Service-Themen erreichen Sie uns telefonisch.
          </p>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <ContactCard
              icon={MapPin}
              title="Standort"
              lines={[
                contact.address.street,
                `${contact.address.postalCode} ${contact.address.city}`,
                contact.address.country,
              ]}
            />
            <ContactCard
              icon={Phone}
              title="Telefon"
              lines={[contact.phone]}
              href={contact.phoneHref}
            />
            <ContactCard
              icon={Mail}
              title="E-Mail"
              lines={[contact.email]}
              href={`mailto:${contact.email}`}
            />
            <ContactCard
              icon={Clock}
              title="Erreichbarkeit"
              lines={[
                "Montag – Freitag, 08:00 – 18:00 Uhr",
                "Samstag nach Vereinbarung",
              ]}
            />
          </div>

          <div className="surface-glass rounded-3xl p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Anfrageformular
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Beschreiben Sie kurz Ihr Anliegen – wir melden uns persönlich.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon: Icon,
  title,
  lines,
  href,
}: {
  icon: typeof MapPin;
  title: string;
  lines: string[];
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      {...(href ? { href, className: "ring-focus block" } : {})}
      className="surface-glass group flex items-start gap-4 rounded-2xl p-5 ring-focus transition-shadow hover:shadow-[0_18px_40px_-30px_rgba(11,31,51,0.45)]"
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--solar-emerald)]/12 text-[color:var(--solar-emerald)]">
        <Icon className="size-5" />
      </span>
      <div className="text-sm leading-relaxed">
        <p className="font-semibold text-foreground">{title}</p>
        {lines.map((l) => (
          <p key={l} className="text-muted-foreground">
            {l}
          </p>
        ))}
      </div>
    </Wrapper>
  );
}
