import { request } from "../utils/request";

export async function getAllRole(search, limit, offset){
  return request({
    url: `/role?search=${search}&limit=${limit}&offset=${offset}`,
    method: 'GET'
  })
}

export async function createNewRole({name, role_function}){
  return request({
    url: `/role`,
    method: 'POST',
    body: {name, role_function}
  })
}

export async function deleteRole(roleId) {
  return request({
    url: `/role/${roleId}`,
    method: 'DELETE'
  })
}

export async function updateRole({id, name, role_function}) {
  return request({
    url: `/role/${id}`,
    method: 'PUT',
    body: { name, role_function }
  })
}

export async function getRoleByName(role) {
  return request({
    url: `/role/name/${role}`,
    method: 'GET'
  })
}

export async function getRoleByAdminId(adminId) {
  return request({
    url: `/role/admin/${adminId}`,
    method: 'GET'
  })
}