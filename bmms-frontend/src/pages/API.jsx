// src/services/API.jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default class API {
  // ==================== AUTHENTICATION ====================
  static auth = {
    register: (data) => api.post('/users/register', { ...data, role: data.role.toUpperCase() }),
    login: (data) => api.post('/users/login', data),
    verify2FA: (email, code) => api.post('/users/verify-2fa', null, { 
      params: { email, enteredCode: code } 
    }),
    requestPasswordReset: (email) => api.post('/users/request-reset', null, { 
      params: { email } 
    }),
    resetPassword: (token, newPassword) => 
      api.post('/users/reset-password', { newPassword }, { 
        params: { token } 
      }),
  };

  // ==================== PRODUCTS ====================
  static products = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (product) => api.post('/products', product),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: (id) => api.delete(`/products/${id}`),
  };

  // ==================== CATEGORIES ====================
  static categories = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (category) => api.post('/categories', category),
    update: (id, category) => api.put(`/categories/${id}`, category),
    delete: (id) => api.delete(`/categories/${id}`),
  };

  // ==================== ORDERS ====================
  static orders = {
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    create: (order) => api.post('/orders', order),
    update: (id, order) => api.put(`/orders/${id}`, order),
    delete: (id) => api.delete(`/orders/${id}`),
  };

  // ==================== ORDER DETAILS ====================
  static orderDetails = {
    getAll: () => api.get('/orderdetails'),
    getById: (id) => api.get(`/orderdetails/${id}`),
    create: (orderDetail) => api.post('/orderdetails', orderDetail),
    update: (id, orderDetail) => api.put(`/orderdetails/${id}`, orderDetail),
    delete: (id) => api.delete(`/orderdetails/${id}`),
  };

  // ==================== STOCKS ====================
  static stocks = {
    getAll: () => api.get('/stocks'),
    getById: (id) => api.get(`/stocks/${id}`),
    create: (stock) => api.post('/stocks', stock),
    update: (id, stock) => api.put(`/stocks/${id}`, stock),
    delete: (id) => api.delete(`/stocks/${id}`),
  };

  // ==================== SUPPLIERS ====================
  static suppliers = {
    getAll: () => api.get('/suppliers'),
    getById: (id) => api.get(`/suppliers/${id}`),
    create: (supplier) => api.post('/suppliers', supplier),
    update: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
    delete: (id) => api.delete(`/suppliers/${id}`),
  };
}