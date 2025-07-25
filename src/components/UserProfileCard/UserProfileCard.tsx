import React from "react";
import { Avatar, Box, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface UserProfileCardProps {
  image: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  company: {
    name: string;
    title: string;
  };
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  image,
  fullName,
  email,
  phone,
  gender,
  company,
}) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box textAlign="center">
        <Box
          sx={{
            width: 108,
            height: 108,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            border: `4px solid ${theme.palette.tertiary.main}`,
            boxShadow: `0 0 10px ${theme.palette.tertiary.main}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar src={image} sx={{ width: 100, height: 100 }} />
        </Box>

        <Typography variant="h6" fontWeight={600}>
          {fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {phone} | {gender}
        </Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="subtitle2" color="text.secondary">
          Company
        </Typography>
        <Typography variant="body2">{company.name}</Typography>
        <Typography variant="body2">{company.title}</Typography>
      </Box>
    </Paper>
  );
};

export default UserProfileCard;
