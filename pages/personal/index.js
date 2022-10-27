import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "react-tabs/style/react-tabs.css";
import { toast } from "react-toastify";
import UserCheckout from "../../components/UserPersonal/UserCheckout";
import { getUserInfo, updateUserInfo } from "../../services/user";
import { useRouter } from "next/router";
import { isVietnamesePhoneNumber, parseJSON } from "../../utils/common";
import { USER_INFO_KEY } from "../../utils/constants";
import { Tab, Tabs } from "@mui/material";
import AdminElectricityPayment from "../../components/AdminElectricityWater/ElectricityPayment";
import AdminWaterPayment from "../../components/AdminElectricityWater/WaterPayment";

export default function PersonalPage(props) {
  const [userInfo, setUserInfo] = useState({});
  const [historyTab, setHistoryTab] = useState(0);
  const router = useRouter();
  const userData =
    typeof window !== "undefined"
      ? parseJSON(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const getUserData = async () => {
    try {
      const userRes = await getUserInfo(userData?.user_id);

      if (userRes?.data?.success) {
        setUserInfo(userRes?.data?.payload);
      }
    } catch (error) {
      console.log("get user data error: ", error);
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      if (
        userInfo?.phone_number?.trim()?.length &&
        !isVietnamesePhoneNumber(userInfo?.phone_number)
      ) {
        return toast.error("Số diện thoại không đúng định dạng");
      }

      const userRes = await updateUserInfo({
        ...userInfo,
        id: userData?.user_id,
      });

      if (userRes?.data?.success) {
        localStorage.setItem(
          USER_INFO_KEY,
          JSON.stringify({
            ...userInfo,
            user_id: userData?.user_id,
          })
        );

        toast.success("Cập nhật thông tin thành công");
      } else {
        toast.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.log("update user data error: ", error);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      getUserData();
    } else {
      router?.push("/login");
    }
  }, []);

  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Trang cá nhân</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a className="text-body" href="/">
                  Trang chủ
                </a>
              </li>
              <li
                className="breadcrumb-item text-dark active"
                aria-current="page"
              >
                Trang cá nhân
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <Box
        sx={{
          paddingLeft: "50px",
          paddingRight: "50px",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Stack
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Avatar />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <TextField
                  label="Họ"
                  id="post-title"
                  variant="filled"
                  style={{ marginTop: 11, textAlign: "left", width: "48%" }}
                  value={userInfo?.first_name}
                  sx={{
                    ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
                      marginTop: "12px",
                    },
                  }}
                  onChange={(event) =>
                    setUserInfo({
                      ...userInfo,
                      first_name: event.target.value,
                    })
                  }
                />
                <TextField
                  label="Tên"
                  id="post-title"
                  variant="filled"
                  style={{ marginTop: 11, textAlign: "left", width: "48%" }}
                  value={userInfo?.last_name}
                  sx={{
                    ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
                      marginTop: "12px",
                    },
                  }}
                  onChange={(event) =>
                    setUserInfo({
                      ...userInfo,
                      last_name: event.target.value,
                    })
                  }
                />
              </div>

              <TextField
                label="Email"
                defaultValue=""
                id="contact-address"
                variant="filled"
                style={{ marginTop: 11, width: "100%" }}
                value={userInfo.email}
                sx={{
                  ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
                    marginTop: "12px",
                  },
                }}
                onChange={(event) => {
                  setUserInfo({ ...userInfo, email: event.target.value });
                }}
              />

              <TextField
                label="Địa chỉ"
                defaultValue=""
                id="contact-address"
                variant="filled"
                style={{ marginTop: 11, width: "100%" }}
                value={userInfo.address}
                sx={{
                  ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
                    marginTop: "12px",
                  },
                }}
                onChange={(event) => {
                  setUserInfo({ ...userInfo, address: event.target.value });
                }}
              />
              <TextField
                label="Số điện thoại"
                defaultValue=""
                id="contact-address"
                variant="filled"
                style={{ marginTop: 11, width: "100%" }}
                value={userInfo.phone_number}
                sx={{
                  ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
                    marginTop: "12px",
                  },
                }}
                onChange={(event) => {
                  setUserInfo({
                    ...userInfo,
                    phone_number: event.target.value,
                  });
                }}
              />
              <Box sx={{ marginTop: "30px" }}>
                <Button
                  variant="contained"
                  sx={{ color: "white !important" }}
                  onClick={() => handleUpdateUserInfo()}
                >
                  Cập nhật
                </Button>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={7}>
            <Tabs
              value={historyTab}
              onChange={(event, newValue) => setHistoryTab(newValue)}
              aria-label="disabled tabs example"
            >
              <Tab label="Lịch sử đặt hàng" />
              <Tab label="Thanh toán điện" />
              <Tab label="Thanh toán nước" />
            </Tabs>

            {historyTab === 0 ? (
              <div style={{marginTop: '20px'}}>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    marginBottom: "12px",
                    fontWeight: 700,
                  }}
                >
                  LỊCH SỬ ĐẶT HÀNG
                </div>
                <UserCheckout />
              </div>
            ) : (
              <></>
            )}

            {historyTab === 1 ? (
              <div style={{marginTop: '20px'}}>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    marginBottom: "12px",
                    fontWeight: 700,
                  }}
                >
                  LỊCH SỬ THANH TOÁN TIỀN ĐIỆN
                </div>
                <AdminElectricityPayment userId={userData?.user_id}/>
              </div>
            ) : (
              <></>
            )}
            {historyTab === 2 ? (
              <div style={{marginTop: '20px'}}>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    marginBottom: "12px",
                    fontWeight: 700,
                  }}
                >
                  LỊCH SỬ THANH TOÁN TIỀN NƯỚC
                </div>
                <AdminWaterPayment userId={userData?.user_id}/>
              </div>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
