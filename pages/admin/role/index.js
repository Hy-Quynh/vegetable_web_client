import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import CustomInput from "../../../components/CustomInput";
import CustomDialog from "../../../components/CustomDialog";
import {
  createNewRole,
  deleteRole,
  getAllRole,
  updateRole,
} from "../../../services/role";
import { ADMIN_ROLE } from "../../../utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Tab, Tabs } from "@mui/material";
import UserPermission from "../../../components/AdminRole/UserPermisstion";

const columns = [
  { id: "id", label: "Id", minWidth: 100 },
  { id: "role_name", label: "Tên", minWidth: 250 },
  {
    id: "role_function",
    label: "Chức năng",
    minWidth: 170,
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
  },
];

export default function ComponentAdminAccountRole(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allRoleData, setAllRoleData] = useState([]);
  const [openRoleModal, setOpenRoleModal] = useState({
    status: false,
    type: "",
  });
  const [newRoleData, setNewRoleData] = useState({
    name: "",
    role_function: "admin-dashboard",
  });
  const [addRoleNoti, setAddRoleNoti] = useState({
    status: false,
    noti: "",
    type: "",
  }); /*display noti in modal when add and update*/
  const [comfirmDelete, setComfirmDelete] = useState({
    status: false,
    columnId: "",
  });
  const [roleTab, setRoleTab] = React.useState(0);

  const handleChangeRoleTab = (event, newValue) => {
    setRoleTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllRoleData = async () => {
    try {
      const roleRes = await getAllRole();

      if (roleRes.data && roleRes.data.success) {
        setAllRoleData(roleRes.data.payload);
      }
    } catch (error) {
      console.log("get role error: ", error);
    }
  };

  useEffect(() => {
    getAllRoleData();
  }, []);

  const addNewRole = async () => {
    try {
      setAddRoleNoti({ status: false, noti: "", type: "" });
      if (!newRoleData.name.length || !newRoleData.role_function.length) {
        setAddRoleNoti({
          status: true,
          noti: "Các trường không được để trống",
          type: "error",
        });
      } else {
        const addRes = await createNewRole({
          name: newRoleData.name,
          role_function: newRoleData.role_function,
        });

        if (!addRes.data.success) {
          return false;
        }
        getAllRoleData();
        setOpenRoleModal({ status: false, type: "" });
        setNewRoleData({ name: "", role_function: "admin-dashboard" });
        return true;
      }
      return false;
    } catch (error) {
      setAddRoleNoti({ status: true, noti: error.message, type: "error" });
      return false;
    }
  };

  const handleUpdateRole = async () => {
    try {
      if (!newRoleData.name.length || !newRoleData.role_function.length) {
        setAddRoleNoti({
          status: true,
          noti: "Các trường không được để trống",
          type: "error",
        });
      } else {
        const addRes = await updateRole({
          id: newRoleData.role_id,
          name: newRoleData.name,
          role_function: newRoleData.role_function,
        });

        if (addRes.data && addRes.data.success) {
          getAllRoleData();
          setOpenRoleModal({ status: false, type: "" });
          setNewRoleData({ name: "", role_function: "admin-dashboard" });
          return true;
        }
      }
      return false;
    } catch (error) {
      setAddRoleNoti({ status: true, noti: error.message, type: "error" });
      return false;
    }
  };

  return (
    <div>
      {comfirmDelete.status ? (
        <ComfirmDeteleModal
          status={comfirmDelete.status}
          columnId={comfirmDelete.columnId}
          setStatus={(status) =>
            setComfirmDelete({ columnId: "", status: status })
          }
          setDeleteSuccess={() => {
            getAllRoleData();
            setComfirmDelete({ columnId: "", status: false });
          }}
        />
      ) : (
        ""
      )}

      {openRoleModal.status && (
        <CustomDialog
          onClose={() => setOpenRoleModal({ status: false, type: "" })}
          visible={openRoleModal.status}
          title={
            openRoleModal.type === "add" ? "Thêm mới quyền" : "Cập nhật quyền"
          }
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            if (openRoleModal.type === "add") {
              return addNewRole();
            } else if (openRoleModal.type === "update") {
              return handleUpdateRole();
            }
          }}
          maxWidth="800px"
        >
          <CustomInput
            label="Tên"
            defaultValue=""
            id="contact-address"
            variant="filled"
            style={{ marginTop: 11 }}
            value={newRoleData.name}
            onChange={(event) =>
              setNewRoleData({ ...newRoleData, name: event.target.value })
            }
          />

          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="p" component="p">
              Quyền:
            </Typography>
            <FormGroup>
              {ADMIN_ROLE.map((roleItem, roleIndex) => {
                return (
                  <FormControlLabel
                    key={`add-role-modal-${roleIndex}`}
                    control={
                      <Checkbox
                        disabled={roleItem.value === "admin-dashboard"}
                        checked={newRoleData.role_function
                          .split(",")
                          .includes(roleItem.value)}
                        onChange={(event) => {
                          let roleCheck = newRoleData.role_function.split(",");
                          if (roleCheck.indexOf(roleItem.value) >= 0) {
                            roleCheck = roleCheck.filter(
                              (item) => item !== roleItem.value
                            );
                          } else {
                            roleCheck.push(roleItem.value);
                          }

                          roleCheck = roleCheck.filter((item) => item.length);
                          setNewRoleData({
                            ...newRoleData,
                            role_function: roleCheck.toString(),
                          });
                        }}
                      />
                    }
                    label={roleItem.label}
                  />
                );
              })}
            </FormGroup>
          </Box>

          {addRoleNoti.status && (
            <Alert severity={addRoleNoti.type} sx={{ marginTop: "10px" }}>
              {addRoleNoti.noti}
            </Alert>
          )}
        </CustomDialog>
      )}
      <Tabs
        value={roleTab}
        onChange={handleChangeRoleTab}
        aria-label="disabled tabs example"
      >
        <Tab label="Quản lí quyền" />
        <Tab label="Phân quyền User" />
      </Tabs>
      {roleTab === 0 ? (
        <div>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            sx={{ marginTop: "20px" }}
          >
            <Typography variant="h5" component="h2">
              Phân quyền
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setOpenRoleModal({ status: true, type: "add" });
                setNewRoleData({ name: "", role_function: "admin-dashboard" });
              }}
            >
              Thêm mới
            </Button>
          </Stack>
          <br />

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                  {allRoleData
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
                                      onClick={() => {
                                        setNewRoleData({
                                          role_id: row.role_id,
                                          name: row.role_name,
                                          role_function: row.role_function,
                                        });
                                        setOpenRoleModal({
                                          status: true,
                                          type: "update",
                                        });
                                      }}
                                      disabled={
                                        row.role_name === "user" ||
                                        row.role_name === "admin"
                                          ? true
                                          : false
                                      }
                                    >
                                      <BorderColorIcon />
                                    </Button>
                                    <Button
                                      sx={{
                                        height: "30px",
                                        padding: 0,
                                        width: "fit-content",
                                        minWidth: "30px",
                                      }}
                                      variant="text"
                                      color="error"
                                      onClick={() =>
                                        setComfirmDelete({
                                          status: true,
                                          columnId: row.role_id,
                                        })
                                      }
                                      disabled={
                                        row.role_name === "user" ||
                                        row.role_name === "admin"
                                          ? true
                                          : false
                                      }
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  </Stack>
                                ) : column.id === "role_function" ? (
                                  <ul>
                                    {row.role_function
                                      .split(",")
                                      .map((roleItem, roleIndex) => {
                                        const getValueFromLabel =
                                          ADMIN_ROLE.find(
                                            (item) => item.value === roleItem
                                          );
                                        if (getValueFromLabel) {
                                          return (
                                            <li>{getValueFromLabel.label}</li>
                                          );
                                        } else {
                                          return <li></li>;
                                        }
                                      })}
                                  </ul>
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
              count={allRoleData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <UserPermission />
        </div>
      )}
    </div>
  );
}

const ComfirmDeteleModal = (props) => {
  const [comfirmDeleteModal, setComfirmDeleteModal] = useState(false);
  const [comfirmId, setColumnId] = useState("");

  useEffect(() => {
    setComfirmDeleteModal(props.status);
    setColumnId(props.columnId);
  }, []);

  const hanleDeleteRole = async (columnId) => {
    try {
      const deleteRoleRes = await deleteRole(columnId);

      if (deleteRoleRes.data && deleteRoleRes.data.success) {
        props.setDeleteSuccess();
        return true;
      }
      return fasle;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      <CustomDialog
        onClose={() => {
          props.setStatus(false);
          setComfirmDeleteModal(false);
        }}
        visible={comfirmDeleteModal}
        title={"Xác nhận xoá"}
        closeTitle="Đóng"
        closeSubmitTitle={"Xác nhận"}
        handleSubmit={() => {
          return hanleDeleteRole(comfirmId);
        }}
        maxWidth="400px"
      >
        Bạn có chắc chắn muốn xoá?
      </CustomDialog>
    </div>
  );
};
