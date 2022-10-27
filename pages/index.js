import * as React from "react";
import { useRouter } from "next/router";
import ProductList from "../components/ProductList";
import { getAllCategory } from "../services/category";
import { getListProduct, getMostSearchProduct, getSellingProduct } from "../services/product";
import { getAllPostList } from "../services/post";
import { dateTimeConverter } from "../utils/common";

const LIMIT_CATEGORY = 5;
const LIMIT_PRODUCT = 12;
const LIMIT_POST = 12;

export default function HomePage() {
  const [listCategory, setListCategory] = React.useState([]);
  const [listProduct, setListProduct] = React.useState([]);
  const [sellingProduct, setSellingProduct] = React.useState([]);
  const [mostSearchProduct, setMostSearchProduct] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState(0);
  const [listPost, setListPost] = React.useState([]);
  const serviceRef = React.useRef(null);

  const getCategoryData = async () => {
    const categoryList = await getAllCategory(LIMIT_CATEGORY, 0);
    const category = categoryList?.data?.payload?.category;
    if (category?.length) {
      setListCategory(category);
      setActiveCategory(category[0]?.category_id);
    }
  };

  const getProductData = async (categoryId) => {
    const productList = await getListProduct("", LIMIT_PRODUCT, 0, categoryId);
    const { product } = productList?.data?.payload;
    if (product) {
      setListProduct(product);
    }
  };

  const getPostData = async () => {
    const postList = await getAllPostList(LIMIT_POST, 0);
    if (postList?.data?.success) {
      setListPost(postList?.data?.payload?.post);
    }
  };

  const getSellingProductInfo = async () => {
    const productList = await getSellingProduct();
    if (productList?.data?.success) {
      setSellingProduct(productList?.data?.payload);
    }
  };

  const getMostSearchProductData = async () => {
    const productList = await getMostSearchProduct()
    if ( productList?.data?.success){
      setMostSearchProduct(productList?.data?.payload)
    }
  }

  React.useEffect(() => {
    getCategoryData();
    getPostData();
    getSellingProductInfo();
    getMostSearchProductData()
  }, []);

  React.useEffect(() => {
    if (activeCategory > 0) {
      getProductData(activeCategory);
    }
  }, [activeCategory]);

  return (
    <div>
      <div
        className="container-fluid p-0 mb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="img/carousel-1.jpg" alt="Image" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <h1 className="display-2 mb-5 animated slideInDown">
                        Rau xanh nâng tầm sức khoẻ
                      </h1>
                      <a
                        href="/product"
                        className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                        style={{ zIndex: 1000000 }}
                      >
                        Sản phẩm
                      </a>
                      <a
                        style={{ zIndex: 1000000 }}
                        className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                        onClick={() => serviceRef.current.scrollIntoView()}
                      >
                        Dịch vụ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="img/carousel-2.jpg" alt="Image" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <h1 className="display-2 mb-5 animated slideInDown">
                        Natural Food Is Always Healthy
                      </h1>
                      <a
                        href
                        className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                      >
                        Products
                      </a>
                      <a
                        href
                        className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                      >
                        Services
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button> */}
        </div>
      </div>
      {/* Carousel End */}
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
              <a
                className="btn btn-primary rounded-pill py-3 px-5 mt-3"
                href="/about"
              >
                Xem thêm
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Feature Start */}
      <div
        className="container-fluid bg-light bg-icon my-5 py-6"
        ref={serviceRef}
      >
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Dịch vụ của chúng tôi</h1>
            <p>Các dịch vụ tiện ích luôn sẵn sàng hỗ trợ bạn</p>
          </div>
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  className="img-fluid mb-4"
                  src="img/dien-nuoc.png"
                  alt=""
                  style={{ width: "180px", height: "180px" }}
                />
                <h4 className="mb-3">Thanh toán điện nước</h4>
                <p className="mb-4">
                  Bạn có thể dễ dàng thanh toán hoá đơn điện nước thông qua vài
                  bước đơn giản
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="/electricity-water-payment"
                >
                  Xem thêm
                </a>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  className="img-fluid mb-4"
                  src="img/live-stream.png"
                  alt=""
                  style={{ width: "180px", height: "180px" }}
                />
                <h4 className="mb-3">LiveStream hàng hoá</h4>
                <p className="mb-4">
                  Giới thiệu về các sản phẩm mới, giúp bạn hiểu hơn về sản phẩm
                  của chúng tôi
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="/livestream"
                >
                  Xem thêm
                </a>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  className="img-fluid mb-4"
                  src="img/nau-an.png"
                  alt=""
                  style={{ width: "180px", height: "180px" }}
                />
                <h4 className="mb-3">Công thức nấu ăn</h4>
                <p className="mb-4">
                  Những món ăn đặc sắc và hấp dẫn sẽ giúp bữa cơm hàng ngày của
                  bạn thêm đa dạng
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href
                >
                  Xem thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Feature End */}

      {/* Product Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div
                className="section-header text-start mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ maxWidth: "500px" }}
              >
                <h1 className="display-5 mb-3">Sản phẩm mới</h1>
                <p>Luôn đảm bảo AN TOÀN - CHẤT LƯỢNG - SỨC KHOẺ cho bạn</p>
              </div>
            </div>
            <div
              className="col-lg-6 text-start text-lg-end wow slideInRight"
              data-wow-delay="0.1s"
            >
              <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                {listCategory?.map((item, index) => {
                  return (
                    <li
                      className="nav-item me-2"
                      key={`home-category-item-${index}`}
                      onClick={() => {
                        setActiveCategory(item?.category_id);
                      }}
                      style={{ marginTop: "20px" }}
                    >
                      <a
                        className={`btn btn-outline-primary border-2 ${
                          activeCategory === item?.category_id ? "active" : ""
                        }`}
                        data-bs-toggle="pill"
                      >
                        {item?.category_name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <ProductList dataSource={listProduct} />
            </div>
          </div>
        </div>
      </div>
      {/* Product End */}

      {/* Product Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div
                className="section-header text-start mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ maxWidth: "500px" }}
              >
                <h1 className="display-5 mb-3">Sản phẩm bán chạy</h1>
                <p>
                  Sản phẩm được tiêu thụ nhiều nhất trong thời gian qua - Một
                  gợi ý tuyệt vời dành cho bạn
                </p>
              </div>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <ProductList dataSource={sellingProduct} />
            </div>
          </div>
        </div>
      </div>
      {/* Product End */}

      {/* Product Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div
                className="section-header text-start mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ maxWidth: "500px" }}
              >
                <h1 className="display-5 mb-3">Sản phẩm gợi ý</h1>
                <p>
                  Sản phẩm được nhiều người tìm kiếm nhất trong thời gian vừa qua
                </p>
              </div>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <ProductList dataSource={mostSearchProduct} />
            </div>
          </div>
        </div>
      </div>
      {/* Product End */}

      {/* Blog Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Bài viết mới nhất</h1>
            <p>Những bài viết hay, cung cấp kiến thức tuyệt vời dành cho bạn</p>
          </div>
          <div className="row g-4">
            {listPost?.map((postItem, postIndex) => {
              return (
                <div
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay="0.1s"
                  key={`post-item-${postIndex}`}
                >
                  <img
                    className="img-fluid"
                    src={postItem?.blog_image}
                    alt=""
                    style={{ height: "250px", width: "100%" }}
                  />
                  <div className="bg-light p-4">
                    <a
                      className="d-block h5 lh-base mb-4"
                      href={`/post/${postItem?.blog_id}`}
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {postItem?.blog_title}
                    </a>
                    <div className="text-muted border-top pt-4">
                      <small className="me-3">
                        <i className="fa fa-calendar text-primary me-2" />
                        {dateTimeConverter(postItem?.create_at)}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Blog End */}
    </div>
  );
}
