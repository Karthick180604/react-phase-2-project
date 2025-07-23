import React from 'react';
import { Paper, Typography, Box, Chip, Stack } from '@mui/material';

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  onClick: () => void;
}

const UserProfilePostCard: React.FC<Post> = ({ title, body, tags, onClick }) => {
  return (
    <Paper 
    elevation={2} 
    sx={{ p: 2, borderRadius: 2, mb: 2 }} 
    onClick={onClick}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {body}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {tags.map((tag, idx) => (
          <Chip key={idx} label={`#${tag}`} variant="outlined" size="small" />
        ))}
      </Stack>
    </Paper>
  );
};

export default UserProfilePostCard;
