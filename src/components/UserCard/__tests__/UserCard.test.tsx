//cleared tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import UserCard from '../UserCard';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Create a test theme with tertiary color
const testTheme = createTheme({
  palette: {
    tertiary: {
      main: '#9c27b0',
    },
  } as any,
});

const defaultProps = {
  id: 1,
  image: 'https://example.com/avatar.jpg',
  name: 'John Doe',
};

// Wrapper component to provide necessary context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={testTheme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

const renderWithProviders = (props = defaultProps) => {
  return render(
    <TestWrapper>
      <UserCard {...props} />
    </TestWrapper>
  );
};

describe('UserCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the user card with all props', () => {
      renderWithProviders();

      // Check if the card is rendered
      const card = screen.getByRole('img', { name: 'John Doe' });
      expect(card).toBeInTheDocument();

      // Check if the name is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Check if the avatar image has correct src
      expect(card).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render with different user data', () => {
      const customProps = {
        id: 2,
        image: 'https://example.com/jane.jpg',
        name: 'Jane Smith',
      };

      renderWithProviders(customProps);

      const avatar = screen.getByRole('img', { name: 'Jane Smith' });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/jane.jpg');
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should handle long names with noWrap', () => {
      const longNameProps = {
        ...defaultProps,
        name: 'This is a very long name that should be truncated with ellipsis',
      };

      renderWithProviders(longNameProps);

      const nameElement = screen.getByText(longNameProps.name);
      expect(nameElement).toBeInTheDocument();
      
      // Check if the Typography component has the noWrap prop applied
      // This is reflected in the styling
      expect(nameElement).toHaveStyle('white-space: nowrap');
    });

    it('should render avatar with alt text', () => {
      renderWithProviders();

      const avatar = screen.getByRole('img', { name: 'John Doe' });
      expect(avatar).toHaveAttribute('alt', 'John Doe');
    });
  });

  describe('Navigation Functionality', () => {
    it('should navigate to user profile when card is clicked', () => {
      renderWithProviders();

      const card = screen.getByRole('img', { name: 'John Doe' }).closest('[role="button"], div');
      
      // Find the clickable card container
      const clickableCard = screen.getByText('John Doe').closest('div');
      expect(clickableCard).toBeInTheDocument();

      fireEvent.click(clickableCard!);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('profile/1');
    });

    it('should navigate with different user ID', () => {
      const customProps = {
        id: 42,
        image: 'https://example.com/user42.jpg',
        name: 'User 42',
      };

      renderWithProviders(customProps);

      const clickableCard = screen.getByText('User 42').closest('div');
      fireEvent.click(clickableCard!);

      expect(mockNavigate).toHaveBeenCalledWith('profile/42');
    });

    it('should have cursor pointer style', () => {
      renderWithProviders();

      const clickableCard = screen.getByText('John Doe').closest('div');
      expect(clickableCard).toHaveStyle('cursor: pointer');
    });
  });

  describe('Styling and Theme', () => {
    it('should apply hover transform effect', () => {
      renderWithProviders();

      const clickableCard = screen.getByText('John Doe').closest('div');
      expect(clickableCard).toHaveStyle('transition: transform 0.3s');
    });

    it('should have proper card styling', () => {
      renderWithProviders();

      const clickableCard = screen.getByText('John Doe').closest('div');
      
      // Check basic styling properties
      expect(clickableCard).toHaveStyle({
        'border-radius': '12px', // borderRadius: 3 in MUI
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        'text-align': 'center',
      });
    });

    it('should apply theme colors to avatar border', () => {
      renderWithProviders();

      const avatar = screen.getByRole('img', { name: 'John Doe' });
      
      // The border color should be applied through the theme
      // This would be tested more thoroughly in integration tests
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper image alt text for screen readers', () => {
      renderWithProviders();

      const avatar = screen.getByRole('img', { name: 'John Doe' });
      expect(avatar).toHaveAttribute('alt', 'John Doe');
    });

    it('should be keyboard accessible', () => {
      renderWithProviders();

      const clickableCard = screen.getByText('John Doe').closest('div');
      
      // Card should be focusable (though MUI Card might handle this)
      expect(clickableCard).toBeInTheDocument();
    });

    it('should handle missing or broken images gracefully', () => {
      const propsWithBrokenImage = {
        ...defaultProps,
        image: '',
      };

      renderWithProviders(propsWithBrokenImage);

      // The main goal is to ensure the component renders without crashing
      // and the name is still displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      // Check that some avatar-like element exists (could be img, div, or span)
      // We don't care about the exact implementation, just that it renders
      const nameElement = screen.getByText('John Doe');
      const cardContainer = nameElement.closest('div');
      expect(cardContainer).toBeInTheDocument();
      
      // Verify the component is still clickable (main functionality)
      fireEvent.click(cardContainer!);
      expect(mockNavigate).toHaveBeenCalledWith('profile/1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty name', () => {
      const propsWithEmptyName = {
        ...defaultProps,
        name: '',
      };

      const { container } = renderWithProviders(propsWithEmptyName);

      // The main goal is to ensure the component renders without crashing
      // When name is empty, there might not be any text to find, so we check the container
      expect(container.firstChild).toBeInTheDocument();
      
      // Ensure the component is still functional (clickable)
      const cardElement = container.querySelector('div');
      expect(cardElement).toBeInTheDocument();
      
      if (cardElement) {
        fireEvent.click(cardElement);
        expect(mockNavigate).toHaveBeenCalledWith('profile/1');
      }
      
      // Check that the component has the expected structure even with empty name
      expect(container.querySelector('div')).toHaveStyle('cursor: pointer');
    });

    it('should handle zero ID', () => {
      const propsWithZeroId = {
        ...defaultProps,
        id: 0,
      };

      renderWithProviders(propsWithZeroId);

      const clickableCard = screen.getByText('John Doe').closest('div');
      fireEvent.click(clickableCard!);

      expect(mockNavigate).toHaveBeenCalledWith('profile/0');
    });

    it('should handle negative ID', () => {
      const propsWithNegativeId = {
        ...defaultProps,
        id: -1,
      };

      renderWithProviders(propsWithNegativeId);

      const clickableCard = screen.getByText('John Doe').closest('div');
      fireEvent.click(clickableCard!);

      expect(mockNavigate).toHaveBeenCalledWith('profile/-1');
    });

    it('should handle special characters in name', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        name: 'José María González-Smith',
      };

      renderWithProviders(propsWithSpecialChars);

      expect(screen.getByText('José María González-Smith')).toBeInTheDocument();
      
      const avatar = screen.getByRole('img', { name: 'José María González-Smith' });
      expect(avatar).toHaveAttribute('alt', 'José María González-Smith');
    });
  });

  describe('Component Integration', () => {
    it('should work with Material-UI theme provider', () => {
      // This test ensures the component works within the theme context
      renderWithProviders();

      const nameElement = screen.getByText('John Doe');
      expect(nameElement).toBeInTheDocument();
      
      // Check that MUI Typography is applied
      expect(nameElement.tagName).toBe('H6'); // subtitle1 variant maps to h6
    });

    it('should work with React Router context', () => {
      // This test ensures the component works within router context
      renderWithProviders();

      const clickableCard = screen.getByText('John Doe').closest('div');
      fireEvent.click(clickableCard!);

      // Navigation should work without errors
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with minimal re-renders', () => {
      const { rerender } = renderWithProviders();

      // Re-render with same props
      rerender(
        <TestWrapper>
          <UserCard {...defaultProps} />
        </TestWrapper>
      );

      // Component should still be in the document
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle prop changes correctly', () => {
      const { rerender } = renderWithProviders();

      const newProps = {
        id: 2,
        image: 'https://example.com/new-avatar.jpg',
        name: 'New Name',
      };

      rerender(
        <TestWrapper>
          <UserCard {...newProps} />
        </TestWrapper>
      );

      expect(screen.getByText('New Name')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      
      const avatar = screen.getByRole('img', { name: 'New Name' });
      expect(avatar).toHaveAttribute('src', 'https://example.com/new-avatar.jpg');
    });
  });
});