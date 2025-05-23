// types/global.d.ts
import type { useAuthStore } from '@store/useAuthStore';

declare global {
  interface Window {
    useAuthStore: ReturnType<typeof useAuthStore>;
  }
}

export {};
