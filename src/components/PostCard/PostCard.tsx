import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Box,
  Avatar,
  CardMedia,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import type { Post } from "../../redux/Actions/postsActions";

type PostCardProps = {
  post: Post;
  onLikeHandler: (postId: number, like: boolean) => void;
  onDislikeHandler: (postId: number, dislike: boolean) => void;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
  like: boolean;
  dislike: boolean;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeHandler,
  onDislikeHandler,
  setSelectedPost,
  like,
  dislike,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const randomImage = `https://picsum.photos/seed/${post.id}/300/200`;
    setImageUrl(randomImage);
  }, [post.id]);

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
      {/* Left: Image + Actions */}
      <Box
        sx={{
          width: { xs: "100%", sm: 300 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "grey.100",
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Post Image"
          sx={{ height: 210, objectFit: "cover" }}
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
        >
          <Box textAlign="center">
            <IconButton onClick={() => onLikeHandler(post.id, like)}>
              {like ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
            </IconButton>
            <Typography variant="caption">
              {post.reactions.likes + (like ? 1 : 0)}
            </Typography>
          </Box>

          <Box textAlign="center">
            <IconButton onClick={() => onDislikeHandler(post.id, dislike)}>
              {dislike ? <ThumbDownAltIcon /> : <ThumbDownAltOutlinedIcon />}
            </IconButton>
            <Typography variant="caption">
              {post.reactions.dislikes + (dislike ? 1 : 0)}
            </Typography>
          </Box>

          <Box textAlign="center">
            <IconButton onClick={() => setSelectedPost(post)}>
              <CommentOutlinedIcon />
            </IconButton>
            <Typography variant="caption">Comments</Typography>
          </Box>

          <Box textAlign="center" display="flex" alignItems="center" gap={0.5}>
            <VisibilityOutlinedIcon fontSize="small" />
            <Typography variant="caption">{post.views}</Typography>
          </Box>
        </Stack>
      </Box>

      {/* Right: Content */}
      <Box flex={1}>
        <CardContent>
          {/* User Info */}
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Avatar
              src={post.image}
              alt={post.username}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {post.username}
            </Typography>
          </Stack>

          {/* Title & Body */}
          <Typography variant="h6" gutterBottom>
            {post.title}
          </Typography>
          <Box
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'text.secondary',
                typography: 'body2',
                mb: 1,
              }}
            >
              {post.body}
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'inline-block',
              }}
              onClick={() => setSelectedPost(post)}
            >
              Read more
            </Typography>


          {/* Tags */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PostCard;
