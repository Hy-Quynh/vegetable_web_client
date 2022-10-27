import { request } from "../utils/request";

export async function createNewContact(contactData) {
  return request({
    method: "POST",
    url: `/contact`,
    body: {contactData}
  })
}

export async function getListContact() {
  return request({
    method: "GET",
    url: `/contact`,
  })
}

export async function deleteContact(contactId) {
  return request({
    method: "DELETE",
    url: `/contact/${contactId}`,
  })
}