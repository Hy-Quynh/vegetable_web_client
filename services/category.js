import { request } from "../utils/request";

export async function getAllCategory(limit, offset) {
  return request({
    method: "GET",
    url: `/category?limit=${limit}&offset=${offset}`,
    })
}

export async function createNewCategory(categoryData) {
  return request({
    method: 'POST',
    url: '/category',
    body: {categoryData}
  })
}

export async function updateCategoryData(categoryData, categoryId) {
  return request({
    method: 'PUT',
    url: `/category/${categoryId}`,
    body: {categoryData}
  })
}

export async function deleteCategory(categoryId) {
  return request({
    method: 'DELETE',
    url: `/category/${categoryId}`,
  })
}