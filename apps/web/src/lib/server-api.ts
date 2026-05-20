const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
}

export interface RentalItem {
  id: string;
  name: string;
  description: string | null;
  pricePerEvent: number;
  quantity: number;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  category: Category;
}

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const serverApi = {
  categories: (fallback: Category[] = []) =>
    safeFetch<Category[]>('/categories', fallback),
  itemsByCategory: (slug: string, fallback: RentalItem[] = []) =>
    safeFetch<RentalItem[]>(`/items?category=${slug}`, fallback),
  allItems: (fallback: RentalItem[] = []) =>
    safeFetch<RentalItem[]>('/items', fallback),
  featuredItems: (fallback: RentalItem[] = []) =>
    safeFetch<RentalItem[]>('/items?featured=true&limit=8', fallback),
  itemById: (id: string) =>
    safeFetch<RentalItem | null>(`/items/${id}`, null),
  categoryBySlug: (slug: string) =>
    safeFetch<(Category & { items: RentalItem[] }) | null>(
      `/categories/${slug}`,
      null,
    ),
};
