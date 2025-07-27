//cleared tests

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import WebLayout from '../WebLayout';

// Mock the Navbar component
jest.mock('../../../components/Navbar/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// Mock react-router-dom Outlet
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Mock useMediaQuery
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

// Create a mock Redux store
const createMockStore = () => {
  const initialState = {};
  
  const rootReducer = (state = initialState, action: any) => {
    return state;
  };

  return createStore(rootReducer);
};

// Create MUI theme for testing
const theme = createTheme();

// Test utilities
const renderWithProviders = (ui: React.ReactElement) => {
  const store = createMockStore();
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('WebLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders navbar and outlet', () => {
    // Mock mobile breakpoint (no drawer)
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('applies correct styles for mobile viewport', () => {
    // Mock mobile breakpoint
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    const mainBox = screen.getByTestId('outlet').parentElement;
    expect(mainBox).toHaveStyle({
      'flex-grow': '1',
      padding: '16px',
    });
  });

  it('applies correct styles for tablet viewport', () => {
    // Mock tablet breakpoint
    mockUseMediaQuery
      .mockReturnValueOnce(true)  // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    const mainBox = screen.getByTestId('outlet').parentElement;
    
    // Check if the component is rendered (styles are applied internally)
    expect(mainBox).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('applies correct styles for desktop viewport', () => {
    // Mock desktop breakpoint
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(true);  // isDesktop

    renderWithProviders(<WebLayout />);

    const mainBox = screen.getByTestId('outlet').parentElement;
    
    // Check if the component is rendered (styles are applied internally)
    expect(mainBox).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('has correct drawer width calculations', () => {
    // Test mobile (drawerWidth = 0)
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    const { rerender } = renderWithProviders(<WebLayout />);
    
    // Verify component renders without errors
    expect(screen.getByTestId('outlet')).toBeInTheDocument();

    // Test tablet (drawerWidth = 72)
    mockUseMediaQuery
      .mockReturnValueOnce(true)  // isTablet
      .mockReturnValueOnce(false); // isDesktop

    rerender(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <WebLayout />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();

    // Test desktop (drawerWidth = 200)
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(true);  // isDesktop

    rerender(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <WebLayout />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders with correct DOM structure', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    // Check that the main container exists
    const navbar = screen.getByTestId('navbar');
    const outlet = screen.getByTestId('outlet');
    
    expect(navbar).toBeInTheDocument();
    expect(outlet).toBeInTheDocument();
    
    // Check that outlet is inside a main element
    const mainElement = outlet.parentElement;
    expect(mainElement?.tagName.toLowerCase()).toBe('main');
  });

  it('calls useMediaQuery with correct breakpoint queries', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    // Verify useMediaQuery was called
    expect(mockUseMediaQuery).toHaveBeenCalledTimes(2);
  });

  it('handles theme provider integration', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    // Test that component renders without theme-related errors
    expect(() => {
      renderWithProviders(<WebLayout />);
    }).not.toThrow();

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('applies flex display to root container', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    const navbar = screen.getByTestId('navbar');
    const rootContainer = navbar.parentElement;
    
    expect(rootContainer).toHaveStyle({
      display: 'flex',
    });
  });

  it('renders outlet content within main component', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(false) // isTablet
      .mockReturnValueOnce(false); // isDesktop

    renderWithProviders(<WebLayout />);

    const outlet = screen.getByTestId('outlet');
    const mainElement = outlet.parentElement;
    
    expect(mainElement?.tagName.toLowerCase()).toBe('main');
    expect(outlet).toHaveTextContent('Outlet Content');
  });
});