import { request } from "../utils/request";

export function getAllHelper() {
  return request({
    method: "GET",
    url: `/helper`,
  });
}

export function createNewHelper(helperData) {
  return request({
    method: "POST",
    url: `/helper`,
    body: {helperData}
  });
}

export function updateHelperData(helperData, helperId) {
  return request({
    method: "PUT",
    url: `/helper/${helperId}`,
    body: {helperData}
  });
}

export function deleteHelper(helperId) {
  return request({
    method: "DELETE",
    url: `/helper/${helperId}`,
  });
}

export function getAllWarranty(){
  return request({
    method: "GET",
    url: `/helper/warranty/info`,
  });
}

export function createWarrantyInfo(warrantyContent) {
  return request({
    method: "POST",
    url: `/helper/warranty/info`,
    body: {
      warrantyContent
    }
  });
}


export function updateWarrantyInfo(warrantyId, warrantyContent) {
  return request({
    method: "PUT",
    url: `/helper/warranty/${warrantyId}/info`,
    body: {
      warrantyContent
    }
  });
}