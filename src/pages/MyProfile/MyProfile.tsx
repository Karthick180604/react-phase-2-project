import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Box, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/Store/store';
import { getSingleUserPosts } from '../../services/apiCalls';
import UserProfileCard from '../../components/UserProfileCard/UserProfileCard';
import UserPostSection from '../../components/UserPostSection/UserPostSection';
import EditProfileDialog from '../../components/EditProfileDialog/EditProfileDialog';

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

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
}

const MyProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editOpen, setEditOpen] = useState(false);

  const userDetails = useSelector((state: RootState) => state.user);

  const updateUser = () => {
    const userData: User = {
      id: userDetails.id,
      firstName: userDetails.firstName || userDetails.username,
      lastName: userDetails.lastName || '',
      image: userDetails.image || 'https://ui-avatars.com/api/?name=User',
      email: userDetails.email,
      phone: userDetails.phone || 'ph:no data',
      gender: userDetails.gender || 'gender:no data',
      company: userDetails.company || { name: 'company name: no data', title: 'role: no data' }
    };
    setUser(userData);
  };

  useEffect(() => {
    if (userDetails) {
      updateUser();
    }
  }, [userDetails]);

  if (!user) return <Typography>Loading...</Typography>;

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

          {/* Update Info Button */}
          <Box mt={2} textAlign="center">
            <Button variant="outlined" onClick={() => setEditOpen(true)}>
              Refresh Profile Info
            </Button>
          </Box>
        </Grid>

        {/* RIGHT - POSTS */}
        <Grid item xs={12} md={8}>
          {/* Add Post Button */}
          <Stack direction="row" justifyContent="flex-end" mb={2}>
            <Button variant="contained" color="primary" onClick={() => console.log("Add Post clicked")}>
              Add Post
            </Button>
          </Stack>

          <UserPostSection posts={userPosts} />
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(data) => {
          setUser((prev) => (prev ? { ...prev, ...data } : null));
        }}
        updateUser={updateUser}
        initialData={{
          firstName: '',
          lastName: '',
          image: '',
          phone: '',
          gender: '',
          company: { name: '', title: '' }
        }}
      />
    </Container>
  );
};

export default MyProfile;
