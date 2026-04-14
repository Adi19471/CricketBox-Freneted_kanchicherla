import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { getServices } from "../lib/api";
import type { Service } from "../types/booking";

interface BookingState {
  selectedDate: Date | undefined;
  services: Service[];
  selectedServices: Service[];
  loadingServices: boolean;
  couponCode: string;
  couponApplied: boolean;
  discount: number;
  includeInsurance: boolean;
  termsAccepted: boolean;
  paymentStatus: "idle" | "processing" | "success" | "failed";
  bookingId: string;
}

interface BookingContextType extends BookingState {
  setSelectedDate: (date: Date | undefined) => void;
  setServices: (services: Service[]) => void;
  setLoadingServices: (loading: boolean) => void;
  fetchServices: (date: Date | undefined) => Promise<void>;
  toggleService: (service: Service) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setIncludeInsurance: (v: boolean) => void;
  setTermsAccepted: (v: boolean) => void;
  setPaymentStatus: (s: BookingState["paymentStatus"]) => void;
  setBookingId: (id: string) => void;
  getBasePrice: () => number;
  getConvenienceFee: () => number;
  getInsuranceFee: () => number;
  getDiscountAmount: () => number;
  getTotalAmount: () => number;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [couponCode, setCouponCode] = useState(""); 
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<BookingState["paymentStatus"]>("idle");
  const [bookingId, setBookingId] = useState(""); 

  const fetchServices = useCallback(async (date: Date | undefined) => {
    if (!date) {
      setServices([]);
      setLoadingServices(false);
      return;
    }

    try {
      setLoadingServices(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const availableServices = await getServices(formattedDate);
      setServices(availableServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Failed to load services');
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev.filter((s) => s.id !== service.id);
      return [...prev, service];
    });
  };

  const getBasePrice = () => selectedServices.reduce((sum, s) => sum + s.price, 0);
  const getConvenienceFee = () => (selectedServices.length > 0 ? 12 : 0);
  const getInsuranceFee = () => (includeInsurance && selectedServices.length > 0 ? 10 : 0);
  const getDiscountAmount = () => {
    if (!couponApplied) return 0;
    const disc = Math.floor(getBasePrice() * 0.3);
    return Math.min(disc, 75);
  };
  const getTotalAmount = () => getBasePrice() + getConvenienceFee() + getInsuranceFee() - getDiscountAmount(); 

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === "CRICKET30") {
      setCouponCode(code.toUpperCase());
      setCouponApplied(true);
      setDiscount(30);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setDiscount(0);
  };

  const resetBooking = () => {
    setSelectedDate(undefined);
    setSelectedServices([]);
    removeCoupon();
    setIncludeInsurance(false);
    setTermsAccepted(false);
    setPaymentStatus("idle");
    setBookingId("");
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate, setSelectedDate,
        services, selectedServices, loadingServices, setServices, setLoadingServices, fetchServices,
        toggleService,
        couponCode, couponApplied, discount,
        applyCoupon, removeCoupon,
        includeInsurance, setIncludeInsurance,
        termsAccepted, setTermsAccepted,
        paymentStatus, setPaymentStatus,
        bookingId, setBookingId,
        getBasePrice, getConvenienceFee, getInsuranceFee, getDiscountAmount, getTotalAmount,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};
