import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const PostCardSmallSkeleton: React.FC = () => {
  return (
    <Card
      data-testid="post-card-skeleton"
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Box
        data-testid="post-card-skeleton-image-box"
        sx={{ width: "100%", pt: "56.25%", position: "relative" }}
      >
        <Skeleton
          data-testid="post-card-skeleton-image"
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ position: "absolute", top: 0, left: 0 }}
        />
      </Box>
      <CardContent data-testid="post-card-skeleton-content">
        <Skeleton
          data-testid="post-card-skeleton-title"
          variant="text"
          width="80%"
          height={30}
        />
        <Skeleton
          data-testid="post-card-skeleton-line1"
          variant="text"
          width="100%"
          height={20}
        />
        <Skeleton
          data-testid="post-card-skeleton-line2"
          variant="text"
          width="60%"
          height={20}
        />
      </CardContent>
    </Card>
  );
};

export default PostCardSmallSkeleton;
