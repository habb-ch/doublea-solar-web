import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von DoubleA Solar Solutions.",
  robots: { index: true, follow: false },
};

export default function DatenschutzPage() {
  const { contact, legalName } = siteConfig;
  return (
    <article className="container-page prose prose-neutral max-w-3xl py-16 lg:py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Datenschutzerklärung
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Diese Vorlage orientiert sich am revidierten Schweizer Datenschutzgesetz
        (revDSG, in Kraft seit 1. September 2023). Bitte lassen Sie sie vor der
        Veröffentlichung durch eine Datenschutzfachperson prüfen.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-foreground">
        Verantwortliche Stelle
      </h2>
      <p className="mt-2 text-foreground/80">
        {legalName}
        <br />
        {contact.address.street}, {contact.address.postalCode} {contact.address.city}
        <br />
        E-Mail:{" "}
        <a className="underline underline-offset-4" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Bearbeitete Personendaten
      </h2>
      <p className="mt-2 text-foreground/80">
        Wir bearbeiten Personendaten, die Sie uns aktiv übermitteln, etwa über
        unsere Kontakt- und Anfrageformulare oder den Solarrechner. Dazu gehören
        insbesondere Name, E-Mail-Adresse, Telefonnummer, sowie technische und
        gebäudebezogene Angaben zu Ihrem Vorhaben.
      </p>
      <p className="mt-2 text-foreground/80">
        Beim Aufruf dieser Website werden ausserdem technische Verbindungsdaten
        (z. B. IP-Adresse, Browsertyp, Aufrufzeitpunkt) verarbeitet, soweit dies für
        Betrieb und Sicherheit der Website erforderlich ist.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Bearbeitungszwecke
      </h2>
      <ul className="mt-2 list-disc pl-5 text-foreground/80">
        <li>Beantwortung Ihrer Anfragen und Erstellung von Offerten</li>
        <li>Auswertung Ihres Solar-Potenzials zur Vorbereitung eines Angebots</li>
        <li>Vertragsanbahnung, -abschluss und -abwicklung</li>
        <li>Sicherstellung des stabilen Betriebs der Website</li>
        <li>Erfüllung gesetzlicher Pflichten</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Datenweitergabe</h2>
      <p className="mt-2 text-foreground/80">
        Eine Weitergabe an Dritte erfolgt nur, soweit dies zur Vertragserfüllung
        erforderlich ist (z. B. an Verteilnetzbetreiber, Pronovo AG bei Förder­
        anträgen, Finanzierungs- oder Versicherungspartner). Im Übrigen geben wir
        Daten nur weiter, wenn wir gesetzlich dazu verpflichtet sind oder Sie
        eingewilligt haben.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Auftragsbearbeitung & Hosting
      </h2>
      <p className="mt-2 text-foreground/80">
        Diese Website wird über Vercel betrieben. Daten aus Anfrageformularen und
        Solarberechnungen werden bei unserem Datenbank-Anbieter Supabase
        gespeichert. Beide Dienste werden vertraglich auf die Einhaltung
        angemessener technischer und organisatorischer Massnahmen verpflichtet.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Cookies & Analyse
      </h2>
      <p className="mt-2 text-foreground/80">
        Wir verzichten auf Tracking-Cookies und externe Analyse-Tools, die ohne
        Ihre Einwilligung personenbezogene Daten verarbeiten. Sollten wir solche
        Werkzeuge zukünftig einsetzen, holen wir Ihre Einwilligung über ein
        Cookie-Banner ein.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">
        Aufbewahrung
      </h2>
      <p className="mt-2 text-foreground/80">
        Wir bewahren Personendaten so lange auf, wie es für die Bearbeitung
        Ihrer Anfrage und die Erfüllung gesetzlicher Pflichten erforderlich ist.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Ihre Rechte</h2>
      <p className="mt-2 text-foreground/80">
        Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder
        Einschränkung der Bearbeitung Ihrer Personendaten sowie auf Widerspruch
        gegen die Bearbeitung. Schreiben Sie uns dazu an{" "}
        <a className="underline underline-offset-4" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        .
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Änderungen</h2>
      <p className="mt-2 text-foreground/80">
        Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Es gilt jeweils
        die auf dieser Seite veröffentlichte Fassung.
      </p>
    </article>
  );
}
