import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const PostCardSkeleton: React.FC = () => {
  return (
    <Card sx={{ mb: 2, p: 2, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
      {/* Left Section */}
      <Box flex={1}>
        <CardContent>
          <Skeleton animation="wave" variant="text" width={100} height={20} />
          <Skeleton animation="wave" variant="text" width="80%" height={28} sx={{ mt: 1 }} />
          <Skeleton animation="wave" variant="text" width="100%" height={60} sx={{ mt: 1 }} />
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton animation="wave" key={idx} variant="rounded" width={60} height={24} />
            ))}
          </Stack>
        </CardContent>
      </Box>

      {/* Right Section */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        sx={{ minWidth: "100px", textAlign: "center", p: 1 }}
      >
        <IconButton disabled>
          <ThumbUpAltOutlinedIcon fontSize="small" />
        </IconButton>
        <Skeleton animation="wave" variant="text" width={20} height={20} />

        <IconButton disabled>
          <ThumbDownAltOutlinedIcon fontSize="small" />
        </IconButton>
        <Skeleton animation="wave" variant="text" width={20} height={20} />

        <IconButton disabled>
          <CommentOutlinedIcon fontSize="small" />
        </IconButton>
        <Skeleton animation="wave" variant="text" width={50} height={20} />

        <Box mt={1} display="flex" alignItems="center" gap={0.5}>
          <VisibilityOutlinedIcon fontSize="small" />
          <Skeleton animation="wave" variant="text" width={30} height={20} />
        </Box>
      </Box>
    </Card>
  );
};

export default PostCardSkeleton;
