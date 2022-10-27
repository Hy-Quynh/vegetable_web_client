import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Button,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import storage from "../../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPopover from "../../../components/CustomPopover";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CustomInput from "../../../components/CustomInput";
import CustomDialog from "../../../components/CustomDialog";
import {
  getAllCategory,
  createNewCategory,
  updateCategoryData,
  deleteCategory,
} from "../../../services/category";
import Image from "next/image";
import { BLUR_BASE64 } from "../../../utils/constants";

const columns = [
  { id: "category_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "category_image",
    label: "Hình ảnh",
    minWidth: 170,
    align: "center",
  },
  {
    id: "category_name",
    label: "Tên danh mục",
    minWidth: 170,
    align: "left",
  },
  {
    id: "category_description",
    label: "Mô tả",
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

export default function ProductCategory() {
  const [listCategory, setListCategory] = useState([]);
  const [addCategoryModal, setAddCategoryModal] = useState({
    status: false,
    type: "",
  });
  const [editCategory, setEditCategory] = useState({
    category_name: "",
    category_description: "",
    category_image: "",
    category_id: -1,
  });
  const [editCategoryError, setEditCategoryError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListCategory = async () => {
    try {
      const categoryRes = await getAllCategory();
      if (categoryRes?.data?.success) {
        setListCategory(categoryRes?.data?.payload?.category);
      }
    } catch (error) {
      console.log("get list category error >>> ", error);
    }
  };

  useEffect(() => {
    getListCategory();
  }, []);

  const handleCreatwUpdateCategory = async () => {
    setEditCategoryError({ status: false, type: "", message: "" });
    const { category_name, category_description, category_image } =
      editCategory;
    if (
      category_name?.trim()?.length <= 0 ||
      category_description?.trim()?.length <= 0 ||
      (addCategoryModal.type === "add" && typeof category_image === "string")
    ) {
      setEditCategoryError({
        status: true,
        type: "error",
        message: "Tên, mô tả và hình ảnh không được bỏ trống",
      });
    } else if (category_name.length <= 1) {
      setEditCategoryError({
        status: true,
        type: "error",
        message: "Tên phải nhiều hơn 1 kí tự",
      });
    } else if (category_description.length <= 10) {
      setEditCategoryError({
        status: true,
        type: "error",
        message: "Mô tả phải nhiều hơn 10 kí tự",
      });
    } else {
      let categoryData = {
        name: category_name,
        image: category_image || "",
        category_description: category_description,
      };

      if (typeof category_image !== "string") {
        const imageName = "category-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, category_image);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);
          categoryData.image = url;
        } else {
          setEditCategoryError({
            status: true,
            type: "error",
            message: "Không thể tải hình ảnh, Vui lòng thử lại sau",
          });
        }
      }

      /*Create category*/
      if (addCategoryModal.type === "add") {
        const createBranchRes = await createNewCategory(categoryData);
        if (createBranchRes?.data?.success) {
          setEditCategoryError({
            status: true,
            type: "success",
            message: "Thêm mới danh mục thành công",
          });
          getListCategory();
          setTimeout(() => {
            setAddCategoryModal({ status: false, type: "" });
          }, 1000);
          return true;
        } else {
          setEditCategoryError({
            status: true,
            type: "error",
            message: "Thêm mới danh mục thất bại",
          });
          return false;
        }

        /*Update category*/
      } else {
        const updateRes = await updateCategoryData(
          categoryData,
          editCategory?.category_id
        );

        if (updateRes?.data?.success) {
          setEditCategoryError({
            status: true,
            type: "success",
            message: "Cập nhật danh mục thành công",
          });
          getListCategory();
          setTimeout(() => {
            setAddCategoryModal({ status: false, type: "" });
          }, 1000);
          return true;
        } else {
          setEditCategoryError({
            status: true,
            type: "error",
            message: "Cập nhật danh mục thất bại",
          });
          return false;
        }
      }
    }
    return false;
  };

  const deleteCategoryData = async (categoryId) => {
    try {
      const deleteRes = await deleteCategory(categoryId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá danh mục thành công");
        getListCategory();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá danh mục thất bại");
      }
    } catch (error) {
      toast.error("Xoá danh mục thất bại");
    }
  };

  return (
    <>
      {addCategoryModal.status && (
        <CustomDialog
          onClose={() =>
            setAddCategoryModal({ ...addCategoryModal, status: false })
          }
          visible={addCategoryModal.status}
          title={
            addCategoryModal.type === "add"
              ? "Thêm mới danh mục"
              : "Cập nhật danh mục"
          }
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            return handleCreatwUpdateCategory();
          }}
          maxWidth="400px"
        >
          <CustomInput
            label="Tên"
            defaultValue={editCategory.category_name || ""}
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditCategory({
                ...editCategory,
                category_name: event.target.value,
              })
            }
          />

          <TextareaAutosize
            defaultValue={editCategory.category_description || ""}
            aria-label="minimum height"
            minRows={10}
            placeholder="Nhập mô tả"
            style={{ width: "100%", marginTop: "20px", padding: "10px" }}
            onChange={(event) =>
              setEditCategory({
                ...editCategory,
                category_description: event.target.value,
              })
            }
          />

          <Box sx={{ margin: "10px 0" }}>
            <Typography variant="p" component="p">
              Hình ảnh:
            </Typography>
            <CustomInput
              defaultValue=""
              id="post-title"
              variant="filled"
              style={{ marginTop: 11 }}
              type="file"
              onChange={(event) =>
                setEditCategory({
                  ...editCategory,
                  category_image: event.target.files[0],
                })
              }
            />
          </Box>

          {editCategoryError.status && (
            <Alert severity={editCategoryError.type}>
              {editCategoryError.message}
            </Alert>
          )}
        </CustomDialog>
      )}
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
          Quản lí danh mục
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setEditCategory({
                category_name: "",
                category_description: "",
                category_image: "",
              });
              setEditCategoryError({ status: false, type: "", message: "" });
              setAddCategoryModal({ status: true, type: "add" });
            }}
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
              {listCategory
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
                                <CustomPopover
                                  open={popoverId === row?.category_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    deleteCategoryData(row?.category_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá danh mục?"
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
                                      if (popoverId === row?.category_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.category_id);
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
                                    setEditCategoryError({
                                      status: false,
                                      type: "",
                                      message: "",
                                    });
                                    setEditCategory({
                                      category_name: row?.category_name,
                                      category_description:
                                        row?.category_description,
                                      category_image: row?.category_image,
                                      category_id: row?.category_id,
                                    });
                                    setAddCategoryModal({
                                      status: true,
                                      type: "update",
                                    });
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "category_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "category_image" ? (
                              <Image
                                src={value}
                                width={100}
                                height={100}
                                placeholder="blur"
                                blurDataURL={BLUR_BASE64}
                              />
                            ) : column.id === "category_name" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "category_description" ? (
                              <div
                                style={{
                                  maxWidth: "200px",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {value}
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
          count={listCategory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
