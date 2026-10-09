# Họ tên: NGUYỄN THỊ NGỌC THẮM | MSSV: 23719471 | Stamp: #041913 | Số cuối: 1
- **URL Clone HTTPS**: https://github.com/Zy-LTN/23719471_TH2.git
- **Hàng VARIANT (Số cuối 1)**:
  - Watermark: Dưới (watermarkAtTop: false)
  - Ô Login: phone (authField: 'phone')
  - Thứ tự Tab: Shop → Giỏ → Tôi (tabOrder: 'shopFirst')
  - Haptic: selection (hapticOnAdd: 'selection')
  - Phí ship: B (shipFormula: 'B' -> `BASE_SHIP_FEE + Math.round(km * 1500) + 2000`)
  - Detail: card (detailPresentation: 'card')

---

## KTXGo - Dịch Vụ Giao Đồ Tận Phòng Ký Túc Xá

### Công nghệ sử dụng:
- **React Native CLI**: TypeScript + StyleSheet.create
- **React Navigation V7**: Auth Stack -> Main Tabs (Shop, Cart, Me) + Shop Stack
- **State Management**: Zustand + Persist AsyncStorage (`ktxgo-cart-23719471`)
- **Data Fetching**: TanStack Query + Axios (Interceptor `X-Student-Id: 23719471`)
- **Device Features**: Geolocation (mock coords + real GPS), Haptic feedback, Linking.openSettings

### Hướng dẫn chạy:
1. Cài đặt dependencies:
   ```bash
   npm install
   ```
2. Khởi động Metro:
   ```bash
   npm start
   ```
3. Chạy trên máy ảo Android:
   ```bash
   npm run android
   ```
