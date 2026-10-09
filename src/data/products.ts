import type { Product } from '@stores/cartStore';

/**
 * Danh sách món ăn và đồ dùng KTX chuẩn hóa với hình ảnh sắc nét
 */
export const KTX_FOOD_MENU: Array<{
  title: string;
  priceFactor: number; // để khi nhân PRICE_MULTIPLIER ra giá hợp lý sinh viên
  image: string;
  description: string;
}> = [
  {
    title: 'Cơm gà xối mỡ giòn',
    priceFactor: 1.15,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    description: 'Cơm chiên tỏi thơm nức ăn kèm đùi gà xối mỡ da giòn rụm, dưa leo và canh súp nóng hổi, giao tận phòng KTX.',
  },
  {
    title: 'Bún bò Huế đặc biệt',
    priceFactor: 1.15,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80',
    description: 'Bún bò Huế nước dùng đậm đà sa tế cay nồng, đầy đủ thịt nạm, chả cua, chả lụa và rau sống tươi sạch.',
  },
  {
    title: 'Bánh mì kẹp thịt nướng',
    priceFactor: 0.82,
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&auto=format&fit=crop&q=80',
    description: 'Bánh mì vỏ giòn rụm, nhân thịt nướng thơm lừng sốt đậm đà cùng pate béo ngậy, đồ chua và dưa leo.',
  },
  {
    title: 'Phở bò tái nạm gầu',
    priceFactor: 1.31,
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
    description: 'Phở truyền thống nước hầm xương bò 12 tiếng thanh ngọt, bánh phở mềm cùng bò tái thơm ngậy.',
  },
  {
    title: 'Trà sữa trân châu đường đen',
    priceFactor: 0.82,
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop&q=80',
    description: 'Trà sữa thơm béo chuẩn vị Đài Loan kết hợp trân châu đen dẻo dai nấu sốt đường đen đậm vị.',
  },
  {
    title: 'Xôi gà xé lá chuối',
    priceFactor: 0.82,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Xôi nếp dẻo thơm nấu nước dừa gói lá chuối, gà xé đậm đà rắc hành phi giòn rụm và mỡ hành.',
  },
  {
    title: 'Bánh cuốn nóng chả lụa',
    priceFactor: 0.98,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Bánh cuốn tráng mỏng nhân mộc nhĩ thịt băm, chả quế thơm ngon chấm cùng nước mắm chua ngọt ấm nóng.',
  },
  {
    title: 'Nước cam tươi nguyên chất',
    priceFactor: 0.65,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    description: 'Nước cam sành vắt tươi 100% giàu vitamin C, thêm ít đường phèn thanh mát bổ sung năng lượng học tập.',
  },
  {
    title: 'Mì ly xúc xích trứng lòng đào',
    priceFactor: 0.65,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    description: 'Mì ly thơm cay ăn kèm xúc xích nướng, trứng lòng đào béo ngậy cứu đói đêm khuya cho sinh viên KTX.',
  },
  {
    title: 'Bánh tráng trộn khô bò trứng cút',
    priceFactor: 0.65,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    description: 'Bánh tráng trộn chua cay đậm đà với rau răm, tắc, xoài bào sợi, khô bò, ruốc và trứng cút luộc.',
  },
  {
    title: 'Bút bi Thiên Long TL-027',
    priceFactor: 0.33,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
    description: 'Bút bi mực xanh ngòi 0.5mm êm mượt, viết trơn nét không lem mực, đồ dùng học tập thiết yếu.',
  },
  {
    title: 'Tập 200 trang sinh viên',
    priceFactor: 0.49,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Tập vở sinh viên kẻ ngang 200 trang giấy trắng định lượng cao, bìa dày dặn chống quăn mép.',
  },
];
