import { ShoppingCart, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const SweetCard = ({ sweet, onAddToCart, onEdit, onDelete, isAdmin = false }) => {
  // Backend sends quantity field
  const stock = sweet.quantity || 0;
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-300">
      <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-blue-400 transition-opacity duration-300"></div>
        {sweet.image && !imageError ? (
          <img 
            src={sweet.image} 
            alt={sweet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ImageIcon size={40} className="text-blue-600" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{sweet.name}</h3>
        <p className="text-slate-500 text-sm mb-4">{sweet.category}</p>
        
        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-bold text-blue-600">₹{sweet.price}</span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            stock > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex gap-2">
          {!isAdmin && (
            <button
              onClick={() => onAddToCart(sweet)}
              disabled={stock <= 0}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <ShoppingCart size={18} />
              <span className="text-sm">{stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          )}
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 py-3 px-4 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              <span className="text-sm">Edit</span>
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(sweet._id)}
              className="flex-1 py-3 px-4 border-2 border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              <span className="text-sm">Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
