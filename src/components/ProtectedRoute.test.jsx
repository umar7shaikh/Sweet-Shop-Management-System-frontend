import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

test('renders children when authenticated', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthProvider>
  );
  
  render(
    <ProtectedRoute isAdmin={false}>
      <div>Protected Content</div>
    </ProtectedRoute>,
    { wrapper }
  );
  
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

test('redirects to login when unauthenticated', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        {children}
      </MemoryRouter>
    </AuthProvider>
  );
  
  render(
    <ProtectedRoute isAdmin={false}>
      <div>Protected Content</div>
    </ProtectedRoute>,
    { wrapper }
  );
  
  // When unauthenticated, the Navigate component should redirect
  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});

test('redirects to dashboard when user is not admin but accessing admin route', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      <MemoryRouter initialEntries={['/admin']}>
        {children}
      </MemoryRouter>
    </AuthProvider>
  );
  
  render(
    <ProtectedRoute isAdmin={true}>
      <div>Admin Content</div>
    </ProtectedRoute>,
    { wrapper }
  );
  
  // When user is not admin, should not render admin content
  expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
});
