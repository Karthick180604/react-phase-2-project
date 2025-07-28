import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleUser, getSingleUserPosts } from "../../services/apiCalls";
import {
  Container,
  Grid,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserPostSection from "../../components/UserPostSection/UserPostSection";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import NoPosts from "../../components/NoPosts/NoPosts";
import type { Post } from "../../redux/Actions/postsActions";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/Store/store";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: string;
  gender: string;
  company: {
    name: string;
    title: string;
  };
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userIdNumber = Number(id);
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const userDetails = useSelector((state: RootState) => state.user);

  const fetchUser = async () => {
    if (id) {
      try {
        const response = await getSingleUser(userIdNumber);
        const userPostData = await getSingleUserPosts(userIdNumber);

        setUser(response.data);

        if (userDetails.id === userIdNumber) {
          const uploadedPosts = userDetails.uploadedPosts || [];
          const mergedPosts = [...userPostData.data.posts, ...uploadedPosts];
          setUserPosts(mergedPosts);
        } else {
          setUserPosts(userPostData.data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <Box
        data-testid="loading-spinner"
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5 }} data-testid="user-profile-page">
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        data-testid="back-button-box"
      >
        <IconButton
          onClick={() => navigate(-1)}
          data-testid="back-button"
          aria-label="go-back"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={4} data-testid="user-profile-card-section">
          <UserProfileCard
            image={user.image}
            fullName={`${user.firstName} ${user.lastName}`}
            email={user.email}
            phone={user.phone}
            gender={user.gender}
            company={user.company}
          />
        </Grid>

        <Grid item xs={12} md={8} data-testid="user-posts-section">
          <Box sx={{ mt: -1 }}>
            {userPosts.length === 0 ? (
              <NoPosts data-testid="no-posts-message" />
            ) : (
              <UserPostSection
                posts={userPosts}
                data-testid="user-post-section"
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
