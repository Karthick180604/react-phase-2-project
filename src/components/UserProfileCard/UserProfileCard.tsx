import React from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';

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
  company
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box textAlign="center">
        <Avatar src={image} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
        <Typography variant="h6" fontWeight={600}>{fullName}</Typography>
        <Typography variant="body2" color="text.secondary">{email}</Typography>
        <Typography variant="body2" color="text.secondary">{phone} | {gender}</Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="subtitle2" color="text.secondary">Company</Typography>
        <Typography variant="body2">{company.name}</Typography>
        <Typography variant="body2">{company.title}</Typography>
      </Box>
    </Paper>
  );
};

export default UserProfileCard;
