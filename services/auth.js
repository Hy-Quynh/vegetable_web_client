import { request } from "../utils/request";

export async function userSignup({
  firstName,
  lastName,
  email,
  phone_number,
  address,
  password,
  role,
  type
}) {
  return request({
    method: "POST",
    url: "/auth/signup",
    body: {
      firstName,
      lastName,
      email,
      password,
      phone_number,
      address,
      role,
      type
    },
  });
}

export async function userLogin(email, password) {
  return request({
    method: "POST",
    url: `/auth/login`,
    body: {
      email,
      password,
    },
  });
}
