import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

type CtaBandProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CtaBand({
  eyebrow = "Ihr nächster Schritt",
  title,
  description,
  primaryHref = "/solarrechner",
  primaryLabel = "Solarpotenzial berechnen",
  secondaryHref = "/kontakt",
  secondaryLabel = "Beratung anfragen",
}: CtaBandProps) {
  return (
    <section className="container-page my-16 sm:my-24">
      <div className="surface-navy grain-overlay relative overflow-hidden rounded-3xl px-8 py-14 lg:px-16 lg:py-20">
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
              {eyebrow}
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[44px]">
              {title}
            </h2>
            {description && (
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <Link
              href={primaryHref}
              className="ring-focus inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[color:var(--solar-gold)] px-5 text-sm font-semibold text-[color:var(--solar-navy)] shadow-[0_18px_40px_-22px_rgba(245,184,65,0.7)] transition-transform hover:-translate-y-0.5"
            >
              <Calculator className="size-4" />
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="ring-focus inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-medium text-white/90 transition-colors hover:bg-white/5"
            >
              {secondaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
