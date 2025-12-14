import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            🍭 SweetShop
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <Link to="/admin" className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/admin' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-orange-600'}`}>
                  Admin Panel
                </Link>
              )}
              <Link to="/dashboard" className={`px-4 py-2 rounded-lg font-medium flex items-center ${location.pathname === '/dashboard' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-orange-600'}`}>
                <ShoppingCart size={20} />
              </Link>
              <button onClick={logout} className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
