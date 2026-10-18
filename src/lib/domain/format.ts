import { formatInTimeZone } from "date-fns-tz";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { businessConfig } from "@config/business.config";

export function formatMoneyCents(cents: number, options?: { omitZeroCents?: boolean }): string {
  const isNegative = cents < 0;
  const absCents = Math.abs(cents);
  const dollars = absCents / 100;

  if (options?.omitZeroCents && absCents % 100 === 0) {
    return `${isNegative ? "-" : ""}$${dollars.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  return `${isNegative ? "-" : ""}$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatBusinessDate(isoOrDate: string | Date, tz = businessConfig.timezone): string {
  return formatInTimeZone(new Date(isoOrDate), tz, "EEE, MMM d");
}

export function formatBusinessTime(isoOrDate: string | Date, tz = businessConfig.timezone): string {
  return formatInTimeZone(new Date(isoOrDate), tz, "h:mm a");
}

export function formatBusinessTimeWithZone(isoOrDate: string | Date, tz = businessConfig.timezone): string {
  return formatInTimeZone(new Date(isoOrDate), tz, "h:mm a zzz");
}

export function normalizeUSPhone(input: string): string | null {
  const parsed = parsePhoneNumberFromString(input, "US");
  if (!parsed || !parsed.isValid()) {
    // Also accept fictional 555 numbers used in demo/tests like (305) 555-0142
    const digits = input.replace(/\D/g, "");
    if (digits.length === 10 && digits.slice(3, 6) === "555") {
      return `+1${digits}`;
    }
    if (digits.length === 11 && digits.startsWith("1") && digits.slice(4, 7) === "555") {
      return `+${digits}`;
    }
    return null;
  }
  return parsed.number;
}

export function formatDisplayPhone(input: string): string {
  const digits = input.replace(/\D/g, "").replace(/^1/, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return input;
}
