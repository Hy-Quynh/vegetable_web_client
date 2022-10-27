import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GET_PROVINCE_API, STRIPE_KEY, USER_INFO_KEY } from "../../../utils/constants";
import CustomInput from "../../CustomInput";
import style from "./style.module.scss";
import _ from "lodash";
import { toast } from "react-toastify";
import { isVietnamesePhoneNumber } from "../../../utils/common";
import CustomDialog from "../../CustomDialog";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { electricityPayment, waterPayment } from "../../../services/electricity-water";

const stripeKey = loadStripe(STRIPE_KEY)

const WATER_SUPPLIER = [
  { label: "Nhà cung cấp nước 1", value: "nha_cung_cap_1" },
  { label: "Nhà cung cấp nước 2", value: "nha_cung_cap_2" },
  { label: "Nhà cung cấp nước 3", value: "nha_cung_cap_3" },
  { label: "Nhà cung cấp nước 4", value: "nha_cung_cap_4" },
];


export default function WaterPayment() {
  const [listProvince, setListProvince] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState("");
  const [waterSupplierSelected, setWaterSupperlierSelected] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [visiblePaymentModal, setVisiblePaymentModal] = useState(false);
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const getProvinceData = async () => {
    const listProvince = await axios.get(GET_PROVINCE_API);
    if (listProvince?.data?.length) setListProvince(listProvince?.data);
  };

  useEffect(() => {
    getProvinceData();
  }, []);

  const electricityPayment = async () => {
    if (!userData?.user_id) {
      return toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
    }

    const checkNull = _.compact([
      provinceSelected,
      customerCode,
      customerName,
      customerPhone,
      waterSupplierSelected
    ]);


    if (checkNull?.length < 5) {
      return toast.error("Thông tin không được bỏ trống");
    }

    if (!isVietnamesePhoneNumber(customerPhone)) {
      return toast.error("Số điện thoại sai định dạng");
    }
    setVisiblePaymentModal(true);
  };
  return (
    <div className="container-xxl py-6">
      <div className="container">
        <div
          style={{
            border: "1px solid rgb(60,185,20)",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: "40%" }} className={style.electricityPayment}>
            <div
              style={{
                marginBottom: "10px",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              1. Chọn tỉnh/thành
            </div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tỉnh thành</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={provinceSelected}
                label="Quyền"
                onChange={(event) => setProvinceSelected(event.target.value)}
                style={{ width: "100%" }}
              >
                {listProvince?.map((roleItem, roleIndex) => {
                  return (
                    <MenuItem
                      key={`role-item-${roleIndex}`}
                      value={roleItem?.name}
                    >
                      {roleItem?.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div
              style={{ margin: "10px 0", fontWeight: 700, fontSize: "18px" }}
            >
              2. Chọn nhà cung cấp nước
            </div>
            {provinceSelected?.length ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {WATER_SUPPLIER?.map(
                  (waterSupplierItem, waterSupplierIndex) => {
                    return (
                      <div
                        key={`water-supperlier-item-${waterSupplierIndex}`}
                        style={{
                          border: "2px solid rgb(60,185,20)",
                          cursor: "pointer",
                          padding: "10px",
                          background:
                            waterSupplierSelected === waterSupplierItem?.label
                              ? "rgb(60,185,20)"
                              : "white",
                          color:
                            waterSupplierSelected === waterSupplierItem?.label
                              ? "white"
                              : "rgb(60,185,20)",
                        }}
                        onClick={() => {
                          if (
                            waterSupplierSelected !== waterSupplierItem?.label
                          ) {
                            setWaterSupperlierSelected(
                              waterSupplierItem?.label
                            );
                          }
                        }}
                      >
                        {waterSupplierItem?.label}
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <></>
            )}
            <div
              style={{ margin: "10px 0", fontWeight: 700, fontSize: "18px" }}
            >
              3. Nhập thông tin thanh toán
            </div>
            <Box sx={{ margin: "10px 0" }}>
              <Typography variant="p" component="p">
                Mã danh bạ:
              </Typography>
              <CustomInput
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, width: "100%", padding: "10px 5px" }}
                type="text"
                value={customerCode}
                onChange={(event) => setCustomerCode(event?.target?.value)}
                sx={{}}
              />
            </Box>
            <Box sx={{ margin: "10px 0" }}>
              <Typography variant="p" component="p">
                Tên khách hàng:
              </Typography>
              <CustomInput
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, width: "100%" }}
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event?.target?.value)}
              />
            </Box>
            <Box sx={{ margin: "10px 0" }}>
              <Typography variant="p" component="p">
                Số điện thoại liên hệ:
              </Typography>
              <CustomInput
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, width: "100%" }}
                type="text"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event?.target?.value)}
              />
            </Box>
            <div>
              <button
                style={{
                  border: "none",
                  width: "100%",
                  padding: "15px",
                  background: "#3CB914",
                  color: "white",
                }}
                onClick={() => electricityPayment()}
              >
                Xem hoá đơn và thanh toán
              </button>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <div
              style={{ fontWeight: 700, fontSize: "18px", marginLeft: "30%" }}
            >
              Hoá đơn mẫu
            </div>
            <div
              style={{
                width: "50%",
                marginLeft: "30%",
                height: "400px",
                position: "relative",
              }}
            >
              <Image
                src="/img/hoa-don-nuoc.png"
                alt="Hoá đơn mẫu"
                layout="fill"
              />
            </div>
          </div>
        </div>
      </div>
      {visiblePaymentModal && (
        <Elements stripe={stripeKey}>
          <PaymentCardModal
            visible={visiblePaymentModal}
            onClose={() => setVisiblePaymentModal(false)}
            provinceSelected={provinceSelected}
            customerCode={customerCode}
            customerName={customerName}
            customerPhone={customerPhone}
            waterSupplierSelected={waterSupplierSelected}
          />
        </Elements>
      )}
    </div>
  );
}

const PaymentCardModal = (props) => {
  const [paymentMoney, setPaymentMoney] = useState(0);
  const {
    visible,
    onClose,
    provinceSelected,
    customerCode,
    customerName,
    customerPhone,
    waterSupplierSelected
  } = props;
  const stripe = useStripe();
  const elements = useElements();
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const handleWaterPayment = async () => {
    if (Number(paymentMoney) <= 0) {
      return toast.error("Số tiền thanh toán cần lớn hơn 0");
    }

    if (!stripe || !elements) {
      return toast.error("Cần nhập đầy đủ thông tin thanh toán");
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: "thanhtoanhoadonnuoc@gmail.com",
        phone: customerPhone,
        name: customerName,
      },
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        const paymentData = {
          paymentId: id,
          money: paymentMoney,
          province: provinceSelected,
          customerPhone,
          customerName,
          customerCode,
          userId: userData?.user_id,
          waterSupperlier: waterSupplierSelected
        };

        const paymentRes = await waterPayment(paymentData);
        if (paymentRes?.data?.success) {
          onClose?.();
          return toast.success("Thanh toán thành công");
        }
        return toast.error("Thanht toán thất bại, vui lòng thử lại sau");
      } catch (error) {
        console.log("errorrrrrr >>>>> ", error);
        return toast.error("Gặp lỗi trong quá trình xử lí thông tin");
      }
    }
  };

  return (
    <CustomDialog
      onClose={() => onClose(false)}
      visible={visible}
      title={"Thanh toán hoá đơn tiền điện"}
      closeTitle="Đóng"
      closeSubmitTitle={"Xác nhận"}
      handleSubmit={() => handleWaterPayment()}
      maxWidth="800px"
      width="800px"
    >
      <div className={style.electricityModal}>
        <div className="modal-info">
          <div className="info-title">Dịch vụ</div>
          <div className="info-value">Điện lực toàn quốc</div>
        </div>
        <div className="modal-info">
          <div className="info-title">Tỉnh thành</div>
          <div className="info-value">{provinceSelected}</div>
        </div>
        <div className="modal-info">
          <div className="info-title">Nhà cung cấp nước</div>
          <div className="info-value">{waterSupplierSelected}</div>
        </div>
        <div className="modal-info">
          <div className="info-title">Mã danh bạ</div>
          <div className="info-value">{customerCode}</div>
        </div>
        <div className="modal-info">
          <div className="info-title">Tên khách hàng</div>
          <div className="info-value">{customerName}</div>
        </div>
        <div className="modal-info">
          <div className="info-title">SĐT khách hàng</div>
          <div className="info-value">{customerPhone}</div>
        </div>
        <div className="modal-info">
          <div className="info-title">Kì hoá đơn</div>
          <div className="info-value">
            {new Date().getMonth() + "/" + new Date().getFullYear()}
          </div>
        </div>
        <Box sx={{ marginTop: "50px" }}>
          <Typography variant="p" component="b">
            Nhập số tiền thanh toán:
          </Typography>
          <CustomInput
            defaultValue=""
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, width: "100%" }}
            type="number"
            value={paymentMoney}
            onChange={(event) => setPaymentMoney(event?.target?.value)}
          />
        </Box>
        <Box sx={{ marginTop: "50px" }}>
          <Typography variant="p" component="b">
            Nhập số thẻ thanh toán:
          </Typography>
          <Box sx={{ marginTop: "30px" }}>
            <CardElement id="card-element" />
          </Box>
        </Box>
      </div>
    </CustomDialog>
  );
};