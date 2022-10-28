import React, { useCallback, useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import CustomPopover from "../../../components/CustomPopover";
import { debounce } from "@mui/material";
import "braft-editor/dist/index.css";
import storage from "../../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dateTimeConverter } from "../../../utils/common"; 
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CustomInput from "../../../components/CustomInput";
import {
  createNewPost,
  deletePostData,
  getAllPostList,
  updatePostData,
} from "../../../services/post";
import SearchIcon from "@mui/icons-material/Search";
import dynamic from "next/dynamic";
import CustomDialog from "../../../components/CustomDialog";
import Image from "next/image";
import { BLUR_BASE64 } from "../../../utils/constants";

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
  { id: "id", label: "Id", minWidth: 100 },
  { id: "blog_image", label: "Hình ảnh", minWidth: 170 },
  { id: "blog_title", label: "Tiêu đề", minWidth: 170 },
  {
    id: "create_at",
    label: "Ngày viết",
    minWidth: 170,
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
  },
];

const BraftEditor = dynamic(() => import("braft-editor"), {
  ssr: false,
});

export default function AdminPost(props) {
  const [allPostData, setAllPostData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPostModal, setOpenPostModal] = useState({
    status: false,
    type: "",
  });
  const [postModalData, setPostModalData] = useState({
    id: "",
    title: "",
    desc: "",
    image: "",
  });
  const [popoverId, setPopoverId] = useState("");
  const searchText = useRef('')
  const [braftValue, setBraftValue] = useState("");

  const setBraftEditorValue = async (value) => {
    const Braft = (await import("braft-editor")).default;
    setBraftValue(Braft?.createEditorState?.(value));
  };

  useEffect(() => {
    setBraftEditorValue("");
  }, []);

  const getAllPostData = async (search) => {
    try {
      const getPostRes = await getAllPostList(undefined, undefined, search || '');
      if (getPostRes?.data?.success) {
        setAllPostData(getPostRes?.data?.payload?.post);
      }
    } catch (error) {
      console.log("getAllPostData error: ", error);
    }
  };

  useEffect(() => {
    getAllPostData()
  }, [])

  const addNewPost = async () => {
    try {
      if (
        !postModalData?.title?.length ||
        !postModalData?.desc?.length ||
        typeof postModalData?.image === "string"
      ) {
        toast.error("Các trường không được bỏ trống");
        return false;
      } else {
        const postData = {
          title: postModalData.title,
          desc: postModalData.desc,
          image: postModalData.image,
        };
        const imageName = "post-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, postData.image);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);

          postData.image = url;
        } else {
          postData.image = "";
        }
        const addPostRes = await createNewPost(postData);
        if (addPostRes?.data && addPostRes?.data?.success) {
          getAllPostData();
          setOpenPostModal({ status: false, type: "" });
          setPostModalData({ id: "", title: "", desc: "", image: "" });
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const handleUpdatePostData = async () => {
    try {
      if (!postModalData.title.length || !postModalData.desc.length) {
        toast.error("Các trường không được để trống");
        return false;
      } else {
        const postData = {
          id: postModalData.id,
          title: postModalData.title,
          desc: postModalData.desc,
        };
        if (typeof postModalData?.image !== "string") {
          const imageName = "post-" + new Date().getTime();
          const storageRef = ref(storage, imageName);

          const updateImageRes = await uploadBytes(
            storageRef,
            postModalData?.image
          );
          if (updateImageRes) {
            const pathReference = ref(storage, imageName);
            const url = await getDownloadURL(pathReference);
            postData.image = url;
          } else {
            postData.image = "";
          }
        } else {
          postData.image = postModalData.image;
        }
        const addPostRes = await updatePostData(postData);

        if (addPostRes.data && addPostRes.data.success) {
          getAllPostData(searchText.current);
          setOpenPostModal({ status: false, type: "" });
          setPostModalData({ id: "", title: "", desc: "", image: "" });
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const deletePost = async (postId) => {
    try {
      const deletePostRes = await deletePostData(postId);
      if (deletePostRes.data && deletePostRes.data.success) {
        getAllPostData(searchText.current);
        toast.success("Xoá bài viết thành công");
      } else {
        toast.error("Xoá bài viết thất bại");
        props.setDeleteFailed();
      }
    } catch (error) {
      toast.error("Xoá bài viết thất bại");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const debounceSearch = useCallback(
    debounce(() => {
      getAllPostData(searchText.current);
    }, 200),
    []
  );

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

  return (
    <div>
      {openPostModal.status && (
        <CustomDialog
          onClose={() => setOpenPostModal({ status: false, type: "" })}
          visible={openPostModal.status}
          title={
            openPostModal.type === "add"
              ? "Thêm bài viết mới"
              : "Cập nhật bài viết"
          }
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            if (openPostModal.type === "add") {
              return addNewPost();
            } else if (openPostModal.type === "update") {
              return handleUpdatePostData();
            }
          }}
          maxWidth="1000px"
          width="1000px"
        >
          <CustomInput
            label="Tên bài viết"
            defaultValue=""
            id="post-title"
            variant="filled"
            style={{ marginTop: 11 }}
            value={postModalData.title}
            onChange={(event) =>
              setPostModalData({
                ...postModalData,
                title: event.target.value,
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
                  setPostModalData({
                    ...postModalData,
                    desc: editorState.toHTML(),
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
              onChange={(event) => {
                setPostModalData({
                  ...postModalData,
                  image: event.target.files[0],
                });
              }}
            />
          </Box>
        </CustomDialog>
      )}
      <Stack flexDirection={"row"} justifyContent={"space-between"}>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí bài viết
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setPostModalData({ id: "", title: "", desc: "", image: "" });
            setOpenPostModal({ status: true, type: "add" });
            setBraftValue(BraftEditor?.createEditorState?.(""));
          }}
        >
          Thêm mới
        </Button>
      </Stack>
      <br />

      <div className='homeSearchBar'>
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="Bạn muốn tìm kiếm bài viết gì?"
            onChange={(event) => searchText.current = event.target.value}
            onKeyUp={(event) => {
              if (event?.code === "Backspace") {
                debounceSearch();
              }
            }}
          />
          <button
            type="submit"
            className="searchButton"
            onClick={() => getAllPostData(searchText.current)}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
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
              {allPostData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                            {column.id === "id" ? (
                              page * 10 + (index + 1)
                            ) : column.id === "action" ? (
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
                                  onClick={async () => {
                                    setOpenPostModal({
                                      status: true,
                                      type: "update",
                                    });
                                    setPostModalData({
                                      id: row.blog_id,
                                      title: row.blog_title,
                                      desc: row.blog_desc,
                                      image: row.blog_image,
                                    });
                                    setBraftEditorValue(row.blog_desc);
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                                <CustomPopover
                                  open={popoverId === row.blog_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() => deletePost(row.blog_id)}
                                  noti="Bạn có chắc chắn muốn xoá bài viết?"
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
                                      if (popoverId === row.blog_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row.blog_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                              </Stack>
                            ) : column.id === "blog_image" ? (
                              <Image
                                src={row.blog_image}
                                width={100}
                                height={100}
                                alt=""
                                placeholder='blur'
                                blurDataURL={BLUR_BASE64}
                              />
                            ) : column.id === "create_at" ? (
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
          count={allPostData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
