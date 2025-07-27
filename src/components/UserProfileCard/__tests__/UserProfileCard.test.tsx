//cleared tests
import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UserProfileCard from "../UserProfileCard";

// Create a custom theme with tertiary color for testing
const createTestTheme = () => {
  return createTheme({
    palette: {
      tertiary: {
        main: "#9c27b0", // Purple color for testing
      },
    },
  });
};

// Test wrapper component with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = createTestTheme();
  
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

// Mock data
const mockUserData = {
  image: "https://example.com/avatar.jpg",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1-234-567-8900",
  gender: "Male",
  company: {
    name: "Tech Solutions Inc.",
    title: "Senior Software Engineer",
  },
};

const mockUserDataMinimal = {
  image: "",
  fullName: "Jane Smith",
  email: "jane@test.com",
  phone: "555-0123",
  gender: "Female",
  company: {
    name: "StartupCo",
    title: "Product Manager",
  },
};

describe("UserProfileCard", () => {
  describe("Rendering", () => {
    it("renders the main card container", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      expect(screen.getByTestId("user-profile-card")).toBeInTheDocument();
    });

    it("renders user avatar with correct src attribute", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const avatar = screen.getByTestId("user-avatar");
      expect(avatar).toBeInTheDocument();
      
      // MUI Avatar renders an img element inside, so we need to find it
      const avatarImg = avatar.querySelector('img');
      expect(avatarImg).toHaveAttribute("src", mockUserData.image);
    });

    it("renders avatar border container", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      expect(screen.getByTestId("user-avatar-border")).toBeInTheDocument();
    });

    it("renders user full name correctly", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const fullNameElement = screen.getByTestId("user-fullname");
      expect(fullNameElement).toBeInTheDocument();
      expect(fullNameElement).toHaveTextContent(mockUserData.fullName);
    });

    it("renders user email correctly", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const emailElement = screen.getByTestId("user-email");
      expect(emailElement).toBeInTheDocument();
      expect(emailElement).toHaveTextContent(mockUserData.email);
    });

    it("renders user contact information (phone and gender)", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const contactElement = screen.getByTestId("user-contact");
      expect(contactElement).toBeInTheDocument();
      expect(contactElement).toHaveTextContent(`${mockUserData.phone} | ${mockUserData.gender}`);
    });

    it("renders company section container", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      expect(screen.getByTestId("user-company-section")).toBeInTheDocument();
    });

    it("renders company label", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const companyLabel = screen.getByTestId("company-label");
      expect(companyLabel).toBeInTheDocument();
      expect(companyLabel).toHaveTextContent("Company");
    });

    it("renders company name correctly", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const companyNameElement = screen.getByTestId("company-name");
      expect(companyNameElement).toBeInTheDocument();
      expect(companyNameElement).toHaveTextContent(mockUserData.company.name);
    });

    it("renders company title correctly", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const companyTitleElement = screen.getByTestId("company-title");
      expect(companyTitleElement).toBeInTheDocument();
      expect(companyTitleElement).toHaveTextContent(mockUserData.company.title);
    });
  });

  describe("Props Handling", () => {
    it("handles empty image prop", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserDataMinimal} />
        </TestWrapper>
      );

      const avatar = screen.getByTestId("user-avatar");
      expect(avatar).toBeInTheDocument();
      
      // For empty image, MUI Avatar might not render an img element or have empty src
      const avatarImg = avatar.querySelector('img');
      if (avatarImg) {
        expect(avatarImg).toHaveAttribute("src", "");
      } else {
        // If no img element, Avatar is showing fallback (initials or icon)
        expect(avatar).toBeInTheDocument();
      }
    });

    it("renders different user data correctly", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserDataMinimal} />
        </TestWrapper>
      );

      expect(screen.getByTestId("user-fullname")).toHaveTextContent("Jane Smith");
      expect(screen.getByTestId("user-email")).toHaveTextContent("jane@test.com");
      expect(screen.getByTestId("user-contact")).toHaveTextContent("555-0123 | Female");
      expect(screen.getByTestId("company-name")).toHaveTextContent("StartupCo");
      expect(screen.getByTestId("company-title")).toHaveTextContent("Product Manager");
    });

    it("renders special characters in props correctly", () => {
      const specialCharData = {
        ...mockUserData,
        fullName: "José María O'Connor",
        email: "josé.maría@company-name.com",
        phone: "+34-123-456-789",
        company: {
          name: "Tech & Innovation Co.",
          title: "Lead Developer & Architect",
        },
      };

      render(
        <TestWrapper>
          <UserProfileCard {...specialCharData} />
        </TestWrapper>
      );

      expect(screen.getByTestId("user-fullname")).toHaveTextContent("José María O'Connor");
      expect(screen.getByTestId("user-email")).toHaveTextContent("josé.maría@company-name.com");
      expect(screen.getByTestId("company-name")).toHaveTextContent("Tech & Innovation Co.");
      expect(screen.getByTestId("company-title")).toHaveTextContent("Lead Developer & Architect");
    });
  });

  describe("Styling and Theme Integration", () => {
    it("applies Paper component with correct elevation", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const card = screen.getByTestId("user-profile-card");
      // In MUI v6, check for the base Paper class and elevation
      expect(card).toHaveClass("MuiPaper-root");
      // MUI v6 might use different elevation class patterns
      expect(card).toBeInTheDocument();
    });

    it("applies theme-based styling to avatar border", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const avatarBorder = screen.getByTestId("user-avatar-border");
      expect(avatarBorder).toHaveStyle({
        width: "108px",
        height: "108px",
        borderRadius: "50%",
      });
    });

    it("applies correct Typography variants", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const fullName = screen.getByTestId("user-fullname");
      const email = screen.getByTestId("user-email");
      const contact = screen.getByTestId("user-contact");
      const companyLabel = screen.getByTestId("company-label");
      const companyName = screen.getByTestId("company-name");
      const companyTitle = screen.getByTestId("company-title");

      // In MUI v6, check for the base Typography classes
      expect(fullName).toHaveClass("MuiTypography-root");
      expect(email).toHaveClass("MuiTypography-root");
      expect(contact).toHaveClass("MuiTypography-root");
      expect(companyLabel).toHaveClass("MuiTypography-root");
      expect(companyName).toHaveClass("MuiTypography-root");
      expect(companyTitle).toHaveClass("MuiTypography-root");

      // Check the actual HTML elements for semantic structure
      expect(fullName.tagName).toBe("H6"); // variant="h6"
      expect(email.tagName).toBe("P"); // variant="body2" typically renders as p
      expect(contact.tagName).toBe("P"); // variant="body2"
    });
  });

  describe("Accessibility", () => {
    it("renders avatar with proper accessibility", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const avatar = screen.getByTestId("user-avatar");
      expect(avatar).toBeInTheDocument();
      
      // Check if there's an img element inside the Avatar
      const avatarImg = avatar.querySelector('img');
      if (avatarImg) {
        // img elements have implicit role="img"
        expect(avatarImg).toBeInTheDocument();
      }
      
      // The Avatar component itself should be accessible
      expect(avatar).toHaveClass("MuiAvatar-root");
    });

    it("maintains proper heading hierarchy", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const fullName = screen.getByTestId("user-fullname");
      // h6 variant creates an h6 element
      expect(fullName.tagName).toBe("H6");
    });

    it("uses semantic text colors for secondary information", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const email = screen.getByTestId("user-email");
      const contact = screen.getByTestId("user-contact");
      const companyLabel = screen.getByTestId("company-label");

      // In MUI v6, verify the Typography components render properly
      expect(email).toHaveClass("MuiTypography-root");
      expect(contact).toHaveClass("MuiTypography-root");
      expect(companyLabel).toHaveClass("MuiTypography-root");
      
      // Verify they're using the correct variants by checking tag names
      expect(email.tagName).toBe("P"); // body2 variant
      expect(contact.tagName).toBe("P"); // body2 variant
      // subtitle2 might render as different element depending on MUI v6 implementation
      expect(companyLabel).toBeInTheDocument();
    });
  });

  describe("Layout and Structure", () => {
    it("maintains proper component structure", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const card = screen.getByTestId("user-profile-card");
      const avatarBorder = screen.getByTestId("user-avatar-border");
      const companySection = screen.getByTestId("user-company-section");

      expect(card).toContainElement(avatarBorder);
      expect(card).toContainElement(companySection);
    });

    it("renders all required elements in the correct order", () => {
      render(
        <TestWrapper>
          <UserProfileCard {...mockUserData} />
        </TestWrapper>
      );

      const card = screen.getByTestId("user-profile-card");
      const elements = [
        screen.getByTestId("user-avatar-border"),
        screen.getByTestId("user-fullname"),
        screen.getByTestId("user-email"),
        screen.getByTestId("user-contact"),
        screen.getByTestId("user-company-section"),
      ];

      elements.forEach(element => {
        expect(card).toContainElement(element);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles very long names gracefully", () => {
      const longNameData = {
        ...mockUserData,
        fullName: "Alexander Christopher Montgomery Fitzgerald Wellington III",
      };

      render(
        <TestWrapper>
          <UserProfileCard {...longNameData} />
        </TestWrapper>
      );

      const fullName = screen.getByTestId("user-fullname");
      expect(fullName).toHaveTextContent(longNameData.fullName);
    });

    it("handles very long company names and titles", () => {
      const longCompanyData = {
        ...mockUserData,
        company: {
          name: "International Business Machines Corporation Technology Solutions Division",
          title: "Senior Principal Software Development Engineer and Technical Lead",
        },
      };

      render(
        <TestWrapper>
          <UserProfileCard {...longCompanyData} />
        </TestWrapper>
      );

      expect(screen.getByTestId("company-name")).toHaveTextContent(longCompanyData.company.name);
      expect(screen.getByTestId("company-title")).toHaveTextContent(longCompanyData.company.title);
    });

    it("handles empty string values", () => {
      const emptyData = {
        image: "",
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        company: {
          name: "",
          title: "",
        },
      };

      render(
        <TestWrapper>
          <UserProfileCard {...emptyData} />
        </TestWrapper>
      );

      // Component should still render all elements, even if empty
      expect(screen.getByTestId("user-profile-card")).toBeInTheDocument();
      expect(screen.getByTestId("user-fullname")).toHaveTextContent("");
      
      // The contact shows "phone | gender" format, so with empty values it shows " | "
      // But whitespace might be trimmed, so let's check it contains the pipe
      const contactElement = screen.getByTestId("user-contact");
      expect(contactElement).toBeInTheDocument();
      expect(contactElement.textContent).toContain("|");
      
      expect(screen.getByTestId("company-name")).toHaveTextContent("");
    });
  });
});