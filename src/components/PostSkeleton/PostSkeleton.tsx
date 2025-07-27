import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const PostCardSkeleton: React.FC = () => {
  return (
    <Card
      data-testid="post-card-skeleton"
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        boxShadow: 4,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        data-testid="skeleton-media-section"
        sx={{
          width: { xs: "100%", sm: 300 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "grey.100",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={210}
          data-testid="skeleton-image"
        />

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
          data-testid="skeleton-actions"
        >
          {[1, 2, 3].map((_, idx) => (
            <Box key={idx} textAlign="center" data-testid={`skeleton-action-${idx}`}>
              <IconButton disabled data-testid={`skeleton-icon-${idx}`}>
                {idx === 0 && <ThumbUpAltOutlinedIcon />}
                {idx === 1 && <ThumbDownAltOutlinedIcon />}
                {idx === 2 && <CommentOutlinedIcon />}
              </IconButton>
              <Skeleton variant="text" width={30} height={16} />
            </Box>
          ))}
          <Box
            data-testid="skeleton-views"
            textAlign="center"
            display="flex"
            alignItems="center"
            gap={0.5}
          >
            <VisibilityOutlinedIcon fontSize="small" />
            <Skeleton variant="text" width={30} height={16} />
          </Box>
        </Stack>
      </Box>

      <Box flex={1} data-testid="skeleton-content-section">
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Skeleton variant="circular" data-testid="skeleton-avatar">
              <Avatar sx={{ width: 40, height: 40 }} />
            </Skeleton>
            <Skeleton variant="text" width={100} height={20} />
          </Stack>

          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="100%" height={20} sx={{ my: 0.5 }} />
          <Skeleton variant="text" width="95%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />

          <Skeleton variant="text" width={80} height={20} sx={{ mt: 1 }} />

          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" data-testid="skeleton-tags">
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
