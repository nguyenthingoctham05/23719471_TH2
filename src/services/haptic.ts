import HapticFeedback from 'react-native-haptic-feedback';
import { VARIANT } from '@constants/student';

export function triggerHaptic() {
  try {
    const type = VARIANT.hapticOnAdd === 'impact' ? 'impactMedium' : 'selection';
    HapticFeedback.trigger(type, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  } catch {
    // Haptic không hoạt động thì vẫn tiếp tục bình thường
  }
}
