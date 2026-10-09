import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';
import { STALE_TIME_MS } from '@constants/student';
import type { Product } from '@stores/cartStore';

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  image: string;
}

function toProduct(item: ApiProduct): Product {
  return {
    id: String(item.id),
    title: item.title,
    price: item.price,
    image: item.image,
  };
}

export async function getProducts(
  signal?: AbortSignal,
): Promise<Product[]> {
  const response = await apiClient.get<ApiProduct[]>('/products', {
    params: { limit: 12 },
    signal,
  });

  return response.data.map(toProduct);
}

export async function getProduct(
  id: string,
  signal?: AbortSignal,
): Promise<Product> {
  const response = await apiClient.get<ApiProduct>(
    `/products/${encodeURIComponent(id)}`,
    { signal },
  );

  return toProduct(response.data);
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: ({ signal }) => getProducts(signal),
    staleTime: STALE_TIME_MS,
    retry: 1,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProduct(id, signal),
    staleTime: STALE_TIME_MS,
    retry: 1,
  });
}
