import HapticFeedback from 'react-native-haptic-feedback';
import { VARIANT } from '@constants/student';

export function triggerHaptic() {
  try {
    HapticFeedback.trigger(
      VARIANT.haptic === 'selection' ? 'selection' : 'impactLight',
      {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      },
    );
  } catch {
    // Haptic không hoạt động thì vẫn cho phép mua hàng.
  }
}
