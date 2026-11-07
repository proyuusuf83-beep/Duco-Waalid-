import React, { useState, useEffect } from 'react';
import { Language, Package, Hotel, FlightOption, VisaCategory, Testimonial, CompanySettings, GeneralBooking } from './types';
import { translations } from './translations';
import { api } from './services/api';
import { INITIAL_PACKAGES, INITIAL_HOTELS, INITIAL_VISAS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BookingModal } from './components/BookingModal';
import { TrackBookingModal } from './components/TrackBookingModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { HomeView } from './views/HomeView';
import { PackagesView } from './views/PackagesView';
import { FlightsView } from './views/FlightsView';
import { HotelsView } from './views/HotelsView';
import { VisaView } from './views/VisaView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

export default function App() {
  // Default language is Somali ('so') as requested by Master Prompt §12
  const [currentLang, setCurrentLang] = useState<Language>('so');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Core Data Collections
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [visas, setVisas] = useState<VisaCategory[]>(INITIAL_VISAS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);

  // Search filter transfers
  const [flightInitialOrigin, setFlightInitialOrigin] = useState('Mogadishu (MGQ)');
  const [flightInitialDest, setFlightInitialDest] = useState('Jeddah (JED)');

  // Modals
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceType, setBookingServiceType] = useState<'Hajj' | 'Umrah' | 'Parent Umrah' | 'Flight' | 'Hotel' | 'Visa'>('Umrah');
  const [bookingServiceTitle, setBookingServiceTitle] = useState('');
  const [bookingDefaultPrice, setBookingDefaultPrice] = useState(0);
  const [bookingInitialDetails, setBookingInitialDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    // Check if admin session exists
    const token = sessionStorage.getItem('dw_admin_token');
    if (token) {
      setIsAdminLoggedIn(true);
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pkgs, htls, stngs, tsts, vcat] = await Promise.all([
        api.getPackages(),
        api.getHotels(),
        api.getSettings(),
        api.getTestimonials(),
        api.getVisaCategories()
      ]);
      setPackages(pkgs);
      setHotels(htls);
      setSettings(stngs);
      setTestimonials(tsts);
      setVisas(vcat);
    } catch (e) {
      console.warn('Initial data load fallback', e);
    }
  };

  const handleBookPackage = (pkg: Package) => {
    const isParent = pkg.category.startsWith('parent_');
    const sType = pkg.category === 'hajj' ? 'Hajj' : isParent ? 'Parent Umrah' : 'Umrah';
    const sTitle = currentLang === 'so' ? pkg.titleSo : pkg.titleEn;

    setBookingServiceType(sType);
    setBookingServiceTitle(sTitle);
    setBookingDefaultPrice(pkg.price);
    setBookingInitialDetails({
      packageId: pkg.id,
      category: pkg.category,
      departureDate: pkg.departureDate,
      durationDays: pkg.durationDays,
      hotel: `${pkg.makkahHotel} & ${pkg.madinahHotel}`,
      price: pkg.price
    });
    setIsBookingOpen(true);
  };

  const handleBookFlight = (flight: FlightOption, params: any) => {
    setBookingServiceType('Flight');
    setBookingServiceTitle(`${flight.airline} (${flight.flightNumber}: ${flight.origin} → ${flight.destination})`);
    setBookingDefaultPrice(flight.price);
    setBookingInitialDetails({
      flightId: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      tripType: params.tripType,
      cabinClass: params.cabinClass,
      passengersCount: params.passengersCount,
      totalPrice: params.totalPrice
    });
    setIsBookingOpen(true);
  };

  const handleReserveHotel = (hotel: Hotel, roomType?: any) => {
    setBookingServiceType('Hotel');
    const roomName = roomType ? (currentLang === 'so' ? roomType.nameSo : roomType.nameEn) : 'Standard Room';
    setBookingServiceTitle(`${hotel.name} (${roomName})`);
    setBookingDefaultPrice(roomType ? roomType.price : hotel.pricePerNight);
    setBookingInitialDetails({
      hotelId: hotel.id,
      hotelName: hotel.name,
      city: hotel.city,
      roomTypeId: roomType?.id,
      roomTypeName: roomName,
      pricePerNight: roomType ? roomType.price : hotel.pricePerNight
    });
    setIsBookingOpen(true);
  };

  const handleSearchFlightsFromHome = (origin: string, destination: string) => {
    setFlightInitialOrigin(origin);
    setFlightInitialDest(destination);
    setActiveTab('flights');
  };

  const handleAdminAccess = () => {
    if (isAdminLoggedIn) {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('dw_admin_token');
    localStorage.removeItem('dw_admin_token');
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#202820]">
      {/* Announcement Notification Banner if enabled */}
      {settings.showAnnouncement && (
        <div className="bg-[#168447] text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
          <span>{currentLang === 'so' ? settings.announcementSo : settings.announcementEn}</span>
        </div>
      )}

      {/* Top Bar Navigation (Hidden in Admin full view for clean workspace, or with back button) */}
      {activeTab !== 'admin' && (
        <Navbar
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTrack={() => setIsTrackOpen(true)}
          onOpenAdmin={handleAdminAccess}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            currentLang={currentLang}
            packages={packages}
            hotels={hotels}
            visas={visas}
            testimonials={testimonials}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookPackage={handleBookPackage}
            onReserveHotel={handleReserveHotel}
            onSearchFlights={handleSearchFlightsFromHome}
            onOpenTrack={() => setIsTrackOpen(true)}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesView
            currentLang={currentLang}
            packages={packages}
            onBookPackage={handleBookPackage}
          />
        )}

        {activeTab === 'flights' && (
          <FlightsView
            currentLang={currentLang}
            onBookFlight={handleBookFlight}
            initialOrigin={flightInitialOrigin}
            initialDestination={flightInitialDest}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelsView
            currentLang={currentLang}
            hotels={hotels}
            onReserveHotel={handleReserveHotel}
          />
        )}

        {activeTab === 'visa' && (
          <VisaView
            currentLang={currentLang}
            visas={visas}
            onOpenTrack={() => setIsTrackOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            currentLang={currentLang}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView
            currentLang={currentLang}
            settings={settings}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            currentLang={currentLang}
            onLogout={handleAdminLogout}
            packages={packages}
            hotels={hotels}
            settings={settings}
            onRefreshAll={loadData}
          />
        )}
      </div>

      {/* Footer on all public pages */}
      {activeTab !== 'admin' && (
        <Footer
          settings={settings}
          currentLang={currentLang}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenTrack={() => setIsTrackOpen(true)}
          onOpenAdmin={handleAdminAccess}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      {activeTab !== 'admin' && (
        <WhatsAppButton
          settings={settings}
          currentLang={currentLang}
        />
      )}

      {/* Global Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        serviceType={bookingServiceType}
        serviceTitle={bookingServiceTitle}
        defaultPrice={bookingDefaultPrice}
        initialDetails={bookingInitialDetails}
        currentLang={currentLang}
        onBookingCreated={() => {
          loadData();
        }}
      />

      <TrackBookingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        currentLang={currentLang}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
      />
    </div>
  );
}
