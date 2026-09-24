import { useState, useEffect, type FC, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { LogIn, AlertCircle } from 'lucide-react';

const SignIn: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Sign In | CampusFind';
  }, []);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.login({ username, password });
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || (typeof err.response.data === 'string' ? err.response.data : 'Login failed. Please check your credentials.'));
      } else if (err.request) {
        setError('Unable to connect to the backend server (http://localhost:8080). Please ensure the backend API is running.');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-[fade-in_0.5s_ease-out]">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <LogIn className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to continue to CampusFind</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="glass-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="glass-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
