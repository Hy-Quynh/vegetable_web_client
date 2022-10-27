import React, { useState } from "react";
import _ from "lodash";
import { isVietnamesePhoneNumber, validateEmail } from "../../utils/common";
import { toast } from "react-toastify";
import { createNewContact } from "../../services/contact";

export default function FeedbackPage() {
  const [contactDetail, setContactDetail] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    contact_subject: "",
    contact_description: "",
  });

  const sendContact = async () => {
    const {
      customer_name,
      customer_email,
      customer_phone,
      contact_subject,
      contact_description,
    } = contactDetail;
    const checkNull = _.compact([
      customer_name,
      customer_email,
      customer_phone,
      contact_subject,
      contact_description,
    ]);

    if (checkNull?.length < 5) {
      return toast.error("Dữ liệu không được bỏ trống");
    }

    if (!validateEmail(customer_email)) {
      return toast.error("Email không đúng định dạng");
    }

    if (!isVietnamesePhoneNumber(customer_phone)) {
      return toast.error("Số điện thoại không đúng định dạng");
    }

    const sendContactRes = await createNewContact(contactDetail);
    if (sendContactRes?.data?.success) {
      setContactDetail({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        contact_subject: "",
        contact_description: "",
      });
      return toast.success("Gửi thông tin thành công");
    }
    return toast.error(
      "Xảy ra lỗi trong quá trình xử lí thông tin, vui lòng liên hệ lại sau"
    );
  };

  return (
    <div>
      {/* Page Header Start */}
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Trang góp ý</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a className="text-body" href="#">
                  Trang chủ
                </a>
              </li>
              <li
                className="breadcrumb-item text-dark active"
                aria-current="page"
              >
                Góp ý
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}
      {/* Contact Start */}
      <div className="container-xxl py-6">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Trang góp ý</h1>
            <p>
              Những lời góp ý của các bạn chính là tài sản quý giá giúp chúng
              tôi ngày càng hoàn thiện hơn
            </p>
          </div>
          <div className="row g-5 justify-content-center">
            <div
              className="col-lg-5 col-md-12 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="bg-primary text-white d-flex flex-column justify-content-center h-100 p-5">
                <h5 className="text-white">Số điện thoại liên hệ</h5>
                <p className="mb-5">
                  <i className="fa fa-phone-alt me-3" />
                  +012 345 67890
                </p>
                <h5 className="text-white">Email</h5>
                <p className="mb-5">
                  <i className="fa fa-envelope me-3" />
                  info@example.com
                </p>
                <h5 className="text-white">Địa chỉ</h5>
                <p className="mb-5">
                  <i className="fa fa-map-marker-alt me-3" />
                  123 HCM, Việt Nam
                </p>
                <h5 className="text-white">Theo dõi chúng tôi</h5>
                <div className="d-flex pt-2">
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-1"
                    href
                  >
                    <i className="fab fa-twitter" />
                  </a>
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-1"
                    href
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-1"
                    href
                  >
                    <i className="fab fa-youtube" />
                  </a>
                  <a
                    className="btn btn-square btn-outline-light rounded-circle me-0"
                    href
                  >
                    <i className="fab fa-linkedin-in" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-lg-7 col-md-12 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <p className="mb-4">
                Hãy nhập thông tin góp ý của các bạn vào phía bên dưới nhé
              </p>
              <form onSubmit={(event) => event.preventDefault()}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={contactDetail?.customer_name}
                        placeholder="Nhập họ tên của bạn"
                        onChange={(event) => {
                          setContactDetail({
                            ...contactDetail,
                            customer_name: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="name">Họ và tên</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={contactDetail?.customer_email}
                        placeholder="Nhập email của bạn"
                        onChange={(event) => {
                          setContactDetail({
                            ...contactDetail,
                            customer_email: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Nhập số điện thoại"
                        value={contactDetail?.customer_phone}
                        onChange={(event) => {
                          setContactDetail({
                            ...contactDetail,
                            customer_phone: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="subject">Số điện thoại</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Nhập tiêu đề"
                        value={contactDetail?.contact_subject}
                        onChange={(event) => {
                          setContactDetail({
                            ...contactDetail,
                            contact_subject: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="subject">Tiêu đề</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Nhập nội dung góp ý"
                        id="message"
                        style={{ height: "200px" }}
                        defaultValue={""}
                        value={contactDetail?.contact_description}
                        onChange={(event) => {
                          setContactDetail({
                            ...contactDetail,
                            contact_description: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="message">Nội dung góp ý</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary rounded-pill py-3 px-5"
                      type="submit"
                      onClick={() => sendContact()}
                    >
                      Gửi thông tin
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </div>
  );
}
