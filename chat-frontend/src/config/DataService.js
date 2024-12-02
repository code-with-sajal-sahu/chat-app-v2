import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const handlePostRequest = async (endpoint, data, showToast = true) => {
    try{
        const response = await axiosInstance.post(endpoint, data);
        if(showToast) toast.success(response?.data?.message);
        return response?.data;
    }catch(error){
        console.log("Post Request Error: ", error);
        if(showToast) toast.error(error?.response?.data?.message || error?.message);
        return error?.response?.data;
    }
};

export const handleGetRequest = async (endpoint, showToast = false) => {
    try{
        const response = await axiosInstance.get(endpoint);
        if(showToast) toast.success(response?.data?.message);
        return response?.data;
    }catch(error){
        console.log("Get Request Error: ", error);
        if(showToast) toast.error(error?.response?.data?.message || error?.message);
        return error?.response?.data;
    }
};
