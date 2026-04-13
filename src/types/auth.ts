export interface RegisterPayload {
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  token: string;
  role: string;
  expirationTime: string;
  bookingConfirmationCode: string;
  user: {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
  };
  userList: Array<{
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
  }>;
  data: Record<string, any>;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
}

