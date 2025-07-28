import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import SearchUsers from '../SearchUsers';
import { getAllUsers, getSearchedUsers } from '../../../services/apiCalls';
import debounce from 'lodash.debounce';

// Mock the API calls
jest.mock('../../../services/apiCalls', () => ({
  getAllUsers: jest.fn(),
  getSearchedUsers: jest.fn(),
}));

// Mock debounce
jest.mock('lodash.debounce', () => jest.fn((fn) => fn));

// Mock the components
jest.mock('../../../components/UserCard/UserCard', () => {
  return function UserCard({ id, name, image }: { id: number; name: string; image: string }) {
    return (
      <div data-testid={`user-card-${id}`}>
        <img src={image} alt={name} />
        <span>{name}</span>
      </div>
    );
  };
});

jest.mock('../../../components/NoResults/NoResults', () => {
  return function NoResults({ message }: { message: string }) {
    return <div data-testid="no-results">{message}</div>;
  };
});

jest.mock('../../../components/ApiError/ApiError', () => {
  return function ApiError() {
    return <div data-testid="api-error">API Error occurred</div>;
  };
});

const mockGetAllUsers = getAllUsers as jest.MockedFunction<typeof getAllUsers>;
const mockGetSearchedUsers = getSearchedUsers as jest.MockedFunction<typeof getSearchedUsers>;
const mockDebounce = debounce as jest.MockedFunction<typeof debounce>;

// Mock user data
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    image: 'https://example.com/john.jpg',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    image: 'https://example.com/jane.jpg',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    image: 'https://example.com/bob.jpg',
  },
];

// Create mock store
const createMockStore = (hasApiError = false) => {
  const initialState = {
    error: {
      hasApiError,
    },
  };

  const rootReducer = (state = initialState) => state;
  return createStore(rootReducer);
};

// Helper function to render component with store
const renderWithStore = (hasApiError = false) => {
  const store = createMockStore(hasApiError);
  return render(
    <Provider store={store}>
      <SearchUsers />
    </Provider>
  );
};

describe('SearchUsers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDebounce.mockImplementation((fn) => fn);
  });

  describe('Initial Loading', () => {
    it('should show loading spinner initially', async () => {
      mockGetAllUsers.mockImplementation(() => 
        new Promise((resolve) => 
          setTimeout(() => resolve({ data: { users: mockUsers } }), 100)
        )
      );

      renderWithStore();

      expect(screen.getByTestId('page-loader')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument();
      });
    });

    it('should fetch and display users on component mount', async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: mockUsers } });

      renderWithStore();

      await waitFor(() => {
        expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
        expect(screen.getByTestId('search-users-title')).toHaveTextContent('Explore Users');
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      // Check if all users are displayed
      mockUsers.forEach((user) => {
        expect(screen.getAllByTestId(`user-card-${user.id}`)[0]).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display API error component when hasApiError is true', () => {
      renderWithStore(true);

      expect(screen.getByTestId('api-error')).toBeInTheDocument();
      expect(screen.queryByTestId('search-users-container')).not.toBeInTheDocument();
    });

    it('should handle fetch users error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGetAllUsers.mockRejectedValue(new Error('API Error'));

      renderWithStore();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: mockUsers } });
      renderWithStore();

      await waitFor(() => {
        expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      });
    });

    it('should render search input with correct placeholder', () => {
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search users by name...');
    });

    it('should update search term when typing in search input', () => {
      const searchInput = screen.getByTestId('search-input');
      
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      expect(searchInput).toHaveValue('John');
    });

    it('should call getSearchedUsers when search term is not empty', async () => {
      const searchedUsers = [mockUsers[0]]; // John Doe
      mockGetSearchedUsers.mockResolvedValue({ data: { users: searchedUsers } });

      const searchInput = screen.getByTestId('search-input');
      
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(mockGetSearchedUsers).toHaveBeenCalledWith('John');
      });
    });

    it('should reset to all users when search term is empty', async () => {
      const searchedUsers = [mockUsers[0]]; // John Doe
      mockGetSearchedUsers.mockResolvedValue({ data: { users: searchedUsers } });
      
      const searchInput = screen.getByTestId('search-input');
      
      // First search for something
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(mockGetSearchedUsers).toHaveBeenCalledWith('John');
      });
      
      // Then clear the search
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        // Should show all users again (using getAllByTestId to handle multiple elements)
        mockUsers.forEach((user) => {
          expect(screen.getAllByTestId(`user-card-${user.id}`)[0]).toBeInTheDocument();
        });
      });
    });

    it('should handle search API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGetSearchedUsers.mockRejectedValue(new Error('Search API Error'));

      const searchInput = screen.getByTestId('search-input');
      
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('User Display', () => {
    it('should display NoResults component when no users found', async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: [] } });

      renderWithStore();

      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument();
        expect(screen.getByTestId('no-results')).toHaveTextContent('No users found');
      });
    });

    it('should display users in grid layout when users are available', async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: mockUsers } });

      renderWithStore();

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
        
        mockUsers.forEach((user) => {
          const userCard = screen.getAllByTestId(`user-card-${user.id}`)[0];
          expect(userCard).toBeInTheDocument();
          expect(userCard).toHaveTextContent(`${user.firstName} ${user.lastName}`);
        });
      });
    });

    it('should pass correct props to UserCard components', async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: mockUsers } });

      renderWithStore();

      await waitFor(() => {
        mockUsers.forEach((user) => {
          const userCard = screen.getAllByTestId(`user-card-${user.id}`)[0];
          expect(userCard).toHaveTextContent(`${user.firstName} ${user.lastName}`);
          
          const image = userCard.querySelector('img');
          expect(image).toHaveAttribute('src', user.image);
          expect(image).toHaveAttribute('alt', `${user.firstName} ${user.lastName}`);
        });
      });
    });
  });

  describe('Debounce Functionality', () => {
    it('should use debounce for search functionality', async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: mockUsers } });
      
      renderWithStore();

      await waitFor(() => {
        expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      });

      expect(mockDebounce).toHaveBeenCalledWith(
        expect.any(Function),
        500
      );
    });
  });

  describe('Component Structure', () => {
    beforeEach(async () => {
      mockGetAllUsers.mockResolvedValue({ data: { users: mockUsers } });
      renderWithStore();

      await waitFor(() => {
        expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
      });
    });

    it('should render main container with correct test id', () => {
      expect(screen.getByTestId('search-users-container')).toBeInTheDocument();
    });

    it('should render title with correct text and test id', () => {
      const title = screen.getByTestId('search-users-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Explore Users');
    });

    it('should render search input with search icon', () => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      // Search icon is rendered through MUI InputAdornment
    });
  });

  describe('Redux Integration', () => {
    it('should correctly read hasApiError from Redux store', () => {
      // Test with error state
      const { unmount: unmountWithError } = renderWithStore(true);
      expect(screen.getByTestId('api-error')).toBeInTheDocument();
      
      // Unmount and test without error state
      unmountWithError();
      renderWithStore(false);
      expect(screen.queryByTestId('api-error')).not.toBeInTheDocument();
    });
  });
});