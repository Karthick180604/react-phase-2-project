import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import type { Post } from "../../redux/Actions/postsActions";

type PostCardProps = {
  post: Post;
  onLikeHandler: (postId: number, like:boolean) => void;
  onDislikeHandler:(postId: number, like:boolean)=>void
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
  like: boolean;
  dislike:boolean;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeHandler,
  setSelectedPost,
  like,
  dislike,
  onDislikeHandler
}) => {
  return (
    <Card
      sx={{
        mb: 3,
        p: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        boxShadow: 4,
        borderRadius: 3,
      }}
    >
      {/* Left Section */}
      <Box flex={1}>
        <CardContent>
          {/* Avatar + Name */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={post.userImage}
              alt={post.userName}
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              {post.userName}
            </Typography>
          </Stack>

          <Typography variant="h5" sx={{ mt: 2 }}>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {post.body}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            {post.tags.map((tag: string, idx: number) => (
              <Chip
                key={idx}
                label={`#${tag}`}
                size="medium"
                variant="outlined"
                sx={{ fontSize: "0.85rem" }}
              />
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
        sx={{ minWidth: "120px", textAlign: "center", p: 2 }}
      >
        <IconButton onClick={() => onLikeHandler(post.id, like)} size="large">
          {like ? (
            <ThumbUpAltIcon fontSize="medium" />
          ) : (
            <ThumbUpAltOutlinedIcon fontSize="medium" />
          )}
        </IconButton>
        <Typography variant="body1">
          {post.reactions.likes+(like ? 1 : 0)}
        </Typography>

        <IconButton size="large" onClick={() => onDislikeHandler(post.id, dislike)}>
          {dislike ? (
            <ThumbDownAltIcon fontSize="medium" />
          ) : (
            <ThumbDownAltOutlinedIcon fontSize="medium" />
          )}
        </IconButton>

        <Typography variant="body1">{post.reactions.dislikes+(dislike ? 1 : 0)}</Typography>

        <IconButton onClick={() => setSelectedPost(post)} size="large">
          <CommentOutlinedIcon fontSize="medium" />
        </IconButton>
        <Typography variant="body1">Comments</Typography>

        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <VisibilityOutlinedIcon fontSize="medium" />
          <Typography variant="body1">{post.views}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
