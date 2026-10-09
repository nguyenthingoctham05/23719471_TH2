import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { STALE_TIME_MS } from '@constants/student';
import type { Product } from '@stores/cartStore';
import { KTX_FOOD_MENU } from '@data/products';

interface RawApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

/**
 * Fetch danh sách 12 sản phẩm từ FakeStore API qua axios instance
 * Map title, image, description cho dịch vụ giao đồ ăn KTXGo
 */
export async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get<RawApiProduct[]>('/products?limit=12');
  const rawList = response.data;

  return rawList.map((item, index) => {
    const fallback = KTX_FOOD_MENU[index % KTX_FOOD_MENU.length];
    return {
      id: String(item.id),
      title: fallback.title,
      price: fallback.priceFactor,
      image: fallback.image,
      description: fallback.description || item.description,
    };
  });
}

/**
 * Hook useProductsQuery theo đúng đề bài
 */
export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
    retry: 1,
  });
}

// Alias tương thích
export const useProducts = useProductsQuery;

/**
 * Lấy chi tiết món từ cache React Query / danh sách đã fetch
 */
export function useProductQuery(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const cached = queryClient.getQueryData<Product[]>(['products']);
      const found = cached?.find(p => p.id === id);
      if (found) return found;

      // Nếu chưa có trong cache thì fetch danh sách
      const all = await getProducts();
      const product = all.find(p => p.id === id);
      if (!product) {
        throw new Error(`Không tìm thấy món có mã ${id}`);
      }
      return product;
    },
    staleTime: STALE_TIME_MS,
    retry: 1,
  });
}

export const useProduct = useProductQuery;
