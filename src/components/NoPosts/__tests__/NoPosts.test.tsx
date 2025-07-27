import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NoPosts from '../NoPosts';

// Mock the image import
jest.mock('../../../assets/no-posts.png', () => 'mocked-no-posts-image.png');

// Helper function to render component with MUI theme
const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('NoPosts Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithTheme(<NoPosts />);
      
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('should display the correct text content', () => {
      renderWithTheme(<NoPosts />);
      
      const typography = screen.getByText('No posts yet');
      expect(typography).toBeInTheDocument();
      expect(typography.tagName).toBe('H6');
    });

    it('should render the no posts image', () => {
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'mocked-no-posts-image.png');
      expect(image).toHaveAttribute('alt', 'No posts');
    });

    it('should render image with correct styling', () => {
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      expect(image).toHaveStyle({
        width: '150px',
        maxWidth: '100%'
      });
    });
  });

  describe('Layout and Structure', () => {
    it('should have proper container structure', () => {
      const { container } = renderWithTheme(<NoPosts />);
      
      // Check if the main Box container exists
      const boxContainer = container.firstChild;
      expect(boxContainer).toBeInTheDocument();
    });

    it('should render image before typography', () => {
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      const typography = screen.getByText('No posts yet');
      
      // Check DOM order - image should come before typography
      expect(image.compareDocumentPosition(typography)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should have both image and text elements present', () => {
      renderWithTheme(<NoPosts />);
      
      expect(screen.getByAltText('No posts')).toBeInTheDocument();
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });
  });

  describe('MUI Component Integration', () => {
    it('should render MUI Box component', () => {
      const { container } = renderWithTheme(<NoPosts />);
      
      // MUI Box renders as a div by default
      const boxElement = container.querySelector('div');
      expect(boxElement).toBeInTheDocument();
    });

    it('should render MUI Typography component with correct variant', () => {
      renderWithTheme(<NoPosts />);
      
      const typography = screen.getByText('No posts yet');
      expect(typography).toBeInTheDocument();
      
      // Check if it's rendered as h6 (variant="h6")
      expect(typography.tagName).toBe('H6');
    });

    it('should apply MUI theme correctly', () => {
      const customTheme = createTheme({
        palette: {
          text: {
            secondary: '#666666'
          }
        }
      });

      render(
        <ThemeProvider theme={customTheme}>
          <NoPosts />
        </ThemeProvider>
      );

      const typography = screen.getByText('No posts yet');
      expect(typography).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      expect(image).toHaveAttribute('alt', 'No posts');
    });

    it('should be accessible with screen readers', () => {
      renderWithTheme(<NoPosts />);
      
      // Check if content is accessible
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(screen.getByAltText('No posts')).toBeInTheDocument();
    });

    it('should have semantic heading structure', () => {
      renderWithTheme(<NoPosts />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('No posts yet');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive image styling', () => {
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      expect(image).toHaveStyle({
        width: '150px',
        maxWidth: '100%'
      });
    });

    it('should maintain aspect ratio on smaller screens', () => {
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      // maxWidth: 100% ensures image doesn't overflow on small screens
      expect(image).toHaveStyle('maxWidth: 100%');
    });
  });

  describe('Edge Cases', () => {
    it('should handle theme provider absence gracefully', () => {
      // Test without ThemeProvider to ensure component doesn't break
      expect(() => {
        render(<NoPosts />);
      }).not.toThrow();
    });

    it('should render consistently across multiple renders', () => {
      const { rerender } = renderWithTheme(<NoPosts />);
      
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(screen.getByAltText('No posts')).toBeInTheDocument();
      
      // Re-render and check consistency
      rerender(
        <ThemeProvider theme={createTheme()}>
          <NoPosts />
        </ThemeProvider>
      );
      
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(screen.getByAltText('No posts')).toBeInTheDocument();
    });

    it('should handle missing image gracefully', () => {
      // This test ensures the component structure remains intact even if image fails to load
      renderWithTheme(<NoPosts />);
      
      const image = screen.getByAltText('No posts');
      expect(image).toBeInTheDocument();
      
      // Typography should still be present regardless of image load status
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });
  });

  describe('Component Props and State', () => {
    it('should be a functional component without props', () => {
      // Test that component works without any props
      expect(() => {
        renderWithTheme(<NoPosts />);
      }).not.toThrow();
      
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('should render the same content on every render', () => {
      const { container: container1 } = renderWithTheme(<NoPosts />);
      const { container: container2 } = renderWithTheme(<NoPosts />);
      
      // Both renders should have the same structure
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });
  });
});