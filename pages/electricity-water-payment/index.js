import React, { useState } from "react";
import ElectricityPayment from "../../components/ElectricityWaterPayment/ElectricityPayment";
import WaterPayment from "../../components/ElectricityWaterPayment/WaterPayment";
import { PAYMENT_SERVICE } from "../../utils/constants";

export default function ElectricityWaterPayment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Thanh toán điện nước
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a className="text-body" href="/">
                  Trang chủ
                </a>
              </li>
              <li
                className="breadcrumb-item text-dark active"
                aria-current="page"
              >
                Thanh toán điện nước
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container-xxl py-6">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "40px",
            }}
          >
            {PAYMENT_SERVICE?.map((serviceItem, serviceIndex) => {
              return (
                <div
                  key={`service-item-${serviceIndex}`}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px 20px",
                    border: "2px solid rgb(60,185,20)",
                    cursor: "pointer",
                    background:
                      selectedPaymentMethod === serviceItem?.value
                        ? "rgb(60,185,20)"
                        : "white",
                  }}
                  onClick={() => {
                    if (selectedPaymentMethod !== serviceItem?.value) {
                      setSelectedPaymentMethod(serviceItem?.value);
                    }
                  }}
                >
                  <div>
                    {React.cloneElement(serviceItem?.icon, {
                      sx: {
                        color:
                          selectedPaymentMethod === serviceItem?.value
                            ? "white"
                            : "rgb(60,185,20)",
                      },
                    })}
                  </div>
                  <div
                    style={{
                      marginLeft: "10px",
                      color:
                        selectedPaymentMethod === serviceItem?.value
                          ? "white"
                          : "rgb(60,185,20)",
                    }}
                  >
                    {serviceItem?.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {selectedPaymentMethod === "electricity" ? (
        <ElectricityPayment />
      ) : selectedPaymentMethod === "water" ? (
        <WaterPayment />
      ) : (
        <></>
      )}
    </div>
  );
}
