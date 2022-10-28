import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { dateTimeConverter } from "../../../utils/common"; 
import {
  changeBlogView,
  changeUserFavouriteBlog,
  getAllRelativePost,
  getPostById,
  getUserFavouriteBlog,
} from "../../../services/post";
import { BLUR_BASE64, USER_INFO_KEY } from "../../../utils/constants";
import { Markup } from "interweave";
import style from "./style.module.scss";
import PostReview from "../../../components/PostReview";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Tooltip } from "@mui/material";

export default function PostDetailPage() {
  const [postDetail, setPostDetail] = useState({});
  const [relativePost, setRelativePost] = useState([]);
  const [userFavourite, setUserFavourite] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const getPostData = async () => {
    const detail = await getPostById(id);
    if (detail?.data?.success) {
      const payload = detail?.data?.payload;
      const changeView = await changeBlogView(id, payload?.blog_view + 1);

      if (changeView?.data?.success) {
        payload.blog_view = payload?.blog_view + 1;
      }
      setPostDetail(payload);
    }
  };

  const getRelativePost = async () => {
    const post = await getAllRelativePost(5, 0, id);
    if (post?.data?.payload?.length) setRelativePost(post?.data?.payload);
  };

  const getUserBlogFavourite = async () => {
    const favourite = await getUserFavouriteBlog(userData?.user_id, id);
    if (favourite?.data?.success) {
      setUserFavourite(favourite?.data?.payload);
    }
  };

  useEffect(() => {
    if (router?.isReady) {
      getPostData();
      getRelativePost();
    }
  }, [router]);

  useEffect(() => {
    if (id && userData?.user_id) {
      getUserBlogFavourite();
    }
  }, [id, userData]);

  const handleChangePostFavourite = async (status) => {
    if (! userData?.user_id){
      return toast.error('Bạn cần đăng nhập để thực hiện chức năng này')
    }
    
    const changeRes = await changeUserFavouriteBlog(
      userData?.user_id,
      id,
      status
    );

    if (changeRes?.data?.success) {
      setUserFavourite(status);
      if (status) {
        setPostDetail({
          ...postDetail,
          count_favourite: Number(postDetail?.count_favourite) + 1,
        });
      } else {
        setPostDetail({
          ...postDetail,
          count_favourite: Number(postDetail?.count_favourite) - 1,
        });
      }
    }
  };

  return (
    <div>
      {/* Page Header Start */}
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Trang chi tiết bài viết
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a className="text-body" href="/">
                  Trang chủ
                </a>
              </li>
              <li className="breadcrumb-item">
                <a className="text-body" href="/post">
                  Trang bài viết
                </a>
              </li>
              <li
                className="breadcrumb-item text-dark active"
                aria-current="page"
              >
                {postDetail?.blog_title}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      <div className="container-xxl py-6">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-8">
              <div
                className="section-header text-center mx-auto mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <h1 className="mb-3">{postDetail?.blog_title}</h1>
              </div>
              <div
                style={{ width: "95%", height: "400px", position: "relative" }}
              >
                <Image
                  src={postDetail?.blog_image}
                  alt="post-image"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={BLUR_BASE64}
                />
              </div>
              <div className="text-muted border-top pt-4">
                <small className="me-3">
                  <i className="fa fa-calendar text-primary me-2" />
                  {dateTimeConverter(postDetail?.create_at)}
                </small>
                <small className="me-3">
                  <i className="fa fa-eye text-success me-2" />
                  {postDetail?.blog_view}
                </small>
                <small className="me-3">
                  <Tooltip
                    title={
                      userFavourite
                        ? "Nhấn vào để bỏ yêu thích"
                        : "Nhấn vào để yêu thích bài viết"
                    }
                    placement="top"
                  >
                    {userFavourite ? (
                      <FavoriteIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleChangePostFavourite(false)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleChangePostFavourite(true)}
                      />
                    )}
                  </Tooltip>
                  {postDetail?.count_favourite}
                </small>
              </div>

              <div
                style={{ width: "100%", marginTop: "50px" }}
                className={style.postDetailDescription}
              >
                <Markup content={postDetail?.blog_desc} />
              </div>
            </div>
            <div className="col-md-1" />
            <div className="col-12 col-md-3">
              <div
                className="text-center mx-auto mb-5 wow fadeInUp mt-5"
                data-wow-delay="0.1s"
              >
                <h4 className="mb-3">Bài viết mới nhất</h4>
                <div className="row g-4" style={{ justifyContent: "center" }}>
                  {relativePost?.map((postItem, postIndex) => {
                    return (
                      <div
                        className="col-12 wow fadeInUp"
                        data-wow-delay="0.1s"
                        key={`post-item-${postIndex}`}
                        style={{ marginTop: postIndex !== 0 ? "30px" : "" }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "180px",
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
                        <div className="bg-light p-1">
                          <a
                            className="d-block h5 lh-base mb-1"
                            href={`/post/${postItem?.blog_id}`}
                            style={{
                              fontSize: "16px",
                              fontWeight: 500,
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              padding: "5px 10px",
                            }}
                          >
                            {postItem?.blog_title}
                          </a>
                          <div className="text-muted border-top pt-1">
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
          </div>
          <div className="row g-4 mt-5">
            <PostReview />
          </div>
        </div>
      </div>
    </div>
  );
}
