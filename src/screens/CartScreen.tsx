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
import { triggerHaptic } from '@services/haptic';
import { PRICE_MULTIPLIER, ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

function money(amount: number) {
  return `${amount.toLocaleString('vi-VN')} đ`;
}

export default function CartScreen() {
  const items = useCartStore(state => state.items);
  const shippingFee = useCartStore(state => state.shippingFee);
  const changeQty = useCartStore(state => state.changeQty);
  const remove = useCartStore(state => state.remove);

  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) =>
      sum + Math.round(item.product.price * PRICE_MULTIPLIER) * item.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {VARIANT.watermark === 'top' && <Watermark />}

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
            <Text style={styles.emptyText}>Giỏ hàng chưa có sản phẩm.</Text>
          }
          renderItem={({ item }) => {
            const unitPrice = Math.round(item.product.price * PRICE_MULTIPLIER);

            return (
              <View style={styles.card}>
                <Image source={{ uri: item.product.image }} style={styles.image} />

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
                        remove(item.product.id);
                        triggerHaptic();
                      }}>
                      <Text style={styles.removeText}>Xóa</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {items.length > 0 && (
          <View style={styles.summary}>
            <Text style={styles.deliveryInfo}>Giao đến {ROOM_LABEL}</Text>
            <Text style={styles.shippingInfo}>
              Phí ship: {shippingFee === null ? 'Chưa xác định' : money(shippingFee)} (công thức {VARIANT.shippingFormula})
            </Text>

            <View style={styles.totalRow}>
              <Text style={styles.total}>
                Tổng hàng: {money(subtotal + (shippingFee ?? 0))}
              </Text>
            </View>
          </View>
        )}
      </View>

      {VARIANT.watermark === 'bottom' && <Watermark />}
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
  image: { width: 70, height: 90, resizeMode: 'contain' },
  info: { flex: 1 },
  title: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  price: { color: COLORS.secondary, fontWeight: '700', marginTop: 6 },
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
  lineTotal: { color: COLORS.text, fontSize: 12, marginTop: 8 },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  label: { color: COLORS.textLight },
  value: { color: COLORS.text, fontWeight: '600' },
  shipping: { color: COLORS.secondary, fontWeight: '700' },
  hint: { color: COLORS.textLight, fontSize: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 8,
  },
  total: { color: COLORS.primary, fontWeight: '800', fontSize: 17 },
});
