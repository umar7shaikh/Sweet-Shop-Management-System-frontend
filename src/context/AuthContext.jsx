import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true 
      };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    error: null
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.id) {
          dispatch({ 
            type: 'LOGIN', 
            payload: user 
          });
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      }
    }
  }, []);

  const login = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
