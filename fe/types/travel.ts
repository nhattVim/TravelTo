export type UserRole = "USER" | "ADMIN";

export interface ProvinceOverview {
  id: number;
  code: string;
  name: string;
  coverImageUrl: string;
  tourCount: number;
}

export interface TourItem {
  id: number;
  title: string;
  summary: string;
  price: number;
  days: number;
  nights: number;
  imageUrl: string;
  provinceCode: string;
  provinceName: string;
  slotsAvailable: number;
}

export interface TourDetail {
  id: number;
  title: string;
  summary: string;
  description: string;
  price: number;
  days: number;
  nights: number;
  imageUrl: string;
  provinceCode: string;
  provinceName: string;
  slotsAvailable: number;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface Booking {
  id: number;
  tourId: number;
  tourTitle: string;
  provinceName: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  customerEmail: string;
  customerName: string;
}

export interface BackendAuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    avatarUrl: string;
    role: UserRole;
  };
}
