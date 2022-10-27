import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FORMAT_NUMBER } from "../../../utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewCheckoutDetailDrawer from "../../../components/AdminOrder/ViewDataDrawer";
import { toast } from "react-toastify";
import CustomPopover from "../../../components/CustomPopover";
import { dateTimeConverter } from "../../../../server/utils/util";
import ChangeCheckoutStatusPopover from "../../../components/AdminOrder/ChangeStatusPopover";
import {
  changeCheckoutStatus,
  deleteCheckoutProduct,
  getListCheckout,
} from "../../../services/product";

const columns = [
  { id: "checkout_id", label: "Mã đặt hàng", minWidth: 70, align: "center" },
  { id: "checkout_date", label: "Ngày đặt hàng", width: 200, align: "center" },
  {
    id: "user_name",
    label: "Tên",
    minWidth: 200,
    align: "left",
  },
  { id: "total_price", label: "Tổng giá tiền", width: 200, align: "right" },
  {
    id: "payment_method",
    label: "Phương thức thanh toán",
    width: 200,
    align: "right",
  },
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

const STATUS_FILTER = [
  { label: "Tất cả", value: -1 },
  { label: "Đã huỷ", value: 0 },
  { label: "Đặt hàng thành công", value: 1 },
  { label: "Đang giao hàng", value: 2 },
  { label: "Đã giao hàng", value: 3 },
];

export default function AdminOrder() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listOrder, setListOrder] = useState([]);
  const [visibleViewDataDrawer, setVisibleViewDataDrawer] = useState(false);
  const [viewData, setViewData] = useState("");
  const [popoverId, setPopoverId] = useState("");
  const [changeStatusPopoverId, setChangeStatusPopoverId] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(-1);
  const [paymentFilter, setPaymentFilter] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListCheckoutData = async (fromData, toDate, statusFilter) => {
    const getListRes = await getListCheckout(fromData, toDate, undefined, undefined, statusFilter);
    if (getListRes?.data?.success) {
      setListOrder(getListRes?.data?.payload);
    }
  };

  const handleDeleteCheckoutProduct = async (checkoutId) => {
    try {
      const deleteRes = await deleteCheckoutProduct(checkoutId);
      if (deleteRes?.data?.success) {
        getListCheckoutData();
        toast.success("Xoá đơn hàng thành công");
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá đơn hàng thất bại");
      }
    } catch (error) {
      toast.error("Xoá đơn hàng thất bại");
    }
  };

  const handleChangeCheckoutStatus = async (status, checkoutId) => {
    try {
      const res = await changeCheckoutStatus(status, checkoutId);

      if (res?.data?.success) {
        const product = [...listOrder];
        const findCheckoutProduct = product?.findIndex(
          (item) => item?.checkout_id === checkoutId
        );
        if (findCheckoutProduct !== -1) {
          product[findCheckoutProduct].status = status;
          setListOrder(product);
        } else {
          getListCheckoutData();
        }
        toast.success("Đổi trạng thái đơn đặt hàng thành công");
      } else {
        toast.error("Đổi trạng thái đơn đặt hàng thất bại");
      }
    } catch (error) {
      toast.error("Đổi trạng thái đơn đặt hàng thất bại");
    }
  };

  const displayStatus = (status, checkoutId) => {
    if (status === 0) {
      return (
        <ChangeCheckoutStatusPopover
          visible={changeStatusPopoverId === checkoutId}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            handleChangeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            color="error"
            icon={false}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
            sx={{ cursor: "pointer" }}
          >
            Đã huỷ
          </Alert>
        </ChangeCheckoutStatusPopover>
      );
    } else if (status === 1) {
      return (
        <ChangeCheckoutStatusPopover
          visible={changeStatusPopoverId === checkoutId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            handleChangeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            color="warning"
            icon={false}
            sx={{ cursor: "pointer" }}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
          >
            Đặt hàng thành công
          </Alert>
        </ChangeCheckoutStatusPopover>
      );
    } else if (status === 2) {
      return (
        <ChangeCheckoutStatusPopover
          visible={changeStatusPopoverId === checkoutId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            handleChangeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            color="primary"
            icon={false}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
          >
            Đang giao hàng
          </Alert>
        </ChangeCheckoutStatusPopover>
      );
    } else if (status === 3) {
      return (
        <ChangeCheckoutStatusPopover
          visible={changeStatusPopoverId === checkoutId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) =>
            handleChangeCheckoutStatus(selectStatus, checkoutId)
          }
        >
          <Alert
            color="success"
            icon={false}
            onClick={() => setChangeStatusPopoverId(checkoutId)}
          >
            Đã giao hàng
          </Alert>
        </ChangeCheckoutStatusPopover>
      );
    }
  };

  const diplayPaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return (
          <Alert color="primary" icon={false}>
            Thanh toán tận nơi
          </Alert>
        );
      case "VISA":
        return (
          <Alert color="success" icon={false}>
            Thanh toán qua thẻ
          </Alert>
        );
      default:
        break;
    }
  };

  useEffect(() => {
    getListCheckoutData(fromDateFilter, toDateFilter, statusFilter);
  }, [fromDateFilter, toDateFilter, statusFilter]);

  return (
    <>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí đơn hàng
        </Typography>
      </Stack>
      <Stack
        flexDirection={"row"}
        justifyContent={"flex-start"}
        flexWrap="wrap"
        gap={"20px"}
        marginBottom="20px"
      >
        <Box>
          <Typography variant="p" component="p">
            Từ ngày:
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            type={"date"}
            value={fromDateFilter}
            sx={{
              width: "300px",
              "& legend": { display: "none" },
              "& fieldset": { top: 0 },
            }}
            size="small"
            onChange={(event) => {
              setFromDateFilter(event.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography variant="p" component="p">
            Đến ngày:
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            type={"date"}
            size="small"
            sx={{
              width: "300px",
              "& legend": { display: "none" },
              "& fieldset": { top: 0 },
            }}
            value={toDateFilter}
            onChange={(event) => {
              setToDateFilter(event.target.value);
            }}
          />
        </Box>
        <Box>
          <Typography variant="p" component="p">
            Trạng thái:
          </Typography>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event?.target?.value)}
            style={{
              width: "300px",
              height: "38px",
              border: "1px solid rgb(188,189,188)",
              borderRadius: "4px",
              background: "#F5F5F5",
              paddingLeft: '10px',
              paddingRight: '10px'
            }}
          >
            {STATUS_FILTER?.map((statusItem, statusIndex) => {
              return (
                <option
                  value={statusItem?.value}
                  key={`status-item-${statusIndex}`}
                >
                  {statusItem?.label}
                </option>
              );
            })}
          </select>
        </Box>
      </Stack>
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
              {listOrder
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => {
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
                                <CustomPopover
                                  open={popoverId === row.checkout_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    handleDeleteCheckoutProduct(row.checkout_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá đơn đặt hàng?"
                                >
                                  <Button
                                    sx={{
                                      height: "30px",
                                      padding: 0,
                                      width: "fit-content",
                                      minWidth: "30px",
                                    }}
                                    variant="text"
                                    color="error"
                                    onClick={() => {
                                      if (popoverId === row.checkout_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row.checkout_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
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
                              <div>{dateTimeConverter(value)}</div>
                            ) : column.id === "user_name" ? (
                              <div>
                                {row?.user_first_name +
                                  " " +
                                  row?.user_last_name}
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
                              FORMAT_NUMBER.format(value)
                            ) : column.id === "status" ? (
                              displayStatus(value, row?.checkout_id)
                            ) : column.id === "payment_method" ? (
                              diplayPaymentMethod(row?.payment_method)
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
          count={listOrder.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {visibleViewDataDrawer && (
        <ViewCheckoutDetailDrawer
          visible={visibleViewDataDrawer}
          onClose={() => setVisibleViewDataDrawer(false)}
          viewData={viewData}
        />
      )}
    </>
  );
}
