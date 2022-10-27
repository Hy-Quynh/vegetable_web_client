import React, { useEffect, useState } from "react";
import { parseJSON } from "../utils/common";
import { USER_INFO_KEY } from "../utils/constants";
import AdminLayout from "./AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import UserLayout from "./UserLayout";

const LOSE_TOAST_TIME = 2000;
export default function MainLayout(props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const userInfo =
    typeof window !== "undefined"
      ? parseJSON(localStorage.getItem(USER_INFO_KEY))
      : {};

  return (
    <>
      {mounted ? (
        router?.pathname?.indexOf("admin") >= 0 &&
        userInfo?.type === "admin" ? (
          <AdminLayout>{props?.children}</AdminLayout>
        ) : router?.pathname?.indexOf("login") < 0 &&
          router?.pathname?.indexOf("signup") < 0 ? (
          <UserLayout>{props?.children}</UserLayout>
        ) : (
          <div>{props?.children}</div>
        )
      ) : (
        <></>
      )}
      <ToastContainer
        position="top-center"
        autoClose={LOSE_TOAST_TIME}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
        className="layout_toastify"
      />
    </>
  );
}
