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

interface BackendSlot {
  session?: 'MORNING' | 'AFTERNOON';
  price?: number;
  startTime: string;
  endTime: string;
}

export const getServices = async (bookingDate: string): Promise<Service[]> => {
  const response = await api.post('/booking/booked-slots', { bookingDate });
  const { booked, available: availSlots } = response.data.data as { 
    booked: BackendSlot[], 
    available: BackendSlot[] 
  };
  
  // Create unique slots
  const allStartTimes = new Set([...booked.map(s => s.startTime), ...availSlots.map(s => s.startTime)]);
  
  const services: Service[] = Array.from(allStartTimes).map(startTime => {
    const availableSlot = availSlots.find(s => s.startTime === startTime);
    const anySlot = availableSlot || [...booked, ...availSlots].find(s => s.startTime === startTime)!;
    
    const service = {
      id: `slot-${startTime}`,
      name: `${startTime}-${anySlot.endTime} (${availableSlot?.session || 'General'}) Cricket Slot`,
      price: availableSlot?.price || 30,
      available: !!availableSlot,
      startTime,
      endTime: anySlot.endTime
    };

    return service;
  });
  
  return services;
};

import type { BookingPayload, BookingResponse, PaymentResponse } from '../types/booking';

export const createBooking = async (payload: BookingPayload): Promise<BookingResponse> => {
  const response = await api.post('/booking/create', payload);
  return response.data;
};

export const createPaymentLink = async (bookingId: number): Promise<PaymentResponse> => {
  const response = await api.post(`/payment/create-payment-link/${bookingId}`);
  return response.data;
};


export default api;

