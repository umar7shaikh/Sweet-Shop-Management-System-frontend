import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { sweetsAPI } from '@/services/api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  if (cart.length === 0 && !success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Checkout</h1>
        <p className="text-2xl text-gray-500 font-semibold mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Shopping
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const orders = [];
      
      // Process each item in the cart
      for (const item of cart) {
        try {
          const response = await sweetsAPI.purchase(item._id, item.cartQuantity);
          orders.push({
            sweetId: item._id,
            name: item.name,
            quantity: item.cartQuantity,
            price: item.price,
            subtotal: item.price * item.cartQuantity,
            status: 'success'
          });
        } catch (itemError) {
          orders.push({
            sweetId: item._id,
            name: item.name,
            quantity: item.cartQuantity,
            price: item.price,
            status: 'failed',
            error: itemError.response?.data?.message || 'Failed to purchase'
          });
        }
      }

      const failedOrders = orders.filter(o => o.status === 'failed');
      
      if (failedOrders.length === 0) {
        // All orders succeeded
        setSuccess(true);
        setOrderDetails({
          orders,
          totalItems: getTotalItems(),
          totalAmount: getTotalPrice(),
          timestamp: new Date().toLocaleString()
        });
        clearCart();
      } else if (failedOrders.length === orders.length) {
        // All orders failed
        setError('Failed to process checkout. Please try again.');
      } else {
        // Partial success
        setError(`Checkout partially successful. ${failedOrders.length} item(s) could not be purchased.`);
        setOrderDetails({
          orders,
          totalItems: getTotalItems(),
          totalAmount: getTotalPrice(),
          timestamp: new Date().toLocaleString()
        });
        clearCart();
      }
    } catch (err) {
      setError('An error occurred during checkout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success && orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
            <div>
              <p className="text-gray-600 text-sm">Order ID</p>
              <p className="text-2xl font-bold text-orange-600">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-2xl font-bold">{orderDetails.totalItems}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{orderDetails.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderDetails.orders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{order.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.subtotal.toFixed(2)}</p>
                    {order.status === 'failed' && (
                      <p className="text-xs text-red-600">{order.error}</p>
                    )}
                    {order.status === 'success' && (
                      <p className="text-xs text-green-600">✓ Processed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-8 mt-8">
            <p className="text-gray-600 text-sm mb-4">Order placed on: {orderDetails.timestamp}</p>
            <p className="text-gray-600">Customer: {user?.name} ({user?.email})</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 text-orange-600 font-semibold border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold mb-4"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <textarea
                  placeholder="Enter your delivery address"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 border-orange-500 rounded-lg cursor-pointer bg-orange-50">
                <input type="radio" name="payment" defaultChecked className="mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer opacity-50">
                <input type="radio" name="payment" disabled className="mr-4" />
                <div>
                  <p className="font-semibold text-gray-900">Online Payment (Coming Soon)</p>
                  <p className="text-sm text-gray-600">Pay now with card or UPI</p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Review */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Order Review</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.cartQuantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-8 sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax</span>
                <span className="font-semibold">₹0.00</span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                ₹{getTotalPrice().toFixed(2)}
              </span>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              disabled={loading}
              className="w-full mt-3 py-3 text-orange-600 font-semibold border-2 border-orange-500 rounded-lg hover:bg-orange-50 disabled:opacity-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
