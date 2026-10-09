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
import { useProductQuery } from '@services/productApi';
import { triggerHaptic } from '@services/haptic';
import { useCartStore } from '@stores/cartStore';
import { PRICE_MULTIPLIER, STUDENT, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

type Props = NativeStackScreenProps<ShopStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const result = useProductQuery(route.params.id);
  const addItem = useCartStore(state => state.addItem);
  const product = result.data;

  const handleAdd = () => {
    if (!product) return;
    addItem(product);
    triggerHaptic();
    Alert.alert('Đã thêm vào giỏ', `${STUDENT.mssv}: ${product.title}`);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.content}>
        {result.isPending ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.note}>Đang tải chi tiết món...</Text>
          </View>
        ) : result.isError || !product ? (
          <View style={styles.center}>
            <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
            <Text style={styles.error}>
              Không tải được chi tiết món ăn.
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
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>
                {Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN')} đ
              </Text>

              {!!product.description && (
                <Text style={styles.description}>{product.description}</Text>
              )}

              <Text style={styles.note}>Mã món: #{product.id}</Text>

              <Pressable style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>
                  Thêm vào giỏ · Haptic {VARIANT.hapticOnAdd}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
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
    gap: 12,
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  price: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  note: { color: COLORS.textLight, fontSize: 13 },
  errorMssv: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  error: { color: COLORS.error, textAlign: 'center', fontSize: 15 },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
