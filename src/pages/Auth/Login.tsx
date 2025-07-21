import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormInput from "../../components/MuiComponents/FormInput";
import { findUser } from "../../services/apiOperations";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/apiCalls";
import type { UserType } from "../../types/types";

const Login = () => {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen]=useState(false)

  const findUser=async()=>{
    try {
          const formData={
            email,
            password
          }
          const response=await getAllUsers();
          const findUser=response.data.users.find((user:UserType)=>{
            return user.email===formData.email && user.password===formData.password
          })
          const isExist=!!findUser
          console.log(findUser)
          return isExist
        } catch (error) {
          return false
        }
  }

  const handleLogin = async() => {
    const userExist=await findUser()
    const isExist=!!userExist
    if(isExist)
    {
      navigate("/")
    }
    else
    {
      setOpen(true)
    }
  };

  const handleClose=()=>{
    setOpen(false)
  }

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
          Connectify Login
        </Typography>

        <Box mt={2}>
          <FormInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <Box mt={2}>
          <FormInput
            label="Password"
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
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={!email || !password}
          >
            Login
          </Button>
        </Box>
      </Paper>
      <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="User does not exist"
            />
    </Box>
  );
};

export default Login;
