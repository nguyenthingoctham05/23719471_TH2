import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { useAuthStore } from '@stores/authStore';
import { useCartStore } from '@stores/cartStore';
import {
  ROOM_LABEL,
  STUDENT,
  VARIANT,
  examStamp,
} from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

export default function MeScreen() {
  const location = useCampusLocation();
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const shippingFee = useCartStore(state => state.shippingFee);
  const setShippingFee = useCartStore(state => state.setShippingFee);

  const shortToken = token
    ? `${token.slice(0, 15)}...${token.slice(-6)}`
    : 'Chưa có token';

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert('Thông báo', 'Không thể mở cài đặt ứng dụng.');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBanner}>
          <Text style={styles.bannerTitle}>TÔI · LOCATION</Text>
        </View>

        {/* Thông tin định danh + Token rút gọn */}
        <View style={styles.card}>
          <Text style={styles.name}>{STUDENT.hoTen}</Text>
          <Text style={styles.text}>
            MSSV: {STUDENT.mssv} · Stamp: #{examStamp()}
          </Text>
          <Text style={styles.tokenText}>
            Token: <Text style={styles.tokenValue}>{shortToken}</Text>
          </Text>
          <Text style={styles.note}>Phòng giao mặc định: {ROOM_LABEL}</Text>
        </View>

        {/* Trạng thái quyền & Phí ship */}
        <View style={styles.card}>
          <Text style={styles.text}>
            Quyền vị trí: <Text style={styles.statusText}>{location.status}</Text>
          </Text>

          {location.status === 'denied' && (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                ⚠️ Bạn đã từ chối quyền. Vui lòng bấm nút "Lấy vị trí ước tính ship" bên dưới để xin cấp quyền lại.
              </Text>
            </View>
          )}

          {location.coords && (
            <Text style={styles.distanceText}>
              ≈ {location.km?.toFixed(1)} km tới cổng KTX
            </Text>
          )}

          <Text style={styles.feeLabel}>
            Phí ship ước tính (công thức {VARIANT.shipFormula}):
          </Text>
          <Text style={styles.fee}>
            {shippingFee === null
              ? 'Chưa tính'
              : `${shippingFee.toLocaleString('vi-VN')} đ`}
          </Text>

          {location.loading && (
            <ActivityIndicator color={COLORS.primary} />
          )}

          {!!location.error && (
            <Text style={styles.error}>
              {STUDENT.mssv}: {location.error}
            </Text>
          )}
        </View>

        {/* Các nút hành động theo Câu 3b */}
        <Pressable
          style={[styles.button, location.loading && styles.disabled]}
          disabled={location.loading}
          onPress={() => void location.requestLocation()}>
          <Text style={styles.buttonText}>
            {location.loading ? 'Đang lấy vị trí...' : 'Lấy vị trí ước tính ship'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.mockButton}
          disabled={location.loading}
          onPress={() => void location.requestLocation(true)}>
          <Text style={styles.mockButtonText}>
            Lấy vị trí mẫu máy ảo (~1.2 km)
          </Text>
        </Pressable>

        <Pressable style={styles.outlineButton} onPress={openSettings}>
          <Text style={styles.outlineText}>Mở Cài đặt (blocked)</Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={() => {
            setShippingFee(null);
            logout();
          }}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </Pressable>
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
  },
  headerBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  name: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  text: { color: COLORS.text, fontSize: 14 },
  tokenText: { color: COLORS.textLight, fontSize: 13 },
  tokenValue: { color: COLORS.text, fontWeight: '700' },
  statusText: { fontWeight: '700', color: COLORS.primary },
  distanceText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  hintBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hintText: {
    color: '#B45309',
    fontSize: 13,
    lineHeight: 18,
  },
  note: { color: COLORS.textLight, fontSize: 13 },
  error: { color: COLORS.error, fontSize: 13 },
  feeLabel: { color: COLORS.textLight, fontSize: 13, marginTop: 4 },
  fee: { color: COLORS.secondary, fontSize: 22, fontWeight: '900' },
  mockButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  mockButtonText: { color: COLORS.primary, fontWeight: '700' },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  outlineText: { color: COLORS.primary, fontWeight: '700', textAlign: 'center' },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  disabled: { opacity: 0.5 },
});
