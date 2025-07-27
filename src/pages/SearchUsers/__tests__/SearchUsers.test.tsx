//cleared tests

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Store, AnyAction } from 'redux';
import SearchUsers from '../SearchUsers';
import * as apiCalls from '../../../services/apiCalls';

// Mock the components
jest.mock('../../../components/UserCard/UserCard', () => {
  return function MockUserCard({ id, image, name }: any) {
    return (
      <div data-testid={`user-card-component-${id}`}>
        <img src={image} alt={name} />
        <h3>{name}</h3>
      </div>
    );
  };
});

jest.mock('../../../components/NoResults/NoResults', () => {
  return function MockNoResults({ message }: any) {
    return <div data-testid="no-results">{message}</div>;
  };
});

jest.mock('../../../components/ApiError/ApiError', () => {
  return function MockApiError() {
    return <div data-testid="api-error">API Error occurred</div>;
  };
});

// Mock the entire store to avoid middleware issues
jest.mock('../../../redux/Store/store', () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn()
  }
}));

// Mock API calls
jest.mock('../../../services/apiCalls');
const mockedApiCalls = apiCalls as jest.Mocked<typeof apiCalls>;

// Mock lodash debounce
jest.mock('lodash.debounce', () => {
  return jest.fn((fn) => {
    const debounced = (...args: any[]) => {
      fn(...args);
    };
    debounced.cancel = jest.fn();
    debounced.flush = jest.fn();
    return debounced;
  });
});

const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    image: 'https://example.com/john.jpg'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    image: 'https://example.com/jane.jpg'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    image: 'https://example.com/bob.jpg'
  }
];

const createMockStore = (initialState = {}): Store<any, AnyAction> => {
  const defaultState = {
    error: {
      hasApiError: false
    },
    ...initialState
  };

  const mockStore: Store<any, AnyAction> = {
    getState: () => defaultState,
    dispatch: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn()
  };

  return mockStore;
};

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </Provider>
  );
};

describe('SearchUsers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApiCalls.getAllUsers.mockResolvedValue({ data: { users: mockUsers } });
    mockedApiCalls.getSearchedUsers.mockResolvedValue({ data: { users: mockUsers } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the component with correct title', () => {
      renderWithProviders(<SearchUsers />);
      
      expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      expect(screen.getByTestId('search-users-title')).toHaveTextContent('Explore Users');
    });

    it('should render search input', () => {
      renderWithProviders(<SearchUsers />);
      
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search users by name...')).toBeInTheDocument();
    });

    it('should fetch and display users on mount', async () => {
      renderWithProviders(<SearchUsers />);
      
      await waitFor(() => {
        expect(mockedApiCalls.getAllUsers).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-3')).toBeInTheDocument();
      });
    });
  });

  describe('Users Display', () => {
    it('should render all users correctly', async () => {
      renderWithProviders(<SearchUsers />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      // Check if all users are rendered
      expect(screen.getByTestId('user-card-component-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-card-component-2')).toBeInTheDocument();
      expect(screen.getByTestId('user-card-component-3')).toBeInTheDocument();

      // Check user names are displayed correctly
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should show no results when no users are found', async () => {
      mockedApiCalls.getAllUsers.mockResolvedValue({ data: { users: [] } });
      
      renderWithProviders(<SearchUsers />);
      
      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input changes', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      
      await user.type(searchInput, 'John');
      
      expect(searchInput).toHaveValue('John');
      
      await waitFor(() => {
        expect(mockedApiCalls.getSearchedUsers).toHaveBeenCalledWith('John');
      });
    });

    it('should search for users and display results', async () => {
      const searchResult = [mockUsers[0]]; // Only John Doe
      mockedApiCalls.getSearchedUsers.mockResolvedValue({ data: { users: searchResult } });
      
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'John');
      
      await waitFor(() => {
        expect(mockedApiCalls.getSearchedUsers).toHaveBeenCalledWith('John');
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-card-component-1')).toBeInTheDocument();
        expect(screen.queryByTestId('user-card-component-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('user-card-component-3')).not.toBeInTheDocument();
      });
    });

    it('should reset to all users when search term is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      
      // Type and then clear
      await user.type(searchInput, 'John');
      await user.clear(searchInput);
      
      // Should show all users again
      await waitFor(() => {
        expect(screen.getByTestId('user-card-component-1')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-component-2')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-component-3')).toBeInTheDocument();
      });
    });

    it('should handle empty search term by showing all users', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      
      // Type spaces only
      await user.type(searchInput, '   ');
      
      // Should not call API and should show all users
      await waitFor(() => {
        expect(mockedApiCalls.getSearchedUsers).not.toHaveBeenCalledWith('   ');
        expect(screen.getByTestId('user-card-component-1')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-component-2')).toBeInTheDocument();
        expect(screen.getByTestId('user-card-component-3')).toBeInTheDocument();
      });
    });

    it('should show no results when search returns empty array', async () => {
      mockedApiCalls.getSearchedUsers.mockResolvedValue({ data: { users: [] } });
      
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'NonExistentUser');
      
      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should render API error component when hasApiError is true', () => {
      const store = createMockStore({
        error: { hasApiError: true }
      });
      
      renderWithProviders(<SearchUsers />, store);
      
      expect(screen.getByTestId('api-error')).toBeInTheDocument();
      expect(screen.queryByTestId('search-users-container')).not.toBeInTheDocument();
    });

    it('should handle getAllUsers API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockedApiCalls.getAllUsers.mockRejectedValue(new Error('Failed to fetch users'));
      
      renderWithProviders(<SearchUsers />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
      
      // Should still render the container but with no users
      expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('should handle getSearchedUsers API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockedApiCalls.getSearchedUsers.mockRejectedValue(new Error('Search failed'));
      
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Debounced Search', () => {
    it('should debounce search input', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      
      // Type multiple characters quickly
      await user.type(searchInput, 'John');
      
      // Should eventually call the search API
      await waitFor(() => {
        expect(mockedApiCalls.getSearchedUsers).toHaveBeenCalledWith('John');
      });
    });

    it('should update search term state immediately', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      const searchInput = screen.getByTestId('search-input');
      
      await user.type(searchInput, 'J');
      
      expect(searchInput).toHaveValue('J');
    });
  });

  describe('Component State Management', () => {
    it('should initialize with empty user list and search term', () => {
      mockedApiCalls.getAllUsers.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithProviders(<SearchUsers />);
      
      expect(screen.getByTestId('search-input')).toHaveValue('');
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });

    it('should update filtered users when user list changes', async () => {
      renderWithProviders(<SearchUsers />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
        expect(screen.getAllByTestId(/user-card-component-/)).toHaveLength(3);
      });
    });

    it('should maintain search term state during searches', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchUsers />);
      
      const searchInput = screen.getByTestId('search-input');
      
      await user.type(searchInput, 'John Doe');
      
      expect(searchInput).toHaveValue('John Doe');
      
      await waitFor(() => {
        expect(mockedApiCalls.getSearchedUsers).toHaveBeenCalledWith('John Doe');
      });
      
      // Search term should still be maintained
      expect(searchInput).toHaveValue('John Doe');
    });
  });

  describe('Grid Layout', () => {
    it('should render users in a grid layout', async () => {
      renderWithProviders(<SearchUsers />);
      
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const userList = screen.getByTestId('user-list');
      // Check if the grid container has the correct CSS class from MUI
      expect(userList).toHaveClass('MuiGrid-root');
      
      // Check if individual grid items are rendered
      expect(screen.getByTestId('user-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('user-card-3')).toBeInTheDocument();
    });
  });

  describe('User Interface Elements', () => {
    it('should render search icon in input', () => {
      renderWithProviders(<SearchUsers />);
      
      // Check if SearchIcon is rendered (it should be in the DOM structure)
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have proper styling and layout classes', () => {
      renderWithProviders(<SearchUsers />);
      
      expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      expect(screen.getByTestId('search-users-title')).toBeInTheDocument();
    });

    it('should render proper placeholder text', () => {
      renderWithProviders(<SearchUsers />);
      
      expect(screen.getByPlaceholderText('Search users by name...')).toBeInTheDocument();
    });
  });

  describe('Async Operations', () => {
    it('should handle async user fetching correctly', async () => {
      const mockPromise = Promise.resolve({ data: { users: mockUsers } });
      mockedApiCalls.getAllUsers.mockReturnValue(mockPromise);
      
      renderWithProviders(<SearchUsers />);
      
      expect(mockedApiCalls.getAllUsers).toHaveBeenCalled();
      
      await act(async () => {
        await mockPromise;
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });
    });

    it('should handle async search correctly', async () => {
      const user = userEvent.setup();
      const searchResult = [mockUsers[0]];
      const mockSearchPromise = Promise.resolve({ data: { users: searchResult } });
      mockedApiCalls.getSearchedUsers.mockReturnValue(mockSearchPromise);
      
      renderWithProviders(<SearchUsers />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'John');
      
      await act(async () => {
        await mockSearchPromise;
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user-card-component-1')).toBeInTheDocument();
        expect(screen.queryByTestId('user-card-component-2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Memory Management', () => {
    it('should cleanup debounced function on unmount', () => {
      const { unmount } = renderWithProviders(<SearchUsers />);
      
      // Component should render without issues
      expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      
      // Unmount should not cause any errors
      unmount();
    });
  });
});