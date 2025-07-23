// src/components/PostCardSmall/PostCardSmall.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

type PostCardSmallProps = {
  title: string;
  body: string;
};

const PostCardSmall: React.FC<PostCardSmallProps> = ({ title, body }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {body.length > 120 ? body.slice(0, 120) + '...' : body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCardSmall;
