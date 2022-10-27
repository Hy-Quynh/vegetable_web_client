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
import { Alert, Button, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPopover from "../../../components/CustomPopover";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  createNewHelper,
  deleteHelper,
  getAllHelper,
} from "../../../services/helper";
import CustomDialog from "../../../components/CustomDialog";
import CustomInput from "../../../components/CustomInput";
import dynamic from "next/dynamic";
import "braft-editor/dist/index.css";
import storage from "../../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { dateTimeConverter } from "../../../utils/common";

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
  { id: "helper_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "helper_text",
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

export default function AdminFAQ() {
  const [listHelper, setListHelper] = useState([]);
  const [addHelperModal, setAddHelperModal] = useState({
    status: false,
    type: "",
  });
  const [editHelper, setEditHelper] = useState({
    helper_id: "",
    helper_text: "",
    helper_description: "",
  });
  const [editHelperError, setEditHelperError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");
  const [braftValue, setBraftValue] = useState("");

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

  const getListHelper = async () => {
    try {
      const topicRes = await getAllHelper();
      if (topicRes?.data?.success) {
        setListHelper(topicRes?.data?.payload);
      }
    } catch (error) {
      console.log("ggetListTopic error >>> ", error);
    }
  };

  useEffect(() => {
    getListHelper();
  }, []);

  const handleCreateNewHelper = async () => {
    setEditHelperError({
      status: false,
      type: "",
      message: "",
    });

    if (
      !editHelper?.helper_text?.trim()?.length ||
      !editHelper?.helper_description?.trim()?.length
    ) {
      setEditHelperError({
        status: true,
        type: "error",
        message: "Dữ liệu không được bỏ trống",
      });
      return false;
    }
    const createRes = await createNewHelper({
      helperText: editHelper?.helper_text,
      helperDescription: editHelper?.helper_description,
    });

    if (createRes?.data?.success) {
      getListHelper();
      setAddHelperModal({ status: false, type: "" });
      return true;
    }
    return false;
  };

  const handleDeleteHelper = async (helperId) => {
    try {
      const deleteRes = await deleteHelper(helperId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá trợ giúp thành công");
        getListHelper();
        setPopoverId("");
      } else {
        v;
        toast.error(deleteRes?.data?.error?.message || "Xoá trợ giúp thất bại");
      }
    } catch (error) {
      toast.error("Xoá trợ giúp thất bại");
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

  return (
    <>
      <div>
        <CustomDialog
          onClose={() =>
            setAddHelperModal({ ...addHelperModal, status: false })
          }
          visible={addHelperModal.status}
          title={
            addHelperModal.type === "add"
              ? "Thêm mới chủ đề"
              : "Cập nhật chủ đề"
          }
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            return handleCreateNewHelper();
          }}
          maxWidth="800px"
          width="800px"
        >
          <CustomInput
            label="Tiêu đề"
            defaultValue={editHelper.helper_text || ""}
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditHelper({
                ...editHelper,
                helper_text: event.target.value,
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
                  setEditHelper({
                    ...editHelper,
                    helper_description: editorState.toHTML(),
                  });
                }}
              />
            </div>
          )}

          {editHelperError.status && (
            <Alert severity={editHelperError.type}>
              {editHelperError.message}
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
          FAQ
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setBraftEditorValue("");
              setEditHelper({
                helper_text: "",
                helper_description: "",
                topic_image: "",
              });
              setEditHelperError({ status: false, type: "", message: "" });
              setAddHelperModal({ status: true, type: "add" });
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
              {listHelper
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
                                  open={popoverId === row?.helper_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    handleDeleteHelper(row?.helper_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá Câu hỏi thường gặp này?"
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
                                      if (popoverId === row?.helper_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.helper_id);
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
                                    setEditHelperError({
                                      status: false,
                                      type: "",
                                      message: "",
                                    });
                                    setEditHelper({
                                      helper_text: row?.helper_text,
                                      helper_description:
                                        row?.helper_description,
                                      helper_id: row?.helper_id,
                                    });
                                    setAddHelperModal({
                                      status: true,
                                      type: "update",
                                    });
                                    setBraftEditorValue(row.helper_description);
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "helper_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "helper_text" ? (
                              <div style={{ fontWeight: 700 }}>{value}</div>
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
          count={listHelper.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
