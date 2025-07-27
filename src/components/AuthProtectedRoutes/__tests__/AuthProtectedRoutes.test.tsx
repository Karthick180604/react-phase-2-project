//cleared tests

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import AuthProtectedRoutes from '../AuthProtectedRoutes';

// Mock Navigate component
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => {
    mockNavigate(to);
    return <div data-testid="navigate-component">Navigating to {to}</div>;
  },
}));

// Mock root reducer for testing
const mockRootReducer = (state = { user: { email: '' } }, action: any) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Helper function to create store with initial state
const createMockStore = (initialState: any) => {
  return createStore(mockRootReducer, initialState);
};

// Test component to render as children
const TestComponent = () => <div data-testid="test-children">Test Children</div>;

describe('AuthProtectedRoutes', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('when user is not authenticated', () => {
    it('should render children when user email is empty', () => {
      const store = createMockStore({
        user: { email: '' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render children when user email is null', () => {
      const store = createMockStore({
        user: { email: null }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render children when user email is undefined', () => {
      const store = createMockStore({
        user: { email: undefined }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render children when user object is missing email property', () => {
      const store = createMockStore({
        user: {}
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('when user is authenticated', () => {
    it('should navigate to /home when user has email', () => {
      const store = createMockStore({
        user: { email: 'test@example.com' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('navigate-component')).toBeInTheDocument();
      expect(screen.getByText('Navigating to /home')).toBeInTheDocument();
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('should navigate to /home when user has non-empty email', () => {
      const store = createMockStore({
        user: { email: 'user@domain.com' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('navigate-component')).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/home');
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle multiple children elements', () => {
      const store = createMockStore({
        user: { email: '' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <div data-testid="child-1">Child 1</div>
              <div data-testid="child-2">Child 2</div>
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
    });

    it('should handle null children when not authenticated', () => {
      const store = createMockStore({
        user: { email: '' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              {null}
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.queryByTestId('navigate-component')).not.toBeInTheDocument();
    });

    it('should handle store state with additional user properties', () => {
      const store = createMockStore({
        user: { 
          email: 'test@example.com',
          name: 'Test User',
          id: 123
        }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/home');
      expect(screen.queryByTestId('test-children')).not.toBeInTheDocument();
    });
  });

  describe('Redux integration', () => {
    it('should correctly read from Redux store state', () => {
      const store = createMockStore({
        user: { email: 'redux@test.com' },
        otherState: { someValue: 'ignored' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('should work with minimal store state', () => {
      const store = createMockStore({
        user: { email: '' }
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <AuthProtectedRoutes>
              <TestComponent />
            </AuthProtectedRoutes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });
  });
});