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
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <PackageSearch className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Campus<span className="text-primary">Find</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-slate-600 hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/report" className="text-slate-600 hover:text-primary font-medium transition-colors">
                  Report Item
                </Link>
                <Link to="/requests" className="text-slate-600 hover:text-primary font-medium transition-colors">
                  {isAdmin ? 'Manage Requests' : 'My Requests'}
                </Link>
                
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 py-1.5 px-3 rounded-full border border-slate-100">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-medium">{user?.username}</span>
                    {isAdmin && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold ml-1">ADMIN</span>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/10 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-600 font-medium hover:text-primary transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95"
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
