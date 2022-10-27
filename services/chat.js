import { request } from "../utils/request";


export async function getAllUserHaveChat() {
  return request({
    method: "GET",
    url: `/chat/user`,
  });
}

export async function getChatByUserId(userId) {
  return request({
    method: "GET",
    url: `/chat/user/${userId}`,
  });
}

export async function createUserChat(userId, message) {
  return request({
    method: "POST",
    url: `/chat/user/${userId}`,
    body: { message },
  });
}

export async function createUserChatReply(userId, message, ownerReply) {
  return request({
    method: "POST",
    url: `/chat/user/reply/${userId}`,
    body: { message, owner_reply: ownerReply },
  });
}