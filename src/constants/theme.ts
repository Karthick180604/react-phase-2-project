import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F5F5F5",
      contrastText: "#2C3E50",
    },
    secondary: {
      main: "#2C3E50",
      contrastText: "#FFFFFF",
    },
    tertiary: {
      main: "#1ABC9C",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FAFAFA",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
