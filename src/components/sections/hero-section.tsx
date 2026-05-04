"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { siteConfig } from "@/lib/site-config";
import { HeroVisual } from "./hero-visual";

export function HeroSection() {
  const reduce = useReducedMotion();
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: reduce ? 0 : delay,
      duration: reduce ? 0 : 0.6,
      ease: [0.2, 0.8, 0.2, 1] as const,
    },
  });

  return (
    <section className="relative overflow-hidden">
      <BackgroundDecor />
      <div className="container-page relative grid items-center gap-12 pt-12 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-28">
        <div className="relative">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--solar-emerald)]/25 bg-[color:var(--solar-emerald)]/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]"
          >
            <span className="size-1.5 rounded-full bg-[color:var(--solar-emerald)]" />
            Schweizer Photovoltaik · Sitz in Grenchen
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="mt-6 text-balance text-[40px] leading-[1.05] font-semibold text-foreground sm:text-5xl lg:text-[60px]"
          >
            Solarenergie für{" "}
            <span className="gold-underline">Schweizer Dächer</span>
            {" "}– präzise geplant, sauber umgesetzt.
          </motion.h1>

          <motion.p
            {...fadeUp(0.12)}
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground"
          >
            {siteConfig.name} begleitet Sie von der ersten Standortanalyse bis zur
            langfristigen Wartung Ihrer Photovoltaikanlage – transparent,
            persönlich und schweizweit professionell.
          </motion.p>

          <motion.div
            {...fadeUp(0.2)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="/solarrechner"
              className="ring-focus inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[color:var(--solar-navy)] px-5 text-sm font-semibold text-[color:var(--solar-navy-foreground)] shadow-[0_18px_36px_-22px_rgba(11,31,51,0.6)] transition-transform hover:-translate-y-0.5"
            >
              <Calculator className="size-4" />
              Solarpotenzial berechnen
            </Link>
            <Link
              href="/angebote"
              className="ring-focus inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Kostenloses Angebot erhalten
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp(0.28)}
            className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[color:var(--solar-gold)]" />
              Persönliche Beratung in Deutsch & Schweizerdeutsch
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <a
              href={siteConfig.contact.phoneHref}
              className="ring-focus inline-flex items-center gap-2 rounded-md text-foreground hover:underline"
            >
              <Phone className="size-3.5" />
              {siteConfig.contact.phone}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: reduce ? 0 : 0.18,
            duration: reduce ? 0 : 0.7,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          className="relative"
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(107,160,37,0.08)_0%,transparent_70%)]" />
      <div className="absolute -top-40 right-[-10%] size-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,184,65,0.10)_0%,transparent_60%)]" />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  );
}
