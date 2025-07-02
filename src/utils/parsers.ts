import { COMMA_SEPARATOR } from "../core/constants/constants";

export function safeParseJSON(v: string): unknown {
  try {
    return JSON.parse(v);
  } catch (e) {
    throw new Error(`Invalid JSON: ${(e as Error).message}`);
  }
}

export function safeParseInt(v: string | number): number {
  if (typeof v === "number") return Math.floor(v);

  const value = Number(v);

  if (!Number.isInteger(value)) {
    throw new Error(`Invalid integer value: ${v}`);
  }

  return value;
}

export function safeParseCSV(csv: string): string[] {
  if (!csv.trim()) return [];

  return csv.split(COMMA_SEPARATOR).map((item) => item.trim());
}

export function mapParser(
  map: Map<string, string | number | boolean | string[]>
): string[] {
  return Object.entries(map).flatMap(([key, value]) => {
    if (typeof value === "boolean") {
      return value ? [`--${key}`] : [];
    }
    if (Array.isArray(value)) {
      return [`--${key}`, value.join(",")];
    }
    return [`--${key}`, value.toString()];
  });
}
