/** @format */

import { eraseCookie, getCookie, setCookie } from "./cookie";

export const getToken = () => {
  return localStorage.getItem("userToken") || getCookie("userToken") || "";
};

export const setToken = (token, remember) => {
  remember ? localStorage.setItem("userToken", token) : setCookie("userToken", token, 1);
};

export const deleteToken = () => {
  localStorage.removeItem("userToken");
  eraseCookie("userToken");
};
