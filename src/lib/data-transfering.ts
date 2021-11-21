export const stringOrNull = (data: unknown): string | null =>
  data ? String(data) : null
