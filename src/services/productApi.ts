import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { STALE_TIME_MS } from '@constants/student';
import type { Product } from '@stores/cartStore';

interface RawApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

/**
 * Menu 12 món ăn, thức uống và văn phòng phẩm KTXGo kèm hình ảnh món ăn thực tế
 */
const KTX_ITEMS = [
  {
    title: 'Cơm gà xối mỡ giòn',
    price: 1.15,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80',
    description: 'Cơm chiên tỏi thơm nức ăn kèm đùi gà xối mỡ da giòn rụm, dưa leo và canh súp nóng hổi, giao tận phòng KTX.',
  },
  {
    title: 'Bún bò Huế đặc biệt',
    price: 1.15,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80',
    description: 'Bún bò Huế nước dùng đậm đà sa tế cay nồng, đầy đủ thịt nạm, chả cua, chả lụa và rau sống tươi sạch.',
  },
  {
    title: 'Bánh mì kẹp thịt nướng',
    price: 0.82,
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&auto=format&fit=crop&q=80',
    description: 'Bánh mì vỏ giòn rụm, nhân thịt nướng thơm lừng sốt đậm đà cùng pate béo ngậy, đồ chua và dưa leo.',
  },
  {
    title: 'Phở bò tái nạm gầu',
    price: 1.31,
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500&auto=format&fit=crop&q=80',
    description: 'Phở truyền thống nước hầm xương bò 12 tiếng thanh ngọt, bánh phở mềm cùng bò tái thơm ngậy.',
  },
  {
    title: 'Trà sữa trân châu đường đen',
    price: 0.82,
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&auto=format&fit=crop&q=80',
    description: 'Trà sữa thơm béo chuẩn vị Đài Loan kết hợp trân châu đen dẻo dai nấu sốt đường đen đậm vị.',
  },
  {
    title: 'Xôi gà xé lá chuối',
    price: 0.82,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    description: 'Xôi nếp dẻo thơm nấu nước dừa gói lá chuối, gà xé đậm đà rắc hành phi giòn rụm và mỡ hành.',
  },
  {
    title: 'Bánh cuốn nóng chả lụa',
    price: 0.98,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    description: 'Bánh cuốn tráng mỏng nhân mộc nhĩ thịt băm, chả quế thơm ngon chấm cùng nước mắm chua ngọt ấm nóng.',
  },
  {
    title: 'Nước cam tươi nguyên chất',
    price: 0.65,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    description: 'Nước cam sành vắt tươi 100% giàu vitamin C, thêm ít đường phèn thanh mát bổ sung năng lượng học tập.',
  },
  {
    title: 'Mì ly xúc xích trứng lòng đào',
    price: 0.65,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    description: 'Mì ly thơm cay ăn kèm xúc xích nướng, trứng lòng đào béo ngậy cứu đói đêm khuya cho sinh viên KTX.',
  },
  {
    title: 'Bánh tráng trộn bò khô trứng cút',
    price: 0.65,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    description: 'Bánh tráng trộn chua cay đậm đà với rau răm, tắc, xoài bào sợi, khô bò, ruốc và trứng cút luộc.',
  },
  {
    title: 'Bút bi Thiên Long TL-027',
    price: 0.33,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    description: 'Bút bi mực xanh ngòi 0.5mm êm mượt, viết trơn nét không lem mực, đồ dùng học tập thiết yếu.',
  },
  {
    title: 'Tập 200 trang sinh viên',
    price: 0.49,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    description: 'Tập vở sinh viên kẻ ngang 200 trang giấy trắng định lượng cao, bìa dày dặn chống quăn mép.',
  },
];

/**
 * Fetch danh sách sản phẩm từ FakeStore API qua axios instance
 * Map title, image, description cho món ăn KTXGo
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<RawApiProduct[]>('/products?limit=12', {
      timeout: 3000,
    });
    const rawList = response.data;

    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((item, index) => {
        const itemInfo = KTX_ITEMS[index % KTX_ITEMS.length];
        return {
          id: String(item.id),
          title: itemInfo.title,
          price: itemInfo.price,
          image: itemInfo.image,
          description: itemInfo.description || item.description,
        };
      });
    }
  } catch (error) {
    // Nếu mạng chậm/chặn, vẫn fallback để app luôn có dữ liệu hiển thị mượt mà
    console.log('Using fallback KTX items:', error);
  }

  return KTX_ITEMS.map((item, index) => ({
    id: String(index + 1),
    title: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
  }));
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
