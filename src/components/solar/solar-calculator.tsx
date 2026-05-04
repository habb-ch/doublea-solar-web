"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  solarCalculatorSchema,
  type SolarCalculatorFormInput,
} from "@/lib/validations/lead";
import {
  calculateSolar,
  type SolarCalculatorResult,
} from "@/lib/solar/calculate";
import { cantonCodes, type CantonCode } from "@/lib/solar/canton-data";
import { CantonSelect } from "./canton-select";
import { RoofInputs } from "./roof-inputs";
import { CalculatorResultCard } from "./calculator-result-card";
import { AddressStep, type AddressStepSelection } from "./address-step";

const buildingTypes: {
  value: SolarCalculatorFormInput["buildingType"];
  label: string;
  description: string;
}[] = [
  {
    value: "einfamilienhaus",
    label: "Einfamilienhaus",
    description: "Privat, 1 Haushalt",
  },
  {
    value: "mehrfamilienhaus",
    label: "Mehrfamilienhaus",
    description: "Mehrere Wohneinheiten / ZEV",
  },
  {
    value: "gewerbe",
    label: "Gewerbe",
    description: "Büro, Industrie, Logistik",
  },
  {
    value: "landwirtschaft",
    label: "Landwirtschaft",
    description: "Stall, Scheune, Reithalle",
  },
  {
    value: "sonstiges",
    label: "Sonstiges",
    description: "Anderes Objekt",
  },
];

const wantsBatteryOptions: {
  value: SolarCalculatorFormInput["wantsBattery"];
  label: string;
}[] = [
  { value: "ja", label: "Ja, gewünscht" },
  { value: "nein", label: "Nein, vorerst nicht" },
  { value: "unsicher", label: "Noch unsicher" },
];

const financingOptions: {
  value: NonNullable<SolarCalculatorFormInput["financingInterest"]>;
  label: string;
}[] = [
  { value: "ja", label: "Ja" },
  { value: "nein", label: "Nein" },
  { value: "unsicher", label: "Beratung erwünscht" },
];

const stepConfig = [
  { id: 0, label: "Adresse", fields: [] },
  { id: 1, label: "Standort & Gebäude", fields: ["buildingType", "canton"] },
  {
    id: 2,
    label: "Dach",
    fields: [
      "roofAreaM2",
      "usableRoofPercent",
      "orientation",
      "tilt",
      "shading",
    ],
  },
  {
    id: 3,
    label: "Verbrauch & Lasten",
    fields: ["annualConsumptionKwh", "wantsBattery"],
  },
] as const;

type StepKey = (typeof stepConfig)[number]["fields"][number];

const defaultValues: SolarCalculatorFormInput = {
  buildingType: "einfamilienhaus",
  canton: "SO",
  postalCode: "",
  city: "",
  roofAreaM2: 80,
  usableRoofPercent: 75,
  orientation: "sued",
  tilt: "25-40",
  shading: "keine",
  annualConsumptionKwh: 5500,
  hasHeatPump: false,
  hasEv: false,
  wantsBattery: "unsicher",
  electricityPriceRappen: 30,
  feedInTariffRappen: 10,
  financingInterest: "unsicher",
};

export function SolarCalculator() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SolarCalculatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<SolarCalculatorFormInput>({
    resolver: zodResolver(solarCalculatorSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const values = watch();

  // Live-Vorschau für die Schnellanzeige im Header.
  const livePreview = useMemo(() => {
    try {
      const parsed = solarCalculatorSchema.safeParse(values);
      if (!parsed.success) return null;
      return calculateSolar(parsed.data);
    } catch {
      return null;
    }
  }, [values]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const progress = ((step + 1) / (stepConfig.length + 1)) * 100;

  async function nextStep() {
    const cfg = stepConfig[step];
    if (!cfg) return;
    if (cfg.fields.length > 0) {
      const ok = await trigger(cfg.fields as readonly StepKey[] as StepKey[]);
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, stepConfig.length));
  }

  function prevStep() {
    setStep((s) => Math.max(0, s - 1));
  }

  function applySonnendachSelection(selection: AddressStepSelection) {
    const { address, building, selectedSegmentIds } = selection;
    const segs = building.segments.filter((s) => selectedSegmentIds.includes(s.id));
    if (segs.length === 0) return;
    const totalArea = segs.reduce((s, x) => s + x.areaM2, 0);
    const totalUsable = segs.reduce((s, x) => s + x.usableAreaM2, 0);
    const totalYield = segs.reduce((s, x) => s + x.electricityYieldKwhYear, 0);
    const weightedIrr =
      segs.reduce((s, x) => s + x.specificIrradiationKwhM2Year * x.areaM2, 0) /
      Math.max(totalArea, 1);
    const avgClass =
      segs.reduce((s, x) => s + x.suitabilityClass * x.areaM2, 0) /
      Math.max(totalArea, 1);

    const ct = (address.canton ?? "").toUpperCase();
    const cantonValue = (cantonCodes as readonly string[]).includes(ct)
      ? (ct as CantonCode)
      : values.canton;

    setValue("canton", cantonValue, { shouldValidate: true });
    if (address.postalCode) setValue("postalCode", address.postalCode, { shouldValidate: true });
    if (address.city) setValue("city", address.city, { shouldValidate: true });
    setValue("address", address.label, { shouldValidate: false });
    setValue("roofAreaM2", Math.round(totalArea), { shouldValidate: true });
    setValue(
      "usableRoofPercent",
      Math.max(30, Math.min(100, Math.round((totalUsable / Math.max(totalArea, 1)) * 100))),
      { shouldValidate: true },
    );
    setValue("sonnendach", {
      totalAreaM2: Math.round(totalArea * 10) / 10,
      usableAreaM2: Math.round(totalUsable * 10) / 10,
      totalElectricityYieldKwhYear: Math.round(totalYield),
      weightedSpecificIrradiationKwhM2Year: Math.round(weightedIrr),
      segmentCount: segs.length,
      averageSuitabilityClass: Math.round(avgClass * 10) / 10,
    });

    setStep(1);
  }

  function skipAddressStep() {
    setValue("sonnendach", undefined as never, { shouldValidate: false });
    setValue("address", "", { shouldValidate: false });
    setStep(1);
  }

  async function onSubmit(data: SolarCalculatorFormInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/solar-calculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: data }),
      });
      if (!res.ok) {
        // Fallback: rechne lokal weiter, damit der Nutzer trotzdem ein Ergebnis sieht.
        const local = calculateSolar(data);
        setResult(local);
        toast.warning(
          "Server konnte die Berechnung nicht speichern – wir zeigen Ihnen die lokale Auswertung.",
        );
        return;
      }
      const payload = (await res.json()) as { result: SolarCalculatorResult };
      setResult(payload.result);
    } catch {
      const local = calculateSolar(data);
      setResult(local);
      toast.warning(
        "Verbindung gestört – wir zeigen Ihnen die lokale Auswertung.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setResult(null);
    setStep(0);
    form.reset(defaultValues);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="surface-glass relative overflow-hidden rounded-3xl">
        <div className="border-b border-border/60 px-6 pt-6 pb-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--solar-emerald)]">
                Solarrechner
              </p>
              <h2 className="mt-1 text-balance text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                Erstauswertung in 60 Sekunden
              </h2>
            </div>
            <ol className="flex flex-wrap gap-2 text-xs">
              {[...stepConfig.map((s) => s.label), "Ergebnis"].map((label, i) => {
                const isActive = i === step;
                const isDone = i < step || (result && i === stepConfig.length);
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${
                      isActive
                        ? "border-[color:var(--solar-navy)] bg-[color:var(--solar-navy)] text-[color:var(--solar-navy-foreground)]"
                        : isDone
                          ? "border-[color:var(--solar-emerald)]/50 bg-[color:var(--solar-emerald)]/10 text-[color:var(--solar-emerald)]"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <span className="font-mono text-[10px]">0{i + 1}</span>
                    )}
                    {label}
                  </li>
                );
              })}
            </ol>
          </div>
          <Progress value={progress} className="mt-4 h-1" />
        </div>

        {!result ? (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 lg:px-8 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: reduce ? 0 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : -16 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
              >
                {step === 0 && (
                  <AddressStep
                    initialQuery={values.address}
                    onSelect={applySonnendachSelection}
                    onSkip={skipAddressStep}
                  />
                )}

                {step === 1 && (
                  <FieldGroup>
                    {values.sonnendach && (
                      <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--solar-emerald)]/30 bg-[color:var(--solar-emerald)]/5 px-4 py-3">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-[color:var(--solar-emerald)]" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">Bundesdaten aktiv</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Kanton, PLZ und Dachfläche stammen aus Sonnendach.ch (BFE) zu{" "}
                            <span className="font-medium">{values.address}</span>. Sie können die
                            Werte unten weiterhin anpassen.
                          </p>
                        </div>
                      </div>
                    )}
                    <FieldSet>
                      <FieldLegend>Gebäudetyp</FieldLegend>
                      <FieldDescription>
                        Wählen Sie die Kategorie, die am besten zu Ihrem Objekt passt.
                      </FieldDescription>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {buildingTypes.map((b) => (
                          <button
                            type="button"
                            key={b.value}
                            onClick={() =>
                              setValue("buildingType", b.value, {
                                shouldValidate: true,
                              })
                            }
                            aria-pressed={values.buildingType === b.value}
                            className={`ring-focus flex flex-col items-start gap-0.5 rounded-2xl border p-4 text-left transition-colors ${
                              values.buildingType === b.value
                                ? "border-[color:var(--solar-navy)] bg-[color:var(--solar-navy)] text-[color:var(--solar-navy-foreground)]"
                                : "border-border bg-card hover:bg-secondary"
                            }`}
                          >
                            <span className="text-sm font-semibold">{b.label}</span>
                            <span className="text-xs opacity-80">{b.description}</span>
                          </button>
                        ))}
                      </div>
                    </FieldSet>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="canton">Kanton</FieldLabel>
                        <CantonSelect
                          id="canton"
                          value={values.canton}
                          onValueChange={(v) =>
                            setValue("canton", v, { shouldValidate: true })
                          }
                          invalid={!!errors.canton}
                        />
                        <FieldError errors={errors.canton ? [errors.canton] : undefined} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="postalCode">PLZ</FieldLabel>
                        <Input
                          id="postalCode"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="2540"
                          aria-invalid={!!errors.postalCode}
                          {...register("postalCode")}
                          className="h-11"
                        />
                        <FieldError
                          errors={errors.postalCode ? [errors.postalCode] : undefined}
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="city">Ort (optional)</FieldLabel>
                      <Input
                        id="city"
                        placeholder="z. B. Grenchen"
                        {...register("city")}
                        className="h-11"
                      />
                    </Field>
                  </FieldGroup>
                )}

                {step === 2 && (
                  <FieldGroup>
                    {values.sonnendach && (
                      <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--solar-emerald)]/30 bg-[color:var(--solar-emerald)]/5 px-4 py-3">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-[color:var(--solar-emerald)]" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground">
                            Dachdaten aus Sonnendach.ch übernommen
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Ausrichtung, Neigung und Verschattung sind in den BFE-Daten bereits
                            verarbeitet. Sie müssen unten nichts eintragen — wir nutzen die
                            Bundesdaten direkt für die Berechnung.
                          </p>
                        </div>
                      </div>
                    )}
                    <RoofInputs form={form} />
                  </FieldGroup>
                )}

                {step === 3 && (
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="annualConsumptionKwh">
                        Jährlicher Stromverbrauch (kWh)
                      </FieldLabel>
                      <FieldDescription>
                        Sie finden den Wert auf Ihrer letzten Stromrechnung.
                      </FieldDescription>
                      <Input
                        id="annualConsumptionKwh"
                        type="number"
                        inputMode="numeric"
                        min={500}
                        max={500000}
                        step={100}
                        aria-invalid={!!errors.annualConsumptionKwh}
                        {...register("annualConsumptionKwh", { valueAsNumber: true })}
                        className="h-11"
                      />
                      <FieldError
                        errors={
                          errors.annualConsumptionKwh
                            ? [errors.annualConsumptionKwh]
                            : undefined
                        }
                      />
                    </Field>

                    <FieldSet>
                      <FieldLegend variant="label">Elektrische Lasten</FieldLegend>
                      <Field orientation="horizontal">
                        <Switch
                          id="hasHeatPump"
                          checked={values.hasHeatPump}
                          onCheckedChange={(v) =>
                            setValue("hasHeatPump", v, { shouldValidate: true })
                          }
                        />
                        <FieldContent>
                          <FieldLabel htmlFor="hasHeatPump">Wärmepumpe vorhanden</FieldLabel>
                          <FieldDescription>
                            Erhöht den möglichen Eigenverbrauch und beeinflusst die Auslegung.
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                      <Field orientation="horizontal">
                        <Switch
                          id="hasEv"
                          checked={values.hasEv}
                          onCheckedChange={(v) =>
                            setValue("hasEv", v, { shouldValidate: true })
                          }
                        />
                        <FieldContent>
                          <FieldLabel htmlFor="hasEv">Elektroauto vorhanden</FieldLabel>
                          <FieldDescription>
                            Mit Wallbox und PV-Überschuss steigt der Eigenverbrauch deutlich.
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldSet>

                    <FieldSet>
                      <FieldLegend variant="label">Batteriespeicher</FieldLegend>
                      <div className="grid grid-cols-3 gap-2">
                        {wantsBatteryOptions.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() =>
                              setValue("wantsBattery", o.value, { shouldValidate: true })
                            }
                            aria-pressed={values.wantsBattery === o.value}
                            className={`ring-focus rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                              values.wantsBattery === o.value
                                ? "border-[color:var(--solar-emerald)] bg-[color:var(--solar-emerald)]/10"
                                : "border-border bg-card hover:bg-secondary"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </FieldSet>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="electricityPriceRappen">
                          Strompreis (Rp./kWh)
                        </FieldLabel>
                        <Input
                          id="electricityPriceRappen"
                          type="number"
                          inputMode="decimal"
                          min={5}
                          max={80}
                          step={0.5}
                          {...register("electricityPriceRappen", { valueAsNumber: true })}
                          className="h-11"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="feedInTariffRappen">
                          Einspeisetarif (Rp./kWh)
                        </FieldLabel>
                        <Input
                          id="feedInTariffRappen"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          max={60}
                          step={0.5}
                          {...register("feedInTariffRappen", { valueAsNumber: true })}
                          className="h-11"
                        />
                      </Field>
                    </div>

                    <FieldSet>
                      <FieldLegend variant="label">Finanzierung</FieldLegend>
                      <div className="grid grid-cols-3 gap-2">
                        {financingOptions.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() =>
                              setValue("financingInterest", o.value, {
                                shouldValidate: true,
                              })
                            }
                            aria-pressed={values.financingInterest === o.value}
                            className={`ring-focus rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                              values.financingInterest === o.value
                                ? "border-[color:var(--solar-navy)] bg-[color:var(--solar-navy)] text-[color:var(--solar-navy-foreground)]"
                                : "border-border bg-card hover:bg-secondary"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </FieldSet>
                  </FieldGroup>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Live-Quick-Stats */}
            {livePreview && step > 0 && step < stepConfig.length && (
              <div className="mt-6 grid gap-2 rounded-2xl border border-dashed border-border bg-background/40 p-4 text-xs text-muted-foreground sm:grid-cols-3">
                <span>
                  Ungefähre Anlage:{" "}
                  <strong className="text-foreground">
                    {livePreview.recommendedKwp} kWp
                  </strong>
                </span>
                <span>
                  Jahresproduktion (real.):{" "}
                  <strong className="text-foreground">
                    {Intl.NumberFormat("de-CH").format(
                      livePreview.annualProductionKwh.realistic,
                    )}{" "}
                    kWh
                  </strong>
                </span>
                <span>
                  Jährliche Ersparnis (ind.):{" "}
                  <strong className="text-foreground">
                    CHF{" "}
                    {Intl.NumberFormat("de-CH").format(
                      livePreview.annualSavingsChf.realistic,
                    )}
                  </strong>
                </span>
              </div>
            )}

            {step > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={submitting}
                className="h-11 px-3"
              >
                <ArrowLeft className="size-4" /> Zurück
              </Button>

              {step < stepConfig.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-11 rounded-xl bg-[color:var(--solar-navy)] px-5 text-[color:var(--solar-navy-foreground)] hover:bg-[color:var(--solar-navy)]/95"
                >
                  Weiter <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting || !isValid}
                  className="h-11 rounded-xl bg-[color:var(--solar-gold)] px-5 text-[color:var(--solar-navy)] hover:bg-[color:var(--solar-gold)]/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Berechne …
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Auswertung anzeigen
                    </>
                  )}
                </Button>
              )}
            </div>
            )}
          </form>
        ) : (
          <div ref={resultRef} className="px-6 py-8 lg:px-8 lg:py-10">
            <CalculatorResultCard result={result} onReset={reset} />
          </div>
        )}
      </div>
    </div>
  );
}
