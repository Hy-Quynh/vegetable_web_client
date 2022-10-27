import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/router";
import { USER_INFO_KEY } from "../../utils/constants";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const HEADER_MENU = [
  { title: "Trang chủ", href: "/" },
  { title: "Sản phẩm", href: "/product" },
  { title: "Bài viết", href: "/post" },
  { title: "Thanh toán điện nước", href: "/electricity-water-payment" },
  { title: "Live Stream", href: "/livestream" },
  { title: "Công thức nấu ăn", href: "/cooking-recipe" },
  { title: "Về chúng tôi", href: "/about" },
  { title: "Góp ý", href: "/feedback" },
  { title: "FAQ", href: "/faq" },
  { title: "Bảo hành", href: "/warranty" },
];

export default function HeaderDrawer(props) {
  const theme = useTheme();
  const { visible, onClose } = props;
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};
  const router = useRouter();
  const HEADER_SUBMENU = userData?.user_id
    ? [
        { title: "Trang cá nhân", href: "/personal" },
        { title: "Đăng xuất", href: "/logout" },
      ]
    : [{ title: "Đăng nhập", href: "/login" }];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={visible}
    >
      <DrawerHeader>
        <IconButton onClick={() => onClose()}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {HEADER_MENU?.map((text, index) => (
          <ListItem key={text?.title} disablePadding>
            <ListItemButton
              onClick={() => {
                router?.push(text?.href);
                onClose();
              }}
            >
              <ListItemText
                primary={text?.title}
                sx={{ color: router?.pathname === text?.href ? "red" : "" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {HEADER_SUBMENU.map((text, index) => (
          <ListItem key={text?.title} disablePadding>
            <ListItemButton
              onClick={() => {
                if (text?.href === "/logout") {
                  localStorage.removeItem(USER_INFO_KEY);
                  router.push("/login");
                } else {
                  router?.push(text?.href);
                }
                onClose();
              }}
            >
              <ListItemText
                primary={text?.title}
                sx={{ color: router?.pathname === text?.href ? "red" : "" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
