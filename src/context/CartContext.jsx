import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, cartQuantity: item.cartQuantity + (action.payload.cartQuantity || 1) }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cartQuantity: action.payload.cartQuantity || 1 }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, cartQuantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'RESTORE_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed.items && Array.isArray(parsed.items)) {
          dispatch({ type: 'RESTORE_CART', payload: parsed });
        }
      } catch (err) {
        console.error('Failed to restore cart:', err);
      }
    }
  }, []);

  const addToCart = (sweet, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...sweet, cartQuantity: quantity }
    });
  };

  const removeFromCart = (sweetId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: sweetId });
  };

  const updateQuantity = (sweetId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: sweetId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
