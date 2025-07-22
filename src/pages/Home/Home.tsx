import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, type Post } from "../../redux/Actions/postsActions";
import type { ThunkDispatch } from "redux-thunk";
import type { RootState } from "../../redux/Store/store";
import type { AnyAction } from "redux";
import PostCard from "../../components/PostCard/PostCard";
import PostCardSkeleton from "../../components/PostSkeleton/PostSkeleton";
import PostDialog from "../../components/PostDialog/PostDialog";
import { Container, Typography } from "@mui/material";
import { likePost } from "../../redux/Actions/userActions";

const Home = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const onLikeHandler=(postId:number)=>{
    dispatch(likePost(postId))
    console.log("in like section")
  }
  // const userDetails=useSelector((state:RootState)=>{
  //   return state.user
  // })
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const thunkData = useSelector((state: RootState) => state.posts);
  const userDetails=useSelector((state:RootState)=>{
    return state.user
  })
  console.log(thunkData)

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest Posts
      </Typography>

      {thunkData.loading ? (
        Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
      ) : (
        thunkData.posts.map((post: Post) => (
          <div key={post.id}  style={{ cursor: "pointer" }}>
            <PostCard 
            post={post} 
            setSelectedPost={setSelectedPost} 
            onLikeHandler={onLikeHandler}  
            like={userDetails.likedPostId.includes(post.id)}
            />
          </div>
        ))
      )}

      <PostDialog open={!!selectedPost} onClose={() => setSelectedPost(null)} post={selectedPost} />
    </Container>
  );
};

export default Home;
