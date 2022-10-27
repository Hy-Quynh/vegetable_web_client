import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { getAllHelper } from "../../services/helper";
import { Markup } from "interweave";

export default function HelperPage() {
  const [listHelper, setListHelper] = useState([]);

  const getListHelper = async () => {
    const helper = await getAllHelper();
    if (helper?.data?.success) {
      setListHelper(helper?.data?.payload);
    }
  };

  useEffect(() => {
    getListHelper();
  }, []);

  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Câu hỏi thường gặp
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
                Câu hỏi thường gặp
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div style={{ padding: "20px" }} className={style.clientHelperPage}>
        <div
          className="section-header text-center mx-auto mb-5 wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <h1 className="display-5 mb-3">Câu hỏi thường gặp</h1>
          <p>
            Giúp người dùng nhanh chóng có được thêm các thông tin hữu ích, hiểu
            rõ hơn về website, về sản phẩm, dịch vụ của chúng tôi
          </p>
        </div>
        {listHelper?.map((helperItem, helperIndex) => {
          return (
            <details
              className="collapseHelper"
              key={`helper-item-${helperIndex}`}
              style={{ marginTop: "20px" }}
            >
              <summary className="title" style={{color: '#rgb(247,79,6)'}}>
                <ArrowRightIcon />
                {helperItem?.helper_text}
              </summary>
              <hr className="divider" />
              <p className="description">
                <Markup content={helperItem?.helper_description} />
              </p>
            </details>
          );
        })}
      </div>
    </div>
  );
}
