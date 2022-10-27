import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chart from "../../components/AdminDashboard/Charts";
import Deposits from "../../components/AdminDashboard/Deposits";
import Orders from "../../components/AdminDashboard/Orders";
import { Stack, TextField, Typography } from "@mui/material";
import { getListCheckout } from "../../services/product";
const mdTheme = createTheme();

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function DashboardContent() {
  const [filterOrder, setFilterOrder] = useState([]);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const getOrderDataByDate = async (fromDate, toDate) => {
    setFilterOrder([]);
    const orderRes = await getListCheckout(fromDate, toDate);
    if (orderRes?.data?.success) {
      setFilterOrder(orderRes?.data?.payload);
    }
  };

  useEffect(() => {
    setFilterFromDate(formatDate(new Date()));
    setFilterToDate(formatDate(new Date()));
  }, []);

  useEffect(() => {
    getOrderDataByDate(filterFromDate, filterToDate);
  }, [filterFromDate, filterToDate]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box style={{ paddingLeft: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack flexDirection={"row"} justifyContent={"flex-start"}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6" component="h2">
                  Từ ngày:
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type={"date"}
                  value={filterFromDate}
                  sx={{
                    width: "300px",
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                  }}
                  onChange={(event) => {
                    setFilterFromDate(event.target.value);
                  }}
                />
              </Box>
              <Box sx={{ margin: "20px 0 20px 30px" }}>
                <Typography variant="h6" component="h2">
                  Đến ngày:
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type={"date"}
                  sx={{
                    width: "300px",
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                  }}
                  value={filterToDate}
                  onChange={(event) => {
                    setFilterToDate(event.target.value);
                  }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart orderData={filterOrder} />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Deposits orderData={filterOrder} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Orders orderData={filterOrder} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
