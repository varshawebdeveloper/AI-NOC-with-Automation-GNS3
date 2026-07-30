import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/authService';
import { isValidEmail } from '../../utils';
import { ROUTES } from '../../constants/theme';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {success ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-success-50 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-success-600" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Check your inbox</h3>
            <p className="text-xs text-text-secondary mt-1">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3 bg-critical-50 border border-critical-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-critical-600 flex-shrink-0" />
              <p className="text-xs text-critical-600 font-medium">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-text-primary mb-1.5">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="Enter your account email"
              className="input-field"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={<Mail className="h-4 w-4" />}
            className="w-full"
            id="send-reset-btn"
          >
            Send Reset Link
          </Button>

          <Link
            to={ROUTES.LOGIN}
            className="flex items-center justify-center gap-2 text-xs text-text-secondary hover:text-text-primary font-medium transition-colors mt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
