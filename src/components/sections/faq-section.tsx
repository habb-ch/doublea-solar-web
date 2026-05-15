import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site-config";
import { faqs as defaultFaqs, type FaqItem } from "./faq-section.defaults";

// Re-export für Bestandscode, der `faqs` aus diesem Modul importiert.
export { defaultFaqs as faqs };

type Props = {
  items?: FaqItem[];
  email?: string;
};

export function FaqSection({ items, email }: Props = {}) {
  const list = items && items.length > 0 ? items : defaultFaqs;
  const contactEmail = email ?? siteConfig.contact.email;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section id="faq" className="container-page py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
            Häufige Fragen
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Antworten auf die Fragen, die wirklich zählen.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Sie haben eine spezifische Frage? Schreiben Sie uns an{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {contactEmail}
            </a>{" "}
            – wir antworten in der Regel innert 24 Stunden.
          </p>
        </div>

        <Accordion className="rounded-2xl border border-border bg-card/60 px-5 py-2 backdrop-blur-sm">
          {list.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="py-5 text-base font-medium">
                {f.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
