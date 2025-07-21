import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormInput from "../../components/MuiComponents/FormInput";
import axios from "axios";
import { getAllUsers } from "../../services/apiCalls";
import type { UserType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/Actions/userActions";

const Signup = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    id:208,
    name: "",
    email: "",
    password: "",
  });
  const [open, setOpen]=useState(false)

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(()=>{
    const fetching=async()=>{
        try {
            const response=await axios.get('https://dummyjson.com/users?limit=208')
            const products=await axios.get('https://dummyjson.com/posts')
            console.log(response.data)
            console.log(products.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetching()
  },[])

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

  const findUser=async():Promise<boolean>=>{
    try {
      const response=await getAllUsers();
      console.log(response.data.users)
      const findUser=response.data.users.find((user:UserType)=>{
        return user.email===formData.email
      })
      const isExist=!!findUser
      console.log(findUser)
      return isExist
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSignup =async()=> {
    const isUserExist=await findUser()
    if(isUserExist)
    {
      setOpen(true)
    }
    else
    {
      dispatch(setUser(formData.id+1, formData.name, formData.email, formData.password))
      setFormData((prevState)=>{
        return {
          ...prevState,
          id:prevState.id+1
        }
      })
      navigate("/")

    }
  };

  const handleClose=()=>{
    setOpen(false)
  }

  const isFormValid =
    formData.name &&
    validateEmail(formData.email) &&
    validatePassword(formData.password);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f5f5f5", padding: 2 }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Sign Up to Connectify
        </Typography>

        <Box mt={2}>
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Box>

        <Box mt={2}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
          />
          {errors.email && (
            <FormHelperText error>{errors.email}</FormHelperText>
          )}
        </Box>

        <Box mt={2}>
          <FormInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.password && (
            <FormHelperText error>{errors.password}</FormHelperText>
          )}
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSignup}
            disabled={!isFormValid}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
      <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="User already exist"
      />
    </Box>
  );
};

export default Signup;
