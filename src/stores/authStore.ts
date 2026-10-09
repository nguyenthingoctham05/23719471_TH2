import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  login: () => {
    set({
      token: `ktxgo-${STUDENT.mssv}-${examStamp()}`,
    });
  },

  logout: () => set({ token: null }),
}));
