import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const PostCardSmallSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ width: "100%", pt: "56.25%", position: "relative" }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ position: "absolute", top: 0, left: 0 }}
        />
      </Box>
      <CardContent>
        <Skeleton variant="text" width="80%" height={30} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="60%" height={20} />
      </CardContent>
    </Card>
  );
};

export default PostCardSmallSkeleton;
