import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const cartItems = getTotalItems();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center gap-3 font-bold text-lg text-slate-900 hover:text-slate-700 transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">S</div>
            SweetShop
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-2">
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === '/admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
              {user.role === 'customer' && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      location.pathname === '/dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Shop
                  </Link>
                  <Link to="/cart" className="relative">
                    <div className={`p-2 rounded-lg transition-all ${
                      location.pathname === '/cart' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}>
                      <ShoppingCart size={20} />
                      {cartItems > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                          {cartItems}
                        </span>
                      )}
                    </div>
                  </Link>
                </>
              )}
              <button 
                onClick={logout} 
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
