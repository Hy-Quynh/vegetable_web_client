import { request } from "../utils/request";

export function getAllCookingRecipe(limit, offset, search) {
  return request({
    method: "GET",
    url: `/cooking-recipe?limit=${limit}&offset=${offset}&search=${search}`,
  });
}

export function createNewCookingRecipe(cookingRecipeData) {
  return request({
    method: "POST",
    url: `/cooking-recipe`,
    body: {cookingRecipeData}
  });
}

export function updateCookingRecipeData(cookingRecipeData, cookingRecipeId) {
  return request({
    method: "PUT",
    url: `/cooking-recipe/${cookingRecipeId}/info`,
    body: {cookingRecipeData}
  });
}

export function deleteCookingRecipe(cookingRecipeId) {
  return request({
    method: "DELETE",
    url: `/cooking-recipe/${cookingRecipeId}`,
  });
}

export async function getAllRelativeCookingRecipe(limit, offset, existCookingRecipe) {
  return request({
    method: "GET",
    url: `/cooking-recipe/relative?limit=${limit}&offset=${offset}&existCookingRecipe=${existCookingRecipe}`,
  });
}

export async function getCookingRecipeById(cookingRecipeId) {
  return request({
    method: "GET",
    url: `/cooking-recipe/${cookingRecipeId}/info`,
  });
}

export async function getReviewByCookingRecipe({ cookingRecipeId, limit, page }) {
  return request({
    method: "GET",
    url: `/cooking-recipe/review/${cookingRecipeId}?limit=${limit}&offset=${page}`,
  });
}

export async function createCookingRecipeReview({ user_id, review, cooking_recipe_id }) {
  return request({
    method: "POST",
    url: `/cooking-recipe/review`,
    body: { user_id, review, cooking_recipe_id },
  });
}

export async function getAllCookingRecipeReview() {
  return request({
    method: "GET",
    url: `/cooking-recipe/review`,
  });
}

export async function updateReviewStatus(reviewId, status) {
  return request({
    method: "PUT",
    url: `/cooking-recipe/review/${reviewId}/status`,
    body: { status },
  });
}

export async function getUserFavouriteCookingRecipe(userId, cookingRecipeId) {
  return request({
    method: "GET",
    url: `/cooking-recipe/favourite?userId=${userId}&cookingRecipeId=${cookingRecipeId}`,
  });
}

export async function changeUserFavouriteCookingRecipe(userId, cookingRecipeId, status) {
  return request({
    method: "PUT",
    url: `/cooking-recipe/favourite?userId=${userId}&cookingRecipeId=${cookingRecipeId}`,
    body: { status },
  });
}

export async function changeCookingRecipeView(cookingRecipeId, view){
  return request({
    method: "PUT",
    url: `/cooking-recipe/view/${cookingRecipeId}`,
    body: { view },
  });
}