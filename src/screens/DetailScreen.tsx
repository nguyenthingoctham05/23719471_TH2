import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@navigation/ShopStack';
import { useProduct } from '@services/productApi';
import { triggerHaptic } from '@services/haptic';
import { useCartStore } from '@stores/cartStore';
import { PRICE_MULTIPLIER, STUDENT, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

type Props = NativeStackScreenProps<ShopStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const result = useProduct(route.params.id);
  const add = useCartStore(state => state.add);
  const product = result.data;

  const handleAdd = () => {
    if (!product) return;
    add(product);
    triggerHaptic();
    Alert.alert('Đã thêm vào giỏ', `${STUDENT.mssv}: ${product.title}`);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      {VARIANT.watermark === 'top' && <Watermark />}

      <View style={styles.content}>
        {result.isPending ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.note}>Đang tải sản phẩm...</Text>
          </View>
        ) : result.isError || !product ? (
          <View style={styles.center}>
            <Text style={styles.error}>
              {STUDENT.mssv}: Không tải được chi tiết sản phẩm.
            </Text>
            <Pressable
              style={styles.button}
              disabled={result.isFetching}
              onPress={() => void result.refetch()}>
              <Text style={styles.buttonText}>
                {result.isFetching ? 'Đang tải...' : 'Thử lại'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              <Image source={{ uri: product.image }} style={styles.image} />
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>
                {Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN')} đ
              </Text>
              <Text style={styles.note}>Mã sản phẩm: {product.id}</Text>
              <Pressable style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>

      {VARIANT.watermark === 'bottom' && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 14,
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  image: { width: '100%', height: 250, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  price: { fontSize: 24, fontWeight: '800', color: COLORS.secondary },
  note: { color: COLORS.textLight, fontSize: 14 },
  error: { color: COLORS.error, textAlign: 'center' },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
