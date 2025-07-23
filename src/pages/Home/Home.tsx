import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, type Post } from "../../redux/Actions/postsActions";
import type { ThunkDispatch } from "redux-thunk";
import type { RootState } from "../../redux/Store/store";
import type { AnyAction } from "redux";
import PostCard from "../../components/PostCard/PostCard";
import PostCardSkeleton from "../../components/PostSkeleton/PostSkeleton";
import PostDialog from "../../components/PostDialog/PostDialog";
import { Container, Typography } from "@mui/material";
import {
  dislikePost,
  likePost,
  removeDislikePost,
  removeLikePost,
} from "../../redux/Actions/userActions";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, Zoom } from "@mui/material";


const Home = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const postsState = useSelector((state: RootState) => state.posts);
  const userDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchPosts(page, limit)).then((res: any) => {
      if (res?.payload?.length < limit) {
        setHasMore(false);
      }
    });
  }, [dispatch, page]);

 const lastPostRef = useCallback(
  (node: HTMLDivElement | null) => {
    if (postsState.loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  },
  [postsState.loading, hasMore]
);

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


  const [showScrollTop, setShowScrollTop] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300); // show after 300px
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest Posts
      </Typography>

      {postsState.posts.map((post: Post, index: number) => {
        const isLast = postsState.posts.length === index + 1;
        return (
          <div
            key={post.id}
            ref={isLast ? lastPostRef : null}
            style={{ cursor: "pointer" }}
          >
            <PostCard
              post={post}
              setSelectedPost={setSelectedPost}
              onLikeHandler={onLikeHandler}
              onDislikeHandler={onDislikeHandler}
              like={userDetails.likedPostId.includes(post.id)}
              dislike={userDetails.dislikePostId.includes(post.id)}
            />
          </div>
        );
      })}

      {postsState.loading &&
        Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={`skeleton-${i}`} />
        ))}

      <PostDialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

    </Container>
  );
};

export default Home;
