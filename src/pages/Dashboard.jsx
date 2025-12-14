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
      // Backend returns { sweets: [...] }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          🍬 Sweet Shop
        </h1>
        <p className="text-gray-600">Discover our delicious collection of sweets</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
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
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
          <button
            onClick={fetchSweets}
            className="ml-4 underline hover:no-underline font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredSweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-500 font-semibold">No sweets found</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Sweets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
            <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={24} /> Cart ({getTotalItems()})
              </h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.cartQuantity}</span>
                    <span className="font-semibold">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="text-lg font-bold text-right">
                  Total: ₹{getTotalPrice().toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 py-3 bg-orange-100 text-orange-600 font-semibold rounded-lg hover:bg-orange-200 transition-all"
                >
                  View Cart
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
