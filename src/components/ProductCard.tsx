import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Product } from '@stores/cartStore';
import { PRICE_MULTIPLIER } from '@constants/student';
import { COLORS } from '@constants/theme';

interface Props {
  product: Product;
  onDetail: () => void;
  onAdd: () => void;
}

export default function ProductCard({ product, onDetail, onAdd }: Props) {
  const price = Math.round(product.price * PRICE_MULTIPLIER);

  return (
    <View style={styles.card}>
      <Pressable onPress={onDetail}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            onError={e => {
              console.log('[IMG_ERR]', product.title, e.nativeEvent.error);
            }}
            onLoad={() => {
              console.log('[IMG_LOADED]', product.title);
            }}
          />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.price} numberOfLines={1}>
          {price.toLocaleString('vi-VN')} đ
        </Text>
        <Pressable
          style={styles.addButton}
          accessibilityLabel={`Thêm ${product.title} vào giỏ`}
          onPress={onAdd}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    height: 40,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 4,
  },
  price: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '700',
  },
});
