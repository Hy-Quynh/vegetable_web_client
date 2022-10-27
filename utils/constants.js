import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TopicIcon from "@mui/icons-material/Topic";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import AssistantIcon from "@mui/icons-material/Assistant";
import ChatIcon from "@mui/icons-material/Chat";
import OpacityIcon from "@mui/icons-material/Opacity";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import VideocamIcon from "@mui/icons-material/Videocam";
import ConstructionIcon from '@mui/icons-material/Construction';

export const GET_PROVINCE_API = "https://provinces.open-api.vn/api/?depth=1";
export const CHAT_HOST = "https://vegetableweb.herokuapp.com";
export const USER_INFO_KEY = "user_info";
export const USER_CART_INFO = "user_prd_card";
export const API_SERVER_URL = "https://vegetableweb.herokuapp.com/api";
export const ADMIN_ROLE = [
  {
    label: "Dashboard",
    value: "admin-dashboard",
    href: "/admin",
    icon: <DashboardIcon />,
  },
  {
    label: "Nhắn tin",
    value: "chat",
    href: "/admin/chat",
    icon: <ChatIcon />,
  },
  {
    label: "LiveStream",
    value: "livestream",
    href: "/admin/livestream",
    icon: <VideocamIcon />,
  },
  {
    label: "Danh mục",
    value: "admin-category",
    href: "/admin/category",
    icon: <TopicIcon />,
  },
  {
    label: "Sản phẩm",
    value: "admin-product",
    href: "/admin/product",
    icon: <StorefrontIcon />,
  },
  {
    label: "CT khuyến mãi",
    value: "admin-promo",
    href: "/admin/promo",
    icon: <CardGiftcardIcon />,
  },
  {
    label: "Đơn hàng",
    value: "admin-order",
    href: "/admin/order",
    icon: <ShoppingCartCheckoutIcon />,
  },
  {
    label: "Bài viết",
    value: "admin-blog",
    href: "/admin/post",
    icon: <PostAddIcon />,
  },
  {
    label: "Quyền",
    value: "admin-role",
    href: "/admin/role",
    icon: <ManageAccountsIcon />,
  },
  {
    label: "Tài khoản",
    value: "admin-account",
    href: "/admin/account",
    icon: <PeopleIcon />,
  },
  {
    label: "Góp ý",
    value: "feedback",
    href: "/admin/feedback",
    icon: <AssistantIcon />,
  },
  {
    label: "FAQ",
    value: "admin-faq",
    href: "/admin/faq",
    icon: <LiveHelpIcon />,
  },
  {
    label: "Chính sách bảo hành",
    value: "admin-warranty",
    href: "/admin/warranty",
    icon: <ConstructionIcon />,
  },
  {
    label: "Công thức nấu ăn",
    value: "admin-cooking-recipe",
    href: "/admin/cooking-recipe",
    icon: <OutdoorGrillIcon />,
  },
  {
    label: "Thanh toán hoá đơn",
    value: "admin-electricity-water",
    href: "/admin/electricity-water",
    icon: <InvertColorsIcon />,
  },
];

export const PAYMENT_SERVICE = [
  {
    label: "Thanh toán hoá đơn điện",
    value: "electricity",
    icon: <ElectricBoltIcon />,
  },
  {
    label: "Thanh toán hoá đơn nước",
    value: "water",
    icon: <OpacityIcon />,
  },
];

export const FORMAT_NUMBER = new Intl.NumberFormat();
export const BLUR_BASE64 =
  "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export const STRIPE_KEY =
  "pk_test_51KHAdUKzeo9d90anKj4ocFehY0bDFuNR5REW9UZKQ3vKWpfXJgbr2P0odm9HugkcoVmfmF383bTkmZRQZvpp8wlv00PAvM4dYm";
