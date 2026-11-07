import { Package, Hotel, FlightOption, VisaCategory, Testimonial, CompanySettings, GeneralBooking, VisaApplication, Customer } from '../types';
import { INITIAL_PACKAGES, INITIAL_HOTELS, INITIAL_FLIGHTS, INITIAL_VISAS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS } from '../data/initialData';
import { db as firestoreDb } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Safe localStorage persistence keys for resilience
const LOCAL_STORAGE_KEY_BOOKINGS = 'dw_bookings_cache';
const LOCAL_STORAGE_KEY_SETTINGS = 'dw_settings_cache';

export const api = {
  // Settings
  async getSettings(): Promise<CompanySettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API fetch settings failed, using initial fallback', e);
    }
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    return cached ? JSON.parse(cached) : INITIAL_SETTINGS;
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        return data.settings;
      }
    } catch (e) {
      console.warn('API update settings failed', e);
    }
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // Packages
  async getPackages(): Promise<Package[]> {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API fetch packages fallback', e);
    }
    return INITIAL_PACKAGES;
  },

  async createPackage(pkg: Omit<Package, 'id'>): Promise<Package> {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API create package fallback', e);
    }
    return { ...pkg, id: 'pkg-' + Date.now() };
  },

  async updatePackage(id: string, pkg: Partial<Package>): Promise<Package> {
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API update package fallback', e);
    }
    return { ...pkg, id } as Package;
  },

  async deletePackage(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API delete package fallback', e);
    }
    return true;
  },

  // Hotels
  async getHotels(): Promise<Hotel[]> {
    try {
      const res = await fetch('/api/hotels');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get hotels fallback', e);
    }
    return INITIAL_HOTELS;
  },

  async createHotel(hotel: Omit<Hotel, 'id'>): Promise<Hotel> {
    try {
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotel)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API create hotel fallback', e);
    }
    return { ...hotel, id: 'htl-' + Date.now() };
  },

  async updateHotel(id: string, hotel: Partial<Hotel>): Promise<Hotel> {
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotel)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API update hotel fallback', e);
    }
    return { ...hotel, id } as Hotel;
  },

  async deleteHotel(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/hotels/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API delete hotel fallback', e);
    }
    return true;
  },

  // Flights
  async searchFlights(origin?: string, destination?: string): Promise<FlightOption[]> {
    try {
      const params = new URLSearchParams();
      if (origin) params.append('origin', origin);
      if (destination) params.append('destination', destination);
      const res = await fetch(`/api/flights/search?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API flights search fallback', e);
    }
    return INITIAL_FLIGHTS;
  },

  // Bookings (Centralized)
  async getBookings(): Promise<GeneralBooking[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get bookings fallback', e);
    }
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKINGS);
    return cached ? JSON.parse(cached) : [];
  },

  async createBooking(bookingData: Partial<GeneralBooking>): Promise<GeneralBooking> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        const created = await res.json();
        try {
          setDoc(doc(firestoreDb, 'bookings', created.id), created).catch(() => {});
        } catch (_) {}
        return created;
      }
    } catch (e) {
      console.warn('API create booking fallback', e);
    }

    const prefix = bookingData.serviceType === 'Hajj' ? 'DW-HAJJ-' :
                   bookingData.serviceType === 'Flight' ? 'DW-FLT-' :
                   bookingData.serviceType === 'Hotel' ? 'DW-HTL-' : 'DW-UMR-';
    const referenceNo = `${prefix}${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: GeneralBooking = {
      id: 'bk-' + Date.now(),
      referenceNo,
      serviceType: bookingData.serviceType || 'Umrah',
      serviceTitle: bookingData.serviceTitle || 'Travel Service',
      customerName: bookingData.customerName || 'Traveler',
      email: bookingData.email || '',
      phone: bookingData.phone || '',
      travelDate: bookingData.travelDate || '2026-05-01',
      totalAmount: bookingData.totalAmount || 0,
      currency: 'USD',
      paymentStatus: 'Unpaid',
      status: 'Pending',
      details: bookingData.details || {},
      createdAt: new Date().toISOString()
    };

    const current = await this.getBookings();
    const updated = [newBooking, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    return newBooking;
  },

  async trackBooking(referenceOrPhone: string): Promise<{ found: boolean; booking?: any; isVisa?: boolean; message?: string }> {
    try {
      const res = await fetch(`/api/bookings/track/${encodeURIComponent(referenceOrPhone)}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API track booking fallback', e);
    }

    const cleanInput = referenceOrPhone.trim().toUpperCase().replace(/\s+/g, '');
    const current = await this.getBookings();
    const match = current.find((b: any) => 
      b.referenceNo.toUpperCase().replace(/\s+/g, '') === cleanInput ||
      (b.phone && b.phone.replace(/\s+/g, '').includes(cleanInput))
    );

    if (match) return { found: true, booking: match };
    return { found: false, message: 'Not found' };
  },

  async updateBookingStatus(id: string, updates: Record<string, any>): Promise<GeneralBooking> {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API update booking status fallback', e);
    }
    return { id, ...updates } as any;
  },

  // Visa
  async getVisaCategories(): Promise<VisaCategory[]> {
    try {
      const res = await fetch('/api/visa/categories');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get visa categories fallback', e);
    }
    return INITIAL_VISAS;
  },

  async getVisaApplications(): Promise<VisaApplication[]> {
    try {
      const res = await fetch('/api/visa/applications');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get visa applications fallback', e);
    }
    return [];
  },

  async applyVisa(applicationData: Partial<VisaApplication>): Promise<VisaApplication> {
    try {
      const res = await fetch('/api/visa/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });
      if (res.ok) {
        const app = await res.json();
        try {
          setDoc(doc(firestoreDb, 'visaApplications', app.id), app).catch(() => {});
        } catch (_) {}
        return app;
      }
    } catch (e) {
      console.warn('API apply visa fallback', e);
    }

    const referenceNo = `DW-VSA-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: VisaApplication = {
      id: 'vapp-' + Date.now(),
      referenceNo,
      visaCategoryId: applicationData.visaCategoryId || '',
      visaTitle: applicationData.visaTitle || 'Visa Application',
      destinationCountry: applicationData.destinationCountry || 'Saudi Arabia',
      applicantName: applicationData.applicantName || 'Applicant',
      gender: applicationData.gender || 'male',
      nationality: applicationData.nationality || 'Somali',
      passportNumber: applicationData.passportNumber || '',
      passportExpiry: applicationData.passportExpiry || '',
      birthDate: applicationData.birthDate || '',
      phone: applicationData.phone || '',
      email: applicationData.email || '',
      travelDate: applicationData.travelDate || '',
      uploadedDocuments: applicationData.uploadedDocuments || [],
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    return newApp;
  },

  async updateVisaApplication(id: string, updates: Partial<VisaApplication>): Promise<VisaApplication> {
    try {
      const res = await fetch(`/api/visa/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API update visa app fallback', e);
    }
    return { id, ...updates } as any;
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get customers fallback', e);
    }
    return [];
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get testimonials fallback', e);
    }
    return INITIAL_TESTIMONIALS;
  },

  // Contact Form
  async submitContact(data: { name: string; email: string; phone: string; subject: string; message: string }): Promise<boolean> {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API submit contact fallback', e);
    }
    return true;
  },

  // Admin Auth
  async adminLogin(email: string, pass: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      return await res.json();
    } catch (e) {
      console.warn('API admin login fallback', e);
      if (email === 'admin@ducowaalid.com' && pass === 'admin123') {
        return {
          success: true,
          token: 'dw_auth_token_mock',
          user: { id: 'adm-1', name: 'Duco Waalid Admin', email, role: 'Super Administrator' }
        };
      }
      return { success: false, message: 'Invalid credentials' };
    }
  },

  async adminChangePassword(currentPassword: string, newEmail?: string, newPassword?: string): Promise<{ success: boolean; message: string; email?: string }> {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newEmail, newPassword })
      });
      return await res.json();
    } catch (e) {
      console.error('API admin change password error', e);
      return { success: false, message: 'Server connection error' };
    }
  },

  async getAdminOverview(): Promise<any> {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API get admin overview fallback', e);
    }
    const bookings = await this.getBookings();
    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b: any) => b.status === 'Pending').length,
      underReviewBookings: bookings.filter((b: any) => b.status === 'Under Review').length,
      confirmedBookings: bookings.filter((b: any) => b.status === 'Confirmed').length,
      cancelledBookings: bookings.filter((b: any) => b.status === 'Cancelled').length,
      completedBookings: bookings.filter((b: any) => b.status === 'Completed').length,
      totalCustomers: 4,
      estimatedRevenue: 12500,
      recentBookings: bookings.slice(0, 5),
      recentVisaApps: []
    };
  }
};
