import React, { useCallback, useEffect, useRef, useState } from "react";
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
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
  createNewProduct,
  deleteProductData,
  getListProduct,
  updateProductData,
} from "../../../services/product";
import { getAllCategory } from "../../../services/category";
import "braft-editor/dist/index.css";
import dynamic from "next/dynamic";
import { FORMAT_NUMBER } from "../../../utils/util.enum";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewProductDrawer from "../../../components/AdminProduct/ViewProductDrawer";
import styles from "./style.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import { BLUR_BASE64 } from "../../../utils/constants";

const maxFileSize = 500000; //100 kb
const controls = [
  "bold",
  "italic",
  "underline",
  "separator",
  "text-indent",
  "text-align",
  "list-ul",
  "list-ol",
  "link",
  "separator",
  "media",
];
const columns = [
  { id: "product_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "product_image",
    label: "Hình ảnh",
    minWidth: 170,
    align: "center",
  },
  {
    id: "product_name",
    label: "Tên sản phẩm",
    minWidth: 170,
    align: "left",
  },
  {
    id: "product_category",
    label: "Danh mục",
    minWidth: 170,
    align: "left",
  },
  {
    id: "product_price",
    label: "Giá",
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

const BraftEditor = dynamic(() => import("braft-editor"), {
  ssr: false,
});

export default function AdminProduct() {
  const [listProduct, setListProduct] = useState([]);
  const [addProductModal, setAddProductModal] = useState({
    status: false,
    type: "",
  });
  const [editProduct, setEditProduct] = useState({
    product_name: "",
    product_description: "",
    product_image: "",
    product_price: 0,
    product_category: -1,
    product_id: -1,
    product_quantity: -1
  });
  const [editProductError, setEditProductError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");
  const [listCategory, setListCategory] = useState([]);
  const [braftValue, setBraftValue] = useState("");
  const searchText = useRef("");

  const setBraftEditorValue = async (value) => {
    const Braft = (await import("braft-editor")).default;
    setBraftValue(Braft?.createEditorState?.(value));
  };

  useEffect(() => {
    setBraftEditorValue("");
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListProductData = async (searchText) => {
    try {
      const productRes = await getListProduct(searchText || "");
      if (productRes?.data?.success) {
        setListProduct(productRes?.data?.payload?.product);
      }
    } catch (error) {
      console.log("getListProductData error >>> ", error);
    }
  };

  const getListCategory = async () => {
    try {
      const categoryRes = await getAllCategory();
      if (categoryRes?.data?.success) {
        setListCategory(categoryRes?.data?.payload?.category);
      }
    } catch (error) {
      console.log("getListCategory error >>> ", error);
    }
  };

  useEffect(() => {
    getListProductData();
    getListCategory();
  }, []);

  const handleCreateUpdateProduct = async () => {
    setEditProductError({ status: false, type: "", message: "" });
    const {
      product_name,
      product_description,
      product_image,
      product_price,
      product_category,
      product_quantity
    } = editProduct;
    if (
      product_name.trim().length <= 0 ||
      product_description.trim().length <= 0 ||
      (addProductModal.type === "add" && typeof product_image === "string") ||
      product_category === -1
    ) {
      setEditProductError({
        status: true,
        type: "error",
        message: "Danh mục, tên, mô tả và hình ảnh không được bỏ trống",
      });
      return false;
    }
    if (Number(product_price) <= 0) {
      setEditProductError({
        status: true,
        type: "error",
        message: "Giá sản phẩm cần lớn hơn 0",
      });
      return false;
    }
    if (Number(product_quantity) <= 0) {
      setEditProductError({
        status: true,
        type: "error",
        message: "Số lượng sản phẩm cần lớn hơn 0",
      });
      return false;
    }
    if (product_name?.trim()?.length <= 1) {
      setEditProductError({
        status: true,
        type: "error",
        message: "Tên phải nhiều hơn 1 kí tự",
      });
      return false;
    }
    if (product_description?.trim()?.length <= 10) {
      setEditProductError({
        status: true,
        type: "error",
        message: "Mô tả phải nhiều hơn 10 kí tự",
      });
      return false;
    }

    let productData = { ...editProduct };

    if (typeof product_image !== "string") {
      const imageName = "category-" + new Date().getTime();
      const storageRef = ref(storage, imageName);

      const updateImageRes = await uploadBytes(storageRef, product_image);
      if (updateImageRes) {
        const pathReference = ref(storage, imageName);
        const url = await getDownloadURL(pathReference);
        productData.product_image = url;
      } else {
        setEditProductError({
          status: true,
          type: "error",
          message: "Không thể tải hình ảnh, Vui lòng thử lại sau",
        });
      }
    }

    /*Create category*/
    if (addProductModal.type === "add") {
      const createProductRes = await createNewProduct(productData);
      if (createProductRes?.data?.success) {
        setEditProductError({
          status: true,
          type: "success",
          message: "Thêm mới sản phẩm thành công",
        });
        getListProductData();
        setTimeout(() => {
          setAddProductModal({ status: false, type: "" });
        }, 1000);
        return true;
      } else {
        setEditProductError({
          status: true,
          type: "error",
          message: "Thêm mới sản phẩm thất bại",
        });
      }
      return false;
    }
    /*Update category*/
    const updateRes = await updateProductData(
      productData,
      editProduct?.product_id
    );

    if (updateRes?.data?.success) {
      setEditProductError({
        status: true,
        type: "success",
        message: "Cập nhật sản phẩm thành công",
      });
      getListProductData();
      setTimeout(() => {
        setAddProductModal({ status: false, type: "" });
      }, 1000);
      return true;
    } else {
      setEditProductError({
        status: true,
        type: "error",
        message: "Cập nhật sản phẩm thất bại",
      });
    }
    return false;
  };

  const deleteCategoryData = async (categoryId) => {
    try {
      const deleteRes = await deleteProductData(categoryId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá sản phẩm thành công");
        getListProductData();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá sản phẩm thất bại");
      }
    } catch (error) {
      toast.error("Xoá sản phẩm thất bại");
    }
  };

  const customUpload = async (props) => {
    const { file, success, error } = props;
    const imageName = "post-" + new Date().getTime();
    const storageRef = ref(storage, imageName);

    const updateImageRes = await uploadBytes(storageRef, file);
    if (updateImageRes) {
      const pathReference = ref(storage, imageName);
      const url = await getDownloadURL(pathReference);
      success({ url });
    } else {
      error("File upload failed");
      toast.warn("File upload failed");
    }
  };

  const validateFn = (file) => {
    let fileSizeError = "File tải lên không thể hơn 500 kb";

    if (file.size > maxFileSize) {
      toast.warn(fileSizeError);
      return false;
    }
    return true;
  };

  const debounceSearch = useCallback(
    debounce(() => {
      getListProductData(searchText.current);
    }, 200),
    []
  );

  return (
    <>
      {addProductModal.status && addProductModal.type !== "view" && (
        <CustomDialog
          onClose={() =>
            setAddProductModal({ ...addProductModal, status: false })
          }
          visible={addProductModal.status}
          title={
            addProductModal.type === "add"
              ? "Thêm mới sản phẩm"
              : "Cập nhật sản phẩm"
          }
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            return handleCreateUpdateProduct();
          }}
          maxWidth="800px"
          width="800px"
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={editProduct.product_category}
              label="Danh mục"
              onChange={(event) => {
                setEditProduct({
                  ...editProduct,
                  product_category: event.target.value,
                });
              }}
            >
              {listCategory?.map((item, index) => {
                return (
                  <MenuItem
                    key={`category-item-${index}`}
                    value={item?.category_id}
                  >
                    {item?.category_name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <CustomInput
            label="Tên sản phẩm"
            defaultValue={editProduct.product_name || ""}
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditProduct({
                ...editProduct,
                product_name: event.target.value,
              })
            }
          />
          <CustomInput
            label="Giá sản phẩm"
            defaultValue={editProduct.product_price || 0}
            type="number"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditProduct({
                ...editProduct,
                product_price: event.target.value,
              })
            }
          />
          <CustomInput
            label="Số lượng sản phẩm"
            defaultValue={editProduct?.product_quantity || 0}
            type="number"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditProduct({
                ...editProduct,
                product_quantity: event.target.value,
              })
            }
          />
          {typeof window !== "undefined" && (
            <div className="editor-wrapper" style={{ marginTop: "20px" }}>
              <label style={{ marginBottom: "10px" }}>Mô tả sản phẩm: </label>
              <BraftEditor
                language="en"
                controls={controls}
                media={{ uploadFn: customUpload, validateFn: validateFn }}
                contentStyle={{
                  height: 350,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
                }}
                value={braftValue}
                onChange={(editorState) => {
                  setBraftValue(editorState);
                  setEditProduct({
                    ...editProduct,
                    product_description: editorState.toHTML(),
                  });
                }}
              />
            </div>
          )}

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
                setEditProduct({
                  ...editProduct,
                  product_image: event.target.files[0],
                })
              }
            />
          </Box>

          {editProductError.status && (
            <Alert severity={editProductError.type}>
              {editProductError.message}
            </Alert>
          )}
        </CustomDialog>
      )}

      {addProductModal.status && addProductModal.type === "view" && (
        <ViewProductDrawer
          visible={addProductModal.status}
          initData={editProduct}
          onClose={() => setAddProductModal({ status: false, type: "" })}
        />
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
          Quản lí sản phẩm
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setEditProduct({
                product_name: "",
                product_description: "",
                product_image: "",
                product_price: 0,
                product_quantity: 0,
                product_category: -1,
              });
              setEditProductError({ status: false, type: "", message: "" });
              setAddProductModal({ status: true, type: "add" });
              setBraftEditorValue("");
            }}
          >
            Thêm mới
          </Button>
        </div>
      </Stack>
      <div className={styles.homeSearchBar}>
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="Bạn muốn tìm kiếm sản phẩm gì?"
            onChange={(event) => (searchText.current = event.target.value)}
            onKeyUp={(event) => {
              if (event?.code === "Backspace") {
                debounceSearch();
              }
            }}
          />
          <button
            type="submit"
            className="searchButton"
            onClick={() => getListProductData(searchText.current)}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

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
                                <CustomPopover
                                  open={popoverId === row?.product_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    deleteCategoryData(row?.product_id)
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
                                      if (popoverId === row?.product_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.product_id);
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
                                    setEditProductError({
                                      status: false,
                                      type: "",
                                      message: "",
                                    });
                                    setEditProduct({
                                      product_name: row?.product_name,
                                      product_description:
                                        row?.product_description,
                                      product_image: row?.product_image,
                                      product_id: row?.product_id,
                                      product_price: row?.product_price,
                                      product_category: row?.product_category,
                                      product_quantity: row?.product_quantity
                                    });
                                    setBraftEditorValue(
                                      row?.product_description
                                    );
                                    setAddProductModal({
                                      status: true,
                                      type: "update",
                                    });
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                                <Button
                                  color="success"
                                  sx={{
                                    height: "30px",
                                    padding: 0,
                                    width: "fit-content",
                                    minWidth: "30px",
                                  }}
                                  variant="text"
                                  onClick={() => {
                                    setAddProductModal({
                                      status: true,
                                      type: "view",
                                    });
                                    setEditProduct({
                                      product_name: row?.product_name,
                                      product_description:
                                        row?.product_description,
                                      product_image: row?.product_image,
                                      product_id: row?.product_id,
                                      product_price: row?.product_price,
                                      product_category: row?.product_category,
                                      product_quantity: row?.product_quantity,
                                      category_name: listCategory?.find(
                                        (it) =>
                                          it?.category_id ===
                                          row?.product_category
                                      )?.category_name,
                                      create_at: row?.create_at,
                                      product_sale: row?.product_sale,
                                      promo: row?.promo,
                                    });
                                  }}
                                >
                                  <RemoveRedEyeIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "product_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "product_image" ? (
                              <Image
                                src={value}
                                width={100}
                                height={100}
                                placeholder="blur"
                                blurDataURL={BLUR_BASE64}
                              />
                            ) : column.id === "product_name" ? (
                              <div style={{ fontWeight: 600, color: "blue" }}>
                                {value}
                              </div>
                            ) : column.id === "product_price" ? (
                              <div style={{ fontWeight: 600 }}>
                                {FORMAT_NUMBER.format(value)}đ
                              </div>
                            ) : column.id === "product_category" ? (
                              <div style={{ fontWeight: 600 }}>
                                {
                                  listCategory?.find(
                                    (it) => it?.category_id === value
                                  )?.category_name
                                }
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
          count={listProduct.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
