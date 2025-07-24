import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUser, getSingleUserPosts } from '../../services/apiCalls';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import UserPostSection from '../../components/UserPostSection/UserPostSection';
import UserProfileCard from '../../components/UserProfileCard/UserProfileCard';
import NoPosts from '../../components/NoPosts/NoPosts';

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
  const userIdNumber = Number(id);
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState([]);

  const fetchUser = async () => {
    if (id) {
      try {
        const response = await getSingleUser(userIdNumber);
        const userPostData = await getSingleUserPosts(userIdNumber);
        setUser(response.data);
        setUserPosts(userPostData.data.posts);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Loader while data is fetching
  if (!user) {
    return (
      <Box
        sx={{
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* LEFT - USER INFO */}
        <Grid item xs={12} md={4}>
          <UserProfileCard
            image={user.image}
            fullName={`${user.firstName} ${user.lastName}`}
            email={user.email}
            phone={user.phone}
            gender={user.gender}
            company={user.company}
          />
        </Grid>

        {/* RIGHT - POSTS */}
        <Grid item xs={12} md={8}>
          {userPosts.length === 0 ? (
            <NoPosts />
          ) : (
            <UserPostSection posts={userPosts} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
