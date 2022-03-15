import axios from "axios";

export const axiosStrapi = axios.create({
  baseURL: process.env.REACT_APP_STRAPI_BASE_URI,
});
