import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAuth(email: string) {
  const queryClient = useQueryClient();

  const checkEmail = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Email check failed');
      const data = await res.json();
      return data.exists as boolean;
    },
  });

  const login = useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'user'], {
        id: data.userId,
        name: data.name,
        email,
      });
    },
  });

  const register = useMutation({
    mutationFn: async ({ name, password }: { name: string; password: string }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'user'], {
        id: data.userId,
        name: data.name,
        email,
      });
    },
  });

  return { checkEmail, login, register };
}
