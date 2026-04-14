import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

import { Service } from '../types/booking';

export const getServices = async (bookingDate: string): Promise<Service[]> => {
  const response = await api.post('/booking/booked-slots', { bookingDate });
  const { booked, available: availSlots } = response.data.data as { booked: {startTime: string; endTime: string}[], available: {startTime: string; endTime: string}[] };
  
  // Create unique slots combining booked + available
  const allStartTimes = new Set([...booked.map(s => s.startTime), ...availSlots.map(s => s.startTime)]);
  
  const services: Service[] = Array.from(allStartTimes).map(startTime => {
    const slot = [...booked, ...availSlots].find(s => s.startTime === startTime)!;
    return {
      id: `slot-${startTime}`,
      name: `${startTime}-${slot.endTime} Cricket Slot`,
      price: 500,
      available: availSlots.some(s => s.startTime === startTime)
    };
  });
  
  return services;
};

export default api;

