import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Grid2 as Grid,
} from "@mui/material";
import { Visibility, VisibilityOff, Chat } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import PageIndex from "../PageIndex";

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
  transition: theme.transitions.create(["background-color", "box-shadow"], {
    duration: theme.transitions.duration.standard,
  }),
}));

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (values) => {
    const { name, email, mobileNumber, password, username } = values;
    const data = { name, email, mobileNumber, password, username };
    const resp = await PageIndex.handlePostRequest(
      PageIndex.API.AUTH.SIGNUP,
      data
    );
    if (resp?.status === 201) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
    validationSchema: PageIndex.signupValidationSchema,
    onSubmit: handleSignup,
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
        transition: (theme) =>
          theme.transitions.create("background-color", {
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
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Welcome to ChatApp
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Connect with friends and colleagues in real-time with our secure
              messaging platform.
            </Typography>
          </Grid>

          {/* Right side - Sign up form */}
          <Grid item size={{ xs: 12, md: 5 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>
                Create your account
              </Typography>

              <TextField
                margin="normal"
                fullWidth
                label="Full Name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2.5 }}
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
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
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={values.mobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2.5 }}
                variant="outlined"
                error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                helperText={touched.mobileNumber && errors.mobileNumber}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 2.5 }}
                variant="outlined"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
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
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mb: 3 }}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
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
                }}
                disabled={isSubmitting}
              >
                Create Account
              </Button>
              <Typography variant="body1" color="text.secondary" align="center">
                Already have an account?{" "}
                <Typography
                  component="span"
                  color="primary"
                  sx={{ cursor: "pointer", fontWeight: 500 }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default Signup;
