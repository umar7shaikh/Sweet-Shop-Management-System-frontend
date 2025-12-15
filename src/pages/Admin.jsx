import { useState, useEffect } from 'react';
import { sweetsAPI } from '@/services/api';
import SweetCard from '@/components/SweetCard';
import { Plus, X } from 'lucide-react';

const Admin = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '0',
    image: ''
  });

  useEffect(() => {
    fetchSweets();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const quantity = parseInt(formData.quantity, 10);
      if (Number.isNaN(quantity) || quantity < 0) {
        setError('Quantity must be a non-negative integer');
        return;
      }

      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity,
        image: formData.image || ''
      };

      if (editingId) {
        await sweetsAPI.update(editingId, sweetData);
        setSweets(sweets.map(s => s._id === editingId ? { ...s, ...sweetData } : s));
      } else {
        const response = await sweetsAPI.create(sweetData);
        setSweets([...sweets, response.data?.sweet || response.data]);
      }

      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  const handleEdit = (sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: String(sweet.quantity || '0'),
      image: sweet.image || ''
    });
    setEditingId(sweet._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetsAPI.delete(id);
        setSweets(sweets.filter(s => s._id !== id));
        setError('');
      } catch (err) {
        setError('Failed to delete sweet. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '0',
      image: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600 mt-2">Manage your sweet collection</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          Add Sweet
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-xl shadow-lg p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Gulab Jamun"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Traditional"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity in Stock</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {formData.image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
                  <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                {editingId ? 'Update Sweet' : 'Add Sweet'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : sweets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-2xl text-gray-500 font-semibold">No sweets yet</p>
          <p className="text-gray-400 mt-2">Create your first sweet to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sweets.map(sweet => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
