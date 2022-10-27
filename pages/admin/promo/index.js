import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import PromoControlModal from "../../../components/AdminPromo/PromoControlModal";
import CustomPopover from "../../../components/CustomPopover";
import { deletePromoData, getPromoList } from "../../../services/product";
import { dateTimeConverter } from "../../../utils/common";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { toast } from "react-toastify";

const columns = [
  { id: "promo_id", label: "Mã khuyến mãi", minWidth: 150, align: "center" },
  {
    id: "promo_name",
    label: "Tên khuyến mãi",
    minWidth: 170,
    align: "center",
  },
  {
    id: "promo_start",
    label: "Ngày bắt đầu",
    minWidth: 170,
    align: "left",
  },
  {
    id: "promo_end",
    label: "Ngày kết thúc",
    minWidth: 170,
    align: "left",
  },
  {
    id: "promo_rule",
    label: "Loại khuyến mãi",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminPromotion() {
  const [promoModal, setPromoModal] = useState({ status: false, type: "" });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listPromo, setListPromo] = useState([]);
  const [popoverId, setPopoverId] = useState("");
  const [editPromoId, setEditPromoId] = useState(0);

  const getListPromo = async () => {
    const promo = await getPromoList();
    if (promo?.data?.success) setListPromo(promo?.data?.payload);
  };

  useEffect(() => {
    getListPromo();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const displayPromoType = (type) => {
    if (type === "DISCOUNT") return "GIẢM GIÁ";
    return "TẶNG KÈM SẢN PHẨM";
  };

  const hanleDeletePromoData = async (promoId) => {
    const res = await deletePromoData(promoId);
    if (res?.data?.success) {
      getListPromo();
      return toast.success("Xoá sản phẩm thành công");
    }
    return toast.error("Xoá sản phẩm thất bại");
  };

  return (
    <>
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
          Quản lí chương trình khuyến mãi
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => setPromoModal({ status: true, type: "CREATE" })}
          >
            Thêm mới
          </Button>
        </div>
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
              {listPromo
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                <CustomPopover
                                  open={popoverId === row?.promo_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    hanleDeletePromoData(row?.promo_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá sản phẩm?"
                                >
                                  <Button
                                    color="error"
                                    sx={{
                                      height: "30px",
                                      padding: 0,
                                      width: "fit-content",
                                      minWidth: "30px",
                                    }}
                                    variant="text"
                                    onClick={() => {
                                      if (popoverId === row?.promo_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.promo_id);
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
                                  onClick={() => {
                                    setPromoModal({
                                      status: true,
                                      type: "UPDATE",
                                    });
                                    setEditPromoId(row?.promo_id);
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "promo_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "promo_name" ? (
                              <div style={{ fontWeight: 600, color: "blue" }}>
                                {value}
                              </div>
                            ) : column.id === "promo_rule" ? (
                              <div style={{ fontWeight: 600, color: "red" }}>
                                {displayPromoType(value)}
                              </div>
                            ) : column.id === "promo_start" ||
                              column.id === "promo_end" ? (
                              dateTimeConverter(value)
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
          count={listPromo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {promoModal?.status && (
        <PromoControlModal
          visible={promoModal?.status}
          type={promoModal?.type}
          onClose={() => setPromoModal({ status: false, type: "" })}
          editPromoId={editPromoId}
          reloadPage={() => getListPromo()}
        />
      )}
    </>
  );
}
