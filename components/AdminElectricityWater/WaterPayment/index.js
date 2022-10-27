import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getListWaterPayment } from "../../../services/electricity-water";
import { dateTimeConverter } from "../../../utils/common";
import { FORMAT_NUMBER } from "../../../utils/constants";

const columns = [
  { id: "stt", label: "STT", minWidth: 50, align: "center" },
  {
    id: "province",
    label: "Tỉnh thành",
    minWidth: 170,
    align: "center",
  },
  {
    id: "water_supperlier",
    label: "Nhà cung cấp nước",
    minWidth: 200,
    align: "center",
  },
  {
    id: "customer_code",
    label: "Mã khách hàng",
    minWidth: 170,
    align: "center",
  },
  {
    id: "customer_name",
    label: "Tên khách hàng",
    minWidth: 170,
    align: "left",
  },
  {
    id: "customer_phone",
    label: "SĐT",
    minWidth: 170,
    align: "right",
  },
  {
    id: "moneny",
    label: "Số tiền",
    minWidth: 170,
    align: "right",
  },
  {
    id: "created_day",
    label: "Ngày thanh toán",
    minWidth: 170,
    align: "right",
  },
];

export default function AdminWaterPayment(props) {
  const {userId} = props
  const [waterPayment, setWaterPayment] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getWater = async () => {
    const response = await getListWaterPayment(undefined, undefined, userId);
    if (response?.data?.payload?.payment) {
      setWaterPayment(response?.data?.payload?.payment);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getWater();
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "30px" }}>
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
            {waterPayment
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column, columnIndex) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "stt" ? (
                            <div
                              style={{
                                textAlign: "center",
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              {columnIndex + 1}
                            </div>
                          ) : column.id === "customer_code" ? (
                            <div style={{ fontWeight: 700 }}>{value}</div>
                          ) : column.id === "moneny" ? (
                            <div style={{ fontWeight: 700 }}>
                              {FORMAT_NUMBER.format(value)} VNĐ
                            </div>
                          ) : column.id === "created_day" ? (
                            <div style={{ fontWeight: 500 }}>
                              {dateTimeConverter(value)}
                            </div>
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
        count={waterPayment.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
