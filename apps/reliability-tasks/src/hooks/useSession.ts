import { useAuthStore } from '@store/useAuthStore';
import { toast } from 'sonner';

export function useSession() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    if (user) toast(`Logged out ${user.name} (${user.email})`);
    logout();
  };

  return { user, handleLogout };
}
