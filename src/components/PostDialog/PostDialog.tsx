import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack,
  Icon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Post } from "../../redux/Actions/postsActions";
import { getPostComments } from "../../services/apiCalls";
import type { CommentType } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { commentPost } from "../../redux/Actions/userActions";
import type { RootState } from "../../redux/Store/store";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';





type PostDialogProps = {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onLikeHandler: (postId: number, like: boolean) => void;
  onDislikeHandler: (postId: number, dislike: boolean) => void;
  like: boolean;
  dislike: boolean;
};


const PostDialog: React.FC<PostDialogProps> = ({ open, onClose, post, onLikeHandler,
  onDislikeHandler, like, dislike }) => {
    if (!post) return null;
    
    const dispatch=useDispatch()
    const [wroteComment, setWroteComment]=useState("")
    const [comments, setComments]=useState<CommentType[]>([])
     const handleComment=()=>{
        dispatch(commentPost(post.id, wroteComment))
        setWroteComment("")
    }
    const userDetails = useSelector((state: RootState) => state.user);
    useEffect(()=>{
        fetchComments()
    },[post?.id, userDetails.commentedPosts])
    const fetchComments = async () => {
  // 1. Fetch API comments
  const response = await getPostComments(post.id);
  const apiComments = response.data.comments.map((comment: CommentType) => comment);

  // 2. Get user details from Redux (call this OUTSIDE the async function)

  // 3. Add user comments if any
  const userComments = userDetails.commentedPosts
    .filter((userComment) => userComment.postId === post.id) // Optional: filter only this post
    .map((userComment, index) => ({
      id: apiComments.length + index + 1,
      body: userComment.comment,
      postId: userComment.postId,
      user: {
        id: userDetails.id,
        fullName: userDetails.username,
      },
    }));

  // 4. Merge and set state
  const combinedComments = [...apiComments, ...userComments];

  setComments(combinedComments);
  console.log(combinedComments)
};

   

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, p: 0 }}>
        {/* Left side - Post */}
        <Box flex={1} p={3} display="flex" flexDirection="column">
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography variant="h6">Post by {post.username}</Typography>
    <IconButton onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </Stack>

  <Typography variant="h5" sx={{ mt: 2 }}>{post.title}</Typography>
  <Typography variant="body1" sx={{ mt: 2 }}>{post.body}</Typography>

  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
    {post.tags.map((tag, i) => (
      <Typography key={i} variant="caption" color="text.secondary">
        #{tag}
      </Typography>
    ))}
  </Stack>

  {/* Fixed Bottom Icons */}
  <Box
    mt="auto"
    pt={2}
    borderTop="1px solid #e0e0e0"
    display="flex"
    justifyContent="space-around"
    alignItems="center"
  >
    <Stack direction="row" spacing={0.5} alignItems="center">
      <IconButton onClick={() => onLikeHandler(post.id, like)}>
              {like ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
            </IconButton>
            <Typography variant="caption">
              {post.reactions.likes + (like ? 1 : 0)}
            </Typography>
    </Stack>
    <Stack direction="row" spacing={0.5} alignItems="center">
      <IconButton onClick={() => onDislikeHandler(post.id, dislike)}>
              {dislike ? <ThumbDownAltIcon /> : <ThumbDownAltOutlinedIcon />}
            </IconButton>
            <Typography variant="caption">
              {post.reactions.dislikes + (dislike ? 1 : 0)}
            </Typography>
    </Stack>
    <Stack direction="row" spacing={0.5} alignItems="center">
      <IconButton>
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
      <Typography variant="body2">{post.views ?? 0}</Typography>
    </Stack>
  </Box>
</Box>


        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

        {/* Right side - Comments */}
        <Box
          flex={1}
          p={3}
          display="flex"
          flexDirection="column"
          height={{ xs: "auto", md: 500 }} // fixed height for md and above
          borderLeft={{ md: "1px solid #ccc" }}
        >
          <Typography variant="subtitle1" gutterBottom>Comments</Typography>

          {/* Scrollable Comments */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              mb: 2,
              pr: 1,
            }}
          >
            {comments.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                color="text.secondary"
                mt={4}
              >
                <ChatBubbleOutlineIcon fontSize="large" />
                <Typography variant="body2" mt={1}>
                  No comments yet
                </Typography>
              </Box>
            ) : (
              comments.map((c: CommentType) => (
                <Box key={c.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {c.user.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ pl: 2 }}>
                    {c.body}
                  </Typography>
                </Box>
              ))
            )}
          </Box>


          {/* Fixed input */}
          <Stack direction="row" spacing={1}>
            <TextField 
            color="tertiary"
            fullWidth size="small" 
            placeholder="Write a comment..." 
            value={wroteComment}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setWroteComment(e.target.value)} 
            />
            <Button color="tertiary" variant="contained" onClick={handleComment}>Post</Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;