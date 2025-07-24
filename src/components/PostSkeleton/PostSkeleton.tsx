import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Box,
  Avatar,
  Chip,
  IconButton,
  Typography,
  CardMedia,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const PostCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        boxShadow: 4,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Left: Image & Actions */}
      <Box
        sx={{
          width: { xs: "100%", sm: 300 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "grey.100",
        }}
      >
        {/* Image Placeholder */}
        <Skeleton variant="rectangular" width="100%" height={210} />

        {/* Reactions */}
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{
            py: 1.5,
            px: 1,
            bgcolor: "background.paper",
            borderTop: "1px solid #eee",
          }}
        >
          {[1, 2, 3].map((_, idx) => (
            <Box key={idx} textAlign="center">
              <IconButton disabled>
                {idx === 0 && <ThumbUpAltOutlinedIcon />}
                {idx === 1 && <ThumbDownAltOutlinedIcon />}
                {idx === 2 && <CommentOutlinedIcon />}
              </IconButton>
              <Skeleton variant="text" width={30} height={16} sx={{ mx: "auto" }} />
            </Box>
          ))}
          <Box textAlign="center" display="flex" alignItems="center" gap={0.5}>
            <VisibilityOutlinedIcon fontSize="small" />
            <Skeleton variant="text" width={30} height={16} />
          </Box>
        </Stack>
      </Box>

      {/* Right: Content */}
      <Box flex={1}>
        <CardContent>
          {/* User Info */}
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Skeleton variant="circular">
              <Avatar sx={{ width: 40, height: 40 }} />
            </Skeleton>
            <Skeleton variant="text" width={100} height={20} />
          </Stack>

          {/* Title & Body */}
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="100%" height={20} sx={{ my: 0.5 }} />
          <Skeleton variant="text" width="95%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />

          <Skeleton variant="text" width={80} height={20} sx={{ mt: 1 }} />

          {/* Tags */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={60} height={24} />
            ))}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PostCardSkeleton;
