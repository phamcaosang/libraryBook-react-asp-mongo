import axios from "axios";
const BASE_URL = "https://samlibrary.azurewebsites.net/api/";
// const BASE_URL = "https://localhost:7107/api/";

export const publicRequest = axios.create({
  baseURL: BASE_URL
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { 
    Authorization: `Bearer ${localStorage.getItem('Token')}`,
 },
 timeout: 5000,
});




