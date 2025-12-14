import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <div className="text-center">
          <p className="text-2xl text-gray-500 font-semibold mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          Back to Shop
        </button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Product</th>
                  <th className="px-6 py-4 text-center font-semibold">Category</th>
                  <th className="px-6 py-4 text-center font-semibold">Price</th>
                  <th className="px-6 py-4 text-center font-semibold">Quantity</th>
                  <th className="px-6 py-4 text-right font-semibold">Subtotal</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-semibold">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                          disabled={item.cartQuantity <= 1}
                          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.cartQuantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      ₹{(item.price * item.cartQuantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-6 py-3 text-orange-600 font-semibold border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-8 sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-700">Items ({getTotalItems()})</span>
                <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                ₹{getTotalPrice().toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full py-3 text-red-600 font-semibold border-2 border-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
