import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Alert, Typography } from "@mui/material";
import { dateTimeConverter } from "../../../utils/common";
import { FORMAT_NUMBER } from "../../../utils/constants";

export default function Orders(props) {
  const { orderData } = props;

  const displayStatus = (status) => {
    if (status === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Alert
            badgeContent={4}
            color="error"
            icon={false}
            sx={{ cursor: "pointer", maxWidth: "200px", width: '200px', textAlign: "center" }}
          >
            Đã huỷ
          </Alert>
        </div>
      );
    } else if (status === 1) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Alert
            badgeContent={4}
            color="warning"
            icon={false}
            sx={{ cursor: "pointer", maxWidth: "200px", width: '200px', textAlign: "center" }}
          >
            Đặt hàng thành công
          </Alert>
        </div>
      );
    } else if (status === 2) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Alert
            badgeContent={4}
            color="primary"
            icon={false}
            sx={{ cursor: "pointer", maxWidth: "200px", width: '200px', textAlign: "center" }}
          >
            Đang giao hàng
          </Alert>
        </div>
      );
    } else if (status === 3) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Alert
            badgeContent={4}
            color="success"
            icon={false}
            sx={{ cursor: "pointer", maxWidth: "200px", width: '200px', textAlign: "center" }}
          >
            Đã giao hàng
          </Alert>
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Đơn đặt hàng
      </Typography>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Ngày đặt hàng</TableCell>
            <TableCell align="right">Tổng giá tiền</TableCell>
            <TableCell align="center" style={{ maxWidth: "200px" }}>
              Trạng thái
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderData.map((row) => (
            <TableRow
              key={`dashboard-checkout-${row?.checkout_id}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">
                {dateTimeConverter(row.checkout_date)}
              </TableCell>
              <TableCell align="right">
                {FORMAT_NUMBER.format(row.total_price)} VNĐ
              </TableCell>
              <TableCell align="center">{displayStatus(row.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
