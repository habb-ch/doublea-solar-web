/**
 * Schweizer Zahlenformatierung mit Apostroph als Tausendertrenner.
 */
const swissNumber = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 0,
});

const swissDecimal = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 1,
});

export function formatChf(amount: number): string {
  return `CHF ${swissNumber.format(Math.round(amount))}`;
}

export function formatChfRange(low: number, high: number): string {
  return `CHF ${swissNumber.format(Math.round(low))} – ${swissNumber.format(Math.round(high))}`;
}

export function formatKwh(amount: number): string {
  return `${swissNumber.format(Math.round(amount))} kWh`;
}

export function formatKwp(amount: number): string {
  return `${swissDecimal.format(amount)} kWp`;
}

export function formatPercent(fraction: number): string {
  return `${swissNumber.format(Math.round(fraction * 100))} %`;
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatYearsRange(low: number, high: number): string {
  if (Math.abs(high - low) < 0.6) {
    return `${swissDecimal.format((low + high) / 2)} Jahre`;
  }
  return `${swissDecimal.format(low)} – ${swissDecimal.format(high)} Jahre`;
}
