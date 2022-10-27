import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Alert, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box } from "@mui/system";
import SwipeableTemporaryDrawer from "../../../components/AdminAccount/ViewUserDrawer";
import { ToastContainer, toast } from "react-toastify";
import AddManagerModal from "../../../components/AdminAccount/AddManagerModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CustomPopover from "../../../components/CustomPopover";
import ChangeStatusPopover from "../../../components/AdminAccount/ChangeStatusPopover";
import {
  changeUserStatus,
  deleteUser,
  getAllUser,
} from "../../../services/user";
import { userSignup } from "../../../services/auth";
import { ADMIN_ROLE } from "../../../utils/constants";
import { getAllRole } from "../../../services/role";

const userColumns = [
  { id: "stt", label: "Số thứ tự", minWidth: 170 },
  { id: "name", label: "Tên", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "phone_number",
    label: "SĐT",
    minWidth: 170,
    align: "right",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
  },
];

const adminColumns = [
  { id: "stt", label: "Số thứ tự", minWidth: 170 },
  { id: "name", label: "Tên", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "phone_number",
    label: "SĐT",
    minWidth: 170,
    align: "right",
  },
  {
    id: "role_id",
    label: "Quyền",
    minWidth: 170,
    align: "left",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
  },
];

export default function AdminAccount() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentTab, setCurrentTab] = useState("user");
  const [tableData, setTableData] = useState([]);
  const [viewUserData, setViewUserData] = useState({});
  const [visibleUserDrawer, setVisibleUserDrawer] = useState(false);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [popoverId, setPopoverId] = useState("");
  const [changeStatusPopoverId, setChangeStatusPopoverId] = useState("");
  const [allRoleData, setAllRoleData] = useState([]);

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

  const getAllUserData = async () => {
    setTableData([]);
    const accountRes = await getAllUser(currentTab);
    if (accountRes?.data?.payload?.user?.length) {
      setTableData(accountRes?.data?.payload?.user);
    }
  };

  useEffect(() => {
    getAllUserData();
  }, [currentTab]);

  useEffect(() => {
    getAllRoleData();
  }, []);

  const handleCreateManager = async (managerData) => {
    const { address, email, firstName, lastName, password, phone, role } =
      managerData;
    const createData = {
      firstName,
      lastName,
      email: email,
      phone_number: phone,
      address: address,
      password: password,
      role: role,
      type: "admin",
    };
    const createRes = await userSignup(createData);
    if (createRes?.data?.success) {
      getAllUserData();
      setVisibleAddModal(false);
      toast.success("Thêm mới nhân viên quản lí thành công");
      return { success: true };
    } else {
      toast.error("Thêm mới nhân viên quản lí thất bại");
      return createRes;
    }
  };

  const handleChangeUserStatus = async (status, userId) => {
    const changeStatusRes = await changeUserStatus(status, userId, currentTab);

    if (changeStatusRes?.data?.success) {
      getAllUserData();
      toast.success("Cập nhật trạng thái thành công");
      setPopoverId("");
    } else {
      toast.error(
        changeStatusRes?.data?.error?.message || "Cập nhật trạng thái thất bại"
      );
    }
  };

  const handleDeleteAccount = async (userId) => {
    const deleteRes = await deleteUser(userId, currentTab);

    if (deleteRes?.data?.success) {
      getAllUserData();
      toast.success("Xoá tài khoản thành công");
      setPopoverId("");
    } else {
      toast.error(deleteRes?.data?.error?.message || "Xoá tài khoản thất bại");
    }
  };

  const displayStatus = (status, userId) => {
    if (status === 0) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === userId}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) => {
            handleChangeUserStatus(selectStatus, userId);
            return;
          }}
        >
          <Alert
            color="error"
            icon={false}
            onClick={() => setChangeStatusPopoverId(userId)}
            sx={{ cursor: "pointer" }}
          >
            Vô hiệu hoá
          </Alert>
        </ChangeStatusPopover>
      );
    } else if (status === 1) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === userId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) => {
            handleChangeUserStatus(selectStatus, userId);
            return;
          }}
        >
          <Alert
            color="success"
            icon={false}
            sx={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => setChangeStatusPopoverId(userId)}
          >
            Hoạt động
          </Alert>
        </ChangeStatusPopover>
      );
    }
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
          Quản lí tài khoản
        </Typography>
        <div>
          <Button variant="contained" onClick={() => setVisibleAddModal(true)}>
            Thêm mới
          </Button>
        </div>
      </Stack>
      <Box sx={{ marginBottom: "10px" }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="user" label="Khách hàng" />
          <Tab value="admin" label="Nhân viên" />
        </Tabs>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {(currentTab === "user" ? userColumns : adminColumns)?.map(
                  (column) => (
                    <TableCell
                      key={column?.id}
                      align={column?.align}
                      style={{ minWidth: column?.minWidth }}
                    >
                      {column?.label}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {(currentTab === "user" ? userColumns : adminColumns).map(
                        (column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "action" ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    flexWrap: "nowrap",
                                  }}
                                >
                                  <Button
                                    sx={{
                                      height: "30px",
                                      padding: 0,
                                      width: "fit-content",
                                      minWidth: "30px",
                                    }}
                                    variant="text"
                                    color="success"
                                    onClick={() => {
                                      setViewUserData(row);
                                      setVisibleUserDrawer(true);
                                    }}
                                  >
                                    {value}
                                    <RemoveRedEyeIcon />
                                  </Button>
                                  <CustomPopover
                                    open={
                                      currentTab === "user"
                                        ? popoverId === row.user_id
                                        : popoverId === row.admin_id
                                    }
                                    onClose={() => setPopoverId("")}
                                    handleSubmit={() =>
                                      handleDeleteAccount(
                                        currentTab === "user"
                                          ? row?.user_id
                                          : row?.admin_id
                                      )
                                    }
                                    noti="Tất cả thông tin của khách hàng sẽ bị mất hoàn toàn khi tài khoản bị xoá"
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
                                          currentTab === "user"
                                            ? popoverId === row.user_id
                                            : popoverId === row.admin_id
                                        ) {
                                          setPopoverId("");
                                        } else {
                                          setPopoverId(
                                            currentTab === "user"
                                              ? row?.user_id
                                              : row?.admin_id
                                          );
                                        }
                                      }}
                                    >
                                      <DeleteForeverIcon />
                                    </Button>
                                  </CustomPopover>
                                </div>
                              ) : column.id === "name" ? (
                                <div>
                                  {row?.first_name + " " + row?.last_name}
                                </div>
                              ) : column.id === "status" ? (
                                displayStatus(
                                  row?.status,
                                  currentTab === "user"
                                    ? row?.user_id
                                    : row?.admin_id
                                )
                              ) : column.id === "stt" ? (
                                index + 1
                              ) : column.id === "role_id" ? (
                                <div style={{ fontWeight: 700, color: "red" }}>
                                  {
                                    allRoleData?.find(
                                      (item) =>
                                        Number(item.role_id) === Number(value)
                                    )?.role_name
                                  }
                                </div>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        }
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {visibleUserDrawer && (
        <SwipeableTemporaryDrawer
          visible={visibleUserDrawer}
          initData={viewUserData}
          onClose={() => setVisibleUserDrawer(false)}
          type={currentTab}
        />
      )}

      {visibleAddModal && (
        <AddManagerModal
          visible={visibleAddModal}
          onClose={() => setVisibleAddModal(false)}
          handleSubmit={(managerData) => handleCreateManager(managerData)}
        />
      )}
    </>
  );
}
