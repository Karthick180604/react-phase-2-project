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
import {
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
  ThumbDownAlt,
  CommentOutlined,
  VisibilityOutlined,
  ThumbUpAlt,
} from "@mui/icons-material";
import type { Post } from "../../redux/Actions/postsActions";
import { Link } from "react-router-dom";
import "./PostCard.css";

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
      data-testid="post-card"
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
          data-testid="post-image"
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
            <IconButton
              onClick={() => onLikeHandler(post.id, like)}
              data-testid="like-button"
            >
              {like ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
            </IconButton>
            <Typography variant="caption" data-testid="like-count">
              {post.reactions.likes + (like ? 1 : 0)}
            </Typography>
          </Box>

          <Box textAlign="center">
            <IconButton
              onClick={() => onDislikeHandler(post.id, dislike)}
              data-testid="dislike-button"
            >
              {dislike ? <ThumbDownAlt /> : <ThumbDownAltOutlined />}
            </IconButton>
            <Typography variant="caption" data-testid="dislike-count">
              {post.reactions.dislikes + (dislike ? 1 : 0)}
            </Typography>
          </Box>

          <Box textAlign="center">
            <IconButton
              onClick={() => setSelectedPost(post)}
              data-testid="comment-button"
            >
              <CommentOutlined />
            </IconButton>
            <Typography variant="caption">Comments</Typography>
          </Box>

          <Box textAlign="center" display="flex" alignItems="center" gap={0.5}>
            <VisibilityOutlined fontSize="small" />
            <Typography variant="caption" data-testid="view-count">
              {post.views}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box flex={1}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Link
              to={`/home/search/profile/${post.userId}`}
              className="link-tag"
              data-testid="user-link"
            >
              <Avatar
                src={post.image}
                alt={post.username}
                sx={{ width: 40, height: 40 }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                {post.username}
              </Typography>
            </Link>
          </Stack>

          <Typography variant="h6" gutterBottom data-testid="post-title">
            {post.title}
          </Typography>

          <Box
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "text.secondary",
              typography: "body2",
              mb: 1,
            }}
            data-testid="post-body"
          >
            {post.body}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              cursor: "pointer",
              fontWeight: 500,
              display: "inline-block",
            }}
            onClick={() => setSelectedPost(post)}
            data-testid="read-more"
          >
            Read more
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            mt={2}
            flexWrap="wrap"
            data-testid="post-tags"
          >
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
