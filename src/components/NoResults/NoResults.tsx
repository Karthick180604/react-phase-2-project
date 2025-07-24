import React from 'react';
import { Box, Typography } from '@mui/material';
import noResultsImage from "../../assets/no-results.png"

const NoResults = ({message}:{message:string}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      width="100%"
    >
      <img
        src={noResultsImage}
        alt="No Results Found"
        style={{ width: '220px', maxWidth: '100%', marginBottom: 20 }}
      />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default NoResults;
