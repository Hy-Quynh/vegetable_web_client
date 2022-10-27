import { request } from "../utils/request";

export async function getListProduct(
  search,
  limit,
  offset,
  category,
  minPrice,
  maxPrice
) {
  return request({
    method: "GET",
    url: `/product?search=${search}&limit=${limit}&offset=${offset}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
  });
}

export async function getProductById(productId) {
  return request({
    method: "GET",
    url: `/product/${productId}`,
  });
}

export async function getProductQuantity(productId) {
  return request({
    method: "GET",
    url: `/product/${productId}/quantity`,
  });
}

export async function createNewProduct(productData) {
  return request({
    method: "POST",
    url: `/product`,
    body: { productData },
  });
}

export async function updateProductData(productData, productId) {
  return request({
    method: "PUT",
    url: `/product/${productId}`,
    body: { productData },
  });
}

export async function deleteProductData(productId) {
  return request({
    method: "DELETE",
    url: `/product/${productId}`,
  });
}

export async function getReviewByProduct({ productId, limit, page }) {
  return request({
    method: "GET",
    url: `/product/review/${productId}?limit=${limit}&page=${page}`,
  });
}

export async function createCustomerReview({ user_id, review, product_id, star }) {
  return request({
    method: "POST",
    url: `/product/review`,
    body: { user_id, review, product_id, star },
  });
}

export async function createChildrenReview({
  review_id,
  user_id,
  review,
  author_type,
}) {
  return request({
    method: "POST",
    url: `/product/review/children`,
    body: { review_id, user_id, review, author_type },
  });
}

export async function updateReviewChildrenStatus(childrenId, status) {
  return request({
    method: "PUT",
    url: `/product/review/children/${childrenId}/status`,
    body: { status },
  });
}

export async function deleteReviewChildren(childrenId) {
  return request({
    method: "DELETE",
    url: `/product/review/children/${childrenId}`,
  });
}

export async function updateUserReviewChildren(childrenId, review) {
  return request({
    method: "PUT",
    url: `/product/review/children/${childrenId}`,
    body: { review },
  });
}

export async function getAllReview() {
  return request({
    method: "GET",
    url: `/product/review`,
  });
}

export async function updateReviewStatus(reviewId, status) {
  return request({
    method: "PUT",
    url: `/product/review/${reviewId}/status`,
    body: { status },
  });
}

export async function deleteReviewData(reviewId) {
  return request({
    method: "DELETE",
    url: `/product/review/${reviewId}`,
  });
}

export async function updateUserReview(reviewId, review) {
  return request({
    method: "PUT",
    url: `/product/review/${reviewId}`,
    body: { review },
  });
}

export async function checkoutCart(
  cartData,
  paymentMethod,
  totalPrice,
  userInfo,
  paymentId,
  pickUpOption,
  pickUpTime,
) {
  return request({
    method: "POST",
    url: `/product/cart`,
    body: { cartData, paymentMethod, totalPrice, userInfo, paymentId, pickUpOption, pickUpTime },
  });
}

export async function getListCheckout(fromData, toDate, limit, offset, status) {
  return request({
    method: "GET",
    url: `/product/checkout/list?fromData=${fromData}&toDate=${toDate}&limit=${limit}&${offset}&status=${status}`,
  });
}

export async function deleteCheckoutProduct(checkoutId) {
  return request({
    method: "DELETE",
    url: `/product/checkout/${checkoutId}`,
  });
}

export async function changeCheckoutStatus(status, checkoutId) {
  return request({
    method: "PUT",
    url: `/product/checkout/status/${checkoutId}`,
    body: { status },
  });
}

export async function getCheckoutById(checkoutId) {
  return request({
    method: "GET",
    url: `/product/checkout/${checkoutId}`,
  });
}

export async function getCheckoutByUserId(userId) {
  return request({
    method: "GET",
    url: `/product/checkout/user/${userId}`,
  });
}

export async function createNewPromo({
  promoData,
  discountRule,
  listFreeProduct,
  listPromoProduct,
}) {
  return request({
    method: "POST",
    url: `/product/promo`,
    body: {
      promoData,
      discountRule,
      listFreeProduct,
      listPromoProduct,
    },
  });
}

export async function updatePromoData(
  { promoData, discountRule, listFreeProduct, listPromoProduct },
  promoId
) {
  return request({
    method: "PUT",
    url: `/product/promo/${promoId}`,
    body: {
      promoData,
      discountRule,
      listFreeProduct,
      listPromoProduct,
    },
  });
}

export async function getPromoList() {
  return request({
    method: "GET",
    url: `/product/promo/list`,
  });
}

export async function deletePromoData(promoId) {
  return request({
    method: "DELETE",
    url: `/product/promo/${promoId}`,
  });
}

export async function getPromoById(promoId) {
  return request({
    method: "GET",
    url: `/product/promo/${promoId}`,
  });
}

export async function checkUserPurchasedProduct(userId, productId) {
  return request({
    method: "GET",
    url: `/product/purchase/${productId}/${userId}`,
  });
}


export async function getSellingProduct(limit, offset) {
  return request({
    method: "GET",
    url: `/product/selling/info?limit=${limit}&offset=${offset}`,
  });
}

export async function addKeyWordSearch(search) {
  return request({
    method: 'POST',
    url: `/product/search/keyword`,
    body: {search}
  })
}

export async function getMostSearchProduct() {
  return request({
    method: 'GET',
    url: `/product/search/most`,
  })
}