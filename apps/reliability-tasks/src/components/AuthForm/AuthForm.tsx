import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAuthStore } from '@store/useAuthStore';
import { toast } from 'sonner';

export default function AuthForm() {
  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const loginToStore = useAuthStore(state => state.login);

  const { checkEmail, login, register } = useAuth(email);

  const resetFeedback = () => setError(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();

    try {
      if (step === 'email') {
        const exists = await checkEmail.mutateAsync();
        setStep(exists ? 'login' : 'register');
      } else if (step === 'login') {
        const result = await login.mutateAsync(password);
        loginToStore({ id: result.userId, name: result.name, email: result.email });
        toast.success(`Logged in as ${result.name} (${result.email})`);
      } else if (step === 'register') {
        const result = await register.mutateAsync({ name, password });
        loginToStore({ id: result.userId, name: result.name, email: result.email });
        toast.success(`Registered and logged in as ${result.name} (${result.email})`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
      setError(message);
    }
  };

  useEffect(() => {
    if ((step === 'login' || step === 'register') && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [step]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">
        {step === 'email' ? 'Welcome' : step === 'login' ? 'Log in' : 'Register'}
      </h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        disabled={step !== 'email'}
        onChange={e => setEmail(e.target.value)}
        className="border px-3 py-2 w-full"
      />

      {step === 'register' && (
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-3 py-2 w-full"
        />
      )}

      {step !== 'email' && (
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border px-3 py-2 w-full"
        />
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={checkEmail.isPending || login.isPending || register.isPending}
      >
        {step === 'email' ? 'Continue' : step === 'login' ? 'Log in' : 'Register'}
      </button>

      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
