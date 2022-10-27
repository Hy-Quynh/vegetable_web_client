import { request } from "../utils/request";

export async function getAllPostList(limit, offset, search) {
  return request({
    method: "GET",
    url: `/post?limit=${limit}&offset=${offset}&search=${search}`,
  });
}

export async function getAllRelativePost(limit, offset, existPost) {
  return request({
    method: "GET",
    url: `/post/relative?limit=${limit}&offset=${offset}&existPost=${existPost}`,
  });
}

export async function getPostById(postId) {
  return request({
    method: "GET",
    url: `/post/${postId}/info`,
  });
}

export async function createNewPost({ title, desc, image }) {
  return request({
    method: "POST",
    url: `/post`,
    body: { title, desc, image },
  });
}

export async function deletePostData(postId) {
  return request({
    method: "DELETE",
    url: `/post/${postId}/info`,
  });
}

export async function updatePostData({ id, title, desc, image }) {
  return request({
    method: "PUT",
    url: `/post/${id}/info`,
    body: { title, desc, image },
  });
}

export async function getReviewByBlog({ postId, limit, page }) {
  return request({
    method: "GET",
    url: `/post/review/${postId}?limit=${limit}&offset=${page}`,
  });
}

export async function createBlogReview({ user_id, review, blog_id }) {
  return request({
    method: "POST",
    url: `/post/review`,
    body: { user_id, review, blog_id },
  });
}

export async function getAllBlogReview() {
  return request({
    method: "GET",
    url: `/post/review`,
  });
}

export async function updateReviewStatus(reviewId, status) {
  return request({
    method: "PUT",
    url: `/post/review/${reviewId}/status`,
    body: { status },
  });
}

export async function getUserFavouriteBlog(userId, blogId) {
  return request({
    method: "GET",
    url: `/post/favourite?userId=${userId}&blogId=${blogId}`,
  });
}

export async function changeUserFavouriteBlog(userId, blogId, status) {
  return request({
    method: "PUT",
    url: `/post/favourite?userId=${userId}&blogId=${blogId}`,
    body: { status },
  });
}

export async function changeBlogView(blogId, view){
  return request({
    method: "PUT",
    url: `/post/view/${blogId}`,
    body: { view },
  });
}