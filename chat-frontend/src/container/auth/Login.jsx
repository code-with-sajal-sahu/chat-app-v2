import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Divider,
  Grid2 as Grid,
} from "@mui/material";
import { Visibility, VisibilityOff, Chat } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useNavigate } from "react-router-dom";
import PageIndex from "../PageIndex";
import { useAppContext } from "../../context/AppContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: 24,
  boxShadow: theme.shadows[4],
  maxWidth: "calc(100vw - 20%)",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
}));

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { setUserProfile } = useAppContext();
  const handleLogin = async (values) => {
    // Handle login logic here
    const resp = await PageIndex.handlePostRequest(PageIndex.API.AUTH.LOGIN, values);
    if(resp?.status === 200){
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      setUserProfile(resp.data.user);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: PageIndex.loginValidationSchema,
      onSubmit: handleLogin,
    });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        padding: 4,
        transition: theme => theme.transitions.create('background-color', {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <StyledPaper elevation={0}>
        <Grid container spacing={4}>
          {/* Left side - Branding */}
          <Grid
            item
            size={{ xs: 12, md: 7 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                mb: 3,
              }}
            >
              <Chat sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Sign in to continue chatting with your friends and colleagues.
            </Typography>
          </Grid>

          {/* Right side - Login form */}
          <Grid item size={{ xs: 12, md: 5 }} sx={{ width: "100%" }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 500, color: "text.primary" }}>
                Sign in to your account
              </Typography>

              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2.5 }}
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                margin="normal"
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2.5 }}
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.8,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow: theme => theme.shadows[3],
                }}
              >
                Sign In
              </Button>

              {/* <Divider sx={{ my: 3 }}>OR</Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  borderColor: "divider",
                  color: "text.primary",
                  '&:hover': {
                    borderColor: "primary.main",
                  }
                }}
              >
                Continue with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={handleFacebookLogin}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  borderColor: "divider",
                  color: "text.primary",
                  '&:hover': {
                    borderColor: "primary.main",
                  }
                }}
              >
                Continue with Facebook
              </Button> */}

              <Typography variant="body1" color="text.secondary" align="center">
                Don't have an account?{" "}
                <Typography
                  component="span"
                  color="primary"
                  sx={{ 
                    cursor: "pointer", 
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <span onClick={() => navigate("/signup")}>Sign up</span>
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default Login;
