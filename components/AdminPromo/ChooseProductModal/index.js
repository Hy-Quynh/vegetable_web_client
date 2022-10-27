import React, { useEffect, useState } from "react";
import { getListProduct } from "../../../services/product";
import CustomDialog from "../../CustomDialog";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { FORMAT_NUMBER } from "../../../utils/constants";
import { Checkbox } from "@mui/material";

const columns = [
  { id: "checked", label: "Chọn", minWidth: 50 },
  { id: "product_id", label: "Mã sản phẩm", minWidth: 140, align: "center" },
  { id: "product_name", label: "Tên sản phẩm", minWidth: 250 },
  {
    id: "product_price",
    label: "Giá sản phẩm",
    minWidth: 200,
    align: "right",
    format: (value) => FORMAT_NUMBER.format(value),
  },
  {
    id: "product_quantity",
    label: "Số lượng",
    minWidth: 100,
    align: "right",
  },
];

export default function ChooseProductModal(props) {
  const { visible, onClose, initData, handleSubmit } = props;
  const [listProduct, setListProduct] = useState([]);
  const [checkedProduct, setCheckedProduct] = useState(() => {
    return initData?.length ? initData : [];
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    getProductData();
  }, []);

  const getProductData = async () => {
    const res = await getListProduct();
    if (res?.data?.payload?.product) {
      setListProduct(
        res?.data?.payload?.product?.map((item) => {
          return {
            ...item,
            id: item?.product_id,
          };
        })
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <CustomDialog
      onClose={() => onClose?.()}
      visible={visible}
      title="Lựa chọn sản phẩm"
      closeTitle="Đóng"
      closeSubmitTitle={"Xác nhận"}
      handleSubmit={() => {
        return handleSubmit?.(checkedProduct);
      }}
      maxWidth="800px"
      width="800px"
    >
      <div style={{ height: 400, width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
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
                            {column.id === "checked" ? (
                              <Checkbox
                                checked={checkedProduct?.includes(
                                  row?.product_id
                                )}
                                onChange={(event) => {
                                  if (event?.target?.checked) {
                                    const currCheck = [...checkedProduct];
                                    currCheck?.push(row?.product_id);
                                    setCheckedProduct(currCheck);
                                  } else {
                                    const currCheck = [
                                      ...checkedProduct,
                                    ]?.filter((item) => item?.row?.product_id);
                                    setCheckedProduct(currCheck);
                                  }
                                }}
                              />
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
      </div>
    </CustomDialog>
  );
}
