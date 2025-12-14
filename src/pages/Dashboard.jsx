import { useState, useEffect } from 'react';
import { sweetsAPI } from '@/services/api';
import SweetCard from '@/components/SweetCard';
import { Search, Filter, Loader } from 'lucide-react';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

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
      setSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
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
        sweet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sweet => sweet.category === selectedCategory);
    }

    setFilteredSweets(filtered);
  };

  const handleAddToCart = (sweet) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === sweet.id);
      if (existing) {
        return prev.map(item =>
          item.id === sweet.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...sweet, quantity: 1 }];
    });
  };

  const categories = ['all', ...new Set(sweets.map(sweet => sweet.category).filter(Boolean))];

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
          <Loader size={48} className="animate-spin text-orange-500" />
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
                key={sweet.id}
                sweet={sweet}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
              <h3 className="text-xl font-bold mb-4">Shopping Cart ({cart.length})</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="text-lg font-bold text-right">
                  Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </p>
              </div>
              <button className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all">
                Checkout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
