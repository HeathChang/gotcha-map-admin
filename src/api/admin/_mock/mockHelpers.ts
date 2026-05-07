export function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
): { items: T[]; total: number; page: number; limit: number } {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
  };
}
