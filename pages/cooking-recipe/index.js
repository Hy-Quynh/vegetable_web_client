import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAllCookingRecipe } from "../../services/cookingRecipe";
import { dateTimeConverter } from "../../utils/common";
import { BLUR_BASE64 } from "../../utils/constants";

const COOKINGRECIPE_IN_PAGE = 12;

export default function CookingRecipe() {
  const [listCookingRecipe, setListCookingRecipe] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getCookingRecipeData = async (page) => {
    const cookingRecipe = await getAllCookingRecipe(
      COOKINGRECIPE_IN_PAGE,
      page
    );
    const { payload } = cookingRecipe?.data;
    if (payload) {
      const total = payload?.total;
      const cookingRecipeData = payload?.cookingRecipe;

      if (page > currentPage) {
        const newCookingRecipe = [...listCookingRecipe];
        newCookingRecipe?.push(...cookingRecipeData);
        setListCookingRecipe(newCookingRecipe);
      } else {
        setListCookingRecipe(cookingRecipeData);
      }
      setCurrentPage(page);
      setTotalPage(Math.ceil(total / COOKINGRECIPE_IN_PAGE));
    }
  };

  useEffect(() => {
    getCookingRecipeData(currentPage);
  }, []);

  return (
    <div>
      <div
        className="container-fluid page-header wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">
            Trang công thức nấu ăn
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
                Trang công thức nấu ăn
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
          >
            <h1 className="display-5 mb-3">Công thức nấu ăn</h1>
            <p>
              Nhịp sống tất bật, hối hả khiến những bữa cơm gia đình trở nên hạn
              chế lại và ít có thời gian để chăm chút tỉ mỉ cho từng món ăn.
              Đừng lo, thấu hiểu được vấn đề này nên ... sẽ hướng dẫn bạn các
              món ăn đơn giản, dễ làm, không mất nhiều thời gian nha.
            </p>
          </div>
          <div className="row g-4">
            {listCookingRecipe?.map((cookingRecipeItem, cookingRecipeIndex) => {
              return (
                <div
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay="0.1s"
                  key={`cooking-recipe-item-${cookingRecipeIndex}`}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <Image
                      src={cookingRecipeItem?.cooking_recipe_avatar}
                      layout="fill"
                      alt="post-iamge"
                      placeholder="blur"
                      blurDataURL={BLUR_BASE64}
                    />
                  </div>
                  <div className="bg-light p-4">
                    <a
                      className="d-block h5 lh-base mb-4"
                      href={`/cooking-recipe/${cookingRecipeItem?.cooking_recipe_id}`}
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cookingRecipeItem?.cooking_recipe_text}
                    </a>
                    <div className="text-muted border-top pt-4">
                      <small className="me-3">
                        <i className="fa fa-calendar text-primary me-2" />
                        {dateTimeConverter(cookingRecipeItem?.create_at)}
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
                  onClick={() => getCookingRecipeData(currentPage + 1)}
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
