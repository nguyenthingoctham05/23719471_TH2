import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '@stores/cartStore';
import { PRICE_MULTIPLIER, ROOM_LABEL, VARIANT, triggerHaptic } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

function money(amount: number) {
  return `${amount.toLocaleString('vi-VN')} đ`;
}

function CartItemRow({ item }: { item: any }) {
  const unitPrice = Math.round(item.product.price * PRICE_MULTIPLIER);
  const changeQty = useCartStore(state => state.changeQty);
  const removeItem = useCartStore(state => state.removeItem);

  return (
    <View style={styles.card}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.price}>
          ×{item.quantity}  {money(unitPrice * item.quantity)}
        </Text>

        <View style={styles.controls}>
          <Pressable
            style={[styles.qtyButton, item.quantity <= 1 && styles.disabled]}
            disabled={item.quantity <= 1}
            accessibilityLabel="Giảm số lượng"
            onPress={() => {
              changeQty(item.product.id, item.quantity - 1);
              triggerHaptic();
            }}>
            <Text style={styles.qtyButtonText}>−</Text>
          </Pressable>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <Pressable
            style={styles.qtyButton}
            accessibilityLabel="Tăng số lượng"
            onPress={() => {
              changeQty(item.product.id, item.quantity + 1);
              triggerHaptic();
            }}>
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>

          <Pressable
            style={styles.removeButton}
            accessibilityLabel="Xóa sản phẩm"
            onPress={() => {
              removeItem(item.product.id);
              triggerHaptic();
            }}>
            <Text style={styles.removeText}>Xóa</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const items = useCartStore(state => state.items);
  const shippingFee = useCartStore(state => state.shippingFee);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Math.round(item.product.price * PRICE_MULTIPLIER) * item.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.content}>
        <View style={styles.headerBanner}>
          <Text style={styles.bannerTitle}>GIỎ HÀNG</Text>
        </View>

        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={item => item.product.id}
          contentContainerStyle={items.length === 0 ? styles.emptyList : styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Giỏ hàng chưa có sản phẩm nào.</Text>
          }
          renderItem={({ item }) => <CartItemRow item={item} />}
        />

        {items.length > 0 && (
          <View style={styles.summary}>
            <Text style={styles.deliveryInfo}>Giao đến {ROOM_LABEL}</Text>

            <Text style={styles.shippingInfo}>
              {shippingFee !== null
                ? `Phí ship: ${money(shippingFee)} (công thức ${VARIANT.shipFormula})`
                : 'Chưa ước tính phí — mở tab Tôi'}
            </Text>

            <View style={styles.totalRow}>
              <Text style={styles.total}>
                Tổng tiền: {money(subtotal + (shippingFee ?? 0))}
              </Text>
            </View>
          </View>
        )}
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  headerBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  deliveryInfo: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  shippingInfo: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  list: { flex: 1 },
  listContent: { paddingBottom: 12 },
  emptyList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textLight, fontSize: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  thumbnailContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: { flex: 1 },
  title: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  price: { color: COLORS.primary, fontWeight: '700', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  qtyButton: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  quantity: { color: COLORS.text, fontWeight: '700' },
  removeButton: { marginLeft: 'auto', padding: 6 },
  removeText: { color: COLORS.error, fontWeight: '600' },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    gap: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginTop: 4,
  },
  total: { color: COLORS.primary, fontWeight: '800', fontSize: 18 },
});
