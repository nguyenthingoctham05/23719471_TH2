import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ShopStackParamList } from '@navigation/ShopStack';
import type { MainTabParamList } from '@navigation/MainTabs';
import ProductCard from '@components/ProductCard';
import Watermark from '@components/Watermark';
import { useProducts } from '@services/productApi';
import { triggerHaptic } from '@services/haptic';
import { useCartStore } from '@stores/cartStore';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import {
  STUDENT,
  VARIANT,
  ROOM_LABEL,
  DEBOUNCE_MS,
} from '@constants/student';
import { COLORS } from '@constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ShopStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);
  const result = useProducts();
  const add = useCartStore(state => state.add);
  const quantity = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const products = (result.data ?? []).filter(product =>
    product.title.toLowerCase().includes(
      debouncedSearch.trim().toLowerCase(),
    ),
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={styles.screen}>
      {VARIANT.watermark === 'top' && <Watermark />}

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>KTXGO</Text>
            <Text style={styles.subtitle}>Giao tận {ROOM_LABEL}</Text>
          </View>

          <Pressable
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartText}>🛒 Giỏ</Text>
            {quantity > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{quantity}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <TextInput
          style={styles.search}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />

        {result.isPending ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.subtitle}>Đang tải món...</Text>
          </View>
        ) : result.isError ? (
          <View style={styles.center}>
            <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
            <Text style={styles.error}>
              Không tải được{'\n'}dữ liệu món.
            </Text>
            <Pressable
              style={styles.retry}
              disabled={result.isFetching}
              onPress={() => { void result.refetch(); }}>
              <Text style={styles.retryText}>
                {result.isFetching ? 'Đang thử lại...' : 'Thử lại'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            <FlashList
              data={products}
              numColumns={2}
              // @ts-expect-error FlashList v1 estimatedItemSize required by exam
              estimatedItemSize={200}
              keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
              renderItem={({ item }) => (
                <View style={styles.cell}>
                  <ProductCard
                    product={item}
                    onDetail={() =>
                      navigation.navigate('Detail', { id: item.id })
                    }
                    onAdd={() => {
                      add(item);
                      triggerHaptic();
                    }}
                  />
                </View>
              )}
              refreshing={result.isRefetching}
              onRefresh={() => { void result.refetch(); }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  Không tìm thấy sản phẩm phù hợp.
                </Text>
              }
            />
          </View>
        )}
      </View>

      {VARIANT.watermark === 'bottom' && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brand: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textLight,
    marginTop: 8,
  },
  cartButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    minWidth: 24,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 12,
  },
  search: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  cell: {
    flex: 1,
    padding: 4,
    paddingBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorMssv: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  retry: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  empty: {
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
