import React from "react";

export default function AboutPage() {
  return (
    <div>
      {/* Page Header Start */}
      <div
        className="container-fluid page-header mb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Về chúng tôi</h1>
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
                Về chúng tôi
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}
      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="about-img position-relative overflow-hidden p-5 pe-0">
                <img className="img-fluid w-100" src="img/about.jpg" />
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <h1 className="display-5 mb-4">
                Trái cây và rau hữu cơ tốt nhất
              </h1>
              <p className="mb-4">
                Rau hữu cơ (Rau organic) là loại rau được trồng và sản xuất theo
                phương pháp và tiêu chuẩn của nông nghiệp hữu cơ. Đây là một lựa
                chọn hàng đầu cho người tiêu dùng, cung cấp các loại rau củ tươi
                ngon. Rau hữu cơ cũng có hàm lượng dinh dưỡng cao với hương vị
                tự nhiên, đảm bảo an toàn cho con người. Đồng thời rau hữu cơ
                giúp đảm bảo hệ sinh thái và đa dạng sinh học.
              </p>
              <p className="mb-4">
                Rau sẽ được trồng hoàn toàn tự nhiên, không sử dụng các chất độc
                hại trong quá trình trồng trọt đến khâu thu hoạch và bảo quản.
                Rau hữu cơ sẽ cần phải đáp ứng được các tiêu chí:
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Không sử dụng chất biến đổi gen.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Không phun thuốc diệt cỏ và trừ sâu.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Không phun thuốc diệt cỏ và trừ sâu.
              </p>
            </div>
          </div>
          <div className="row g-5 align-items-center">
            <p>
              Lý do tại sao mọi người lại thích loại rau organic này mặc dù giá
              cao hơn nhiều so với các loại rau khác? Có lẽ các lợi ích mà nó
              mang lại thu hút người tiêu dùng ưa chuộng. Đây cũng trở thành
              loại thực phẩm an toàn mà các nhà sản xuất lựa chọn để kinh doanh.
              Sau đây là một số lợi ích của rau hữu cơ để lý giải cho ý trên:
            </p>
            <ul style={{ marginTop: "0" }}>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Sử dụng rau hữu cơ sẽ giảm thiểu nguy cơ mắc các căn bệnh nguy
                hiểm về tim mạch, ung thư hay huyết áp. Vì trong rau này chứa
                rất nhiều chất chống oxy hóa, giàu vitamin hơn bất kỳ loại rau
                thông thường nào.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Rau hữu cơ không chứa các sinh vật biến đổi gen, các chất hóa
                học. Đây là các chất rất độc hại đối với cơ thể con người,
                nguyên nhân gây ra các căn bệnh nguy hiểm, đồng thời cũng hủy
                hoại môi trường.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Nó giàu vitamin và chất dinh dưỡng. Rau hữu cơ hoàn toàn không
                chứa các chất độc hại hay bất kỳ loại thuốc hóa học nào. Bên
                cạnh đó được sản xuất theo quy trình hữu cơ chặt chẽ nên sản
                phẩm thu được đảm bảo chất lượng và giàu chất dinh dưỡng. Do đó
                hương vị của rau ngon tự nhiên.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Việc người nông dân sản xuất rau theo phương pháp hữu cơ sẽ góp
                phần bảo vệ môi trường. Mô hình này sẽ tránh gây ô nhiễm môi
                trường, bảo vệ nguồn nước, nguồn đất và sự đa dạng sinh học nơi
                trồng trọt.
              </p>
            </ul>
          </div>
          <div className="row g-5 align-items-center">
            <b>Rau hữu cơ tại cửa hàng chúng tôi</b>
            <p style={{marginTop: '10px'}}>
              Nhận thức được tầm quan trọng của rau hữu cơ trong đời sống hằng
              ngày, Vì thế Cửa hàng chúng tôi luôn lựa chọn những nguồn rau
              sạch, đảm bảo an toàn tới sức khoẻ của bạn.
            </p>
          </div>
        </div>
      </div>
      {/* About End */}
    </div>
  );
}
