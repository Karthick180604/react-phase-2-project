import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Grid,
  useTheme,
  useMediaQuery,
  TextField,
  Alert,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getAllUsers } from "../../services/apiCalls";
import type { UserType } from "../../types/types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/Actions/userActions";
import AuthImage from "../../components/AuthImage/AuthImage";
import { setApiError } from "../../redux/Actions/errorAction";
import { RootState } from "../../redux/Store/store";
import ApiError from "../../components/ApiError/ApiError";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const hasApiError=useSelector((state:RootState)=>state.error.hasApiError)

  const [formData, setFormData] = useState({
    id: 208,
    name: "",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
    return regex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Enter a valid email address",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Min 6 chars, 1 upper, 1 lower, 1 symbol",
      }));
    }
  };

  const findUser = async (): Promise<boolean> => {
    try {
      const response = await getAllUsers();
      const findUser = response.data.users.find(
        (user: UserType) => user.email === formData.email,
      );
      return !!findUser;
    } catch (error) {
      console.log(error);
      dispatch(setApiError(true))
      return false;
    }
  };

  const handleSignup = async () => {
    const isUserExist = await findUser();
    if (isUserExist) {
      setOpen(true);
    } else {
      dispatch(
        setUser(
          formData.id + 1,
          formData.name,
          formData.email,
          formData.password,
        ),
      );
      setFormData((prevState) => ({
        ...prevState,
        id: prevState.id + 1,
      }));
      navigate("/home");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormValid =
    formData.name &&
    validateEmail(formData.email) &&
    validatePassword(formData.password);

    if(hasApiError)
    {
      return <ApiError />
    }

  return (
    <Grid container sx={{ minHeight: "100vh" }} data-testid="signup-container">
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
              Sign Up
            </Typography>

            <Typography
              variant="subtitle1"
              gutterBottom
              textAlign="center"
              color="text.secondary"
            >
              Create your Connectify account
            </Typography>

            <Box mt={3}>
              <TextField
                color="tertiary"
                fullWidth
                label="Name"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
                inputProps={{ "data-testid": "name-input" }}
              />

              <TextField
                color="tertiary"
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 2 }}
                inputProps={{ "data-testid": "email-input" }}
              />

              <TextField
                color="tertiary"
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        data-testid="toggle-password-visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ "data-testid": "password-input" }}
              />

              <Box mt={3}>
                <Button
                  color="tertiary"
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSignup}
                  disabled={!isFormValid}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  data-testid="signup-button"
                >
                  Sign Up
                </Button>
              </Box>

              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                  component={RouterLink}
                  to="/"
                  underline="hover"
                  color="tertiary"
                  data-testid="login-redirect"
                >
                  Login
                </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          data-testid="user-exists-snackbar"
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            User Already exist
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default Signup;
