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
import { getListElectricity } from "../../../services/electricity-water";
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

export default function AdminElectricityPayment(props) {
  const {userId} = props
  const [electricityPayment, setElectricityPayment] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getElectricity = async () => {
    const response = await getListElectricity(undefined, undefined, userId || undefined);
    if (response?.data?.payload?.payment) {
      setElectricityPayment(response?.data?.payload?.payment);
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
    getElectricity();
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
            {electricityPayment
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
        count={electricityPayment.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
