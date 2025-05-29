import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useAuthStore } from '@store/useAuthStore';
import { toast } from 'sonner';
import { Input, Button } from '@reliability-ui';

export default function AuthForm() {
  const [step, setStep] = useState<'email' | 'login' | 'register'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
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
        toast.success(`Signed in as ${result.name} (${result.email})`);
      } else if (step === 'register') {
        const result = await register.mutateAsync({ name, password });
        loginToStore({ id: result.userId, name: result.name, email: result.email });
        toast.success(`Registered and signed in as ${result.name} (${result.email})`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
      setError(message);
    }
  };

  useEffect(() => {
    if (step === 'login' && passwordRef.current) {
      passwordRef.current.focus();
    } else if (step === 'register' && nameRef.current) {
      nameRef.current.focus();
    }
  }, [step]);

  return (
    <form onSubmit={handleSubmit} className="flex w-dvw h-dvh justify-center items-center">
      <div className="space-y-3 min-w-xs max-w-1/3 p-8 bg-white rounded border-1 border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="my-0 text-xl font-semibold block">Reliability Tasks</h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9.09101 3.25669C6.08373 3.71068 4.17373 6.22523 3.33333 9.12511V20.9727H4.99419L4.98978 10.2833C5.18796 6.24959 9.57819 3.51911 13.179 5.64724C16.493 7.60596 16.8772 12.4358 13.9053 14.8806C13.1723 15.484 11.837 15.8018 12.9642 16.9335C14.0913 18.065 16.111 19.345 17.4463 20.4235C17.618 20.5618 18.0253 20.9417 18.0253 20.9417L20.7172 20.9727L14.8509 16.2669C18.8603 13.068 18.4097 6.66369 13.9264 4.12368C13.9264 4.12368 11.9997 2.81823 9.09101 3.25669Z"
              fill="black"
            />
            <path
              d="M15.1809 20.9727H12.5235L8.48314 17.4273C8.37352 17.3852 8.32924 17.446 8.33699 17.5723C8.34584 17.7185 8.42667 20.9727 8.42667 20.9727H6.65509V14.0501L6.82227 13.8841L15.1809 20.9727Z"
              fill="black"
            />
            <path
              d="M10.4507 14.3879C12.6326 14.3879 14.4014 12.6191 14.4014 10.4372C14.4014 8.25532 12.6326 6.48656 10.4507 6.48656C8.26883 6.48656 6.50006 8.25532 6.50006 10.4372C6.50006 12.6191 8.26883 14.3879 10.4507 14.3879Z"
              fill="#FA8A00"
            />
          </svg>
        </div>
        <label className="text-sm font-semibold block">
          {step === 'email' ? 'Sign in / Register' : step === 'login' ? 'Sign in' : 'Register'}
        </label>

        <Input
          type="email"
          placeholder="Email"
          required
          value={email}
          disabled={step !== 'email'}
          onChange={e => setEmail(e.target.value)}
        />

        {step === 'register' && (
          <Input
            ref={nameRef}
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        {step !== 'email' && (
          <Input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        )}

        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={checkEmail.isPending || login.isPending || register.isPending}
        >
          {step === 'email' ? 'Continue' : step === 'login' ? 'Sign in' : 'Register'}
        </Button>

        {error && <div className="text-red-600">{error}</div>}
      </div>
    </form>
  );
}
