export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function listUrl(
  path: string,
  page: number,
  search: string,
  limit = 20,
  filters?: Record<string, string | undefined>
): string {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search.trim()) params.set("search", search.trim());
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value && value.trim()) params.set(key, value.trim());
    }
  }
  return `${path}?${params.toString()}`;
}

export function unwrapList<T>(
  data: T[] | Record<string, unknown> | undefined,
  key: string
): { items: T[]; pagination: PaginationMeta | null } {
  if (!data) return { items: [], pagination: null };
  if (Array.isArray(data)) return { items: data, pagination: null };
  const items = Array.isArray(data[key]) ? (data[key] as T[]) : [];
  const pagination = data.pagination as PaginationMeta | undefined;
  return { items, pagination: pagination ?? null };
}
