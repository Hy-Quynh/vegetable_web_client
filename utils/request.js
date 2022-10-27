import { API_SERVER_URL } from "./constants";
import axios from 'axios';

export const errorHandler = (error) => {
  const { response } = error;
  if (!response) {
    return {
      message: 'Mạng không bình thường, không thể kết nối với máy chủ.',
    };
  }
  return error;
};

export function request(initialRequest) {
  const options = {
    method: initialRequest.method,
    data: initialRequest.body,
  };

  const params = {
    ...initialRequest.params,
  };

  return axios(
    `${API_SERVER_URL}${initialRequest.url}${
      Object.keys(params)?.length > 0 ? `?${new URLSearchParams(params).toString()}` : ''
    }`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...initialRequest.headers,
      },
      ...options,
    },
  )
    .then((response) => response)
    .catch((error) => errorHandler(error));
}