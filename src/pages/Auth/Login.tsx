import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  Grid,
  useMediaQuery,
  useTheme,
  TextField,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { getAllUsers, getSingleUserPosts } from "../../services/apiCalls";
import type { UserType } from "../../types/types";
import { useDispatch } from "react-redux";
import {
  addUploadedPostAction,
  setUser,
  setUserProfileDetails,
} from "../../redux/Actions/userActions";
import type { UploadPostType } from "../../redux/Reducers/userReducer";
import AuthImage from "../../components/AuthImage/AuthImage";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const findUser = async () => {
    try {
      const formData = { email, password };
      const response = await getAllUsers();
      const findUser = response.data.users.find((user: UserType) => {
        return (
          user.email === formData.email && user.password === formData.password
        );
      });
      return findUser;
    } catch (error) {
      return error;
    }
  };

  const handleLogin = async () => {
    const userExist = await findUser();
    const isExist = !!userExist;

    if (isExist) {
      dispatch(
        setUser(
          userExist.id,
          userExist.username,
          userExist.email,
          userExist.password
        )
      );

      const userData = {
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        image: userExist.image,
        phone: userExist.phone,
        gender: userExist.gender,
        company: userExist.company,
      };
      dispatch(setUserProfileDetails(userData));

      // try {
      //   const response = await getSingleUserPosts(userExist.id);
      //   response.data.posts.forEach((post: UploadPostType) => {
      //     dispatch(addUploadedPostAction(post));
      //   });
      // } catch (error) {
      //   console.log(error);
      // }

      navigate("/home");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Image */}
      {!isSmallScreen && (
        <Grid item md={6}>
          <Box
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ maxWidth: "70%", maxHeight: "80%" }}>
              <AuthImage />
            </Box>
          </Box>
        </Grid>
      )}

      {/* Right Login Form */}
      <Grid item xs={12} md={6}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ px: 2 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 5,
              width: "100%",
              maxWidth: 400,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              textAlign="center"
              fontWeight={600}
            >
              Connectify
            </Typography>

            <Typography
              variant="subtitle1"
              gutterBottom
              textAlign="center"
              color="text.secondary"
            >
              Welcome back! Please login to your account.
            </Typography>

            <Box mt={3}>
              <TextField
                color="tertiary"
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
              color="tertiary"
                fullWidth
                
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box mt={3}>
                <Button
                color="tertiary"
                  variant="contained"
                  fullWidth
                  onClick={handleLogin}
                  disabled={!email || !password}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Button>
              </Box>

              {/* Signup link */}
              <Typography
                variant="body2"
                textAlign="center"
                mt={2}
                
              >
                Don’t have an account?{" "}
                <Link component={RouterLink} to="/signup" underline="hover" color="tertiary">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Snackbar with Alert */}
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Invalid email or password. Please try again.
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default Login;
