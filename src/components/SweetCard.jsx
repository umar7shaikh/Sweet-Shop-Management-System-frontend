import { ShoppingCart, Edit2, Trash2, Heart } from 'lucide-react';
import { useState } from 'react';

const SweetCard = ({ sweet, onEdit, onDelete, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
        <img
          src={sweet.image || 'https://via.placeholder.com/200?text=Sweet'}
          alt={sweet.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{sweet.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{sweet.description}</p>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-orange-600">${sweet.price?.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Stock: {sweet.stock || 0}</p>
          </div>
          {sweet.category && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              {sweet.category}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(sweet)}
              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 py-2 border border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(sweet.id)}
              className="flex-1 py-2 border border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
