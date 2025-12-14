import { renderHook, act } from '@testing-library/react';
import { useAuth } from './AuthContext';
import { AuthProvider } from './AuthContext';

test('initializes with unauthenticated state', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  expect(result.current.user).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
});

test('login updates user state', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  const userData = { id: 1, name: 'Test User', email: 'test@example.com' };
  
  act(() => {
    result.current.login(userData);
  });
  
  expect(result.current.user).toEqual(userData);
  expect(result.current.isAuthenticated).toBe(true);
});

test('logout clears user state', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  const userData = { id: 1, name: 'Test User', email: 'test@example.com' };
  
  act(() => {
    result.current.login(userData);
  });
  
  act(() => {
    result.current.logout();
  });
  
  expect(result.current.user).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
});
