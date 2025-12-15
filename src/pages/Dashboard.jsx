import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetsAPI } from '@/services/api';
import SweetCard from '@/components/SweetCard';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Search, Filter, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { cart, addToCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [sweets, searchTerm, selectedCategory]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsAPI.getAll();
      const sweetsData = response.data?.sweets || response.data || [];
      setSweets(Array.isArray(sweetsData) ? sweetsData : []);
      setError('');
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      setSweets([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let filtered = sweets;

    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sweet => sweet.category === selectedCategory);
    }

    setFilteredSweets(filtered);
  };

  const handleAddToCart = (sweet) => {
    addToCart(sweet, 1);
  };

  const categories = ['all', ...new Set((sweets || []).map(sweet => sweet.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Browse Sweets</h1>
        <p className="text-slate-600 mt-2">Explore our premium collection of delicious sweets</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 text-slate-400" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between items-center">
          {error}
          <button
            onClick={fetchSweets}
            className="ml-4 underline hover:no-underline font-semibold hover:text-red-900 transition-colors whitespace-nowrap"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600"></div>
        </div>
      ) : filteredSweets.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-3xl text-gray-900 font-semibold mb-4">No sweets found</p>
          <p className="text-lg text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Sweets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
            {filteredSweets.map(sweet => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-8 right-8 bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-xs max-h-96">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
                <ShoppingCart size={20} /> Cart ({getTotalItems()})
              </h3>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm pb-2 border-b border-slate-100 last:border-b-0">
                    <span className="text-slate-700">{item.name} x{item.cartQuantity}</span>
                    <span className="font-semibold text-slate-900">₹{(item.price * item.cartQuantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-lg font-bold text-right text-slate-900 mb-4">
                  ₹{getTotalPrice().toFixed(0)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex-1 py-2 px-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all text-sm"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
