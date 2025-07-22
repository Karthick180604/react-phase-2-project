import React from "react";
import { Card, CardContent, Typography, Grid, Chip, Stack, IconButton, Box } from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { Post } from "../../redux/Actions/postsActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

type PostCardProps = {
  post: Post;
  onLikeHandler:(postId:number)=>void;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
  like:boolean;
};

const PostCard: React.FC<PostCardProps> = ({ post , onLikeHandler, setSelectedPost, like}) => {
  return (
    <Card sx={{ mb: 2, p: 2, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
      {/* Left Section */}
      <Box flex={1}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            {post.userName}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {post.body}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {post.tags.map((tag:string, idx:number) => (
              <Chip key={idx} label={`#${tag}`} size="small" variant="outlined" />
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
        <IconButton onClick={() => onLikeHandler(post.id)}>
          {like ? (
            <ThumbUpAltIcon fontSize="small" />
          ) : (
            <ThumbUpAltOutlinedIcon fontSize="small" />
          )}
        </IconButton>
        <Typography variant="body2">{post.reactions.likes+(like ? 1 : 0)}</Typography>

        <IconButton>
          <ThumbDownAltOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">{post.reactions.dislikes}</Typography>

        <IconButton onClick={()=>setSelectedPost(post)}>
          <CommentOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">Comments</Typography>

        <Box mt={1} display="flex" alignItems="center" gap={0.5}>
          <VisibilityOutlinedIcon fontSize="small" />
          <Typography variant="body2">{post.views}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
