import moment from "moment";
import { USER_CART_INFO, USER_INFO_KEY } from "./constants";

const hasNumber = (string) => {
  return /\d/.test(string);
};

const hasSpecicalCharacter = (string) => {
  return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string);
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isVietnamesePhoneNumber = (number) => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
};

const dateTimeConverter = (dateTime) => {
  if (dateTime) {
    return moment(dateTime).format("DD-MM-YYYY");
  }
  return "";
};

const parseJSON = (inputString, fallback) => {
  if (inputString) {
    try {
      return JSON.parse(inputString);
    } catch (e) {
      return fallback;
    }
  }
};

const addProductToCart = (cardData) => {
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  const currCart =
    typeof window !== "undefined" &&
    localStorage.getItem(USER_CART_INFO + `_${userData?.user_id || ""}`)
      ? parseJSON(
          localStorage.getItem(USER_CART_INFO + `_${userData?.user_id || ""}`)
        )
      : [];

  if (currCart?.length) {
    const findPrd = currCart?.findIndex(
      (item) => item?.product_id === cardData?.product_id
    );
    if (findPrd >= 0) {
      currCart[findPrd].quantity =
        Number(currCart[findPrd].quantity) + Number(cardData?.quantity);

      localStorage.setItem(
        USER_CART_INFO + `_${userData?.user_id || ""}`,
        JSON.stringify(currCart)
      );
      return window.dispatchEvent(new Event("storage"));
    }
  }
  currCart?.push(cardData);
  localStorage.setItem(
    USER_CART_INFO + `_${userData?.user_id || ""}`,
    JSON.stringify(currCart)
  );

  window.dispatchEvent(new Event("storage"));
};

export {
  hasNumber,
  validateEmail,
  isVietnamesePhoneNumber,
  hasSpecicalCharacter,
  dateTimeConverter,
  parseJSON,
  addProductToCart,
};
