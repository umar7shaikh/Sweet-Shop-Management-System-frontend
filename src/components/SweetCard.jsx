import { ShoppingCart, Edit2, Trash2 } from 'lucide-react';

const SweetCard = ({ sweet, onAddToCart, onEdit, onDelete, isAdmin = false }) => {
  // Backend sends quantity field
  const stock = sweet.quantity || 0;

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:border-orange-200">
      <div className="h-48 bg-gradient-to-br from-orange-50 to-pink-50 p-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <span className="text-5xl group-hover:rotate-6 transition-transform duration-300">🍭</span>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{sweet.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sweet.category}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-orange-600">₹{sweet.price}</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
            {stock} in stock
          </span>
        </div>
        
        <div className="flex gap-2">
          {!isAdmin && (
            <button
              onClick={() => onAddToCart(sweet)}
              disabled={stock <= 0}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={20} />
              <span>{stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          )}
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 py-3 px-4 border border-blue-500 text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Edit2 size={20} />
              Edit
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(sweet._id)}
              className="flex-1 py-3 px-4 border border-red-500 text-red-600 font-semibold rounded-2xl hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 size={20} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
