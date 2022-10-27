import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Alert, Button, Stack } from "@mui/material";
import { FORMAT_NUMBER, USER_INFO_KEY } from "../../../utils/constants";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewDataDrawer from "../CheckoutDrawer";
import { dateTimeConverter, parseJSON } from "../../../utils/common";
import { getCheckoutByUserId } from "../../../services/product";

const columns = [
  { id: "checkout_date", label: "Ngày đặt hàng", width: 200, align: "center" },
  { id: "total_price", label: "Tổng giá tiền", width: 200, align: "right" },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 100,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function UserCheckout() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listProduct, setListProduct] = useState([]);
  const [visibleViewDataDrawer, setVisibleViewDataDrawer] = useState(false);
  const [viewData, setViewData] = useState({});
  const userData =
    typeof window !== "undefined"
      ? parseJSON(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListProduct = async () => {
    const getListRes = await getCheckoutByUserId(userData?.user_id);
    if (getListRes?.data?.success) {
      setListProduct(getListRes?.data?.payload);
    }
  };

  useEffect(() => {
    getListProduct();
  }, []);

  const displayStatus = (status) => {
    if (status === 0) {
      return (
        <Alert badgeContent={4} color="error" icon={false}>
          Đã huỷ
        </Alert>
      );
    } else if (status === 1) {
      return (
        <Alert badgeContent={4} color="warning" icon={false}>
          Đặt hàng thành công
        </Alert>
      );
    } else if (status === 2) {
      return (
        <Alert badgeContent={4} color="primary" icon={false}>
          Đang giao hàng
        </Alert>
      );
    } else if (status === 3) {
      return (
        <Alert badgeContent={4} color="success" icon={false}>
          Đã giao hàng
        </Alert>
      );
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listProduct
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <Stack
                                flexDirection={"row"}
                                justifyContent="center"
                              >
                                <Button
                                  sx={{
                                    height: "30px",
                                    padding: 0,
                                    width: "fit-content",
                                    minWidth: "30px",
                                  }}
                                  variant="text"
                                  color="success"
                                  onClick={() => {
                                    setViewData(row);
                                    setVisibleViewDataDrawer(true);
                                  }}
                                >
                                  <RemoveRedEyeIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "checkout_date" ? (
                              <div style={{ fontWeight: 700 }}>
                                {dateTimeConverter(value)}
                              </div>
                            ) : column.id === "checkout_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "total_price" ? (
                              <div
                                style={{ fontWeight: 700, color: "#F74F06" }}
                              >
                                {FORMAT_NUMBER.format(value)} đ
                              </div>
                            ) : column.id === "status" ? (
                              displayStatus(value, row?.checkout_id)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={listProduct.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {visibleViewDataDrawer && (
        <ViewDataDrawer
          visible={visibleViewDataDrawer}
          onClose={() => setVisibleViewDataDrawer(false)}
          viewData={viewData}
        />
      )}
    </>
  );
}
