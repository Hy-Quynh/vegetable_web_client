import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import { getRoleByAdminId } from "../../services/role";
import { parseJSON } from "../../utils/common";
import { ADMIN_ROLE, USER_INFO_KEY } from "../../utils/constants";

export default function MainListItems() {
  const [userRole, setUserRole] = React.useState([]);
  const router = useRouter();

  const userInfo =
    typeof window !== "undefined"
      ? parseJSON(localStorage.getItem(USER_INFO_KEY))
      : {};

  const getUserRole = async () => {
    if (userInfo?.admin_id) {
      const role = await getRoleByAdminId(userInfo?.admin_id);
      if (role?.data?.success) {
        const roleSplit = role?.data?.payload?.role_function?.split(",")
        const adminRole = ADMIN_ROLE?.map((item) => item?.value)
        roleSplit.sort(function(a, b){  
          return adminRole.indexOf(a) - adminRole.indexOf(b);
        });
        setUserRole(roleSplit);
      }
    }
  };

  React.useEffect(() => {
    getUserRole();
  }, []);

  return (
    <React.Fragment>
      {userRole?.map((roleItem, roleIndex) => {
        const roleInfo = ADMIN_ROLE?.find((item) => item?.value === roleItem);
        return (
          <ListItemButton
            key={`role-item-${roleIndex}`}
            onClick={() => {
              router.push({
                pathname: roleInfo?.href,
              });
            }}
            sx={{
              background: router?.pathname === roleInfo?.href ? "#e8e2e1" : "",
            }}
          >
            <ListItemIcon>{roleInfo?.icon}</ListItemIcon>
            <ListItemText primary={roleInfo?.label} />
          </ListItemButton>
        );
      })}
    </React.Fragment>
  );
}
