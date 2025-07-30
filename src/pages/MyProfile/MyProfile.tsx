import { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/Store/store";
import { getSingleUserPosts } from "../../services/apiCalls";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import UserPostSection from "../../components/UserPostSection/UserPostSection";
import EditProfileDialog from "../../components/EditProfileDialog/EditProfileDialog";
import AddPostDialog from "../../components/AddPostDialog/AddPostDialog";
import type { Post } from "../../redux/Actions/postsActions";
import NoPosts from "../../components/NoPosts/NoPosts";
import { setApiError } from "../../redux/Actions/errorAction";
import ApiError from "../../components/ApiError/ApiError";

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

const MyProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const dispatch=useDispatch()

  const userDetails = useSelector((state: RootState) => state.user);
  const hasApiError=useSelector((state:RootState)=>state.error.hasApiError)

  const updateUser = () => {
    const userData: User = {
      id: userDetails.id,
      firstName: userDetails.firstName || userDetails.username,
      lastName: userDetails.lastName || "",
      image: userDetails.image || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      email: userDetails.email,
      phone: userDetails.phone || "ph:no data",
      gender: userDetails.gender || "gender:no data",
      company: userDetails.company || {
        name: "company name: no data",
        title: "role: no data",
      },
    };
    setUser(userData);
  };

  useEffect(() => {
    if (userDetails) updateUser();
  }, [userDetails]);

  useEffect(() => {
    updatePost();
  }, [userDetails]);

  const updatePost = async () => {
    if (!userDetails) return;
    if (userDetails.id > 208) {
      setUserPosts([...userDetails.uploadedPosts]);
    } else {
      try {
        const response = await getSingleUserPosts(userDetails.id);
        const apiPosts = response.data.posts;
        const uploadedPosts = [...userDetails.uploadedPosts];
        setUserPosts([...apiPosts, ...uploadedPosts]);
      } catch (error) {
        dispatch(setApiError(true))
        console.error("Error fetching user posts:", error);
      }
    }
  };

  if(hasApiError)
  {
    return <ApiError />
  }

  if (!user)
    return <Typography data-testid="loading-text">Loading...</Typography>;

  return (
    <Container sx={{ py: 5 }} data-testid="my-profile-root">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div data-testid="user-profile-card">
            <UserProfileCard
              image={user.image}
              fullName={`${user.firstName} ${user.lastName}`}
              email={user.email}
              phone={user.phone}
              gender={user.gender}
              company={user.company}
            />
          </div>
          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              color="tertiary"
              onClick={() => setEditOpen(true)}
              data-testid="edit-profile-btn"
            >
              Add Profile Info
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack direction="row" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              color="tertiary"
              onClick={() => setAddOpen(true)}
              data-testid="add-post-btn"
            >
              Add Post
            </Button>
          </Stack>
          <div data-testid="user-post-section">
            {userPosts.length === 0 ? (
              <NoPosts data-testid="no-posts" />
            ) : (
              <UserPostSection posts={userPosts} />
            )}
          </div>
        </Grid>
      </Grid>

      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(data) => {
          setUser((prev) => (prev ? { ...prev, ...data } : null));
        }}
        initialData={{
          firstName: "",
          lastName: "",
          image: "",
          phone: "",
          gender: "",
          company: { name: "", title: "" },
        }}
      />

      <AddPostDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </Container>
  );
};

export default MyProfile;
