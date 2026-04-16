export interface Service {
  id: string;
  name: string;
  price: number;
  available: boolean;
  startTime?: string; // extracted
  endTime?: string;
}

export interface BookingPayload {
  bookingDate: string;
  startTime: string; // 'HH:mm:ss'
  endTime: string;
  number: number;
  amount: number;
}

export interface BookingData {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  amount: number;
  status: string;
  paymentStatus: string;
  user: {
    id: number;
    phoneNumber: string;
  };
}

export interface BookingResponse {
  statusCode: number;
  message: string;
  bookingId: number;
  data: BookingData;
}

export interface PaymentResponse {
  statusCode: number;
  data: {
    paymentLink: string;
  };
}


