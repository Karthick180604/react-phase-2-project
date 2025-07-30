import React from "react";
import { Box, Typography } from "@mui/material";
import noPostsImage from "../../assets/no-posts.png";

const NoPosts = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      mt={5}
    >
      <img
        src={noPostsImage}
        alt="No posts"
        style={{ width: "150px", maxWidth: "100%" }}
      />
      <Typography variant="h6" mt={2} color="text.secondary">
        No posts yet
      </Typography>
    </Box>
  );
};

export default NoPosts;
