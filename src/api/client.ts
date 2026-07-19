/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';

// Get API base URL from Vite environment variables or default to /api
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request Interceptor to add authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interviewai_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: 'An unexpected error occurred.',
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response) {
      // Server responded with non-2xx status code
      customError.message = error.response.data?.message || error.response.data?.detail || `Error ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response was received
      customError.message = 'No response received from the server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      customError.message = error.message;
    }

    return Promise.reject(customError);
  }
);
