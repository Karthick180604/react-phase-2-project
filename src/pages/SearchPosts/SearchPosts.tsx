import React, { useEffect, useRef, useState, useCallback } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PostCardSmall from '../../components/PostCardSmall/PostCardSmall';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/Store/store';
import type { ThunkDispatch } from 'redux-thunk';
import type { AnyAction } from 'redux';
import { fetchPosts } from '../../redux/Actions/postsActions';
import { getAllPostTags, getSearchedPosts } from '../../services/apiCalls';

const SearchPosts = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const { posts, loading } = useSelector((state: RootState) => state.posts);

  const [postList, setPostList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const limit = 15;

  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<{ slug: string; name: string; url: string }[]>([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    dispatch(fetchPosts(page, limit)).then((res: any) => {
      if (res?.payload?.length < limit) setHasMore(false);
    });
  }, [dispatch, page]);

  useEffect(() => {
    if (page === 1) {
      setPostList(posts);
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
      console.error(error);
    }
  };

  const fetchSearchedPosts = async () => {
    if (searchTerm.trim() === '') {
      resetPagination();
      return;
    }
    try {
      const response = await getSearchedPosts(searchTerm);
      setPostList(response.data.posts);
      setHasMore(false);
    } catch (error) {
      console.log(error);
    }
  };

  const settedTag = (e: SelectChangeEvent<string>) => {
    setSelectedTag(e.target.value);
    if (e.target.value === '' || e.target.value === 'All') {
      resetPagination();
    } else {
      const filtered = posts.filter((post) => post.tags.includes(e.target.value));
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
        if (entries[0].isIntersecting && hasMore && !searchTerm && !selectedTag) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, searchTerm, selectedTag]
  );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Posts
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          label="Search Posts"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchSearchedPosts();
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="tag-select-label">Filter by Tag</InputLabel>
          <Select
            labelId="tag-select-label"
            value={selectedTag}
            label="Filter by Tag"
            onChange={settedTag}
          >
            <MenuItem value="All">All</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag.slug} value={tag.slug}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
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
            >
              <PostCardSmall title={post.title} body={post.body} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default SearchPosts;
