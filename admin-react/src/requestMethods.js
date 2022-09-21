import axios from "axios";

const BASE_URL = "https://samlibrary.azurewebsites.net/api/";
// const BASE_URL = "https://localhost:7107/api/"

// const TOKEN  = localStorage.getItem("persist:root") ? JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user).currentUser?.Token : ""

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { 
    Authorization: `Bearer ${localStorage.getItem("Token")}`,
 },
});