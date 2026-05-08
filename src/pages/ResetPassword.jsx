import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = searchParams.get('token') || searchParams.get('resetToken') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      const message = 'Reset link is invalid or expired.';
      setError(message);
      showToast('error', message);
      return;
    }

    if (password.length < 6) {
      const message = 'Password must be at least 6 characters.';
      setError(message);
      showToast('error', message);
      return;
    }

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      showToast('error', message);
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/auth/reset-password', { token, email, newPassword: password, password });
      showToast('success', 'Password reset successfully. Please sign in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Could not reset password. Please request a new reset link.';
      setError(message);
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-cream/30 px-5 sm:px-6">
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="Papercues logo" className="h-28 sm:h-32 w-auto" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-serif text-ink">Create new password</h1>
        <p className="mt-3 text-sm text-taupe max-w-md mx-auto">
          Choose a new password for your Papercues account.
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto bg-paper shadow-lg rounded-xl p-6 sm:p-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <label className="block text-xs uppercase tracking-widest text-taupe">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-taupe/30 px-3 py-4 text-base rounded-md focus:outline-none focus:border-ink bg-transparent"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-taupe">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full border border-taupe/30 px-3 py-4 text-base rounded-md focus:outline-none focus:border-ink bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-4 text-base rounded-md uppercase tracking-widest hover:bg-ink/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-sm font-medium text-ink uppercase tracking-widest border-b border-ink/30">
            Request a new link
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
