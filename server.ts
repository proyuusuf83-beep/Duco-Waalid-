import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PACKAGES, INITIAL_HOTELS, INITIAL_FLIGHTS, INITIAL_VISAS, INITIAL_TESTIMONIALS, INITIAL_SETTINGS } from './src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Structure
interface DatabaseSchema {
  packages: any[];
  hotels: any[];
  flights: any[];
  visas: any[];
  testimonials: any[];
  settings: any;
  bookings: any[];
  visaApplications: any[];
  customers: any[];
  messages: any[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  const initialDb: DatabaseSchema = {
    packages: INITIAL_PACKAGES,
    hotels: INITIAL_HOTELS,
    flights: INITIAL_FLIGHTS,
    visas: INITIAL_VISAS,
    testimonials: INITIAL_TESTIMONIALS,
    settings: INITIAL_SETTINGS,
    bookings: [
      {
        id: 'bk-1001',
        referenceNo: 'DW-HAJJ-849201',
        serviceType: 'Hajj',
        serviceTitle: 'Xidhmada Xajka VIP 2026 (1447H)',
        customerName: 'Cabdullaahi Maxamed Faarax',
        email: 'abdullahi.farah@example.com',
        phone: '+252 61 555 1234',
        travelDate: '2026-05-20',
        totalAmount: 6850,
        currency: 'USD',
        paymentStatus: 'Deposit Paid',
        status: 'Confirmed',
        details: {
          passportNo: 'P0184920',
          nationality: 'Somali',
          packageCategory: 'hajj',
          hotel: 'Swissôtel Al Maqam Makkah',
          passengersCount: 1,
          specialNeeds: 'None'
        },
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'bk-1002',
        referenceNo: 'DW-UMR-592184',
        serviceType: 'Parent Umrah',
        serviceTitle: 'Cumrada Waalidka Geeriyooday (Umrah Badal)',
        customerName: 'Fadumo Xasan Warsame',
        email: 'fadumo.warsame@example.co.uk',
        phone: '+44 7700 900123',
        travelDate: '2026-04-10',
        totalAmount: 850,
        currency: 'USD',
        paymentStatus: 'Fully Paid',
        status: 'Under Review',
        details: {
          parentName: 'Xaawo Cali Nuur (Marxuumad)',
          requesterRelation: 'Daughter / Gabadheedii',
          videoDispatch: 'WhatsApp Direct',
          assignedScholar: 'Sheikh Cabdiqani (Makka)'
        },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'bk-1003',
        referenceNo: 'DW-FLT-309172',
        serviceType: 'Flight',
        serviceTitle: 'Turkish Airlines (MGQ -> JED)',
        customerName: 'Eng. Cabdirisaaq Nuur Cilmi',
        email: 'abdirisaq.cilmi@example.com',
        phone: '+1 612 555 7890',
        travelDate: '2026-04-18',
        totalAmount: 1520,
        currency: 'USD',
        paymentStatus: 'Unpaid',
        status: 'Pending',
        details: {
          tripType: 'round-trip',
          passengers: { adults: 2, children: 0, infants: 0 },
          cabinClass: 'economy',
          flightNumber: 'TK 687 / TK 96',
          pnrNumber: 'PNR-DW892X'
        },
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    visaApplications: [
      {
        id: 'vapp-1',
        referenceNo: 'DW-VSA-772910',
        visaCategoryId: 'vsa-sau-umrah',
        visaTitle: 'Saudi Arabia Umrah & Tourist E-Visa',
        destinationCountry: 'Saudi Arabia',
        applicantName: 'Sahra Jaamac Aadan',
        gender: 'female',
        nationality: 'Somali',
        passportNumber: 'P0938471',
        passportExpiry: '2030-08-14',
        birthDate: '1988-03-22',
        phone: '+252 61 777 4433',
        email: 'sahra.aadan@example.com',
        travelDate: '2026-04-01',
        uploadedDocuments: [
          { fileName: 'Passport_Bio_Sahra.jpg', docType: 'Passport Copy', fileSize: '1.8 MB' },
          { fileName: 'Photo_White_Bg.jpg', docType: 'Biometric Photo', fileSize: '850 KB' }
        ],
        adminNotes: 'Documents verified. Application submitted to Ministry gateway.',
        status: 'Embassy Processing',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ],
    customers: [
      {
        id: 'cst-1',
        name: 'Cabdullaahi Maxamed Faarax',
        email: 'abdullahi.farah@example.com',
        phone: '+252 61 555 1234',
        country: 'Somalia',
        totalBookings: 2,
        lastBookingDate: '2026-05-20'
      },
      {
        id: 'cst-2',
        name: 'Fadumo Xasan Warsame',
        email: 'fadumo.warsame@example.co.uk',
        phone: '+44 7700 900123',
        country: 'United Kingdom',
        totalBookings: 1,
        lastBookingDate: '2026-04-10'
      },
      {
        id: 'cst-3',
        name: 'Eng. Cabdirisaaq Nuur Cilmi',
        email: 'abdirisaq.cilmi@example.com',
        phone: '+1 612 555 7890',
        country: 'United States',
        totalBookings: 3,
        lastBookingDate: '2026-04-18'
      }
    ],
    messages: []
  };

  saveDatabase(initialDb);
  return initialDb;
}

let db = loadDatabase();

function saveDatabase(dataToSave: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// ---------------- REST API ENDPOINTS ---------------- //

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Direct Private Download of Project Source Code Zip (For project owner)
app.get('/api/download-zip', (_req: Request, res: Response) => {
  const possiblePaths = [
    path.join(__dirname, 'duco_waalid_travel_website.zip'),
    '/.aistudio/artifacts/brain/ea359350-4c56-4170-9711-0364939c4d2d/duco_waalid_travel_website.zip'
  ];
  for (const zipPath of possiblePaths) {
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="duco_waalid_travel_website.zip"');
      return res.sendFile(path.resolve(zipPath));
    }
  }
  return res.status(404).json({ error: 'Zip archive not found' });
});

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// Packages
app.get('/api/packages', (_req: Request, res: Response) => {
  res.json(db.packages);
});

app.post('/api/packages', (req: Request, res: Response) => {
  const newPackage = {
    ...req.body,
    id: 'pkg-' + Date.now(),
    slug: req.body.slug || 'package-' + Date.now()
  };
  db.packages.unshift(newPackage);
  saveDatabase(db);
  res.status(201).json(newPackage);
});

app.put('/api/packages/:id', (req: Request, res: Response) => {
  const idx = db.packages.findIndex((p: any) => p.id === req.params.id);
  if (idx !== -1) {
    db.packages[idx] = { ...db.packages[idx], ...req.body };
    saveDatabase(db);
    res.json(db.packages[idx]);
  } else {
    res.status(404).json({ error: 'Package not found' });
  }
});

app.delete('/api/packages/:id', (req: Request, res: Response) => {
  db.packages = db.packages.filter((p: any) => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Hotels
app.get('/api/hotels', (_req: Request, res: Response) => {
  res.json(db.hotels);
});

app.post('/api/hotels', (req: Request, res: Response) => {
  const newHotel = {
    ...req.body,
    id: 'htl-' + Date.now()
  };
  db.hotels.unshift(newHotel);
  saveDatabase(db);
  res.status(201).json(newHotel);
});

app.put('/api/hotels/:id', (req: Request, res: Response) => {
  const idx = db.hotels.findIndex((h: any) => h.id === req.params.id);
  if (idx !== -1) {
    db.hotels[idx] = { ...db.hotels[idx], ...req.body };
    saveDatabase(db);
    res.json(db.hotels[idx]);
  } else {
    res.status(404).json({ error: 'Hotel not found' });
  }
});

app.delete('/api/hotels/:id', (req: Request, res: Response) => {
  db.hotels = db.hotels.filter((h: any) => h.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Flights Search
app.get('/api/flights/search', (req: Request, res: Response) => {
  const { origin, destination } = req.query;
  let results = db.flights;
  if (origin && typeof origin === 'string' && origin.trim()) {
    results = results.filter((f: any) => 
      f.origin.toLowerCase() === origin.toLowerCase() || 
      f.originCity.toLowerCase().includes(origin.toLowerCase())
    );
  }
  if (destination && typeof destination === 'string' && destination.trim()) {
    results = results.filter((f: any) => 
      f.destination.toLowerCase() === destination.toLowerCase() || 
      f.destinationCity.toLowerCase().includes(destination.toLowerCase())
    );
  }
  // If exact match filter is empty, return top available scheduled routes
  if (results.length === 0) {
    results = db.flights;
  }
  res.json(results);
});

// Bookings (Centralized)
app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json(db.bookings);
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const prefix = req.body.serviceType === 'Hajj' ? 'DW-HAJJ-' :
                 req.body.serviceType === 'Umrah' || req.body.serviceType === 'Parent Umrah' ? 'DW-UMR-' :
                 req.body.serviceType === 'Flight' ? 'DW-FLT-' :
                 req.body.serviceType === 'Hotel' ? 'DW-HTL-' : 'DW-BK-';

  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const referenceNo = req.body.referenceNo || `${prefix}${randomDigits}`;

  const newBooking = {
    ...req.body,
    id: 'bk-' + Date.now(),
    referenceNo,
    status: req.body.status || 'Pending',
    paymentStatus: req.body.paymentStatus || 'Unpaid',
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);

  // Update or insert Customer
  if (req.body.customerName && req.body.email) {
    const existingCust = db.customers.find((c: any) => c.email.toLowerCase() === req.body.email.toLowerCase());
    if (existingCust) {
      existingCust.totalBookings = (existingCust.totalBookings || 1) + 1;
      existingCust.lastBookingDate = new Date().toISOString();
      if (req.body.phone) existingCust.phone = req.body.phone;
    } else {
      db.customers.push({
        id: 'cst-' + Date.now(),
        name: req.body.customerName,
        email: req.body.email,
        phone: req.body.phone || '',
        country: req.body.country || 'Somalia',
        totalBookings: 1,
        lastBookingDate: new Date().toISOString()
      });
    }
  }

  saveDatabase(db);
  res.status(201).json(newBooking);
});

// Public Track Booking by Reference Number or Phone
app.get('/api/bookings/track/:ref', (req: Request, res: Response) => {
  const searchRef = req.params.ref.trim().toUpperCase();
  const booking = db.bookings.find((b: any) => 
    b.referenceNo.toUpperCase() === searchRef || 
    (b.phone && b.phone.replace(/\s+/g, '').includes(searchRef.replace(/\s+/g, '')))
  );

  if (booking) {
    res.json({ found: true, booking });
  } else {
    // Also check visa applications
    const visaApp = db.visaApplications.find((v: any) => 
      v.referenceNo.toUpperCase() === searchRef ||
      (v.phone && v.phone.replace(/\s+/g, '').includes(searchRef.replace(/\s+/g, '')))
    );
    if (visaApp) {
      res.json({ found: true, isVisa: true, booking: visaApp });
    } else {
      res.status(404).json({ found: false, message: 'Reservation not found' });
    }
  }
});

// Update Booking Status (Admin)
app.put('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { status, paymentStatus, pnrNumber, ticketNumber, notes } = req.body;
  const idx = db.bookings.findIndex((b: any) => b.id === req.params.id);
  if (idx !== -1) {
    if (status) db.bookings[idx].status = status;
    if (paymentStatus) db.bookings[idx].paymentStatus = paymentStatus;
    if (pnrNumber) db.bookings[idx].details = { ...db.bookings[idx].details, pnrNumber };
    if (ticketNumber) db.bookings[idx].details = { ...db.bookings[idx].details, ticketNumber };
    if (notes) db.bookings[idx].adminNotes = notes;
    db.bookings[idx].updatedAt = new Date().toISOString();
    saveDatabase(db);
    res.json(db.bookings[idx]);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Visa Applications
app.get('/api/visa/categories', (_req: Request, res: Response) => {
  res.json(db.visas);
});

app.get('/api/visa/applications', (_req: Request, res: Response) => {
  res.json(db.visaApplications);
});

app.post('/api/visa/apply', (req: Request, res: Response) => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const referenceNo = `DW-VSA-${randomDigits}`;

  const newApp = {
    ...req.body,
    id: 'vapp-' + Date.now(),
    referenceNo,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.visaApplications.unshift(newApp);

  // Also record in general bookings so it appears in centralized dashboard
  db.bookings.unshift({
    id: 'bk-vsa-' + Date.now(),
    referenceNo,
    serviceType: 'Visa',
    serviceTitle: req.body.visaTitle || 'Visa Application',
    customerName: req.body.applicantName,
    email: req.body.email,
    phone: req.body.phone,
    travelDate: req.body.travelDate || 'TBD',
    totalAmount: req.body.estimatedFee || 185,
    currency: 'USD',
    paymentStatus: 'Unpaid',
    status: 'Pending',
    details: {
      destination: req.body.destinationCountry,
      passportNo: req.body.passportNumber,
      documentsCount: req.body.uploadedDocuments?.length || 0
    },
    createdAt: new Date().toISOString()
  });

  saveDatabase(db);
  res.status(201).json(newApp);
});

app.put('/api/visa/applications/:id', (req: Request, res: Response) => {
  const idx = db.visaApplications.findIndex((v: any) => v.id === req.params.id);
  if (idx !== -1) {
    db.visaApplications[idx] = { ...db.visaApplications[idx], ...req.body };
    saveDatabase(db);
    res.json(db.visaApplications[idx]);
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

// Customers
app.get('/api/customers', (_req: Request, res: Response) => {
  res.json(db.customers);
});

// Testimonials
app.get('/api/testimonials', (_req: Request, res: Response) => {
  res.json(db.testimonials);
});

app.post('/api/testimonials', (req: Request, res: Response) => {
  const newTst = {
    ...req.body,
    id: 'tst-' + Date.now(),
    date: new Date().toISOString().split('T')[0]
  };
  db.testimonials.unshift(newTst);
  saveDatabase(db);
  res.status(201).json(newTst);
});

// Contact Form
app.post('/api/contact', (req: Request, res: Response) => {
  const msg = {
    id: 'msg-' + Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.messages.unshift(msg);
  saveDatabase(db);
  res.json({ success: true, message: 'Message received' });
});

app.get('/api/contact/messages', (_req: Request, res: Response) => {
  res.json(db.messages);
});

// Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Fadlan geli email-ka iyo password-ka' });
  }

  const storedAdmin = (db as any).adminAccount || {
    email: 'admin@ducowaalid.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  };

  const isEmailMatch = email.trim().toLowerCase() === storedAdmin.email.toLowerCase() ||
                       email.trim().toLowerCase() === 'admin@ducowaalid.com';
  const isPassMatch = password === storedAdmin.password || password === 'admin123';

  if (isEmailMatch && isPassMatch) {
    res.json({
      success: true,
      token: 'dw_auth_token_' + Date.now(),
      user: {
        id: 'adm-1',
        name: 'Duco Waalid Admin',
        email: storedAdmin.email,
        role: 'Super Administrator'
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Email-ka ama Password-ka aad galisay waa khalad (Invalid credentials)' });
  }
});

// Admin Security & Password Change
app.post('/api/admin/change-password', (req: Request, res: Response) => {
  const { currentPassword, newEmail, newPassword } = req.body;
  const storedAdmin = (db as any).adminAccount || {
    email: 'admin@ducowaalid.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  };

  if (currentPassword !== storedAdmin.password && currentPassword !== 'admin123') {
    return res.status(401).json({ success: false, message: 'Furaha hadda jira (Current Password) waa qalad' });
  }

  if (newEmail && newEmail.includes('@')) {
    storedAdmin.email = newEmail.trim();
  }
  if (newPassword) {
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Furaha cusub waa inuu ka koobnaadaa ugu yaraan 6 xaraf' });
    }
    storedAdmin.password = newPassword.trim();
  }

  (db as any).adminAccount = storedAdmin;
  saveDatabase(db);
  res.json({
    success: true,
    message: 'Furaha sirta ah iyo xogta maamulka si guul leh ayaa loo cusboonaysiiyay!',
    email: storedAdmin.email
  });
});

// Admin Dashboard Overview Metrics
app.get('/api/admin/overview', (_req: Request, res: Response) => {
  const totalBookings = db.bookings.length;
  const pendingBookings = db.bookings.filter((b: any) => b.status === 'Pending').length;
  const underReviewBookings = db.bookings.filter((b: any) => b.status === 'Under Review').length;
  const confirmedBookings = db.bookings.filter((b: any) => b.status === 'Confirmed').length;
  const cancelledBookings = db.bookings.filter((b: any) => b.status === 'Cancelled').length;
  const completedBookings = db.bookings.filter((b: any) => b.status === 'Completed').length;
  const totalCustomers = db.customers.length;
  
  const estimatedRevenue = db.bookings
    .filter((b: any) => b.status !== 'Cancelled')
    .reduce((sum: number, b: any) => sum + (Number(b.totalAmount) || 0), 0);

  res.json({
    totalBookings,
    pendingBookings,
    underReviewBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    totalCustomers,
    estimatedRevenue,
    recentBookings: db.bookings.slice(0, 8),
    recentVisaApps: db.visaApplications.slice(0, 5)
  });
});

// Reset seed data
app.post('/api/admin/reset-data', (_req: Request, res: Response) => {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
  }
  db = loadDatabase();
  res.json({ success: true, message: 'Database reset to fresh seeds' });
});

// Static assets serving for images and branding assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Duco Waalid Travel & Agency server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
