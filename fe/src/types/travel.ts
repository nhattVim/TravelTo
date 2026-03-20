export type UserRole = "USER" | "ADMIN";
export type TourStatus = "DRAFT" | "PUBLISHED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface TourDeparture {
  id: number;
  departureDate: string;
  returnDate: string;
  price: number;
  slotsTotal: number;
  slotsAvailable: number;
}

export interface TourAdditionalInfo {
  attractions: string | null;
  cuisine: string | null;
  suitableFor: string | null;
  idealTime: string | null;
  transport: string | null;
  promotion: string | null;
  notes: string | null;
}

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
  departureLocation: string;
  destinationLocation: string;
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
  imageUrls: string[];
  provinceCode: string;
  provinceName: string;
  departureLocation: string;
  destinationLocation: string;
  slotsAvailable: number;
  createdAt: string;
  departures: TourDeparture[];
  additionalInfo: TourAdditionalInfo;
}

export interface TourFilterOptions {
  departureLocations: string[];
  destinationLocations: string[];
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
  departureId: number | null;
  tourTitle: string;
  provinceName: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  customerEmail: string;
  customerName: string;
}

export interface AdminTourListItem {
  id: number;
  title: string;
  provinceCode: string;
  provinceName: string;
  price: number;
  status: TourStatus;
  days: number;
  nights: number;
  departureLocation: string;
  destinationLocation: string;
  slotsTotal: number;
  slotsAvailable: number;
  updatedAt: string;
}

export interface AdminTourDetail {
  id: number;
  title: string;
  summary: string;
  description: string;
  price: number;
  days: number;
  nights: number;
  imageUrl: string | null;
  imageUrls: string[];
  provinceCode: string;
  provinceName: string;
  departureLocation: string;
  destinationLocation: string;
  slotsTotal: number;
  slotsAvailable: number;
  status: TourStatus;
  createdAt: string;
  updatedAt: string;
  departures: TourDeparture[];
  additionalInfo: TourAdditionalInfo;
}

export interface AdminTourUpsertPayload {
  provinceCode: string;
  title: string;
  summary: string;
  description: string;
  price: number;
  days: number;
  nights: number;
  imageUrl: string;
  imageUrls: string[];
  departureLocation: string;
  destinationLocation: string;
  attractions: string;
  cuisine: string;
  suitableFor: string;
  idealTime: string;
  transport: string;
  promotion: string;
  notes: string;
  status: TourStatus;
}

export interface BackendAuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    avatarUrl: string;
    role: UserRole;
    passwordConfigured: boolean;
  };
}
