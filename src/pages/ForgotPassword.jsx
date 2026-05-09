import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      const successMessage = response.data?.message || 'If an account exists, password reset instructions have been sent.';
      setMessage(successMessage);
      showToast('success', successMessage);
      setEmail('');
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = 'Could not send reset instructions. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check your connection or wait for the server to wake up.';
      }
      
      setMessage(errorMessage);
      showToast('error', errorMessage);
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
        <h1 className="text-3xl sm:text-4xl font-serif text-ink">Reset your password</h1>
        <p className="mt-3 text-sm text-taupe max-w-md mx-auto">
          Enter your registered email or phone number and we will send password reset instructions if the account exists.
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto bg-paper shadow-lg rounded-xl p-6 sm:p-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && <div className="text-sm text-center text-taupe">{message}</div>}

          <div>
            <label className="block text-xs uppercase tracking-widest text-taupe">Email or Phone Number</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-taupe/30 px-3 py-4 text-base rounded-md focus:outline-none focus:border-ink bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-4 text-base rounded-md uppercase tracking-widest hover:bg-ink/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-ink uppercase tracking-widest border-b border-ink/30">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
