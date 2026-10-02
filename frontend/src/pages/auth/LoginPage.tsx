import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Mail, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { error: showError, info } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authService.login({
        identifier: formData.identifier,
        usernameOrEmail: formData.identifier,
        password: formData.password,
      });
      login(res.data);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid credentials. Please try again.';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    info('Password recovery coming soon!');
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <Compass className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-text dark:text-text-dark mb-2">
            Welcome back
          </h1>
          <p className="text-text-muted dark:text-text-muted-dark text-sm">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username or Email"
            placeholder="Enter your username or email"
            leftIcon={<Mail className="w-5 h-5" />}
            autoComplete="username"
            {...register('identifier')}
            error={errors.identifier?.message}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            size="lg"
            className="mt-6"
          >
            Log In
          </Button>
        </form>

        <p className="mt-10 text-center text-sm text-text-muted dark:text-text-muted-dark">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
