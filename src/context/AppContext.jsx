import React, { createContext, useState, useEffect } from 'react';
import { mergeVillaConfigs } from '../utils/villaHelpers';

export const AppContext = createContext();

// Mock Initial Reviews
const initialReviews = [
  {
    id: 1,
    villaId: 'sunrise',
    guestName: 'Sarah Jenkins',
    rating: 5,
    date: '2026-05-12',
    comment: 'So cozy and peaceful! The sunrise views over the garden pool were magical. The host family made us feel right at home.'
  },
  {
    id: 2,
    villaId: 'sunrise',
    guestName: 'Min-ho Kim',
    rating: 5,
    date: '2026-06-02',
    comment: 'Sentilow Sunrise is a wonderful cozy escape. Very comfortable beds, traditional teak wood design, and excellent hospitality.'
  },
  {
    id: 3,
    villaId: 'sunset',
    guestName: 'Emma Watson',
    rating: 5,
    date: '2026-04-20',
    comment: 'An incredibly comfortable stay with beautiful ocean views. Watching the sunset from the porch felt like home.'
  },
  {
    id: 4,
    villaId: 'sunset',
    guestName: 'David Miller',
    rating: 4.8,
    date: '2026-05-30',
    comment: 'Warm Balinese hospitality and extremely relaxing rooms. Very cozy open-air living space. Perfect for winding down.'
  }
];

// Default Villa Configurations (CMS-managed)
const defaultVillaConfigs = {
  sunrise: {
    name: 'Sentilow Sunrise',
    price: 299,
    tagline: 'Traditional Teak & Lush Garden',
    shortDescription: 'Wake up to beautiful natural light reflecting off green foliage. Features rich teak woodwork, high open ceilings, private garden swimming pool, and custom Balinese bath.',
    description: 'Nestled amid lush Balinese tropical gardens, Sentilow Sunrise features exquisite traditional teak wood architecture combined with luxury modern design. Awake to beautiful morning light, swim in your private pool, and relax in the open-concept living room that invites the gentle jungle breeze.',
    image: null,
    gallery: [],
    amenities: [
      'Private Jungle Pool', 'Traditional Teak Bath', 'Fully Equipped Kitchen',
      'Gourmet Coffee Machine', 'High-speed Wi-Fi', 'Smart TV with Netflix',
      'Air Conditioning', 'Daily Housekeeping', 'Airport Shuttle Service'
    ],
    capacity: 4,
    bedrooms: 2,
    baths: '2.5',
    poolType: 'Private Pool',
    location: 'Jalan Suluban, Uluwatu, Pecatu, Bali'
  },
  sunset: {
    name: 'Sentilow Sunset',
    price: 299,
    tagline: 'Contemporary Ocean Breeze',
    shortDescription: 'Indulge in spectacular sunset skies over the ocean. Featuring sleek minimalist tropical styling, open-concept living pavilion, cliffside infinity pool, and custom stargazing deck.',
    description: 'Perched high on the cliffs of Uluwatu, Sentilow Sunset is a contemporary tropical sanctuary offering spectacular views of the sunset over the Indian Ocean. Its sleek minimalist structure is highlighted by a private infinity-edge plunge pool, an open air dining deck, and premium designer furnishings.',
    image: null,
    gallery: [],
    amenities: [
      'Cliffside Infinity Pool', 'Ocean Sunset View Deck', 'Fully Equipped Kitchen',
      'Open-air Lounge Area', 'High-speed Wi-Fi', 'Smart TV with Netflix',
      'Air Conditioning', 'Daily Housekeeping', 'Stargazing Lounge Chairs'
    ],
    capacity: 4,
    bedrooms: 2,
    baths: '2.5',
    poolType: 'Infinity Pool',
    location: 'Jalan Suluban, Uluwatu, Pecatu, Bali'
  }
};

// Mock Initial Bookings
const initialBookings = [
  {
    id: 'BK-8492',
    villaId: 'sunrise',
    villaName: 'Sentilow Sunrise',
    checkIn: '2026-07-10',
    checkOut: '2026-07-15',
    guests: 2,
    totalPrice: 986, // (180 * 5) + 50 cleaning + 36 tax
    userEmail: 'guest@example.com',
    status: 'Confirmed',
    createdAt: '2026-06-10'
  },
  {
    id: 'BK-2938',
    villaId: 'sunset',
    villaName: 'Sentilow Sunset',
    checkIn: '2026-07-18',
    checkOut: '2026-07-22',
    guests: 3,
    totalPrice: 806, // (180 * 4) + 50 cleaning + 36 tax
    userEmail: 'guest@example.com',
    status: 'Confirmed',
    createdAt: '2026-06-12'
  }
];

export const AppProvider = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'details-sunrise', 'details-sunset', 'booking-sunrise', 'booking-sunset', 'guest-dashboard', 'host-dashboard', 'contact'
  const [selectedVillaId, setSelectedVillaId] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Bookings & Blocks State
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState({
    sunrise: ['2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13', '2026-07-14'],
    sunset: ['2026-07-18', '2026-07-19', '2026-07-20', '2026-07-21']
  });

  // Reviews State
  const [reviews, setReviews] = useState(initialReviews);

  // Editable Villa Configurations (CMS) & Contact Details
  const [villaConfigs, setVillaConfigs] = useState(defaultVillaConfigs);
  const [contactEmail, setContactEmail] = useState('contact@sentilowbali.com');

  // Temp Reservation for checkout
  const [currentReservation, setCurrentReservation] = useState(null);

  // Load Initial Data from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('sentilow_users');
    const storedBookings = localStorage.getItem('sentilow_bookings');
    const storedBlocks = localStorage.getItem('sentilow_blocked_dates');
    const storedReviews = localStorage.getItem('sentilow_reviews');
    const storedCurrentUser = localStorage.getItem('sentilow_current_user');
    const storedVillaConfigs = localStorage.getItem('sentilow_villa_configs');
    const storedContactEmail = localStorage.getItem('sentilow_contact_email');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    else {
      const defaultUsers = [
        { name: 'John Doe', email: 'guest@example.com', password: 'password123', role: 'guest' },
        { name: 'Sentilow Host', email: 'host@sentilow.com', password: 'hostpassword', role: 'host' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('sentilow_users', JSON.stringify(defaultUsers));
    }

    if (storedBookings) setBookings(JSON.parse(storedBookings));
    else {
      setBookings(initialBookings);
      localStorage.setItem('sentilow_bookings', JSON.stringify(initialBookings));
    }

    if (storedBlocks) setBlockedDates(JSON.parse(storedBlocks));
    else {
      localStorage.setItem('sentilow_blocked_dates', JSON.stringify(blockedDates));
    }

    if (storedReviews) setReviews(JSON.parse(storedReviews));
    else {
      localStorage.setItem('sentilow_reviews', JSON.stringify(initialReviews));
    }

    if (storedVillaConfigs) {
      setVillaConfigs(mergeVillaConfigs(JSON.parse(storedVillaConfigs), defaultVillaConfigs));
    } else {
      localStorage.setItem('sentilow_villa_configs', JSON.stringify(defaultVillaConfigs));
    }

    if (storedContactEmail) setContactEmail(storedContactEmail);
    else {
      localStorage.setItem('sentilow_contact_email', contactEmail);
    }

    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
  }, []);

  // Save changes to localStorage helpers
  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('sentilow_users', JSON.stringify(newUsers));
  };

  const saveBookings = (newBookings) => {
    setBookings(newBookings);
    localStorage.setItem('sentilow_bookings', JSON.stringify(newBookings));
  };

  const saveBlockedDates = (newBlocks) => {
    setBlockedDates(newBlocks);
    localStorage.setItem('sentilow_blocked_dates', JSON.stringify(newBlocks));
  };

  const saveReviews = (newReviews) => {
    setReviews(newReviews);
    localStorage.setItem('sentilow_reviews', JSON.stringify(newReviews));
  };

  // CMS Savers
  const saveVillaConfigs = (newConfigs) => {
    setVillaConfigs(newConfigs);
    localStorage.setItem('sentilow_villa_configs', JSON.stringify(newConfigs));
  };

  const saveContactEmail = (newEmail) => {
    setContactEmail(newEmail);
    localStorage.setItem('sentilow_contact_email', newEmail);
  };

  const updateVillaConfig = (villaId, updates) => {
    const newConfigs = {
      ...villaConfigs,
      [villaId]: { ...villaConfigs[villaId], ...updates }
    };
    saveVillaConfigs(newConfigs);
  };

  // Auth Operations
  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('sentilow_current_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = { name, email, password, role: 'guest' };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('sentilow_current_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sentilow_current_user');
    setCurrentView('home');
  };

  // Booking Checks
  const isDateRangeAvailable = (villaId, checkIn, checkOut, excludeBookingId = null) => {
    if (!checkIn || !checkOut) return false;
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) return false;

    // Get list of blocked dates (both manual and booking blocks)
    const dates = getDatesInRange(start, end);
    const villaBlocks = blockedDates[villaId] || [];

    // Check if any date in the range is manually blocked
    const hasBlockedDate = dates.some(d => villaBlocks.includes(d));
    if (hasBlockedDate) return false;

    // Check if any date conflicts with active bookings
    const activeBookings = bookings.filter(b => b.villaId === villaId && b.status === 'Confirmed' && b.id !== excludeBookingId);
    
    for (const booking of activeBookings) {
      const bStart = new Date(booking.checkIn);
      const bEnd = new Date(booking.checkOut);

      // Overlap condition: start < bEnd && end > bStart
      if (start < bEnd && end > bStart) {
        return false;
      }
    }

    return true;
  };

  // Helper: Get array of YYYY-MM-DD strings between range
  const getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date < endDate) {
      dates.push(date.toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  // Booking Actions
  const createBooking = (bookingData) => {
    const newBooking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      ...bookingData
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    });
    saveBookings(updatedBookings);
  };

  // Host Blocks
  const toggleDateBlock = (villaId, dateString) => {
    const villaBlocks = blockedDates[villaId] || [];
    let updatedBlocks;
    if (villaBlocks.includes(dateString)) {
      updatedBlocks = villaBlocks.filter(d => d !== dateString);
    } else {
      updatedBlocks = [...villaBlocks, dateString].sort();
    }
    const newBlocks = { ...blockedDates, [villaId]: updatedBlocks };
    saveBlockedDates(newBlocks);
  };

  // Review Actions
  const addReview = (villaId, guestName, rating, comment) => {
    const newReview = {
      id: Date.now(),
      villaId,
      guestName,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment
    };
    const updatedReviews = [newReview, ...reviews];
    saveReviews(updatedReviews);
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      selectedVillaId,
      setSelectedVillaId,
      currentUser,
      setCurrentUser,
      login,
      register,
      logout,
      bookings,
      blockedDates,
      toggleDateBlock,
      isDateRangeAvailable,
      createBooking,
      cancelBooking,
      reviews,
      addReview,
      currentReservation,
      setCurrentReservation,
      villaConfigs,
      saveVillaConfigs,
      updateVillaConfig,
      contactEmail,
      saveContactEmail
    }}>
      {children}
    </AppContext.Provider>
  );
};
