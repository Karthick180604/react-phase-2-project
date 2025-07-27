//cleared tests


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import ApiError from '../ApiError';
import { setApiError } from '../../../redux/Actions/errorAction';

// Mock the image import
jest.mock('../../../assets/ApiErrorImage.png', () => 'test-image-stub');

// Mock the error action
jest.mock('../../../redux/Actions/errorAction', () => ({
  setApiError: jest.fn(),
}));

// Mock useDispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Create MUI theme for testing
const theme = createTheme();

// Create a mock Redux store
const createMockStore = () => {
  const initialState = {
    error: {
      apiError: true,
    },
  };

  const rootReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_API_ERROR':
        return {
          ...state,
          error: {
            ...state.error,
            apiError: action.payload,
          },
        };
      default:
        return state;
    }
  };

  return createStore(rootReducer);
};

// Test utilities
const renderWithProviders = (
  ui: React.ReactElement,
  { store = createMockStore() } = {}
) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </Provider>
  );
};

describe('ApiError', () => {
  let mockDispatch: jest.Mock;
  const mockedUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    
    // Mock useDispatch to return our mock function
    mockedUseDispatch.mockReturnValue(mockDispatch);

    // Mock setApiError to return an action object
    (setApiError as jest.Mock).mockReturnValue({
      type: 'SET_API_ERROR',
      payload: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all elements correctly', () => {
    renderWithProviders(<ApiError />);

    expect(screen.getByTestId('api-error-root')).toBeInTheDocument();
    expect(screen.getByTestId('api-error-image')).toBeInTheDocument();
    expect(screen.getByTestId('api-error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('api-error-heading')).toBeInTheDocument();
    expect(screen.getByTestId('api-error-subtext')).toBeInTheDocument();
    expect(screen.getByTestId('api-error-refresh-btn')).toBeInTheDocument();
  });

  it('displays correct text content', () => {
    renderWithProviders(<ApiError />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try refreshing the page.')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders error image with correct attributes', () => {
    renderWithProviders(<ApiError />);

    const image = screen.getByTestId('api-error-image');
    expect(image).toHaveAttribute('alt', 'Error');
    expect(image).toHaveAttribute('src', 'test-image-stub');
  });

  it('renders error icon', () => {
    renderWithProviders(<ApiError />);

    const icon = screen.getByTestId('api-error-icon');
    expect(icon).toBeInTheDocument();
  });

  it('calls dispatch with setApiError(false) when refresh button is clicked', () => {
    renderWithProviders(<ApiError />);

    const refreshButton = screen.getByTestId('api-error-refresh-btn');
    fireEvent.click(refreshButton);

    expect(setApiError).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_API_ERROR',
      payload: false,
    });
  });

  it('refresh button is clickable and functional', () => {
    renderWithProviders(<ApiError />);

    const refreshButton = screen.getByTestId('api-error-refresh-btn');
    
    expect(refreshButton).toBeEnabled();
    
    fireEvent.click(refreshButton);

    // Verify dispatch is called (we skip window.location.reload testing)
    expect(setApiError).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('has correct button styling and properties', () => {
    renderWithProviders(<ApiError />);

    const refreshButton = screen.getByTestId('api-error-refresh-btn');
    
    expect(refreshButton).toHaveAttribute('type', 'button');
    expect(refreshButton).toHaveClass('MuiButton-contained');
    expect(refreshButton).toHaveClass('MuiButton-containedSecondary');
  });

  it('has correct layout structure', () => {
    renderWithProviders(<ApiError />);

    const rootBox = screen.getByTestId('api-error-root');
    
    // Check if root container has correct display flex class
    expect(rootBox).toHaveStyle({
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      'text-align': 'center',
    });
  });

  it('renders heading with correct typography variant', () => {
    renderWithProviders(<ApiError />);

    const heading = screen.getByTestId('api-error-heading');
    expect(heading).toHaveClass('MuiTypography-h5');
  });

  it('renders subtext with correct typography variant', () => {
    renderWithProviders(<ApiError />);

    const subtext = screen.getByTestId('api-error-subtext');
    expect(subtext).toHaveClass('MuiTypography-body1');
  });

  it('component is accessible', () => {
    renderWithProviders(<ApiError />);

    const image = screen.getByTestId('api-error-image');
    const button = screen.getByTestId('api-error-refresh-btn');

    expect(image).toHaveAttribute('alt', 'Error');
    expect(button).toBeVisible();
    expect(button).toHaveTextContent('Refresh');
  });

  it('handles multiple rapid clicks on refresh button', () => {
    renderWithProviders(<ApiError />);

    const refreshButton = screen.getByTestId('api-error-refresh-btn');
    
    // Click multiple times rapidly
    fireEvent.click(refreshButton);
    fireEvent.click(refreshButton);
    fireEvent.click(refreshButton);

    // Should have been called 3 times (we skip window.location.reload testing)
    expect(setApiError).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });
});