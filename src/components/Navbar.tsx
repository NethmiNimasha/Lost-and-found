import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PackageSearch, LogOut, User as UserIcon } from 'lucide-react';

const Navbar: FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors group">
            <PackageSearch className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-xl tracking-tight text-white">
              Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Find</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/report" className="text-slate-300 hover:text-white font-medium transition-colors">
                  Report Item
                </Link>
                <Link to="/requests" className="text-slate-300 hover:text-white font-medium transition-colors">
                  {isAdmin ? 'Manage Requests' : 'My Requests'}
                </Link>
                
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white bg-white/10 py-1.5 px-3 rounded-full border border-white/10 shadow-inner">
                    <UserIcon className="w-4 h-4 text-indigo-300" />
                    <span className="font-medium tracking-wide">{user?.username}</span>
                    {isAdmin && <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 uppercase border border-indigo-500/30">Admin</span>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-pink-400 hover:bg-pink-400/10 rounded-full transition-all duration-300 hover:rotate-12"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-300 font-medium hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-2 px-5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
