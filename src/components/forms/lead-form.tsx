"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  heatingTypes,
  heatingTypeLabels,
  leadSchema,
  type LeadInput,
  type HeatingType,
} from "@/lib/validations/lead";

type LeadFormProps = {
  source?: string;
  context?: Record<string, unknown>;
  /** Optional: zeige eine zusätzliche CTA neben der Erfolgsmeldung. */
  successCta?: ReactNode;
  /** Wenn true: kompakte Variante ohne Nachricht-Feld. */
  compact?: boolean;
  /**
   * Wenn true: vollständige Offerten-Anfrage — Telefon, Hausadresse und
   * Heizart sind Pflicht. Standardvariante (false) verlangt nur Name + Email.
   */
  requireFullDetails?: boolean;
};

/**
 * Erzeugt das Validierungs-Schema dynamisch je nach `requireFullDetails`.
 * So können wir das Lead-Schema teilen und gleichzeitig im Offer-Modus
 * Pflichtfelder erzwingen, ohne den Contact-Form zu brechen.
 */
function buildSchema(requireFull: boolean) {
  if (!requireFull) return leadSchema;
  const swissPhone = /^[+0-9 ()/-]{6,30}$/;
  return leadSchema
    .extend({
      phone: z
        .string()
        .trim()
        .min(6, "Telefonnummer ist Pflicht.")
        .regex(swissPhone, "Telefonnummer ungültig."),
      address: z
        .string()
        .trim()
        .min(5, "Bitte geben Sie Ihre vollständige Adresse an.")
        .max(240),
      heatingType: z.enum(heatingTypes, {
        message: "Bitte wählen Sie Ihre aktuelle Heizart.",
      }),
    });
}

export function LeadForm({
  source = "website",
  context,
  successCta,
  compact = false,
  requireFullDetails = false,
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const schema = buildSchema(requireFullDetails);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      heatingType: undefined,
      message: "",
      consent: false,
      source,
      company_website: "",
    },
  });

  const consent = watch("consent");
  const heatingType = watch("heatingType");

  async function onSubmit(values: LeadInput) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source, context }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Anfrage konnte nicht gesendet werden.");
      }
      setSubmitted(true);
      reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        heatingType: undefined,
        message: "",
        consent: false,
        source,
      });
      toast.success("Vielen Dank – wir melden uns innert eines Werktags.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Etwas ist schiefgelaufen.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[color:var(--solar-emerald)]/30 bg-[color:var(--solar-emerald)]/8 p-5">
        <p className="text-sm font-semibold text-[color:var(--solar-emerald)]">
          Anfrage erhalten – herzlichen Dank.
        </p>
        <p className="mt-1 text-sm text-foreground/80">
          Wir prüfen Ihre Angaben und melden uns innert eines Werktags persönlich.
        </p>
        {successCta && <div className="mt-3">{successCta}</div>}
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Neue Anfrage senden
        </button>
      </div>
    );
  }

  const phoneLabel = requireFullDetails ? "Telefon *" : "Telefon (optional)";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="lead-name">Name *</FieldLabel>
          <Input
            id="lead-name"
            autoComplete="name"
            placeholder="Vor- und Nachname"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="lead-email">E-Mail *</FieldLabel>
            <Input
              id="lead-email"
              type="email"
              autoComplete="email"
              placeholder="ihre.adresse@example.ch"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </Field>

          <Field>
            <FieldLabel htmlFor="lead-phone">{phoneLabel}</FieldLabel>
            <Input
              id="lead-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+41 …"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            <FieldError errors={errors.phone ? [errors.phone] : undefined} />
          </Field>
        </div>

        {requireFullDetails && (
          <>
            <Field>
              <FieldLabel htmlFor="lead-address">Adresse des Objekts *</FieldLabel>
              <Input
                id="lead-address"
                autoComplete="street-address"
                placeholder="Strasse, PLZ, Ort"
                aria-invalid={!!errors.address}
                {...register("address")}
              />
              <FieldError errors={errors.address ? [errors.address] : undefined} />
            </Field>

            <Field>
              <FieldLabel>Heizart *</FieldLabel>
              <FieldDescription>
                Hilft uns, Wärmepumpe und Eigenverbrauch realistisch einzuplanen.
              </FieldDescription>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {heatingTypes.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() =>
                      setValue("heatingType", h as HeatingType, {
                        shouldValidate: true,
                      })
                    }
                    aria-pressed={heatingType === h}
                    className={cn(
                      "ring-focus rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                      heatingType === h
                        ? "border-[color:var(--solar-navy)] bg-[color:var(--solar-navy)] text-[color:var(--solar-navy-foreground)]"
                        : "border-border bg-card hover:bg-secondary",
                    )}
                  >
                    {heatingTypeLabels[h as HeatingType]}
                  </button>
                ))}
              </div>
              <FieldError
                errors={errors.heatingType ? [errors.heatingType] : undefined}
              />
            </Field>
          </>
        )}

        {!compact && (
          <Field>
            <FieldLabel htmlFor="lead-message">Ihre Nachricht (optional)</FieldLabel>
            <Textarea
              id="lead-message"
              rows={4}
              placeholder="Was sollen wir wissen, bevor wir uns melden?"
              aria-invalid={!!errors.message}
              {...register("message")}
            />
            <FieldError errors={errors.message ? [errors.message] : undefined} />
          </Field>
        )}

        {/* Honeypot — versteckt für echte Nutzer */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company_website">Website (nicht ausfüllen)</label>
          <input
            id="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company_website")}
          />
        </div>

        <Field orientation="horizontal">
          <Switch
            id="lead-consent"
            checked={consent}
            onCheckedChange={(v) => setValue("consent", v, { shouldValidate: true })}
          />
          <FieldContent>
            <FieldLabel htmlFor="lead-consent">
              Ich bin mit der{" "}
              <a href="/datenschutz" className="underline underline-offset-4">
                Datenschutzerklärung
              </a>{" "}
              einverstanden. *
            </FieldLabel>
            <FieldDescription>
              Wir nutzen Ihre Daten ausschliesslich zur Bearbeitung Ihrer Anfrage.
            </FieldDescription>
            <FieldError errors={errors.consent ? [errors.consent] : undefined} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-[color:var(--solar-navy)] text-[color:var(--solar-navy-foreground)] hover:bg-[color:var(--solar-navy)]/95"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Wird gesendet …
          </>
        ) : (
          "Anfrage senden"
        )}
      </Button>
    </form>
  );
}
