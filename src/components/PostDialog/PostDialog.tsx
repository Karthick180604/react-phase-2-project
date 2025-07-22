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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Post } from "../../redux/Actions/postsActions";
import { getPostComments } from "../../services/apiCalls";
import type { CommentType } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { commentPost } from "../../redux/Actions/userActions";
import type { RootState } from "../../redux/Store/store";

type PostDialogProps = {
  open: boolean;
  onClose: () => void;
  post: Post | null;
};


const PostDialog: React.FC<PostDialogProps> = ({ open, onClose, post }) => {
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
        id: userDetails.userId,
        fullName: userDetails.userName,
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
        <Box flex={1} p={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Post by {post.userName}</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography variant="h5" sx={{ mt: 2 }}>{post.title}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{post.body}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            {post.tags.map((tag, i) => (
              <Typography key={i} variant="caption" color="text.secondary">#{tag}</Typography>
            ))}
          </Stack>
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
              pr: 1, // space for scrollbar
            }}
          >
            {comments.map((c:CommentType) => (
              <Box key={c.id} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{c.user.fullName}</strong>: {c.body}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Fixed input */}
          <Stack direction="row" spacing={1}>
            <TextField 
            fullWidth size="small" 
            placeholder="Write a comment..." 
            value={wroteComment}
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setWroteComment(e.target.value)} 
            />
            <Button variant="contained" onClick={handleComment}>Post</Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
