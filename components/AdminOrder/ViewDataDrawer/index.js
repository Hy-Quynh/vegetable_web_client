import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { BLUR_BASE64, FORMAT_NUMBER } from "../../../utils/constants";
import CloseIcon from "@mui/icons-material/Close";
import { getCheckoutById } from "../../../services/product";
import Image from "next/image";
import { dateTimeConverter, parseJSON } from "../../../utils/common";

export default function ViewCheckoutDetailDrawer({
  visible,
  onClose,
  viewData,
}) {
  const [listCheckoutProduct, setListCheckoutProduct] = useState([]);
  const getListCheckoutProduct = async () => {
    try {
      const productRes = await getCheckoutById(viewData?.checkout_id);

      if (productRes?.data?.success)
        setListCheckoutProduct(productRes?.data?.payload);
    } catch (error) {
      console.log("get list checkout product error >>>>> ", error);
    }
  };

  useEffect(() => {
    getListCheckoutProduct();
  }, []);

  return (
    <React.Fragment key="right">
      <Drawer
        anchor="right"
        open={visible}
        onClose={() => onClose()}
        sx={{
          ".css-1160xiw-MuiPaper-root-MuiDrawer-paper": {
            maxWidth: "1200px !important",
          },
        }}
      >
        <Box sx={{ width: "100%", paddingTop: "80px" }}>
          <Stack justifyContent={"start"} flexDirection={"row"}>
            <Box sx={{ width: "50%" }}>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
        </Box>
        <div
          style={{ marginTop: "20px", textAlign: "center", fontSize: "28px" }}
        >
          Thông tin khách hàng
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            paddingX: "30px",
          }}
        >
          <div style={{ width: "50%", marginTop: "20px" }}>
            Tên khách hàng:{" "}
            {viewData?.user_first_name + " " + viewData?.user_last_name}
          </div>
          <div style={{ width: "50%", marginTop: "20px" }}>
            Email: {viewData?.user_email}
          </div>
          <div style={{ width: "50%", marginTop: "20px" }}>
            Số điện thoại: {viewData?.user_phone}
          </div>
          <div style={{ width: "50%", marginTop: "20px" }}>
            Địa chỉ: {viewData?.user_address}
          </div>
          <div style={{ width: "50%", marginTop: "20px" }}>
            Phương thức nhận hàng:{" "}
            {viewData?.pickup_method === "SHIP"
              ? "Giao hàng"
              : "Nhận tại cửa hàng"}
          </div>
          {viewData?.pickup_method === "PICKUP" ? (
            <div style={{ width: "50%", marginTop: "20px" }}>
              Ngày đến lấy: {dateTimeConverter(viewData?.pickup_date)}
            </div>
          ) : (
            <></>
          )}
        </Box>
        <div
          style={{ marginTop: "20px", textAlign: "center", fontSize: "28px" }}
        >
          Thông tin sản phẩm
        </div>
        <Box sx={{ width: "100%", padding: "20px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Mã sản phẩm</TableCell>
                  <TableCell align="center">Hình ảnh</TableCell>
                  <TableCell align="left">Tên sản phẩm</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="right">Giá khuyến mãi</TableCell>
                  <TableCell align="left">Sản phẩm tặng kèm</TableCell>
                  <TableCell align="right">Tổng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listCheckoutProduct.map((row) => (
                  <TableRow
                    key={row?.product_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row?.product_id}
                    </TableCell>
                    <TableCell align="right">
                      <Image
                        src={row?.proudct_image}
                        width={150}
                        height={150}
                        placeholder="blur"
                        blurDataURL={BLUR_BASE64}
                        alt=""
                      />
                    </TableCell>
                    <TableCell align="left">{row?.product_name}</TableCell>
                    <TableCell align="right">{row?.product_quanlity}</TableCell>
                    <TableCell align="right">
                      {FORMAT_NUMBER.format(row?.product_price)}
                    </TableCell>
                    <TableCell align="right">
                      {row?.product_sale > 0
                        ? FORMAT_NUMBER.format(row?.product_sale)
                        : 0}
                    </TableCell>
                    <TableCell align="left">
                      <ul>
                        {parseJSON(row?.free_product)
                          ? parseJSON(row?.free_product)?.map(
                              (prdItem, prdIndex) => {
                                return (
                                  <li
                                    key={`free-product-item-${prdIndex}`}
                                    style={{ textAlign: "left" }}
                                  >
                                    {prdItem?.product_name}
                                  </li>
                                );
                              }
                            )
                          : ""}
                      </ul>
                    </TableCell>
                    <TableCell align="right">
                      <b>
                        {FORMAT_NUMBER.format(
                          Number(
                            row?.product_sale > 0
                              ? row?.product_sale
                              : row?.product_price
                          ) * Number(row?.product_quanlity)
                        )}
                      </b>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
