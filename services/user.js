import { request } from "../utils/request";

export async function getAllUser(type, sort, limit, offset, search){
  return request({
    method: 'GET',
    url: `/user?type=${type}&limit=${limit}&offset=${offset}&sort=${sort}&search=${search}`
  })
}

export async function getUserInfo(userId){
  return request({
    method: 'GET',
    url: `/user/${userId}`
  })
}

export async function deleteUser(userId, type) {
  return request({
    method: 'DELETE',
    url: `/user/${userId}?type=${type}`
  })
}

export async function changeUserStatus(status, userId, type) {
  return request({
    url: `/user/status/${userId}?type=${type}&status=${status}`,
    method: 'PUT'
  })
}

export async function updateUserName(first_name, last_name, userId) {
  return request({
    url: `/user/${userId}/name`,
    method: 'PUT',
    body: {first_name, last_name}
  })
}

export async function updateUserInfo({id, email, first_name, last_name, address, phone_number}) {
  return request({
    url: `/user/${id}`,
    method: 'PUT',
    body: {email, first_name, last_name, address, phone_number} 
  })
}

export async function updateAdminRole(adminId, role) {
  return request({
    url: `/user/admin/${adminId}/role`,
    method: 'PUT',
    body: {role}
  })
}