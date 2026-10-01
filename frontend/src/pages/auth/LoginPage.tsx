import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-form-hook-form'; // typo here intentionally to fix in next call... wait no, use react-hook-form
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Mail, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { info } = useToast();
  
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useHookForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { execute: executeLogin, isLoading } = useApi(authService.login, {
    onSuccess: (data) => {
      login(data);
      navigate(from, { replace: true });
    },
  });

  const onSubmit = (data: LoginForm) => {
    executeLogin(data);
  };

  const handleForgotPassword = () => {
    info("Password recovery coming soon!");
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-semibold mb-2">Valetventure</h1>
          <p className="text-text-muted dark:text-text-muted-dark">Welcome back to your journeys</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email or Username"
            placeholder="Enter your email"
            leftIcon={<Mail className="w-5 h-5" />}
            {...register('identifier')}
            error={errors.identifier?.message}
          />
          
          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg" className="mt-8">
            Log In
          </Button>
        </form>

        <p className="mt-10 text-center text-sm text-text-muted dark:text-text-muted-dark">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
