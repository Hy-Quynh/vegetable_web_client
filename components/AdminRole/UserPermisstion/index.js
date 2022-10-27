import React, { useState, useEffect, useRef, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { getAllRole } from "../../../services/role";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import styles from "./style.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { getAllUser, updateAdminRole } from "../../../services/user";
import { debounce } from "lodash";
import CustomDialog from "../../CustomDialog";

const userColumns = [
  { id: "stt", label: "STT", minWidth: 70 },
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

export default function UserPermission() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableData, setTableData] = useState([]);
  const [allRoleData, setAllRoleData] = useState([]);
  const [visibleUpdateUserRole, setVisibleUpdateUserRole] = useState(false);
  const [userUpdateData, setUserUpdateData] = useState({
    adminId: "",
    role: "",
  });
  const searchText = useRef("");

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

  const getAllUserData = async (searchText) => {
    setTableData([]);
    const accountRes = await getAllUser(
      "admin",
      undefined,
      undefined,
      undefined,
      searchText || ""
    );
    if (accountRes?.data?.payload?.user?.length) {
      setTableData(accountRes?.data?.payload?.user);
    }
  };

  useEffect(() => {
    getAllUserData();
  }, []);

  useEffect(() => {
    getAllRoleData();
  }, []);

  const displayStatus = (status) => {
    if (status === 0) {
      return (
        <Alert color="error" icon={false} sx={{ cursor: "pointer" }}>
          Vô hiệu hoá
        </Alert>
      );
    } else if (status === 1) {
      return (
        <Alert
          color="success"
          icon={false}
          sx={{ cursor: "pointer", textAlign: "center" }}
        >
          Hoạt động
        </Alert>
      );
    }
  };

  const debounceSearch = useCallback(
    debounce(() => {
      getAllUserData(searchText.current);
    }, 200),
    []
  );

  const handleUpdateUserRole = async () => {
    const updateRes = await updateAdminRole(
      userUpdateData?.adminId,
      userUpdateData?.role
    );
    if (updateRes?.data?.success) {
      getAllUserData();
      setVisibleUpdateUserRole(false);
      return true;
    }
    return false;
  };

  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mb: "20px" }}>
        Phân quyền tài khoản
      </Typography>

      <div className={styles.homeSearchBar}>
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="Nhập tài khoản muốn phân quyền?"
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
            onClick={() => getAllUserData(searchText.current)}
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
                {userColumns?.map((column) => (
                  <TableCell
                    key={column?.id}
                    align={column?.align}
                    style={{ minWidth: column?.minWidth }}
                  >
                    {column?.label}
                  </TableCell>
                ))}
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
                      {userColumns?.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <Tooltip placement="top" title="Phân quyền user">
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
                                    setVisibleUpdateUserRole(true);
                                    setUserUpdateData({
                                      adminId: row?.admin_id,
                                      role: row?.role_id,
                                    });
                                  }}
                                >
                                  <PermIdentityIcon />
                                </Button>
                              </Tooltip>
                            ) : column.id === "name" ? (
                              <div>
                                {row?.first_name + " " + row?.last_name}
                              </div>
                            ) : column.id === "status" ? (
                              displayStatus(row?.status)
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
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {visibleUpdateUserRole && (
        <CustomDialog
          onClose={() => setVisibleUpdateUserRole(false)}
          visible={visibleUpdateUserRole}
          title={"Tuỳ chỉnh quyền"}
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          maxWidth="500px"
          width="500px"
          handleSubmit={() => handleUpdateUserRole()}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Quyền</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userUpdateData?.role}
              label="Quyền"
              onChange={(event) =>
                setUserUpdateData({
                  ...userUpdateData,
                  role: event.target.value,
                })
              }
            >
              {allRoleData?.map((roleItem, roleIndex) => {
                return (
                  <MenuItem
                    key={`role-item-${roleIndex}`}
                    value={roleItem?.role_id}
                  >
                    {roleItem?.role_name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </CustomDialog>
      )}
    </>
  );
}
