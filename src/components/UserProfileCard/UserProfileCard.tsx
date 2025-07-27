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
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }} data-testid="user-profile-card">
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
          data-testid="user-avatar-border"
        >
          <Avatar src={image} sx={{ width: 100, height: 100 }} data-testid="user-avatar" />
        </Box>

        <Typography variant="h6" fontWeight={600} data-testid="user-fullname">
          {fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" data-testid="user-email">
          {email}
        </Typography>
        <Typography variant="body2" color="text.secondary" data-testid="user-contact">
          {phone} | {gender}
        </Typography>
      </Box>

      <Box mt={3} data-testid="user-company-section">
        <Typography variant="subtitle2" color="text.secondary" data-testid="company-label">
          Company
        </Typography>
        <Typography variant="body2" data-testid="company-name">
          {company.name}
        </Typography>
        <Typography variant="body2" data-testid="company-title">
          {company.title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserProfileCard;
