import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

interface CustomSession {
  user: {
    token: string;
  };
}

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api`,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession() as CustomSession | null;

    if (session && session.user.token) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    } else {
      // If no token is found and it's not an auth route, we might want to log it
      if (!config.url?.includes('/auth/')) {
        console.warn(`No token found for request to: ${config.url}`);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        return;
      }
    }
    return Promise.reject(error);
  }
);

export default API;