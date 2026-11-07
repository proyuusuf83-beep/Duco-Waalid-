import React, { useState, useEffect } from 'react';
import { Language, Package, Hotel, GeneralBooking, VisaApplication, Customer, CompanySettings, Testimonial } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck,
  LayoutDashboard,
  Package as PkgIcon,
  Plane,
  Building2,
  FileCheck2,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  LogOut,
  Save,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  FileText,
  Download,
  Lock,
  KeyRound
} from 'lucide-react';

interface AdminViewProps {
  currentLang: Language;
  onLogout: () => void;
  packages: Package[];
  hotels: Hotel[];
  settings: CompanySettings;
  onRefreshAll: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentLang,
  onLogout,
  packages: initialPackages,
  hotels: initialHotels,
  settings: initialSettings,
  onRefreshAll
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'flights' | 'hotels' | 'visa' | 'customers' | 'settings'>('overview');
  
  // Data states
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);
  const [bookings, setBookings] = useState<GeneralBooking[]>([]);
  const [visaApps, setVisaApps] = useState<VisaApplication[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Editing package modal
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [isNewPkg, setIsNewPkg] = useState(false);

  // Status update modal for booking
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState<GeneralBooking | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Confirmed');
  const [newPnr, setNewPnr] = useState<string>('');
  const [newTicketNo, setNewTicketNo] = useState<string>('');

  // Visa application notes/status modal
  const [selectedVisaApp, setSelectedVisaApp] = useState<VisaApplication | null>(null);
  const [visaStatus, setVisaStatus] = useState<string>('Approved');
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Security & Password Change
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [passChangeMsg, setPassChangeMsg] = useState('');
  const [passChangeErr, setPassChangeErr] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassChangeMsg('');
    setPassChangeErr('');

    try {
      const res = await api.adminChangePassword(currentAdminPass, newAdminEmail, newAdminPass);
      if (res.success) {
        setPassChangeMsg(res.message);
        setCurrentAdminPass('');
        setNewAdminPass('');
        setNewAdminEmail('');
      } else {
        setPassChangeErr(res.message || 'Khalad ayaa dhacay, fadlan mar kale hubi');
      }
    } catch (err: any) {
      setPassChangeErr('Xiriirka server-ka ayaa xumaaday');
    } finally {
      setPassLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [ov, bks, vapps, custs, pkgs, htls] = await Promise.all([
        api.getAdminOverview(),
        api.getBookings(),
        api.getVisaApplications(),
        api.getCustomers(),
        api.getPackages(),
        api.getHotels()
      ]);
      setOverviewMetrics(ov);
      setBookings(bks);
      setVisaApps(vapps);
      setCustomers(custs);
      setPackages(pkgs);
      setHotels(htls);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async () => {
    if (!selectedBookingForUpdate) return;
    try {
      await api.updateBookingStatus(selectedBookingForUpdate.id, {
        status: newStatus,
        pnrNumber: newPnr,
        ticketNumber: newTicketNo
      });
      setSelectedBookingForUpdate(null);
      setSuccessMsg('Booking status successfully updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateVisaStatus = async () => {
    if (!selectedVisaApp) return;
    try {
      await api.updateVisaApplication(selectedVisaApp.id, {
        status: visaStatus as any,
        adminNotes
      });
      setSelectedVisaApp(null);
      setSuccessMsg('Visa application status & notes updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    if (isNewPkg) {
      await api.createPackage(editingPkg);
    } else {
      await api.updatePackage(editingPkg.id, editingPkg);
    }
    setEditingPkg(null);
    setIsNewPkg(false);
    setSuccessMsg('Package successfully saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadAllAdminData();
    onRefreshAll();
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      await api.deletePackage(id);
      setSuccessMsg('Package deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAllAdminData();
      onRefreshAll();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(settings);
    setSuccessMsg('Company settings updated.');
    setTimeout(() => setSuccessMsg(''), 3000);
    onRefreshAll();
  };

  const flightBookings = bookings.filter((b) => b.serviceType === 'Flight');

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#0B5130] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white p-1">
            <img
              src="/assets/aistudio/Logo_Duco_waalid_d76bc4ba.PNG"
              alt="Duco Waalid"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Duco Waalid Admin Portal</h2>
            <span className="text-[11px] text-emerald-200">Management Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={loadAllAdminData}
            className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Reload data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ka Bax (Logout)</span>
          </button>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <div className="bg-white border-b border-neutral-200 px-6 overflow-x-auto">
        <div className="flex items-center gap-1 max-w-7xl mx-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'packages'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <PkgIcon className="w-4 h-4" />
            <span>Packages ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'flights'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flight Requests ({flightBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hotels')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'hotels'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hotels ({hotels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visa')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'visa'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Visa Dossiers ({visaApps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#168447] text-[#168447]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>CMS & Settings</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-xs text-neutral-500 font-medium">Total Bookings</span>
                <span className="text-2xl font-extrabold text-[#0B5130] block mt-1 font-mono-numbers">
                  {overviewMetrics?.totalBookings || bookings.length}
                </span>
                <span className="text-[11px] text-neutral-400">Across all services</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-xs text-amber-700 font-medium">Pending Review</span>
                <span className="text-2xl font-extrabold text-amber-600 block mt-1 font-mono-numbers">
                  {overviewMetrics?.pendingBookings ?? bookings.filter((b) => b.status === 'Pending').length}
                </span>
                <span className="text-[11px] text-neutral-400">Awaiting verification</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-xs text-emerald-700 font-medium">Confirmed / Active</span>
                <span className="text-2xl font-extrabold text-[#168447] block mt-1 font-mono-numbers">
                  {overviewMetrics?.confirmedBookings ?? bookings.filter((b) => b.status === 'Confirmed').length}
                </span>
                <span className="text-[11px] text-neutral-400">Verified & secured</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-xs text-neutral-500 font-medium">Pipeline Value</span>
                <span className="text-2xl font-extrabold text-[#0B5130] block mt-1 font-mono-numbers">
                  ${overviewMetrics?.estimatedRevenue ?? 12500} USD
                </span>
                <span className="text-[11px] text-neutral-400">Gross reservation volume</span>
              </div>
            </div>

            {/* Centralized Bookings Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0B5130]">Centralized Reservations Ledger</h3>
                  <p className="text-xs text-neutral-500">Every customer reservation, payment status, and verification workflow</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Reference</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Service</th>
                      <th className="py-3 px-4 font-semibold">Travel Date</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/70">
                        <td className="py-3 px-4 font-extrabold text-[#0B5130] font-mono-numbers">
                          {b.referenceNo}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold block text-neutral-800">{b.customerName}</span>
                          <span className="text-[11px] text-neutral-400">{b.phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-neutral-700">{b.serviceTitle}</span>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 font-mono-numbers">{b.travelDate}</td>
                        <td className="py-3 px-4 font-semibold text-[#168447] font-mono-numbers">
                          ${b.totalAmount} USD
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            b.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedBookingForUpdate(b);
                              setNewStatus(b.status);
                              setNewPnr(b.details?.pnrNumber || '');
                              setNewTicketNo(b.details?.ticketNumber || '');
                            }}
                            className="px-3 py-1 bg-[#168447] text-white rounded-md text-[11px] font-semibold hover:bg-[#0B5130] transition-colors cursor-pointer"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PACKAGES MANAGEMENT TAB */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B5130]">Hajj & Umrah Packages Catalog</h3>
                <p className="text-xs text-neutral-500">Manage packages, prices, availability, and elder assistance tiers</p>
              </div>
              <button
                onClick={() => {
                  setEditingPkg({
                    id: '',
                    slug: 'new-package-' + Date.now(),
                    titleSo: 'Xidhmo Cusub oo Xaj ama Cumro',
                    titleEn: 'New Hajj or Umrah Package',
                    category: 'umrah',
                    price: 1800,
                    currency: 'USD',
                    durationDays: 14,
                    departureDate: '2026-05-10',
                    returnDate: '2026-05-24',
                    makkahHotel: 'Swissôtel Makkah',
                    madinahHotel: 'The Oberoi Madinah',
                    makkahDistance: '50m',
                    madinahDistance: '50m',
                    transportation: 'VIP Air-conditioned Coach',
                    availableSeats: 20,
                    totalSeats: 30,
                    image: '/assets/images/makkah_kaaba_pilgrims_1794064534790.jpg',
                    featured: false,
                    includedSo: ['Fiisaha Sacuudiga', 'Tikidhada diyaaradda', 'Hoteel 5-xiddigood ah'],
                    includedEn: ['Saudi Visa', 'International Flights', '5-Star Hotel'],
                    excludedSo: ['Qarashka gaarka ah'],
                    excludedEn: ['Personal shopping'],
                    descriptionSo: 'Xidhmo cusub oo tayo sare leh.',
                    descriptionEn: 'Premium new package.'
                  });
                  setIsNewPkg(true);
                }}
                className="px-4 py-2 bg-[#168447] hover:bg-[#0B5130] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#168447] uppercase">
                        {pkg.category}
                      </span>
                      <span className="text-sm font-extrabold text-[#0B5130] font-mono-numbers">
                        ${pkg.price} USD
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-800 mb-1">{pkg.titleEn}</h4>
                    <p className="text-xs text-neutral-500 mb-3">{pkg.titleSo}</p>

                    <div className="text-xs text-neutral-600 space-y-1 mb-4">
                      <p><span className="font-semibold">Duration:</span> {pkg.durationDays} Days</p>
                      <p><span className="font-semibold">Available Seats:</span> {pkg.availableSeats} / {pkg.totalSeats}</p>
                      <p><span className="font-semibold">Makkah Hotel:</span> {pkg.makkahHotel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        setEditingPkg(pkg);
                        setIsNewPkg(false);
                      }}
                      className="flex-1 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. FLIGHT REQUESTS TAB */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0B5130]">International Flight Requests</h3>
              <p className="text-xs text-neutral-500">
                Process traveler requests, issue airline PNR codes and E-Ticket confirmation numbers
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Passenger Details</th>
                    <th className="py-3 px-4 font-semibold">Route & Airline</th>
                    <th className="py-3 px-4 font-semibold">PNR / Ticket</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {flightBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4 font-extrabold text-[#0B5130] font-mono-numbers">
                        {b.referenceNo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block text-neutral-800">{b.customerName}</span>
                        <span className="text-[11px] text-neutral-400">{b.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-neutral-800 block">{b.serviceTitle}</span>
                        <span className="text-[11px] text-neutral-500">Travel Date: {b.travelDate}</span>
                      </td>
                      <td className="py-3 px-4">
                        {b.details?.pnrNumber ? (
                          <span className="font-mono text-emerald-800 font-bold block">{b.details.pnrNumber}</span>
                        ) : (
                          <span className="text-neutral-400 italic">No PNR assigned</span>
                        )}
                        {b.details?.ticketNumber && (
                          <span className="font-mono text-[11px] text-neutral-500 block">{b.details.ticketNumber}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          b.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookingForUpdate(b);
                            setNewStatus(b.status);
                            setNewPnr(b.details?.pnrNumber || '');
                            setNewTicketNo(b.details?.ticketNumber || '');
                          }}
                          className="px-3 py-1 bg-[#168447] text-white rounded-md text-[11px] font-semibold hover:bg-[#0B5130] transition-colors cursor-pointer"
                        >
                          Issue / Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0B5130]">Hotels Management</h3>
              <p className="text-xs text-neutral-500">Configure accommodations in Makkah, Madinah, and transit gateways</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((h) => (
                <div key={h.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#168447] uppercase">{h.city}</span>
                    <h4 className="text-sm font-bold text-neutral-800 mt-1">{h.name}</h4>
                    <p className="text-xs text-neutral-500 mt-1">{h.distanceToHaram}</p>
                    <p className="text-xs font-bold text-[#0B5130] mt-2 font-mono-numbers">${h.pricePerNight} USD / night</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 mt-4 flex items-center justify-between text-xs text-neutral-500">
                    <span>{h.stars} Stars</span>
                    <span className="text-emerald-700 font-semibold">{h.roomTypes.length} Room Categories</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. VISA APPLICATIONS TAB */}
        {activeTab === 'visa' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0B5130]">Visa Dossier Applications</h3>
              <p className="text-xs text-neutral-500">Review biometric submissions, upload status, and consular processing</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Applicant</th>
                    <th className="py-3 px-4 font-semibold">Country & Visa</th>
                    <th className="py-3 px-4 font-semibold">Passport</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {visaApps.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4 font-extrabold text-[#0B5130] font-mono-numbers">
                        {v.referenceNo}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block text-neutral-800">{v.applicantName}</span>
                        <span className="text-[11px] text-neutral-400">{v.phone}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-700">
                        {v.destinationCountry} - {v.visaTitle}
                      </td>
                      <td className="py-3 px-4 font-mono-numbers">{v.passportNumber}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          v.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          v.status === 'Embassy Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          v.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          v.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedVisaApp(v);
                            setVisaStatus(v.status);
                            setAdminNotes(v.adminNotes || '');
                          }}
                          className="px-3 py-1 bg-[#168447] text-white rounded-md text-[11px] font-semibold hover:bg-[#0B5130] transition-colors cursor-pointer"
                        >
                          Examine
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0B5130]">Customer Directory</h3>
              <p className="text-xs text-neutral-500">Profiles, travel history, and loyalty tracking</p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Customer Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Phone / WhatsApp</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Total Bookings</th>
                    <th className="py-3 px-4 font-semibold">Last Travel Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4 font-bold text-neutral-800">{c.name}</td>
                      <td className="py-3 px-4 text-neutral-600">{c.email}</td>
                      <td className="py-3 px-4 text-neutral-600">{c.phone}</td>
                      <td className="py-3 px-4 text-neutral-600">{c.country}</td>
                      <td className="py-3 px-4 font-extrabold text-[#168447] font-mono-numbers">{c.totalBookings}</td>
                      <td className="py-3 px-4 font-mono-numbers text-neutral-500">{c.lastBookingDate?.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. CMS & WEBSITE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0B5130]">Website CMS & Company Contact Info</h3>
                <p className="text-xs text-neutral-500">Live editable company phone numbers, email addresses, and headquarters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Direct WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Mogadishu Phone</label>
                  <input
                    type="text"
                    value={settings.phoneMogadishu}
                    onChange={(e) => setSettings({ ...settings, phoneMogadishu: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Hargeisa Phone</label>
                  <input
                    type="text"
                    value={settings.phoneHargeisa}
                    onChange={(e) => setSettings({ ...settings, phoneHargeisa: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Mogadishu Headquarters Address</label>
                  <input
                    type="text"
                    value={settings.addressMogadishu}
                    onChange={(e) => setSettings({ ...settings, addressMogadishu: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settings.emailSupport}
                    onChange={(e) => setSettings({ ...settings, emailSupport: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Announcement Notice (Somali)</label>
                <input
                  type="text"
                  value={settings.announcementSo}
                  onChange={(e) => setSettings({ ...settings, announcementSo: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Company Configuration</span>
                </button>
              </div>
            </form>

            {/* Admin Security & Password Change */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B5130]">Nidaamka Amniga & Furaha Maamulka (Admin Security)</h3>
                  <p className="text-xs text-neutral-500">Bedel Furaha sirta ah (Password) iyo Email-ka si qof kale uusan u geli karin galkaaga maamulka</p>
                </div>
              </div>

              {passChangeMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-[#0B5130] text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#168447]" />
                  <span>{passChangeMsg}</span>
                </div>
              )}

              {passChangeErr && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{passChangeErr}</span>
                </div>
              )}

              <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Furaha Hadda Jira (Current Password)
                    </label>
                    <input
                      type="password"
                      value={currentAdminPass}
                      onChange={(e) => setCurrentAdminPass(e.target.value)}
                      placeholder="Geli furahaaga hadda"
                      className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email-ka Cusub (ikhtiyaari)
                    </label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@ducowaalid.com"
                      className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Furaha Cusub (New Password)
                    </label>
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Ugu yaraan 6 xaraf"
                      className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passLoading}
                    className="px-6 py-3 bg-[#0B5130] hover:bg-[#168447] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-colors disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{passLoading ? 'Waa la badalayaa...' : 'Cusboonaysii Furaha Sirta ah'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Booking Update Modal */}
      {selectedBookingForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-neutral-200 animate-in fade-in">
            <h3 className="text-base font-bold text-[#0B5130] mb-2">
              Update Reservation #{selectedBookingForUpdate.referenceNo}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Customer: {selectedBookingForUpdate.customerName} ({selectedBookingForUpdate.serviceTitle})
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Airline PNR Code (if Flight)</label>
                <input
                  type="text"
                  value={newPnr}
                  onChange={(e) => setNewPnr(e.target.value.toUpperCase())}
                  placeholder="e.g. 6D8XZQ"
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none uppercase font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">E-Ticket / Hotel Voucher Number</label>
                <input
                  type="text"
                  value={newTicketNo}
                  onChange={(e) => setNewTicketNo(e.target.value)}
                  placeholder="e.g. ET-072-9182746102"
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none font-mono-numbers"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedBookingForUpdate(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBookingStatus}
                className="px-5 py-2.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visa Application Examination Modal */}
      {selectedVisaApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-neutral-200 animate-in fade-in">
            <h3 className="text-base font-bold text-[#0B5130] mb-1">
              Examine Visa Application #{selectedVisaApp.referenceNo}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Applicant: {selectedVisaApp.applicantName} ({selectedVisaApp.destinationCountry})
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1">
                <p><span className="font-semibold">Passport:</span> {selectedVisaApp.passportNumber} (Exp: {selectedVisaApp.passportExpiry})</p>
                <p><span className="font-semibold">Phone:</span> {selectedVisaApp.phone}</p>
                <p><span className="font-semibold">Documents Attached:</span> {selectedVisaApp.uploadedDocuments?.length || 0} files</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Visa Processing Status</label>
                <select
                  value={visaStatus}
                  onChange={(e) => setVisaStatus(e.target.value)}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Embassy Processing">Embassy Processing</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Administrative Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Biometrics scheduled at VFS / Ministry gateway confirmation received."
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedVisaApp(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleUpdateVisaStatus}
                className="px-5 py-2.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Update Visa Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Edit/Add Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-neutral-200 my-8">
            <h3 className="text-base font-bold text-[#0B5130] mb-4">
              {isNewPkg ? 'Add New Hajj/Umrah Package' : 'Edit Package'}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={editingPkg.titleEn}
                  onChange={(e) => setEditingPkg({ ...editingPkg, titleEn: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Title (Somali)</label>
                <input
                  type="text"
                  value={editingPkg.titleSo}
                  onChange={(e) => setEditingPkg({ ...editingPkg, titleSo: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={editingPkg.category}
                    onChange={(e) => setEditingPkg({ ...editingPkg, category: e.target.value as any })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  >
                    <option value="hajj">Hajj</option>
                    <option value="umrah">Umrah</option>
                    <option value="family">Family Umrah</option>
                    <option value="parent_deceased">Umrah Badal (Deceased Parents)</option>
                    <option value="parent_unable">Assisted Umrah (Mobility)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none font-mono-numbers"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Available Seats</label>
                  <input
                    type="number"
                    value={editingPkg.availableSeats}
                    onChange={(e) => setEditingPkg({ ...editingPkg, availableSeats: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={editingPkg.totalSeats}
                    onChange={(e) => setEditingPkg({ ...editingPkg, totalSeats: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none font-mono-numbers"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
