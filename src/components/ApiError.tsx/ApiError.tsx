import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ApiError: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      textAlign="center"
      px={2}
    >
      <Box
        component="img"
        src="https://illustrations.popsy.co/gray/error.svg"
        alt="Error"
        sx={{ width: 250, mb: 3 }}
      />

      <ErrorOutlineIcon color="error" sx={{ fontSize: 50, mb: 1 }} />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Please try refreshing the page.
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleRefresh}
        sx={{ mt: 2, textTransform: "none" }}
      >
        Refresh
      </Button>
    </Box>
  );
};

export default ApiError;
