import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserPlus, AlertCircle } from 'lucide-react';

const SignUp: FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up | CampusFind';
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'USER' // default role
      });
      // After successful signup, redirect to login
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || (typeof err.response.data === 'string' ? err.response.data : 'Registration failed on server.'));
      } else if (err.request) {
        setError('Unable to connect to the backend server (http://localhost:8080). Please ensure the backend API is running.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8 animate-[fade-in_0.5s_ease-out]">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <UserPlus className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create an Account</h2>
          <p className="text-slate-400 mt-2">Join CampusFind to report or claim items</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="glass-input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="glass-input"
              placeholder="student@institute.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="glass-input"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="glass-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
