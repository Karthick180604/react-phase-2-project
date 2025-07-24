import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import UserProfilePostCard from '../UserProfilePostCard/UserProfilePostCard';
import PostDialog from '../PostDialog/PostDialog';
import type { Post } from '../../redux/Actions/postsActions';
import { useDispatch, useSelector } from 'react-redux';
import { dislikePost, likePost, removeDislikePost, removeLikePost } from '../../redux/Actions/userActions';
import type { RootState } from '../../redux/Store/store';

interface UserPostSectionProps {
  posts: Post[];
}

const UserPostSection: React.FC<UserPostSectionProps> = ({ posts }) => {
  const dispatch=useDispatch()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userDetails=useSelector((state:RootState)=>state.user)

  const onLikeHandler = (postId: number, like: boolean) => {
      if (!like) {
        dispatch(likePost(postId));
      } else {
        dispatch(removeLikePost(postId));
      }
    };
  
    const onDislikeHandler = (postId: number, dislike: boolean) => {
      if (!dislike) {
        dispatch(dislikePost(postId));
      } else {
        dispatch(removeDislikePost(postId));
      }
    };

  const handleCardClick = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Posts
      </Typography>
      {posts.map((post) => (
  <Box
    key={post.id}
    sx={{
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6,
        borderRadius: 2,
        cursor: 'pointer',
      },
      mb: 2,
    }}
  >
    <UserProfilePostCard
      id={post.id}
      title={post.title}
      body={post.body}
      tags={post.tags}
      onClick={() => handleCardClick(post)}
    />
  </Box>
))}


      <PostDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        post={selectedPost}
        onLikeHandler={onLikeHandler}
        onDislikeHandler={onDislikeHandler}
        like={selectedPost ? userDetails.likedPostId.includes(selectedPost.id) : false}
        dislike={selectedPost ? userDetails.dislikePostId.includes(selectedPost.id) : false}
      />
    </Box>
  );
};

export default UserPostSection;
