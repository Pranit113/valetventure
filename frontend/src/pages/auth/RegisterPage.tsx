import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Compass, Mail, Lock, User, Check, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { authService } from '../../services/authService';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const username = watch('username');

  // Debounced username check (mock implementation for frontend)
  useEffect(() => {
    if (!username || username.length < 3 || errors.username) {
      setUsernameStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        // In a real app, you would call authService.checkUsername(username)
        // Here we simulate it
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsernameStatus(username.toLowerCase() === 'admin' ? 'taken' : 'available');
      } catch (err) {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, errors.username]);

  const { execute: executeRegister, isLoading } = useApi(authService.register, {
    onSuccess: (data) => {
      login(data);
      navigate('/');
    },
  });

  const onSubmit = (data: RegisterForm) => {
    if (usernameStatus === 'taken') return;
    executeRegister(data);
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex flex-col px-6 py-8">
      <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center pb-12">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">Start planning your next adventure</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              label="Username"
              placeholder="Choose a username"
              leftIcon={<User className="w-5 h-5" />}
              {...register('username')}
              error={errors.username?.message}
            />
            {!errors.username && usernameStatus === 'available' && (
              <div className="absolute right-3 top-10 flex items-center text-success text-xs">
                <Check className="w-4 h-4 mr-1" /> Available
              </div>
            )}
            {!errors.username && usernameStatus === 'taken' && (
              <div className="absolute right-3 top-10 flex items-center text-error text-xs">
                <X className="w-4 h-4 mr-1" /> Taken
              </div>
            )}
            {!errors.username && usernameStatus === 'checking' && (
              <div className="absolute right-3 top-10 flex items-center text-text-muted text-xs">
                <span className="animate-pulse">Checking...</span>
              </div>
            )}
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail className="w-5 h-5" />}
            {...register('email')}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            leftIcon={<Lock className="w-5 h-5" />}
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            leftIcon={<Lock className="w-5 h-5" />}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading} 
            size="lg" 
            className="mt-6"
            disabled={usernameStatus === 'taken'}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted dark:text-text-muted-dark">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
