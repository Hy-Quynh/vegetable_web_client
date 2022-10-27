import React, { useEffect, useState } from "react";
import { getAllWarranty } from "../../services/helper";
import { Markup } from "interweave";

export default function WarrantyPage() {
  const [warrantyContent, setWarrantyContent] = useState("");

  const getWarranty = async () => {
    const warranty = await getAllWarranty();
    if (warranty?.data?.payload?.[0]?.warranty_id) {
      setWarrantyContent(warranty?.data?.payload?.[0]?.warranty_content);
    }
  };

  useEffect(() => {
    getWarranty();
  }, []);

  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Trang chính sách bảo hành
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
                Chính sách bảo hành
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-xxl py-6">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Chính sách bảo hành</h1>
            <p>Những thông tin bảo hành, chính sách hoàn trả sản phẩm</p>
          </div>
          <div className="row g-4">
            <Markup content={warrantyContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
