import { Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import AdminElectricityPayment from "../../../components/AdminElectricityWater/ElectricityPayment";
import AdminWaterPayment from "../../../components/AdminElectricityWater/WaterPayment";

export default function ElectricityWaterPayment() {
  const [paymentOption, setPaymentOption] = useState(0);

  return (
    <div>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Thanh toán hoá đơn
        </Typography>
      </Stack>

      <Tabs
        value={paymentOption}
        onChange={(event, newValue) => setPaymentOption(newValue)}
        aria-label="disabled tabs example"
      >
        <Tab label="Thanh toán điện" />
        <Tab label="Thanh toán nước" />
      </Tabs>
      {paymentOption === 0 ? (
        <AdminElectricityPayment />
      ) : (
        <AdminWaterPayment />
      )}
    </div>
  );
}
