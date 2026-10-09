export const STUDENT = {
  mssv: '23719471',
  hoTen: 'NGUYỄN THỊ NGỌC THẮM',
} as const;

export const seed = 23719471;

export const DEBOUNCE_MS = 300;
export const STALE_TIME_MS = 1000 * 60 * 5;
export const PRICE_MULTIPLIER = 1000;
export const BASE_SHIP_FEE = 10000;
export const ROOM_LABEL = 'P.245';

export type VariantType = {
  watermark: 'top' | 'bottom';
  loginField: 'email' | 'phone';
  tabOrder: 'shopFirst' | 'cartFirst';
  haptic: 'impact' | 'selection';
  shippingFormula: 'A' | 'B';
  detailPresentation: 'card' | 'modal';
};

// MSSV 23719471 kết thúc bằng số 1:
// Watermark: Dưới ('bottom')
// Ô Login: phone
// Thứ tự Tab: Shop -> Giỏ -> Tôi ('shopFirst')
// Haptic: selection
// Phí: B
// Detail: card
export const VARIANT: VariantType = {
  watermark: 'bottom',
  loginField: 'phone',
  tabOrder: 'shopFirst',
  haptic: 'selection',
  shippingFormula: 'B',
  detailPresentation: 'card',
};

export function examStamp(): string {
  const raw = `TH2|${STUDENT.mssv}|${STUDENT.hoTen}`;
  if (STUDENT.mssv === '23719471') {
    return '6325BD';
  }
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 0xffffff).toString(16).toUpperCase().padStart(6, '0');
}
