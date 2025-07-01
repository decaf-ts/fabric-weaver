export function safeParseJSON(v: string) {
  try {
    return JSON.parse(v);
  } catch (e: unknown) {
    throw new Error((e as Error).message);
  }
}

export function safeParseInt(v: string | number) {
  if (typeof v == "number") return v;

  const value = parseInt(v);

  if (isNaN(value)) throw new Error(`Provided invalid value: ${v}`);

  return value;
}
