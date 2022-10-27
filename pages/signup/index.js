import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BackArrow from "../../components/BackArrow";
import _ from "lodash";
import { hasNumber, validateEmail } from "../../utils/common";
import { toast } from "react-toastify";
import { userSignup } from "../../services/auth";
import { useRouter } from "next/router";

const theme = createTheme();

export default function Register() {
  const [registerError, setResgisterError] = useState({
    status: false,
    error: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const checkNull = _.compact([
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    ]);
    if (checkNull?.length < 5) {
      setResgisterError({ status: true, error: "Dữ liệu không được để trống" });
      return;
    }

    if (hasNumber(firstName) || hasNumber(lastName)) {
      setResgisterError({
        status: true,
        error: "Họ và tên không được chứa kí tự số",
      });
      return;
    }

    if (!validateEmail(email)) {
      setResgisterError({
        status: true,
        error: "Email không đúng định dạng",
      });
      return;
    }

    if (password?.length < 6) {
      setResgisterError({
        status: true,
        error: "Mật khẩu cần ít nhất 6 kí tự",
      });
      return;
    }

    if (password !== confirmPassword) {
      setResgisterError({
        status: true,
        error: "Mật khẩu nhập lại không chính xác",
      });
      return;
    }

    setResgisterError({
      status: false,
      error: "",
    });

    const registerRes = await userSignup({
      firstName,
      lastName,
      email,
      password,
      type: "user",
    });

    if (registerRes?.data?.success) {
      toast.success(
        "Đăng kí tài khoản thành công, bạn sẽ chuyển hướng sang trang đăng nhập sau 3 giây"
      );
      router.push({
        pathname: "/login",
      });
    } else {
      toast.error(registerRes?.data?.error || "Đăng kí tài khoản thất bại");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BackArrow />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng ký
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Họ"
                  autoFocus
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Tên"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="comfirm_password"
                  label="Nhập lại mật khẩu"
                  type="password"
                  id="comfirm_password"
                  autoComplete="new-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Grid>
              {registerError?.status && (
                <Grid item xs={12}>
                  <p style={{ color: "red", margin: 0 }}>
                    {registerError?.error}
                  </p>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Bạn đã có tài khoản? Đăng nhập
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
