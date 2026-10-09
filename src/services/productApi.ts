import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { STALE_TIME_MS, PRICE_MULTIPLIER } from '@constants/student';
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
 * Danh sách 12 món ăn & văn phòng phẩm KTX kèm đúng link hình ảnh online và giá theo yêu cầu
 */
const KTX_ITEMS = [
  {
    title: 'Cơm gà xối mỡ Sài Gòn',
    price: 40000 / PRICE_MULTIPLIER,
    image: 'https://static.vinwonders.com/production/2025/02/com-ga-xoi-mo-sai-gon-ut-minh.jpg',
    description: 'Cơm chiên tỏi thơm nức ăn kèm đùi gà xối mỡ da giòn rụm, dưa leo và canh súp nóng hổi, giao tận phòng KTX.',
  },
  {
    title: 'Bún bò Huế đặc biệt',
    price: 50000 / PRICE_MULTIPLIER,
    image: 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/08/15/bun-bo-hue-6-0935.jpeg',
    description: 'Bún bò Huế nước dùng đậm đà sa tế cay nồng, đầy đủ thịt nạm, chả cua, chả lụa và rau sống tươi sạch.',
  },
  {
    title: 'Bánh mì kẹp thịt nướng',
    price: 20000 / PRICE_MULTIPLIER,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStZ1ZIbxDMtjdNFmfItXCQ-hNLeIULYzZXl3n5rHV-xg&s=10',
    description: 'Bánh mì vỏ giòn rụm, nhân thịt nướng thơm lừng sốt đậm đà cùng pate béo ngậy, đồ chua và dưa leo.',
  },
  {
    title: 'Phở bò tái nạm gầu',
    price: 35000 / PRICE_MULTIPLIER,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWxCckcU2Q07fv9S8GvMW1zU41yNi_Tk-iAvpBbTQbfQsyRwRwjd084ttW',
    description: 'Phở truyền thống nước hầm xương bò 12 tiếng thanh ngọt, bánh phở mềm cùng bò tái thơm ngậy.',
  },
  {
    title: 'Trà sữa trân châu đường đen',
    price: 25000 / PRICE_MULTIPLIER,
    image: 'https://wujiateavn.com/wp-content/uploads/2025/12/TRS-TCDD.jpg',
    description: 'Trà sữa thơm béo chuẩn vị Đài Loan kết hợp trân châu đen dẻo dai nấu sốt đường đen đậm vị.',
  },
  {
    title: 'Xôi gà xé lá chuối',
    price: 18000 / PRICE_MULTIPLIER,
    image: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/kien-thuc/cach-nau-xoi-ga-xe/cach-nau-xoi-ga-xe-5.jpg',
    description: 'Xôi nếp dẻo thơm nấu nước dừa gói lá chuối, gà xé đậm đà rắc hành phi giòn rụm và mỡ hành.',
  },
  {
    title: 'Bánh cuốn nóng chả lụa',
    price: 25000 / PRICE_MULTIPLIER,
    image: 'https://file.hstatic.net/200000667673/file/045b2aae-3699-4ce7-afec-9f0087c89f62_50c07454f52d4e97bfcf710638ce5b31_grande.jpeg',
    description: 'Bánh cuốn tráng mỏng nhân mộc nhĩ thịt băm, chả quế thơm ngon chấm cùng nước mắm chua ngọt ấm nóng.',
  },
  {
    title: 'Nước cam tươi nguyên chất',
    price: 20000 / PRICE_MULTIPLIER,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-65piw5yDqNFAd-gCJeb34txFsU4qVbXueK3EuAvRClG_DAHP2q__sVs&s=10',
    description: 'Nước cam sành vắt tươi 100% giàu vitamin C, thêm ít đường phèn thanh mát bổ sung năng lượng học tập.',
  },
  {
    title: 'Mì trộn',
    price: 22000 / PRICE_MULTIPLIER,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV9Jy6qdPlnE31UVXubkq588AwtwDCupoTXgkRyJbbTCYfWtU2qxkBevs0&s=10',
    description: 'Mì gói trụng trộn sốt chua ngọt sa tế cay, ăn kèm xúc xích nướng, trứng lòng đào và tóp mỡ giòn.',
  },
  {
    title: 'Bánh tráng trộn khô bò trứng cút',
    price: 25000 / PRICE_MULTIPLIER,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZqm3OLUZIT_Z71tY_J-L_afmOigenBw6NO53kfSDEEUZV3dKQoojXck&s=10',
    description: 'Bánh tráng trộn chua cay đậm đà với rau răm, tắc, xoài bào sợi, khô bò, ruốc và trứng cút luộc.',
  },
  {
    title: 'Bút bi Thiên Long TL-027',
    price: 4500 / PRICE_MULTIPLIER,
    image: 'https://product.hstatic.net/1000230347/product/artboard_5_5f321e3f08f04151a0b6ab1ab17a1752_master.jpg',
    description: 'Bút bi mực xanh ngòi 0.5mm êm mượt, viết trơn nét không lem mực, đồ dùng học tập thiết yếu.',
  },
  {
    title: 'Tập 200 trang sinh viên',
    price: 52000 / PRICE_MULTIPLIER,
    image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/362/945/products/cafe86a47fac67c5fb3e4c5be9e68a-88d874a1-164b-4658-a0a2-39caa5d484f7.jpg?v=1751191332817',
    description: 'Tập vở sinh viên kẻ ngang 200 trang giấy trắng định lượng cao, bìa dày dặn chống quăn mép.',
  },
];

let isOfflineSimulated = false;

/**
 * Fetch danh sách sản phẩm từ FakeStore API qua axios instance
 * Map title, image, description cho món ăn KTXGo
 */
export async function getProducts(): Promise<Product[]> {
  if (isOfflineSimulated) {
    throw new Error('Network Error: Không thể kết nối máy chủ khi tắt mạng');
  }

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
    // Nếu mạng ngoài chặn hoặc timeout, dùng trực tiếp danh sách món ăn KTXGo
    console.log('Using KTX items fallback:', error);
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
