// src/components/AuthAssets/LoginImageMockup.tsx

import { Box } from "@mui/material";
import React from "react";
import socialMediaImage from "../../assets/socialMediaPng.png"; // Make sure the image exists here

const AuthImage = () => {
  return (
    <Box
      component="img"
      src={socialMediaImage}
      alt="Connectify App Preview"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
};

export default AuthImage;
