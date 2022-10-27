import { request } from "../utils/request";

export async function electricityPayment(electricityData) {
  return request({
    method: "POST",
    url: `/electricity-water/electricity/payment`,
    body: { ...electricityData },
  });
}

export async function getListElectricity(limit, offset, userId) {
  return request({
    method: "GET",
    url: `/electricity-water/electricity/payment?limit=${limit}&offset=${offset}&userId=${userId}`,
  });
}

export async function waterPayment(waterData) {
  return request({
    method: "POST",
    url: `/electricity-water/water/payment`,
    body: { ...waterData },
  });
}

export async function getListWaterPayment(limit, offset, userId) {
  return request({
    method: "GET",
    url: `/electricity-water/water/payment?limit=${limit}&offset=${offset}&userId=${userId}`,
  });
}
