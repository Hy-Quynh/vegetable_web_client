import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  BLUR_BASE64,
  FORMAT_NUMBER,
  STRIPE_KEY,
  USER_CART_INFO,
  USER_INFO_KEY,
} from "../../utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  isVietnamesePhoneNumber,
  parseJSON,
  validateEmail,
} from "../../utils/common";
import CustomDialog from "../../components/CustomDialog";
import CustomInput from "../../components/CustomInput";
import {
  checkoutCart,
  getProductById,
  getProductQuantity,
} from "../../services/product";
import _ from "lodash";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box } from "@mui/material";

const PAYMENT_METHOD = [
  { label: "Thanh toán khi nhận hàng", value: "COD" },
  { label: "Thanh toán qua thẻ", value: "VISA" },
];

const PICKUP_METHOD = [
  { label: "Giao hàng tận nơi", value: "SHIP" },
  { label: "Lấy tại cửa hàng", value: "PICKUP" },
];

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const stripeKey = loadStripe(STRIPE_KEY);

const calculateTotalPrice = (lstProduct) => {
  const total = lstProduct?.reduce((previous, next) => {
    if (
      Number(next.product_sale) > 0 &&
      Number(next.product_sale) !== Number(next.product_price)
    ) {
      return previous + Number(next.quantity) * Number(next.product_sale);
    } else {
      return previous + Number(next.quantity) * Number(next.product_price);
    }
  }, 0);
  return total || 0;
};

export default function CartPage() {
  const [cartProduct, setCartProduct] = useState([]);
  const [visibleCheckoutModal, setVisibleCheckoutModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [pickUpOption, setPickUpOption] = useState("SHIP");
  const [userInfo, setUserInfo] = useState({});
  const [pickUpTime, setPickUpTime] = useState(formatDate(new Date()));

  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};
  const router = useRouter();

  useEffect(() => {
    if (!userData?.user_id) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
      router.push("/login");
    } else {
      setUserInfo(userData);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const currCart = localStorage.getItem(
        USER_CART_INFO + `_${userData?.user_id || ""}`
      )
        ? parseJSON(
            localStorage.getItem(USER_CART_INFO + `_${userData?.user_id || ""}`)
          )
        : [];

      const newCartProduct = [...currCart];
      for (let i = 0; i < currCart?.length; i++) {
        const detail = await getProductById(currCart?.[i]?.product_id);
        const promo = [...(detail?.data?.payload?.promo || [])];
        if (promo?.length) {
          const freeProductPromo = [...promo]?.filter(
            (item) => item?.promo_rule === "FREE_PRODUCT"
          );
          const freeProduct = [];
          for (let freeProductItem of freeProductPromo) {
            freeProduct.push(...freeProductItem?.free_product);
          }
          newCartProduct[i].free_product = [...freeProduct];
        }
      }
      setCartProduct(newCartProduct);
    })();
  }, []);

  const handleCheckout = async (paymentId) => {
    const totalPrice = calculateTotalPrice(cartProduct);

    const checkoutResponse = await checkoutCart(
      cartProduct,
      paymentOption,
      totalPrice,
      userInfo,
      paymentId,
      pickUpOption,
      pickUpTime
    );

    if (checkoutResponse?.data?.success) {
      localStorage.removeItem(USER_CART_INFO + `_${userData?.user_id || ""}`);
      setCartProduct([]);
      setVisibleCheckoutModal(false);
      window.dispatchEvent(new Event("storage"));
      return true;
    }
    if (checkoutResponse?.data?.message) {
      toast.error(checkoutResponse?.data?.message);
    }
  };

  const changeProductQuantity = async (qlt, productId, type = "add") => {
    if (type !== "remove") {
      const currQuantity = await getProductQuantity(productId);
      if (qlt > Number(currQuantity?.data?.payload)) {
        return toast.error("Số lượng vượt quá số lượng hiện có");
      }
    }
    const currCart = [...cartProduct];
    const findIndex = currCart?.findIndex(
      (item) => item?.product_id === productId
    );
    if (findIndex >= 0) {
      currCart[findIndex].quantity = qlt;
      setCartProduct(currCart);
      localStorage.setItem(
        USER_CART_INFO + `_${userData?.user_id || ""}`,
        JSON.stringify(currCart)
      );
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="container" style={{ marginTop: "250px" }}>
      <table id="cart" className="table table-hover table-condensed">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Sản phẩm</th>
            <th style={{ width: "10%" }}>Giá</th>
            <th style={{ width: "10%" }}>Giá giảm</th>
            <th style={{ width: "22%" }}>Tặng kèm</th>
            <th style={{ width: "8%" }}>Số lượng</th>
            <th style={{ width: "20%" }} className="text-center">
              Tổng
            </th>
            <th style={{ width: "10%" }} />
          </tr>
        </thead>
        <tbody>
          {cartProduct?.map((cartItem, cartIndex) => {
            return (
              <tr key={`cart-item-${cartIndex}`}>
                <td data-th="Product">
                  <div className="row">
                    <div className="col-sm-2 hidden-xs">
                      <Image
                        src={cartItem?.product_image}
                        alt="..."
                        className="img-responsive"
                        width={50}
                        height={50}
                        placeholder="blur"
                        blurDataURL={BLUR_BASE64}
                      />
                    </div>
                    <div className="col-sm-10">
                      <h5
                        className="nomargin"
                        style={{
                          cursor: "pointer",
                          color: "#3CB914",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onClick={() =>
                          router?.push(`/product/${cartItem?.product_id}`)
                        }
                      >
                        {cartItem?.product_name}
                      </h5>
                    </div>
                  </div>
                </td>
                <td data-th="Price">
                  {FORMAT_NUMBER.format(Number(cartItem.product_price))} đ
                </td>
                <td data-th="Price">
                  {cartItem.product_sale > 0 &&
                  cartItem.product_sale !== cartItem.product_price
                    ? FORMAT_NUMBER.format(Number(cartItem.product_sale)) + "đ"
                    : ""}
                </td>
                <td data-th="Promo">
                  <ul>
                    {cartItem?.free_product?.map(
                      (freeProductItem, freeProductIndex) => {
                        return (
                          <li key={`free-product-item-${freeProductIndex}`}>
                            {freeProductItem?.product_name}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </td>
                <td data-th="Quantity">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: "5px",
                        background: "#DC3545",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (cartItem?.quantity - 1 > 0) {
                          changeProductQuantity(
                            Number(cartItem?.quantity) - 1,
                            cartItem?.product_id,
                            "remove"
                          );
                        }
                      }}
                    >
                      <RemoveIcon sx={{ color: "white" }} />
                    </div>
                    <div
                      style={{
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        textAlign: "center",
                        width: "60px",
                        background: "#f0f0f0",
                      }}
                    >
                      {cartItem?.quantity || 0}
                    </div>
                    <div
                      style={{
                        padding: "5px",
                        background: "#3CB914",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        changeProductQuantity(
                          Number(cartItem?.quantity) + 1,
                          cartItem?.product_id
                        );
                      }}
                    >
                      <AddIcon sx={{ color: "white" }} />
                    </div>
                  </div>
                </td>
                <td data-th="Subtotal" className="text-center">
                  {FORMAT_NUMBER.format(
                    Number(cartItem?.quantity) *
                      (cartItem.product_sale > 0 &&
                      cartItem.product_sale !== cartItem.product_price
                        ? Number(cartItem?.product_sale)
                        : Number(cartItem?.product_price))
                  )}{" "}
                  đ
                </td>
                <td className="actions" data-th>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const currCart = [...cartProduct]?.filter(
                        (item) => item?.product_id !== cartItem?.product_id
                      );
                      localStorage.setItem(
                        USER_CART_INFO + `_${userData?.user_id || ""}`,
                        JSON.stringify(currCart)
                      );
                      window.dispatchEvent(new Event("storage"));
                      setCartProduct(currCart);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="visible-xs">
            <td className="text-center">
              <strong>
                Tổng: {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))} đ
              </strong>
            </td>
          </tr>
          <tr>
            <td>
              <a href="/" className="btn btn-warning">
                <i className="fa fa-angle-left" /> Tiếp tục mua sắm
              </a>
            </td>
            <td colSpan={2} className="hidden-xs" />
            <td className="hidden-xs text-center">
              <strong style={{ whiteSpace: "nowrap" }}>
                Tổng: {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))} đ
              </strong>
            </td>
            <td colSpan={1} className="hidden-xs" />
            <td style={{ textAlign: "right" }}>
              <a
                className="btn btn-success btn-block"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
                onClick={() => {
                  if (!cartProduct?.length) {
                    return toast.error("Không có sản phẩm trong giỏ hàng");
                  }
                  setVisibleCheckoutModal(true);
                }}
              >
                <span>Thanh toán </span>
                <span style={{ marginLeft: "20px" }}>
                  <i className="fa fa-angle-right" />
                </span>
              </a>
            </td>
          </tr>
        </tfoot>
      </table>

      {visibleCheckoutModal && (
        <Elements stripe={stripeKey}>
          <PaymentDialog
            visible={visibleCheckoutModal}
            onClose={() => setVisibleCheckoutModal(false)}
            handleCheckout={(paymentId) => handleCheckout(paymentId)}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            changePaymentOption={(method) => setPaymentOption(method)}
            changePickUpOption={(option) => setPickUpOption(option)}
            changePickUpTime={(time) => setPickUpTime(time)}
            cartProduct={cartProduct}
          />
        </Elements>
      )}
    </div>
  );
}

const PaymentDialog = (props) => {
  const [paymentOption, setPaymentOption] = useState("COD");
  const [pickUpOption, setPickUpOption] = useState("SHIP");
  const [pickUpTime, setPickUpTime] = useState(formatDate(new Date()));
  const {
    visible,
    onClose,
    handleCheckout,
    userInfo,
    setUserInfo,
    changePaymentOption,
    cartProduct,
    changePickUpOption,
    changePickUpTime,
  } = props;
  const stripe = useStripe();
  const elements = useElements();

  return (
    <CustomDialog
      onClose={() => onClose()}
      visible={visible}
      title="Xác nhận thanh toán"
      closeTitle="Đóng"
      closeSubmitTitle="Xác nhận"
      handleSubmit={async () => {
        const { first_name, last_name, email, address, phone_number } =
          userInfo;

        const checkNull = _.compact([
          first_name,
          last_name,
          email,
          address,
          phone_number,
        ]);
        if (checkNull.length < 5) {
          toast.error("Thông tin không được để trống");
          return false;
        }

        if (!isVietnamesePhoneNumber(phone_number)) {
          toast.error("Số điện thoại sai định dạng");
          return false;
        }

        if (!validateEmail(email)) {
          toast.error("Email sai định dạng");
          return false;
        }

        if (paymentOption === "VISA") {
          if (!stripe || !elements) {
            return toast.error("Cần nhập đầy đủ thông tin thanh toán");
          }

          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {
              email: userInfo?.email,
              phone: userInfo?.phone_number,
              name: userInfo?.first_name + " " + userInfo?.last_name,
            },
          });

          if (!error) {
            const { id } = paymentMethod;
            return handleCheckout(id);
          } else {
            return toast.error("Thanh toán thất bại, vui lòng thử lại sau");
          }
        }
        return handleCheckout();
      }}
      maxWidth="700px"
      width="700px"
    >
      <h5 style={{ textAlign: "center" }}>Thông tin khách hàng</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "48%" }}>
          <CustomInput
            label="Họ"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            value={userInfo?.first_name}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                first_name: event.target.value,
              })
            }
          />
        </div>
        <div style={{ width: "48%" }}>
          <CustomInput
            label="Tên"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            value={userInfo?.last_name}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                last_name: event.target.value,
              })
            }
          />
        </div>
      </div>
      <CustomInput
        label="Số điện thoại"
        id="post-title"
        variant="filled"
        style={{ marginTop: 11, textAlign: "left" }}
        value={userInfo?.phone_number}
        onChange={(event) =>
          setUserInfo({
            ...userInfo,
            phone_number: event.target.value,
          })
        }
      />
      <CustomInput
        label="Email"
        id="post-title"
        variant="filled"
        style={{ marginTop: 11, textAlign: "left" }}
        value={userInfo?.email}
        onChange={(event) =>
          setUserInfo({ ...userInfo, email: event.target.value })
        }
      />

      <CustomInput
        label="Địa chỉ"
        id="post-title"
        variant="filled"
        style={{ marginTop: 11, textAlign: "left" }}
        value={userInfo?.address}
        onChange={(event) =>
          setUserInfo({
            ...userInfo,
            address: event.target.value,
          })
        }
      />
      <hr />
      <h5 style={{ textAlign: "center", marginTop: "20px" }}>
        Phương thức lấy hàng
      </h5>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {PICKUP_METHOD?.map((item, index) => {
          return (
            <div
              key={`pickup-item-${index}`}
              onClick={() => {
                setPickUpOption(item?.value);
                changePickUpOption(item?.value);
              }}
              style={{
                padding: "30px",
                border: "1px solid rgb(60,185,20)",
                background:
                  pickUpOption === item?.value ? "rgb(60,185,20)" : "white",
                width: "40%",
                cursor: "pointer",
              }}
            >
              {item?.label}
            </div>
          );
        })}
      </div>

      {pickUpOption === "PICKUP" ? (
        <div
          style={{ marginLeft: "30px", marginRight: "30px", marginTop: "20px" }}
        >
          <label>Thời gian dự kiến đến lấy</label>
          <br />
          <input
            style={{
              width: "100%",
              marginTop: "10px",
              border: "1px solid #e2e2e1",
              padding: "10px 20px",
            }}
            type={"date"}
            value={pickUpTime}
            onChange={(event) => setPickUpTime(event?.target?.value)}
          />
        </div>
      ) : (
        <></>
      )}

      <hr />
      <h5 style={{ textAlign: "center", marginTop: "20px" }}>
        Phương thức thanh toán
      </h5>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {PAYMENT_METHOD?.map((item, index) => {
          return (
            <div
              key={`payment-item-${index}`}
              onClick={() => {
                setPaymentOption(item?.value);
                changePaymentOption(item?.value);
              }}
              style={{
                padding: "30px",
                border: "1px solid rgb(60,185,20)",
                background:
                  paymentOption === item?.value ? "rgb(60,185,20)" : "white",
                width: "40%",
                cursor: "pointer",
              }}
            >
              {item?.label}
            </div>
          );
        })}
      </div>
      {paymentOption === "VISA" ? (
        <Box
          sx={{ marginTop: "30px", marginLeft: "30px", marginRight: "30px" }}
        >
          <CardElement id="stripe-card-element" onChange={() => {}} />
        </Box>
      ) : (
        <></>
      )}
      <hr />
      <h6 style={{ color: "red", textAlign: "right" }}>
        Số tiền thanh toán:{" "}
        {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))}đ
      </h6>
    </CustomDialog>
  );
};
