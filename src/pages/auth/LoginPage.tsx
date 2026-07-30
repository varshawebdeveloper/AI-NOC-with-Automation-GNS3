import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils';
import { ROUTES } from '../../constants/theme';

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  const [email, setEmail] = useState('admin@ainoc.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!isValidEmail(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // error is shown via auth context
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your AI-NOC account"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Global error */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 bg-critical-50 border border-critical-100 rounded-lg">
            <AlertCircle className="h-4 w-4 text-critical-600 flex-shrink-0" />
            <p className="text-xs text-critical-600 font-medium">{error}</p>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-text-primary mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError(); }}
            placeholder="admin@ainoc.com"
            className={`input-field ${errors.email ? 'border-critical-600 focus:ring-critical-500 focus:border-critical-600' : ''}`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-critical-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-text-primary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              placeholder="••••••••"
              className={`input-field pr-10 ${errors.password ? 'border-critical-600 focus:ring-critical-500 focus:border-critical-600' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-critical-600">{errors.password}</p>
          )}
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          leftIcon={<LogIn className="h-4 w-4" />}
          className="w-full"
          id="login-btn"
        >
          Sign In
        </Button>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-surface-secondary border border-border rounded-lg">
          <p className="text-[11px] text-text-muted text-center font-medium">
            Demo credentials pre-filled · Phase 1
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
