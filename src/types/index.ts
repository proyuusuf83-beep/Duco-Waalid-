export type Language = 'so' | 'en';

export type BookingStatus = 'Pending' | 'Under Review' | 'Confirmed' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Unpaid' | 'Deposit Paid' | 'Fully Paid' | 'Refunded';

export interface Package {
  id: string;
  slug: string;
  titleSo: string;
  titleEn: string;
  category: 'hajj' | 'umrah' | 'family' | 'parent_deceased' | 'parent_unable';
  price: number;
  currency: string;
  durationDays: number;
  departureDate: string;
  returnDate: string;
  makkahHotel: string;
  madinahHotel: string;
  makkahDistance: string;
  madinahDistance: string;
  transportation: string;
  availableSeats: number;
  totalSeats: number;
  image: string;
  featured: boolean;
  includedSo: string[];
  includedEn: string[];
  excludedSo: string[];
  excludedEn: string[];
  descriptionSo: string;
  descriptionEn: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCity?: string;
  price: number;
  baggage: string;
  cabinClass: 'economy' | 'business' | 'first';
  airplane: string;
}

export interface FlightBookingRequest {
  id: string;
  referenceNo: string;
  passengerName: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  tripType: 'round-trip' | 'one-way';
  departureDate: string;
  returnDate?: string;
  passengersCount: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: string;
  selectedFlightId?: string;
  selectedAirline?: string;
  estimatedPrice: number;
  passportNumber?: string;
  passportExpiry?: string;
  specialRequests?: string;
  pnrNumber?: string;
  ticketNumber?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah' | 'Dubai' | 'Istanbul' | 'Nairobi' | 'Mogadishu';
  stars: number;
  distanceToHaram: string;
  pricePerNight: number;
  currency: string;
  image: string;
  address: string;
  descriptionSo: string;
  descriptionEn: string;
  amenities: string[];
  roomTypes: {
    id: string;
    nameSo: string;
    nameEn: string;
    price: number;
    capacity: number;
  }[];
}

export interface HotelReservation {
  id: string;
  referenceNo: string;
  hotelId: string;
  hotelName: string;
  city: string;
  roomTypeId: string;
  roomTypeName: string;
  guestName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: number;
  roomsCount: number;
  totalPrice: number;
  specialRequests?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface VisaCategory {
  id: string;
  country: string;
  countryCode: string;
  category: 'umrah' | 'tourist' | 'business' | 'medical' | 'student';
  titleSo: string;
  titleEn: string;
  processingDays: string;
  validity: string;
  price: number;
  requirementsSo: string[];
  requirementsEn: string[];
  documentsSo: string[];
  documentsEn: string[];
  descriptionSo: string;
  descriptionEn: string;
}

export interface VisaApplication {
  id: string;
  referenceNo: string;
  visaCategoryId: string;
  visaTitle: string;
  destinationCountry: string;
  applicantName: string;
  gender: 'male' | 'female';
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  birthDate: string;
  phone: string;
  email: string;
  travelDate: string;
  uploadedDocuments: {
    fileName: string;
    docType: string;
    fileSize: string;
  }[];
  adminNotes?: string;
  status: 'Pending' | 'Under Review' | 'Embassy Processing' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface GeneralBooking {
  id: string;
  referenceNo: string;
  serviceType: 'Hajj' | 'Umrah' | 'Parent Umrah' | 'Flight' | 'Hotel' | 'Visa';
  serviceTitle: string;
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  details: Record<string, any>;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalBookings: number;
  lastBookingDate: string;
}

export interface Testimonial {
  id: string;
  name: string;
  locationSo: string;
  locationEn: string;
  packageTypeSo: string;
  packageTypeEn: string;
  commentSo: string;
  commentEn: string;
  rating: number;
  date: string;
  avatar?: string;
}

export interface CompanySettings {
  companyName: string;
  taglineSo: string;
  taglineEn: string;
  phoneMogadishu: string;
  phoneHargeisa: string;
  whatsappNumber: string;
  emailSupport: string;
  emailBookings: string;
  addressMogadishu: string;
  addressHargeisa: string;
  addressNairobi: string;
  workingHoursSo: string;
  workingHoursEn: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYouTube: string;
  socialTikTok: string;
  announcementSo: string;
  announcementEn: string;
  showAnnouncement: boolean;
}
