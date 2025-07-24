
import { Box } from "@mui/material";
import socialMediaImage from "../../assets/socialMediaPng.png";

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
