import React from 'react';
import { Box, Typography } from '@mui/material';
import UserProfilePostCard from '../UserProfilePostCard/UserProfilePostCard';

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
}

interface UserPostSectionProps {
  posts: Post[];
}

const UserPostSection: React.FC<UserPostSectionProps> = ({ posts }) => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Posts
      </Typography>
      {posts.map((post) => (
        <UserProfilePostCard
          key={post.id}
          id={post.id}
          title={post.title}
          body={post.body}
          tags={post.tags}
        />
      ))}
    </Box>
  );
};

export default UserPostSection;
