import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
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
import { useProductsQuery } from '@services/productApi';
import { triggerHaptic } from '@services/haptic';
import { useCartStore } from '@stores/cartStore';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import {
  STUDENT,
  VARIANT,
  ROOM_LABEL,
  DEBOUNCE_MS,
  BANNER_IMAGE_ID,
} from '@constants/student';
import { COLORS } from '@constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ShopStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);
  const result = useProductsQuery();
  const addItem = useCartStore(state => state.addItem);
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
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.content}>
        {/* Header KTXGO + Giao tận ROOM_LABEL */}
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

        {/* Banner KTX */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/240` }}
            style={styles.banner}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>🍱 KTXGo · Đặt đồ ăn & ship tận phòng sinh viên</Text>
          </View>
        </View>

        {/* Ô tìm kiếm controlled debounce */}
        <TextInput
          style={styles.search}
          placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />

        {/* 3 trạng thái: Đang tải · Lỗi mạng (Thử lại) · Có dữ liệu */}
        {result.isPending ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.subtitle}>Đang tải món ăn KTX...</Text>
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
                      addItem(item);
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
                  Không tìm thấy món phù hợp với từ khóa "{debouncedSearch}".
                </Text>
              }
            />
          </View>
        )}
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
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
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brand: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textLight,
    marginTop: 2,
    fontSize: 13,
  },
  bannerContainer: {
    width: '100%',
    height: 75,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(29, 78, 216, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  bannerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
  },
  cartButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    minWidth: 22,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 11,
  },
  search: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.text,
    marginBottom: 10,
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
