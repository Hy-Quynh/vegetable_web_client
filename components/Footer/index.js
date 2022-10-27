import React from "react";

export default function Footer() {
  return (
    <div
      className="container-fluid bg-dark footer mt-5 pt-5 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h1 className="fw-bold text-primary mb-4">
              F<span className="text-secondary">oo</span>dy
            </h1>
            <p>Chúng tôi cung cấp rau củ hữu cơ an toàn và giàu dinh dưỡng</p>
            <div className="d-flex pt-2">
              <a
                className="btn btn-square btn-outline-light rounded-circle me-1"
                href='https://twitter.com/?lang=vi'
                target={'_blank'}
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                className="btn btn-square btn-outline-light rounded-circle me-1"
                href='https://www.facebook.com/'
                target={'_blank'}
              >
                <i className="fab fa-facebook-f" />
              </a>
              <a
                className="btn btn-square btn-outline-light rounded-circle me-1"
                href='https://www.youtube.com/'
                target={'_blank'}
              >
                <i className="fab fa-youtube" />
              </a>
              <a
                className="btn btn-square btn-outline-light rounded-circle me-0"
                href='https://www.instagram.com/'
                target={'_blank'}
              >
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-light mb-4">Địa chỉ</h4>
            <p>
              <i className="fa fa-map-marker-alt me-3" />
              Trường Đại học Bách Khoa Hà Nội
            </p>
            <p>
              <i className="fa fa-phone-alt me-3" />
              +012 345 67890
            </p>
            <p>
              <i className="fa fa-envelope me-3" />
              info@example.com
            </p>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-light mb-4">Đường link</h4>
            <a className="btn btn-link" href="/about">
              Về chúng tôi
            </a>
            <a className="btn btn-link" href="/feedback">
              Góp ý
            </a>
            <a className="btn btn-link" href='/product'>
              Sản phẩm
            </a>
            <a className="btn btn-link" href='/post'>
              Bài viết
            </a>
            <a className="btn btn-link" href='/faq'>
              FAQ
            </a>
          </div>
          <div className="col-lg-3 col-md-6">
            <h4 className="text-light mb-4">Tổng đài hỗ trợ</h4>
            <ul>
              <li>Gọi mua: 0918188221</li>
              <li>Kĩ thuật: 0918188221</li>
              <li>Khiếu nại: 0918188221</li>
              <li>Bảo hành: 0918188221</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
