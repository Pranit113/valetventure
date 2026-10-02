import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Mail, Lock, User, Check, X, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(30, 'Must be 30 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const username = watch('username');

  // Real username availability check against mockDb
  useEffect(() => {
    if (!username || username.length < 3 || errors.username) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await authService.checkUsername(username);
        setUsernameStatus(res.data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [username, errors.username]);

  const onSubmit = async (formData: RegisterForm) => {
    if (usernameStatus === 'taken') return;
    setIsLoading(true);
    try {
      const res = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      login(res.data);
      navigate('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please try again.';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center pb-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-text dark:text-text-dark mb-1">
            Create your account
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            Start planning your next adventure
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username field with availability indicator */}
          <div className="relative">
            <Input
              label="Username"
              placeholder="Choose a username"
              leftIcon={<User className="w-5 h-5" />}
              autoComplete="username"
              {...register('username')}
              error={errors.username?.message}
            />
            {/* Availability badge */}
            {!errors.username && username && username.length >= 3 && (
              <div className="absolute right-3 top-9 flex items-center gap-1 text-xs font-medium">
                {usernameStatus === 'checking' && (
                  <span className="text-text-muted dark:text-text-muted-dark flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking
                  </span>
                )}
                {usernameStatus === 'available' && (
                  <span className="text-success flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Available
                  </span>
                )}
                {usernameStatus === 'taken' && (
                  <span className="text-error flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Taken
                  </span>
                )}
              </div>
            )}
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail className="w-5 h-5" />}
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password (min 6 chars)"
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            size="lg"
            className="mt-4"
            disabled={usernameStatus === 'taken' || usernameStatus === 'checking'}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
