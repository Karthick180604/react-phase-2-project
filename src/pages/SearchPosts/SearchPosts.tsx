import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Grid,
  Container,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  type SelectChangeEvent,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PostCardSmall from "../../components/PostCardSmall/PostCardSmall";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/Store/store";
import type { ThunkDispatch } from "redux-thunk";
import type { AnyAction } from "redux";
import { fetchPosts, Post } from "../../redux/Actions/postsActions";
import { getAllPostTags, getSearchedPosts } from "../../services/apiCalls";
import PostDialog from "../../components/PostDialog/PostDialog";
import {
  dislikePost,
  likePost,
  removeDislikePost,
  removeLikePost,
} from "../../redux/Actions/userActions";
import debounce from "lodash.debounce";
import NoResults from "../../components/NoResults/NoResults";
import PostCardSmallSkeleton from "../../components/PostCardSmallSkeleton/PostCardSmallSkeleton";
import ApiError from "../../components/ApiError/ApiError";
import { setApiError } from "../../redux/Actions/errorAction";

const SearchPosts = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postList, setPostList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const limit = 15;

  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState<
    { slug: string; name: string; url: string }[]
  >([]);
  const [selectedTag, setSelectedTag] = useState("");

  const userDetails = useSelector((state: RootState) => state.user);
  const uploadedPost = userDetails.uploadedPosts;

  const hasApiError = useSelector((state: RootState) => state.error.hasApiError);

  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

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

  useEffect(() => {
    dispatch(fetchPosts(page, limit))
  }, [dispatch, page]);

  useEffect(() => {
    if (page === 1) {
      setPostList([...uploadedPost, ...posts]);
    } else {
      setPostList((prev) => [...prev, ...posts]);
    }
  }, [posts]);

  useEffect(() => {
    fetchAllPostTags();
  }, []);

  const fetchAllPostTags = async () => {
    try {
      const response = await getAllPostTags();
      setTags(response.data);
    } catch (error) {
      dispatch(setApiError(true))
      console.error(error);
    }
  };

  const fetchSearchedPosts = useCallback(async (term: string) => {
    if (term.trim() === "") {
      resetPagination();
      return;
    }

    try {
      const response = await getSearchedPosts(term);
      setPostList(response.data.posts);
      setHasMore(false);
    } catch (error) {
      dispatch(setApiError(true))
      console.log(error);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value:string)=>fetchSearchedPosts(value), 500),
    [fetchSearchedPosts],
  );

  const settedTag = (e: SelectChangeEvent<string>) => {
    setSelectedTag(e.target.value);
    if (e.target.value === "" || e.target.value === "All") {
      resetPagination();
    } else {
      const filtered = posts.filter((post) =>
        post.tags.includes(e.target.value),
      );
      setPostList(filtered);
      setHasMore(false);
    }
  };

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
    dispatch(fetchPosts(1, limit));
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !searchTerm &&
          !selectedTag
        ) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, searchTerm, selectedTag],
  );

  if (hasApiError || error!==null) {
    return <ApiError data-testid="api-error" />;
  }

  return (
    <Container sx={{ py: 4 }} data-testid="search-posts-page">
      <Typography variant="h4" gutterBottom data-testid="page-title">
        Search Posts
      </Typography>

      <Box
        sx={{ display: "flex", gap: 2, mb: 4 }}
        data-testid="search-bar-section"
      >
        <TextField
          color="tertiary"
          label="Search Posts"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          inputProps={{ "data-testid": "search-input" }}
        />
        <FormControl color="tertiary" sx={{ minWidth: 180 }}>
          <InputLabel id="tag-select-label">Tags</InputLabel>
          <Select
            labelId="tag-select-label"
            value={selectedTag}
            label="Filter by Tag"
            onChange={settedTag}
            data-testid="tag-select"
          >
            <MenuItem value="All" data-testid="tag-option-All">
              All
            </MenuItem>
            {tags.map((tag) => (
              <MenuItem
                key={tag.slug}
                value={tag.slug}
                data-testid={`tag-option-${tag.slug}`}
              >
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Grid container spacing={3} data-testid="loading-state">
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PostCardSmallSkeleton data-testid={`skeleton-${index}`} />
            </Grid>
          ))}
        </Grid>
      ) : postList.length === 0 ? (
        <NoResults message="No posts found" data-testid="no-posts" />
      ) : (
        <Grid container spacing={3} data-testid="post-list">
          {postList.map((post, index) => {
            const isLast = postList.length === index + 1;
            return (
              <Grid
                item
                key={post.id}
                xs={12}
                sm={6}
                md={4}
                ref={isLast ? lastPostRef : null}
                data-testid={`post-${post.id}`}
              >
                <PostCardSmall
                  title={post.title}
                  body={post.body}
                  id={post.id}
                  onReadMore={() => handleOpenDialog(post)}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      <PostDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        post={selectedPost}
        onLikeHandler={onLikeHandler}
        onDislikeHandler={onDislikeHandler}
        like={
          selectedPost
            ? userDetails.likedPostId.includes(selectedPost.id)
            : false
        }
        dislike={
          selectedPost
            ? userDetails.dislikePostId.includes(selectedPost.id)
            : false
        }
        data-testid="post-dialog"
      />
    </Container>
  );
};

export default SearchPosts;
