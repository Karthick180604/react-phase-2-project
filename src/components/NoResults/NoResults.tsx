import { Box, Typography } from "@mui/material";
import noResultsImage from "../../assets/no-results.png";

const NoResults = ({ message }: { message: string }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      width="100%"
      data-testid="no-results-container"
    >
      <img
        src={noResultsImage}
        alt="No Results Found"
        style={{ width: "220px", maxWidth: "100%", marginBottom: 20 }}
        data-testid="no-results-image"
      />
      <Typography
        variant="h6"
        color="text.secondary"
        data-testid="no-results-message"
      >
        {message}
      </Typography>
    </Box>
  );
};

export default NoResults;
