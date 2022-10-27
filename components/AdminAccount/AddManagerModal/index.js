import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getAllRole } from "../../../services/role";
import CustomInput from "../../CustomInput";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function AddManagerModal(props) {
  const { visible, onClose, handleSubmit } = props;
  const [editUserData, setEditUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    password: "",
    role: 0,
  });
  const [editUserError, setEditUserError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [allRoleData, setAllRoleData] = useState([]);

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

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={visible}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Thêm mới nhân viên quản lí
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Quyền</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={editUserData?.role}
              label="Quyền"
              onChange={(event) =>
                setEditUserData({
                  ...editUserData,
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
          <Box component="form" onSubmit={(event) => event.preventDefault()} autoComplete="false">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CustomInput
                label="Họ"
                autoComplete="off"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setEditUserData({
                    ...editUserData,
                    firstName: event.target.value,
                  })
                }
              />
              <CustomInput
                label="Tên"
                autoComplete="off"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setEditUserData({
                    ...editUserData,
                    lastName: event.target.value,
                  })
                }
              />
            </div>
            <CustomInput
              autoComplete="off"
              label="Email"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditUserData({ ...editUserData, email: event.target.value })
              }
            />

            <CustomInput
              autoComplete="off"
              label="Địa chỉ"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditUserData({
                  ...editUserData,
                  address: event.target.value,
                })
              }
            />

            <CustomInput
              autoComplete="off"
              label="Số điện thoại"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditUserData({ ...editUserData, phone: event.target.value })
              }
            />

            <CustomInput
              autoComplete="new-password"
              label="Mật khẩu"
              variant="filled"
              type="password"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditUserData({
                  ...editUserData,
                  password: event.target.value,
                })
              }
            />
          </Box>
          <div style={{ marginTop: "20px" }}>
            {editUserError.status && (
              <Alert severity={editUserError.type}>
                {editUserError.message}
              </Alert>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={modalLoading}
            autoFocus
            onClick={async () => {
              const {
                email,
                firstName,
                lastName,
                address,
                phone,
                password,
                role,
              } = editUserData;
              if (
                email.length <= 0 ||
                firstName.length <= 0 ||
                lastName.length <= 0 ||
                address.length <= 0 ||
                phone.length <= 0 ||
                password.length <= 0 ||
                role === 0
              ) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Các trường dữ liêu không được bỏ trống",
                });
              } else if (
                !String(email)
                  .toLowerCase()
                  .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  )
              ) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Email sai định dạng",
                });
              } else if (address.trim().length <= 5) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Địa chỉ cần nhiều hơn 5 kí tự",
                });
              } else if (
                !/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone)
              ) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Số điện thoại sai định dạng",
                });
              } else if (password.trim().length < 6) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Mật khẩu cần nhiều hơn 6 kí tự",
                });
              } else {
                setModalLoading(true);
                const submitRes = await handleSubmit(editUserData);
                if (!submitRes.success) {
                  setModalLoading(false);
                  setEditUserError({
                    status: true,
                    type: "error",
                    message:
                      submitRes?.data?.error?.message ||
                      "Thêm mới nhân viên thất bại",
                  });
                }
              }
            }}
          >
            Thêm mới
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
