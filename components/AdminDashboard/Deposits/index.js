import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FORMAT_NUMBER } from "../../../utils/constants";
import { Title } from "@mui/icons-material";

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits(props) {
  const [turnover, setTurnover] = React.useState(0);

  React.useEffect(() => {
    const allOrder = [...props.orderData];
    let price = 0;
    allOrder.forEach((orderItem) => {
      if (orderItem?.status !== 0) {
        price += Number(orderItem.total_price);
      }
    });
    setTurnover(price);
  }, [props.orderData]);

  return (
    <React.Fragment>
      <Typography
        sx={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "20px !important",
        }}
      >
        Doanh thu(VNĐ)
      </Typography>
      <Typography component="p" variant="h4" sx={{ fontSize: "1.2em" }}>
        {FORMAT_NUMBER.format(turnover)} VNĐ
      </Typography>
    </React.Fragment>
  );
}
