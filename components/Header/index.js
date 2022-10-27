import React, { useEffect, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import { USER_CART_INFO, USER_INFO_KEY } from "../../utils/constants";
import { useRouter } from "next/router";
import { parseJSON } from "../../utils/common";
import HeaderDrawer from "../HeaderDrawer";

export default function Header() {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};
  const router = useRouter();

  useEffect(() => {
    const changeQuantityInCart = () => {
      const cartData =
        parseJSON(
          localStorage.getItem(USER_CART_INFO + `_${userData?.user_id || ""}`)
        ) || [];
      setCartQuantity(cartData?.length);
    };
    changeQuantityInCart();
    window.addEventListener("storage", changeQuantityInCart);
    return () => {
      window.removeEventListener("storage", changeQuantityInCart);
    };
  }, []);

  const routerMark = (pathName) => {
    return router?.pathname === pathName
      ? { fontWeight: 800, color: "red" }
      : {};
  };

  return (
    <div
      className="container-fluid fixed-top px-0 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
        <div className="col-lg-6 px-5 text-start">
          <small>
            <i className="fa fa-map-marker-alt me-2" />
            Trường Đại học Bách Khoa Hà Nội
          </small>
          <small className="ms-4">
            <i className="fa fa-envelope me-2" />
            info@example.com
          </small>
        </div>
        <div className="col-lg-6 px-5 text-end">
          <small>Theo dõi chúng tôi tại:</small>
          <a
            className="text-body ms-3"
            href="https://www.facebook.com/"
            target={"_blank"}
          >
            <i className="fab fa-facebook-f" />
          </a>
          <a
            className="text-body ms-3"
            href="https://twitter.com/?lang=vi"
            target={"_blank"}
          >
            <i className="fab fa-twitter" />
          </a>
          <a
            className="text-body ms-3"
            href="https://www.youtube.com/"
            target={"_blank"}
          >
            <i className="fab fa-youtube" />
          </a>
          <a
            className="text-body ms-3"
            href="https://www.instagram.com/"
            target={"_blank"}
          >
            <i className="fab fa-instagram" />
          </a>
        </div>
      </div>
      <nav
        className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <a href="/" className="navbar-brand ms-4 ms-lg-0">
          <h1 className="fw-bold text-primary m-0">
            F<span className="text-secondary">oo</span>dy
          </h1>
        </a>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          onClick={() => setVisibleDrawer(true)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <div
              className="nav-item nav-link"
              style={{ cursor: "pointer", ...routerMark("/") }}
              onClick={() => {
                router?.push("/");
              }}
            >
              Trang chủ
            </div>
            <div
              className="nav-item nav-link"
              style={{ cursor: "pointer", ...routerMark("/product") }}
              onClick={() => {
                router.push("/product");
              }}
            >
              Sản phẩm
            </div>
            <div
              className="nav-item nav-link"
              style={{ cursor: "pointer", ...routerMark("/post") }}
              onClick={() => {
                router.push("/post");
              }}
            >
              Bài viết
            </div>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                style={
                  router?.pathname === "/electricity-water-payment" ||
                  router?.pathname === "/livestream" ||
                  router?.pathname === "/cooking-recipe"
                    ? { fontWeight: 800, color: "red" }
                    : {}
                }
              >
                Dịch vụ
              </a>
              <div className="dropdown-menu m-0">
                <div
                  className="dropdown-item"
                  style={{
                    cursor: "pointer",
                    ...routerMark("/electricity-water-payment"),
                  }}
                  onClick={() => {
                    router.push("/electricity-water-payment");
                  }}
                >
                  Thanh toán điện nước
                </div>
                <div
                  className="dropdown-item"
                  style={{
                    cursor: "pointer",
                    ...routerMark("/livestream"),
                  }}
                  onClick={() => {
                    router.push("/livestream");
                  }}
                >
                  Live Stream
                </div>
                <div
                  className="dropdown-item"
                  style={{
                    cursor: "pointer",
                    ...routerMark("/cooking-recipe"),
                  }}
                  onClick={() => {
                    router.push("/cooking-recipe");
                  }}
                >
                  Công thức nấu ăn
                </div>
              </div>
            </div>
            <div
              className="nav-item nav-link"
              style={{ ...routerMark("/about"), cursor: "pointer" }}
              onClick={() => {
                router.push("/about");
              }}
            >
              Về chúng tôi
            </div>
            <div
              className="nav-item nav-link"
              style={{ ...routerMark("/feedback"), cursor: "pointer" }}
              onClick={() => {
                router.push("/feedback");
              }}
            >
              Góp ý
            </div>
            <div
              className="nav-item nav-link"
              style={{ ...routerMark("/faq"), cursor: "pointer" }}
              onClick={() => {
                router.push("/faq");
              }}
            >
              FAQ
            </div>
            <div
              className="nav-item nav-link"
              style={{ ...routerMark("/warranty"), cursor: "pointer" }}
              onClick={() => {
                router.push("/warranty");
              }}
            >
              Bảo hành
            </div>
          </div>
          <div className="d-none d-lg-flex ms-2">
            {userData?.user_id ? (
              <div className="nav-item dropdown">
                <a className="btn-sm-square bg-white rounded-circle ms-3">
                  <small className="fa fa-user text-body" />
                </a>
                <div className="dropdown-menu" style={{ marginLeft: "-40px" }}>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    href="/personal"
                  >
                    Trang cá nhân
                  </a>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      localStorage.removeItem(USER_INFO_KEY);
                      router.push("/login");
                    }}
                  >
                    Đăng xuất
                  </a>
                </div>
              </div>
            ) : (
              <a
                className="btn-sm-square bg-white rounded-circle ms-3"
                href="/login"
              >
                <LoginIcon sx={{ marginLeft: "-5px" }} />
              </a>
            )}
            <a
              className="btn-sm-square bg-white rounded-circle ms-3"
              style={{ position: "relative" }}
              onClick={() => router?.push("/cart")}
            >
              <small className="fa fa-shopping-bag text-body" />
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: 0,
                  fontWeight: 900,
                  color: "#F74F06",
                }}
              >
                {cartQuantity}
              </div>
            </a>
          </div>
        </div>
      </nav>

      <HeaderDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
      />
    </div>
  );
}
