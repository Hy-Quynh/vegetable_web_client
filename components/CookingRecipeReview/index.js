import React, { useState, useEffect } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { dateTimeConverter } from "../../utils/common";
import { toast } from "react-toastify";
import { USER_INFO_KEY } from "../../utils/constants";
import { useRouter } from "next/router";
import { createCookingRecipeReview, getReviewByCookingRecipe } from "../../services/cookingRecipe";

const REVIEW_IN_PAGE = 5

export default function CookingRecipeReview(props) {
  const [addReviewData, setAddReviewData] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const userData = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY)) : {}
  const router = useRouter();
  const cookingRecipeId = router.query?.id;

  const createNewReview = async () => {
    try {
      if ( !addReviewData?.trim()?.length){
        return toast.error("Nội dung bình luận không được bỏ trống");
      }
      if (userData?.user_id) {
        const createReviewRes = await createCookingRecipeReview({
          user_id: Number(userData.user_id),
          review: addReviewData?.trim(),
          cooking_recipe_id: cookingRecipeId,
        });

        if (createReviewRes?.data?.success) {
          toast.success("Gửi bình luận thành công");
          getAllReview(currentPage);
          setAddReviewData('')
        } else {
          toast.error("Gửi bình luận thất bại");
        }
      } else {
        toast.error('Đăng nhập để thực hiện chức năng này')
      }
    } catch (error) {
      console.log("create review error: ", error);
    }
  };

  const getAllReview = async (page) => {
    try {
      const reviewRes = await getReviewByCookingRecipe({
        cookingRecipeId: cookingRecipeId,
        limit: REVIEW_IN_PAGE,
        page: page - 1,
      });
      if (reviewRes?.data?.success) {
        setReviewData(reviewRes?.data?.payload?.review);
        const allItem = reviewRes?.data?.payload?.total;
        const total_page = Math.ceil(Number(allItem) / REVIEW_IN_PAGE);
        setTotalPage(total_page);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log("get review Error: ", error);
    }
  };

  useEffect(() => {
    if (router.isReady){
      getAllReview(1);
    }
  }, [router]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h6
        style={{
          textAlign: "center",
          fontSize: "1.5em",
          color: "#FF5721",
          fontWeight: 600,
        }}
      >
        Bình luận công thức nấu ăn
      </h6>
      <div
        className="row"
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          boxSizing: "border-box",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <div className="col-sm-2 col-md-3"></div>
        <div className="col-sm-8 col-md-6">
          <FormControl fullWidth>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={4}
              placeholder="Nhập đánh giá"
              value={addReviewData}
              onChange={(event) => setAddReviewData(event.target.value)}
              style={{padding: '5px 10px'}}
            />
            <Stack
              sx={{ marginTop: "10px" }}
              justifyContent={"center"}
              flexDirection={"row"}
            >
              <Box>
                <Button
                  variant="contained"
                  onClick={() => createNewReview()}
                  sx={{ color: "white !important" }}
                >
                  Gửi bình luận
                </Button>
              </Box>
            </Stack>
          </FormControl>
        </div>
        <div className="col-sm-2 col-md-3"></div>
      </div>

      {/*  */}

      {reviewData.map((reviewItem, reviewIndex) => {
        return (
          <>
            {reviewItem?.status === 1 && (
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
                <div className="col-sm-2 col-md-1"></div>
                <div className="col-sm-8 col-md-6">
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
                        {reviewItem?.last_name?.charAt(0)?.toUpperCase()}
                      </h6>
                    </div>
                    <div>
                      <h6
                        style={{
                          marginLeft: "10px",
                          fontSize: "1.2em",
                          fontWeight: "800",
                          marginBottom: 0,
                        }}
                      >
                        {reviewItem?.first_name + ' ' + reviewItem?.last_name }
                      </h6>
                    </div>
                  </Stack>
                  <p style={{ marginBottom: 0, fontSize: "0.8em" }}>
                    Ngày bình luận:{" "}
                    {reviewItem.review_date &&
                      dateTimeConverter(reviewItem?.review_date)}
                  </p>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={3}
                      value={reviewItem?.review && reviewItem?.review}
                      disabled={true}
                      style={{resize: 'none'}}
                    />
                  </FormControl>
                </div>
                <div className="col-sm-2 col-md-3"></div>
              </div>
            )}
          </>
        );
      })}

      <div
        className="row"
        style={{ marginTop: "50px", marginLeft: 0, marginRight: 0, justifyContent: 'end' }}
      >
        <div className="col-sm-2 col-md-1"></div>
        <div className="col-sm-8 col-md-6">
          <div
            className="row"
            style={{ justifyContent: "center", marginLeft: 0, marginRight: 0 }}
          >
            <Stack spacing={2} flexDirection={"row"} justifyContent={"center"}>
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
    </div>
  );
}
