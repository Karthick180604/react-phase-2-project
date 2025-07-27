import React from "react";
import { Paper, Typography, Chip, Stack } from "@mui/material";

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  onClick: () => void;
}

const UserProfilePostCard: React.FC<Post> = ({
  title,
  body,
  tags,
  onClick,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{ p: 2, borderRadius: 2, mb: 2 }}
      onClick={onClick}
      data-testid="user-profile-post-card"
    >
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        data-testid="post-title"
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        data-testid="post-body"
      >
        {body}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        data-testid="post-tags-stack"
      >
        {tags.map((tag, idx) => (
          <Chip
            key={idx}
            label={`#${tag}`}
            variant="outlined"
            size="small"
            data-testid={`post-tag-${idx}`}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default UserProfilePostCard;
