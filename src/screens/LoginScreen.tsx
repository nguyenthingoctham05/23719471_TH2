import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Watermark from '@components/Watermark';
import { COLORS } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import { useAuthStore } from '@stores/authStore';

export default function LoginScreen() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const isPhone = VARIANT.authField === 'phone';

  const handleLogin = () => {
    const input = value.trim();
    if (!input) {
      setError(`${STUDENT.mssv}: Vui lòng không để trống thông tin đăng nhập.`);
      return;
    }

    setError('');
    login();
  };

  return (
    <SafeAreaView style={styles.screen}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.content}>
        <Text style={styles.title}>KTXGO</Text>
        <Text style={styles.subtitle}>
          Giao đồ tận phòng ký túc xá
        </Text>

        <TextInput
          style={styles.input}
          placeholder={
            isPhone
              ? `Số điện thoại — ${STUDENT.mssv}`
              : `Email — ${STUDENT.mssv}@iuh.edu.vn`
          }
          placeholderTextColor={COLORS.textLight}
          keyboardType={isPhone ? 'phone-pad' : 'email-address'}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={text => {
            setValue(text);
            if (error) setError('');
          }}
        />

        {error !== '' && (
          <Text style={styles.error}>{error}</Text>
        )}

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Vào cửa hàng</Text>
        </Pressable>

        <Text style={styles.note}>
          Đăng nhập giả lập cho bài thực hành KTXGo
        </Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 15,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  error: {
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
});
