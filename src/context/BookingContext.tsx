import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { getServices, createBooking, createPaymentLink } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Service, BookingPayload, BookingResponse, PaymentResponse } from "../types/booking";


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
  phoneInput: string;
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
  setPhoneInput: React.Dispatch<React.SetStateAction<string>>;
  createBookingFn: () => Promise<void>;
  paymentStatus: BookingState["paymentStatus"];
  setPaymentStatus: (s: BookingState["paymentStatus"]) => void;
  bookingId: string;
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
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [couponCode, setCouponCode] = useState(""); 
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneInput, setPhoneInput] = useState(user?.phoneNumber || "");
  const [paymentStatus, setPaymentStatus] = useState<BookingState["paymentStatus"]>("idle");
  const [bookingId, setBookingId] = useState(""); 

  const parseAmPmTo24 = (timeStr: string): string => {
    const [time, period] = timeStr.toLowerCase().split(' ');
    const [hoursRaw, minutesRaw] = time.split(':').map(Number);
    let hours = hoursRaw;
    let minutes = minutesRaw;
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  const createBookingFn = useCallback(async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (selectedServices.length === 0) {
      toast.error('Please select slots');
      return;
    }
    if (!phoneInput.match(/^\d{10}$/)) {
      toast.error('Please enter valid 10-digit phone');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept terms');
      return;
    }

    try {
      setPaymentStatus('processing');
      toast.loading('Creating booking...', { id: 'booking' });

      // Sort selected services by startTime
      const sortedServices = [...selectedServices].sort((a, b) => a.startTime!.localeCompare(b.startTime!));

      // Check consecutive
      for (let i = 0; i < sortedServices.length - 1; i++) {
        const currentEnd24 = parseAmPmTo24(sortedServices[i].endTime!);
        const nextStart24 = parseAmPmTo24(sortedServices[i+1].startTime!);
        if (currentEnd24 !== nextStart24) {
          toast.error('Slots must be consecutive');
          setPaymentStatus('idle');
          return;
        }
      }

      const bookingDate = format(selectedDate, 'yyyy-MM-dd');
      const startTime = parseAmPmTo24(sortedServices[0].startTime!);
      const endTime = parseAmPmTo24(sortedServices[sortedServices.length - 1].endTime!);
      const number = sortedServices.length;

      const payload: BookingPayload = { bookingDate, startTime, endTime, number };

      const bookingRes = await createBooking(payload);
      const paymentRes = await createPaymentLink(bookingRes.bookingId);

      toast.dismiss('booking');
      toast.success(`Booking ${bookingRes.bookingId} created! Opening payment...`);
      setBookingId(bookingRes.bookingId.toString());
      setPaymentStatus('success');
      window.open(paymentRes.data.paymentLink, '_blank');
    } catch (error: unknown) {
      console.error('Booking failed:', error);

      toast.dismiss('booking');
      const err = error as any;
      toast.error(err?.response?.data?.message || 'Booking failed');


      setPaymentStatus('failed');
    }
  }, [selectedDate, selectedServices, phoneInput, termsAccepted]);



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
        phoneInput, setPhoneInput,
        createBookingFn,
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
