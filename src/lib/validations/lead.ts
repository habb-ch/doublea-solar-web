import { z } from "zod";

import { cantonCodes } from "@/lib/solar/canton-data";

const swissPhoneRegex = /^[+0-9 ()/-]{6,30}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(120),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  phone: z
    .string()
    .trim()
    .regex(swissPhoneRegex, "Telefonnummer ungültig.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z
    .boolean()
    .refine((v) => v === true, "Bitte stimmen Sie der Datenschutzerklärung zu."),
  source: z.string().max(60).optional(),
  // Honeypot — muss leer bleiben.
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const cantonEnum = z.enum(cantonCodes as readonly [string, ...string[]]);

export const solarCalculatorSchema = z.object({
  buildingType: z.enum([
    "einfamilienhaus",
    "mehrfamilienhaus",
    "gewerbe",
    "landwirtschaft",
    "sonstiges",
  ]),
  canton: cantonEnum,
  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, "Bitte geben Sie eine gültige Schweizer Postleitzahl an.")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  roofAreaM2: z.number().min(10, "Mindestens 10 m².").max(5000),
  usableRoofPercent: z.number().min(30).max(100),
  orientation: z.enum([
    "sued",
    "suedost",
    "suedwest",
    "ost",
    "west",
    "flachdach",
    "gemischt",
  ]),
  tilt: z.enum(["0-10", "10-25", "25-40", "40+"]),
  shading: z.enum(["keine", "leicht", "mittel", "stark"]),
  annualConsumptionKwh: z.number().min(500).max(500_000),
  hasHeatPump: z.boolean(),
  hasEv: z.boolean(),
  wantsBattery: z.enum(["ja", "nein", "unsicher"]),
  electricityPriceRappen: z.number().min(5).max(80).optional(),
  feedInTariffRappen: z.number().min(0).max(60).optional(),
  financingInterest: z.enum(["ja", "nein", "unsicher"]).optional(),
});

export type SolarCalculatorFormInput = z.infer<typeof solarCalculatorSchema>;

export const solarCalculationRequestSchema = z.object({
  input: solarCalculatorSchema,
  contact: leadSchema.partial().optional(),
});

export const contactFormSchema = leadSchema.extend({
  topic: z.enum(["allgemein", "offerte", "service", "andere"]),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
