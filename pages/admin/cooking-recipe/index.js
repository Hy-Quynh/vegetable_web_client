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
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPopover from "../../../components/CustomPopover";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SearchIcon from "@mui/icons-material/Search";
import CustomDialog from "../../../components/CustomDialog";
import CustomInput from "../../../components/CustomInput";
import dynamic from "next/dynamic";
import "braft-editor/dist/index.css";
import storage from "../../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dateTimeConverter } from "../../../utils/common";
import {
  createNewCookingRecipe,
  deleteCookingRecipe,
  getAllCookingRecipe,
  updateCookingRecipeData,
} from "../../../services/cookingRecipe";
import Image from "next/image";
import { BLUR_BASE64 } from "../../../utils/constants";
import { debounce } from "lodash";

const maxFileSize = 500000; //500 kb
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
  { id: "cooking_recipe_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "cooking_recipe_avatar",
    label: "Hình ảnh",
    minWidth: 170,
    align: "left",
  },
  {
    id: "cooking_recipe_text",
    label: "Tiêu đề",
    minWidth: 170,
    align: "left",
  },
  {
    id: "create_at",
    label: "Ngày tạo",
    minWidth: 170,
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

export default function CookingRecipe() {
  const [listCookingRecipe, setListCookingRecipe] = useState([]);
  const [addCookingRecipeModal, setAddCookingRecipeModal] = useState({
    status: false,
    type: "",
  });
  const [editCookingRecipe, setEditCookingRecipe] = useState({
    cooking_recipe_id: "",
    cooking_recipe_text: "",
    cooking_recipe_description: "",
    cooking_recipe_avatar: "",
  });
  const [editCookingRecipeError, setEditCookingRecipeError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");
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

  const getListCookingRecipe = async (search = "") => {
    try {
      const topicRes = await getAllCookingRecipe(undefined, undefined, search);
      if (topicRes?.data?.success) {
        setListCookingRecipe(topicRes?.data?.payload?.cookingRecipe);
      }
    } catch (error) {
      console.log("ggetListTopic error >>> ", error);
    }
  };

  useEffect(() => {
    getListCookingRecipe();
  }, []);

  const addNewCookingRecipe = async () => {
    try {
      if (
        !editCookingRecipe?.cooking_recipe_text?.length ||
        !editCookingRecipe?.cooking_recipe_description?.length ||
        typeof editCookingRecipe?.cooking_recipe_avatar === "string"
      ) {
        toast.error("Các trường không được bỏ trống");
        return false;
      } else {
        const cookingRecipeData = {
          cooking_recipe_text: editCookingRecipe.cooking_recipe_text,
          cooking_recipe_description:
            editCookingRecipe.cooking_recipe_description,
          cooking_recipe_avatar: editCookingRecipe.cooking_recipe_avatar,
        };
        const imageName = "cooking-recipe-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(
          storageRef,
          cookingRecipeData.cooking_recipe_avatar
        );
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);

          cookingRecipeData.cooking_recipe_avatar = url;
        } else {
          cookingRecipeData.cooking_recipe_avatar = "";
        }
        const addPostRes = await createNewCookingRecipe(cookingRecipeData);
        if (addPostRes?.data && addPostRes?.data?.success) {
          getListCookingRecipe();
          setAddCookingRecipeModal({ status: false, type: "" });
          setEditCookingRecipe({
            cooking_recipe_id: "",
            cooking_recipe_text: "",
            cooking_recipe_description: "",
            cooking_recipe_avatar: "",
          });
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const handleUpdateCookingRecipeData = async () => {
    try {
      if (
        !editCookingRecipe.cooking_recipe_text.length ||
        !editCookingRecipe.cooking_recipe_description.length
      ) {
        toast.error("Các trường không được để trống");
        return false;
      } else {
        const cookingRecipeData = {
          cooking_recipe_id: editCookingRecipe.cooking_recipe_id,
          cooking_recipe_text: editCookingRecipe.cooking_recipe_text,
          cooking_recipe_description:
            editCookingRecipe.cooking_recipe_description,
          cooking_recipe_avatar: "",
        };
        if (typeof editCookingRecipe?.cooking_recipe_avatar !== "string") {
          const imageName = "post-" + new Date().getTime();
          const storageRef = ref(storage, imageName);

          const updateImageRes = await uploadBytes(
            storageRef,
            editCookingRecipe?.cooking_recipe_avatar
          );
          if (updateImageRes) {
            const pathReference = ref(storage, imageName);
            const url = await getDownloadURL(pathReference);
            cookingRecipeData.cooking_recipe_avatar = url;
          } else {
            cookingRecipeData.cooking_recipe_avatar = "";
          }
        } else {
          cookingRecipeData.cooking_recipe_avatar =
            editCookingRecipe.cooking_recipe_avatar;
        }
        const addPostRes = await updateCookingRecipeData(cookingRecipeData);

        if (addPostRes.data && addPostRes.data.success) {
          getListCookingRecipe();
          setAddCookingRecipeModal({ status: false, type: "" });
          setEditCookingRecipe({
            cooking_recipe_id: "",
            cooking_recipe_text: "",
            cooking_recipe_description: "",
            cooking_recipe_avatar: "",
          });
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const handleDeleteCookingRecipe = async (cookingRecipeId) => {
    try {
      const deleteRes = await deleteCookingRecipe(cookingRecipeId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá công thức nấu ăn thành công");
        getListCookingRecipe();
        setPopoverId("");
      } else {
        v;
        toast.error(
          deleteRes?.data?.error?.message || "Xoá công thức nấu ăn thất bại"
        );
      }
    } catch (error) {
      toast.error("Xoá công thức nấu ăn thất bại");
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
    let fileSizeError = "File tải lên không thể quá 500 kb";

    if (file.size > maxFileSize) {
      toast.warn(fileSizeError);
      return false;
    }
    return true;
  };

  const debounceSearch = useCallback(
    debounce(() => {
      getListCookingRecipe(searchText.current);
    }, 200),
    []
  );

  return (
    <>
      <div>
        <CustomDialog
          onClose={() =>
            setAddCookingRecipeModal({
              ...addCookingRecipeModal,
              status: false,
            })
          }
          visible={addCookingRecipeModal.status}
          title={
            addCookingRecipeModal.type === "add"
              ? "Thêm mới công thức nấu ăn"
              : "Cập nhật công thức nấu ăn"
          }
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            if (addCookingRecipeModal.type === "add") {
              return addNewCookingRecipe();
            } else if (addCookingRecipeModal.type === "update") {
              return handleUpdateCookingRecipeData();
            }
          }}
          maxWidth="800px"
          width="800px"
        >
          <CustomInput
            label="Tên công thức nấu ăn"
            defaultValue={editCookingRecipe.cooking_recipe_text || ""}
            id="post-cooking_recipe_text"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditCookingRecipe({
                ...editCookingRecipe,
                cooking_recipe_text: event.target.value,
              })
            }
          />

          {typeof window !== "undefined" && (
            <div className="editor-wrapper">
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
                  setEditCookingRecipe({
                    ...editCookingRecipe,
                    cooking_recipe_description: editorState.toHTML(),
                  });
                }}
              />
            </div>
          )}

          <Box sx={{ margin: "10px 0" }}>
            <Typography variant="p" component="p">
              Hình ảnh công thức:
            </Typography>
            <CustomInput
              defaultValue=""
              id="post-cooking_recipe_text"
              variant="filled"
              style={{ marginTop: 11 }}
              type="file"
              onChange={(event) => {
                setEditCookingRecipe({
                  ...editCookingRecipe,
                  cooking_recipe_avatar: event.target.files[0],
                });
              }}
            />
          </Box>

          {editCookingRecipeError.status && (
            <Alert severity={editCookingRecipeError.type}>
              {editCookingRecipeError.message}
            </Alert>
          )}
        </CustomDialog>
      </div>
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
          Công thức nấu ăn
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setBraftEditorValue("");
              setEditCookingRecipe({
                cooking_recipe_text: "",
                cooking_recipe_description: "",
                cooking_recipe_avatar: "",
              });
              setEditCookingRecipeError({
                status: false,
                type: "",
                message: "",
              });
              setAddCookingRecipeModal({ status: true, type: "add" });
            }}
          >
            Thêm mới
          </Button>
        </div>
      </Stack>

      <div className="homeSearchBar">
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="Bạn muốn tìm kiếm công thức gì?"
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
            onClick={() => getListCookingRecipe(searchText.current)}
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
              {listCookingRecipe
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
                                  open={popoverId === row?.cooking_recipe_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    handleDeleteCookingRecipe(
                                      row?.cooking_recipe_id
                                    )
                                  }
                                  noti="Bạn có chắc chắn muốn xoá công thức nấu ăn này?"
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
                                      if (
                                        popoverId === row?.cooking_recipe_id
                                      ) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.cooking_recipe_id);
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
                                    setEditCookingRecipeError({
                                      status: false,
                                      type: "",
                                      message: "",
                                    });
                                    setEditCookingRecipe({
                                      cooking_recipe_text:
                                        row?.cooking_recipe_text,
                                      cooking_recipe_description:
                                        row?.cooking_recipe_description,
                                      cooking_recipe_avatar:
                                        row?.cooking_recipe_avatar,
                                      cooking_recipe_id: row?.cooking_recipe_id,
                                    });
                                    setAddCookingRecipeModal({
                                      status: true,
                                      type: "update",
                                    });
                                    setBraftEditorValue(
                                      row.cooking_recipe_description
                                    );
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "cooking_recipe_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "cooking_recipe_text" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "cooking_recipe_avatar" ? (
                              <Image
                                src={
                                  value !== "undefined" &&
                                  typeof value !== "undefined"
                                    ? value
                                    : ""
                                }
                                alt="cooking-recipe-image"
                                width={100}
                                height={100}
                                placeholder="blur"
                                blurDataURL={BLUR_BASE64}
                              />
                            ) : column.id === "create_at" ? (
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
          count={listCookingRecipe.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
