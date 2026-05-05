import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await register(username, email, password);
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 flex flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl sm:text-4xl font-serif text-ink">Create an account</h2>
        <p className="mt-2 text-center text-sm text-taupe">
          Or{' '}
          <Link to="/login" className="font-medium text-ink hover:text-ink/70 uppercase tracking-widest border-b border-ink/30 pb-0.5">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-paper py-8 px-5 shadow rounded-sm sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ink uppercase tracking-wider">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-taupe/30 rounded-sm shadow-sm placeholder-taupe/50 focus:outline-none focus:ring-ink focus:border-ink sm:text-sm bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink uppercase tracking-wider">
                Email or Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-taupe/30 rounded-sm shadow-sm placeholder-taupe/50 focus:outline-none focus:ring-ink focus:border-ink sm:text-sm bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-taupe/30 rounded-sm shadow-sm placeholder-taupe/50 focus:outline-none focus:ring-ink focus:border-ink sm:text-sm bg-transparent"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-paper bg-ink hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink uppercase tracking-widest transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
