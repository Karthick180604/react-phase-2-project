import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ApiErrorImage from "../../assets/ApiErrorImage.png";
import { useDispatch } from "react-redux";
import { setApiError } from "../../redux/Actions/errorAction";

const ApiError: React.FC = () => {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(setApiError(false));
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
      data-testid="api-error-root"
    >
      <Box
        component="img"
        src={ApiErrorImage}
        alt="Error"
        sx={{ width: 250, mb: 3 }}
        data-testid="api-error-image"
      />

      <ErrorOutlineIcon
        color="error"
        sx={{ fontSize: 50, mb: 1 }}
        data-testid="api-error-icon"
      />
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        data-testid="api-error-heading"
      >
        Something went wrong
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
        data-testid="api-error-subtext"
      >
        Please try refreshing the page.
      </Typography>

      <Button
        variant="contained"
        color="tertiary"
        onClick={handleRefresh}
        sx={{ mt: 2, textTransform: "none" }}
        data-testid="api-error-refresh-btn"
      >
        Refresh
      </Button>
    </Box>
  );
};

export default ApiError;
