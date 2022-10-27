import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  FormControl,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlaceholderImage from "../../../assets/user/placeholder-image.jpeg";
import { dateTimeConverter } from "../../../utils/common";
import { Markup } from "interweave";
import {
  createChildrenReview,
  deleteReviewChildren,
  deleteReviewData,
  getReviewByProduct,
  updateReviewStatus,
} from "../../../services/product";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { USER_INFO_KEY } from "../../../utils/constants";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const inputStyle = {
  width: "80%",
  minHeight: "50px",
  border: "1px solid #1876D1",
  padding: "10px",
  borderRadius: "5px",
  marginLeft: "20px",
};
const REVIEW_IN_PAGE = 12;

export default function ViewProductDrawer(props) {
  const [productDetailTab, setProductDetailTab] = useState(0);
  const [productReview, setProductReview] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [replyReviewId, setReplyReviewId] = useState(0);
  const [replyContent, setReplyContent] = useState("");
  const { visible, initData, onClose } = props;
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const getAllReview = async (page) => {
    try {
      const reviewRes = await getReviewByProduct({
        productId: initData?.product_id,
        limit: REVIEW_IN_PAGE,
        page: page - 1,
      });
      if (reviewRes.data && reviewRes.data.success) {
        setProductReview(reviewRes.data.payload.review);
        const allItem = reviewRes.data.payload.total;
        const total_page = Math.ceil(Number(allItem) / REVIEW_IN_PAGE);
        setTotalPage(total_page);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log("get review Error: ", error);
    }
  };

  useEffect(() => {
    if (productDetailTab === 1) {
      getAllReview(1);
    }
  }, [productDetailTab]);

  const createReviewChildren = async () => {
    if (!replyContent?.trim()?.length) {
      return toast.error("Nội dung bình luận không thể bỏ trống");
    }

    const createRes = await createChildrenReview({
      review_id: replyReviewId,
      user_id: userData?.admin_id,
      review: replyContent,
      author_type: "admin",
    });

    if (createRes?.data?.success) {
      setReplyContent("");
      getAllReview(currentPage);
      return toast.success("Trả lời bình luân thành công");
    }
    return toast.error("Trả lời bình luận thất bại");
  };

  return (
    <React.Fragment key="right">
      <Drawer anchor="right" open={visible} onClose={() => onClose()}>
        <Box sx={{ width: "70vw", minWidth: "300px", paddingTop: "80px" }}>
          <Stack justifyContent={"end"}>
            <Box>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
          <div style={{ marginLeft: "20px" }}>
            <Tabs
              value={productDetailTab}
              onChange={(event, newValue) => setProductDetailTab(newValue)}
              aria-label="disabled tabs example"
            >
              <Tab label="Thông tin sản phẩm" />
              <Tab label="Đánh giá sản phẩm" />
            </Tabs>
          </div>
          {productDetailTab === 0 ? (
            <Box sx={{ padding: "20px" }}>
              <Box
                sx={{
                  textAlign: "center",
                  marginBottom: "20px",
                  fontWeight: 700,
                }}
              >
                THÔNG TIN SẢN PHẨM
              </Box>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={initData?.product_image || PlaceholderImage}
                  alt="product-image"
                  width={100}
                  height={100}
                />
              </div>
              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
                style={{ marginBottom: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Tên sản phẩm:</div>
                </Box>
                <Box sx={inputStyle}>{initData?.product_name || ""}</Box>
              </Stack>

              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
                style={{ marginBottom: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Danh mục:</div>
                </Box>
                <Box sx={inputStyle}>{initData?.category_name}</Box>
              </Stack>

              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
                style={{ marginBottom: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Giá:</div>
                </Box>
                <Box sx={inputStyle}>{initData?.product_price}</Box>
              </Stack>

              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
                style={{ marginBottom: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Giá giảm:</div>
                </Box>
                <Box sx={inputStyle}>
                  {Number(initData?.product_sale) > 0 &&
                  Number(initData?.product_sale) !==
                    Number(initData?.product_price)
                    ? initData?.product_sale
                    : ""}
                </Box>
              </Stack>
              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
                style={{ marginBottom: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Số lượng: </div>
                </Box>
                <Box sx={inputStyle}>{initData?.product_quantity}</Box>
              </Stack>
              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Ngày tạo:</div>
                </Box>
                <Box sx={inputStyle}>
                  {dateTimeConverter(initData?.create_at)}
                </Box>
              </Stack>

              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="flex-start"
                justifyContent="flex-start"
                style={{ marginTop: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>
                    Chương trình khuyến mãi:
                  </div>
                </Box>
                <Box
                  sx={{
                    width: "80%",
                    border: "1px solid #1876D1",
                    padding: "10px",
                    borderRadius: "5px",
                    marginLeft: "20px",
                    overflowX: "auto",
                    minHeight: "50px",
                  }}
                >
                  {initData?.promo?.length ? (
                    initData?.promo?.map((item, index) => {
                      if (item?.promo_rule === "FREE_PRODUCT") {
                        return (
                          <div
                            style={{
                              padding: "5px",
                              color: "black",
                              marginBottom: "10px",
                            }}
                            key={`product-item-${index}`}
                          >
                            <div style={{ fontSize: "18px" }}>
                              <b>{item?.promo_name}</b>
                            </div>
                            <ul>
                              {item?.free_product?.map?.(
                                (freeItem, freeIndex) => {
                                  return (
                                    <li key={`product-item-${freeIndex}`}>
                                      {freeItem?.product_name}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div>Hiện chưa có chương trình khuyến mãi</div>
                  )}
                </Box>
              </Stack>

              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="flex-start"
                justifyContent="flex-start"
                style={{ marginTop: "20px" }}
              >
                <Box sx={{ width: "20%" }}>
                  <div style={{ color: "#1876D1" }}>Mô tả:</div>
                </Box>
                <Box
                  sx={{
                    width: "80%",
                    border: "1px solid #1876D1",
                    padding: "10px",
                    borderRadius: "5px",
                    marginLeft: "20px",
                    overflowX: "auto",
                  }}
                >
                  <Markup content={initData?.product_description} />
                </Box>
              </Stack>
            </Box>
          ) : (
            <div>
              {productReview?.length ? (
                productReview?.map((reviewItem, reviewIndex) => {
                  return (
                    <div key={`product-review-item-${reviewIndex}`}>
                      <div
                        className="row"
                        style={{
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          boxSizing: "border-box",
                          marginTop: "50px",
                          marginLeft: 0,
                          marginRight: 0,
                        }}
                      >
                        {/* <div className="col-sm-2 col-md-1"></div> */}
                        <div className="col-sm-8 col-md-8">
                          <Stack
                            justifyContent={"start"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            sx={{ marginBottom: "10px" }}
                          >
                            <div>
                              <h6
                                style={{
                                  padding: "10px",
                                  margin: 0,
                                  background: "gray",
                                  color: "white",
                                  fontWeight: "800",
                                }}
                              >
                                {reviewItem?.last_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </h6>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <h6
                                style={{
                                  marginLeft: "10px",
                                  fontSize: "1.2em",
                                  fontWeight: "800",
                                  marginBottom: 0,
                                }}
                              >
                                {reviewItem?.first_name +
                                  " " +
                                  reviewItem?.last_name}
                              </h6>

                              <div style={{ marginLeft: "10px" }}>
                                <Stack
                                  sx={{ my: "10px" }}
                                  justifyContent={"center"}
                                  flexDirection={"row"}
                                >
                                  {[1, 2, 3, 4, 5]?.map((item) => {
                                    return item <= reviewItem?.star ? (
                                      <StarIcon
                                        sx={{ color: "#FC6D2E", width: "15px" }}
                                      />
                                    ) : (
                                      <StarBorderIcon
                                        sx={{ color: "#FC6D2E", width: "15px" }}
                                      />
                                    );
                                  })}
                                </Stack>
                              </div>

                              <div style={{ marginLeft: "15px" }}>
                                <div
                                  onClick={async () => {
                                    const deleteRes = await deleteReviewData(
                                      reviewItem?.review_id
                                    );
                                    if (deleteRes?.data?.success) {
                                      getAllReview(currentPage);
                                      return toast.success(
                                        "Xoá bình luận thành công"
                                      );
                                    }
                                    return toast.error(
                                      "Xoá bình luận thất bại"
                                    );
                                  }}
                                >
                                  <DeleteIcon
                                    sx={{ color: "red", cursor: "pointer" }}
                                  />
                                </div>
                              </div>
                              <div
                                style={{ marginLeft: "15px" }}
                                onClick={async () => {
                                  const updateRes = await updateReviewStatus(
                                    reviewItem?.review_id,
                                    reviewItem?.status === 0 ? 1 : 0
                                  );
                                  if (updateRes?.data?.success) {
                                    getAllReview(currentPage);
                                    return toast.success(
                                      "Cập nhật trạng thái bình luận thành công"
                                    );
                                  }
                                  return toast.error(
                                    "Cập nhật trạng thái bình luận thất bại"
                                  );
                                }}
                              >
                                {reviewItem?.status === 1 ? (
                                  <VisibilityIcon
                                    sx={{ color: "green", cursor: "pointer" }}
                                  />
                                ) : (
                                  <VisibilityOffIcon
                                    sx={{ color: "green", cursor: "pointer" }}
                                  />
                                )}
                              </div>
                            </div>
                          </Stack>
                          <p style={{ marginBottom: 0, fontSize: "0.8em" }}>
                            Ngày review:{" "}
                            {reviewItem.review_date &&
                              dateTimeConverter(reviewItem?.review_date)}
                          </p>
                          <FormControl fullWidth>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={3}
                              value={reviewItem?.review && reviewItem?.review}
                              disabled={true}
                              style={{ resize: "none" }}
                            />
                          </FormControl>
                          <div
                            style={{
                              color: "blue",
                              textAlign: "right",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (replyReviewId !== reviewItem?.review_id) {
                                setReplyContent("");
                                setReplyReviewId(reviewItem?.review_id);
                              }
                            }}
                          >
                            Phản hồi
                          </div>

                          {reviewItem?.children_review?.length ? (
                            reviewItem?.children_review?.map(
                              (childrenReviewItem, childrenReviewIndex) => {
                                return (
                                  <div
                                    key={`children-review-item-${childrenReviewIndex}`}
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      marginTop: "12px",
                                      width: "100%",
                                    }}
                                  >
                                    <div style={{ width: "90%" }}>
                                      <Stack
                                        justifyContent={"start"}
                                        flexDirection={"row"}
                                        alignItems={"center"}
                                        sx={{ marginBottom: "10px" }}
                                      >
                                        <div>
                                          <h6
                                            style={{
                                              padding: "2px 5px",
                                              margin: 0,
                                              background: "gray",
                                              color: "white",
                                              fontWeight: "600",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {childrenReviewItem?.author_type ===
                                            "admin"
                                              ? "Q"
                                              : childrenReviewItem?.last_name
                                                  ?.charAt(0)
                                                  ?.toUpperCase()}
                                          </h6>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                          }}
                                        >
                                          <h6
                                            style={{
                                              marginLeft: "10px",
                                              fontSize: "14px",
                                              fontWeight: "600",
                                              marginBottom: 0,
                                            }}
                                          >
                                            {childrenReviewItem?.author_type ===
                                            "admin"
                                              ? "Quản trị viên"
                                              : childrenReviewItem?.first_name +
                                                " " +
                                                childrenReviewItem?.last_name}
                                          </h6>
                                          <div style={{ marginLeft: "15px" }}>
                                            <div
                                              onClick={async () => {
                                                const deleteRes =
                                                  await deleteReviewChildren(
                                                    childrenReviewItem?.review_children_id
                                                  );
                                                if (deleteRes?.data?.success) {
                                                  getAllReview(currentPage);
                                                  return toast.success(
                                                    "Xoá phản hồi bình luận thành công"
                                                  );
                                                }
                                                return toast.error(
                                                  "Xoá phản hồi bình luận thất bại"
                                                );
                                              }}
                                            >
                                              <DeleteIcon
                                                sx={{
                                                  color: "red",
                                                  cursor: "pointer",
                                                  fontSize: "16px",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </Stack>
                                      <p
                                        style={{
                                          marginBottom: 0,
                                          fontSize: "0.8em",
                                        }}
                                      >
                                        Ngày review:{" "}
                                        {childrenReviewItem.review_date &&
                                          dateTimeConverter(
                                            reviewItem?.review_date
                                          )}
                                      </p>
                                      <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={2}
                                        value={childrenReviewItem?.review}
                                        style={{
                                          resize: "none",
                                          width: "100%",
                                        }}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <></>
                          )}
                          {replyReviewId === reviewItem?.review_id ? (
                            <div style={{ marginTop: "10px" }}>
                              <div
                                style={{
                                  textAlign: "left",
                                  marginLeft: "10%",
                                  color: "blue",
                                }}
                              >
                                Phản hồi
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <TextareaAutosize
                                  aria-label="minimum height"
                                  minRows={2}
                                  value={replyContent}
                                  style={{ resize: "none", width: "90%" }}
                                  onChange={(event) =>
                                    setReplyContent(event?.target?.value)
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  border: "1px solid rgb(218,218,218)",
                                  width: "90%",
                                  marginLeft: "10%",
                                  padding: "5px",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  sx={{ padding: "2px" }}
                                  onClick={() => {
                                    createReviewChildren();
                                  }}
                                >
                                  Gửi
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        {/* <div className="col-sm-2 col-md-3"></div> */}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                  Hiện chưa có đánh giá sản phẩm
                </div>
              )}
              {productReview?.length ? (
                <div
                  className="row"
                  style={{
                    marginTop: "50px",
                    marginLeft: 0,
                    marginRight: 0,
                    justifyContent: "end",
                  }}
                >
                  <div className="col-sm-2 col-md-1"></div>
                  <div className="col-sm-8 col-md-6">
                    <div
                      className="row"
                      style={{
                        justifyContent: "center",
                        marginLeft: 0,
                        marginRight: 0,
                      }}
                    >
                      <Stack
                        spacing={2}
                        flexDirection={"row"}
                        justifyContent={"center"}
                      >
                        <Pagination
                          count={totalPage}
                          color="secondary"
                          defaultPage={1}
                          page={currentPage}
                          onChange={(event, value) => {
                            getAllReview(value);
                          }}
                        />
                      </Stack>
                    </div>
                  </div>
                  <div className="col-sm-2 col-md-3"></div>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
