import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAllPostList } from "../../services/post";
import { dateTimeConverter } from "../../utils/common";
import { BLUR_BASE64 } from "../../utils/constants";

const PRODUCT_IN_PAGE = 12;

export default function PostPage() {
  const [listPost, setListPost] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getPostList = async (page) => {
    const post = await getAllPostList(PRODUCT_IN_PAGE, page);
    const { payload } = post?.data;
    if (payload) {
      const total = payload?.total;
      const post = payload?.post;

      if (page > currentPage) {
        const newPost = [...listPost];
        newPost?.push(...post);
        setListPost(newPost);
      } else {
        setListPost(post);
      }
      setCurrentPage(page);
      setTotalPage(Math.ceil(total / PRODUCT_IN_PAGE));
    }
  };

  useEffect(() => {
    getPostList(currentPage);
  }, []);

  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Trang bài viết
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
                Trang bài viết
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
            <h1 className="display-5 mb-3">Bài Viết</h1>
            <p>
              Những bài viết mới mẻ sẽ đem lại những kiến thức thú vị dành cho
              bạn
            </p>
          </div>
          <div className="row g-4">
            {listPost?.map((postItem, postIndex) => {
              return (
                <div
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay="0.1s"
                  key={`post-item-${postIndex}`}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <Image
                      src={postItem?.blog_image}
                      layout="fill"
                      alt="post-iamge"
                      placeholder="blur"
                      blurDataURL={BLUR_BASE64}
                    />
                  </div>
                  <div className="bg-light p-4">
                    <a
                      className="d-block h5 lh-base mb-4"
                      href={`/post/${postItem?.blog_id}`}
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
            <div
              className="col-12 text-center wow fadeInUp"
              data-wow-delay="0.1s"
            >
              {currentPage + 1 < totalPage ? (
                <a
                  className="btn btn-primary rounded-pill py-3 px-5"
                  href
                  onClick={() => getPostList(currentPage + 1)}
                >
                  Xem thêm
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
