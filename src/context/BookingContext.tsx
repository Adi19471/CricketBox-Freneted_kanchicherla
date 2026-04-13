import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Slot {
  id: string;
  time: string;
  price: number;
  period: "morning" | "afternoon" | "evening";
  available: boolean;
}

interface BookingState {
  selectedDate: Date | undefined;
  selectedSlots: Slot[];
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
  toggleSlot: (slot: Slot) => void;
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
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<BookingState["paymentStatus"]>("idle");
  const [bookingId, setBookingId] = useState("");

  const toggleSlot = (slot: Slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.find((s) => s.id === slot.id);
      if (exists) return prev.filter((s) => s.id !== slot.id);
      return [...prev, slot];
    });
  };

  const getBasePrice = () => selectedSlots.reduce((sum, s) => sum + s.price, 0);
  const getConvenienceFee = () => (selectedSlots.length > 0 ? 12 : 0);
  const getInsuranceFee = () => (includeInsurance && selectedSlots.length > 0 ? 10 : 0);
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
    setSelectedSlots([]);
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
        selectedSlots, toggleSlot,
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
