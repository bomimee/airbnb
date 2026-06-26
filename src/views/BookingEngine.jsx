import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Info, Star } from 'lucide-react';

export default function BookingEngine({ onOpenAuth }) {
  const { 
    selectedVillaId, 
    setCurrentView, 
    bookings, 
    blockedDates, 
    isDateRangeAvailable, 
    setCurrentReservation,
    currentUser,
    villaConfigs
  } = useContext(AppContext);

  const config = villaConfigs[selectedVillaId] || villaConfigs.sunrise;
  const villaName = config.name;
  const basePrice = config.price;

  // Booking Parameters
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState('');

  // Calendar UI states
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Start at July 2026 for demo consistency
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Selected Date Objects
  const [selectedInDate, setSelectedInDate] = useState(null);
  const [selectedOutDate, setSelectedOutDate] = useState(null);

  // Month names
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Re-sync inputs when selected dates change
  useEffect(() => {
    if (selectedInDate) {
      setCheckIn(selectedInDate.toISOString().split('T')[0]);
    } else {
      setCheckIn('');
    }

    if (selectedOutDate) {
      setCheckOut(selectedOutDate.toISOString().split('T')[0]);
    } else {
      setCheckOut('');
    }
  }, [selectedInDate, selectedOutDate]);

  // Price calculations
  const calculateNights = () => {
    if (!selectedInDate || !selectedOutDate) return 0;
    const timeDiff = selectedOutDate.getTime() - selectedInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = calculateNights();
  const accommodationTotal = nights * basePrice;
  const cleaningFee = nights > 0 ? 50 : 0;
  const serviceTax = Math.round(accommodationTotal * 0.12);
  const grandTotal = accommodationTotal + cleaningFee + serviceTax;

  // Navigation Months
  const handlePrevMonth = () => {
    const today = new Date();
    // Don't go to past months relative to today (we are simulating June/July 2026)
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Helper: Get array of dates in current calendar display
  const getDaysInMonth = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    
    // Pad previous month days
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthTotalDays - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true
      });
    }

    // Pad next month days to make complete weeks (rows of 7)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  // Helper: Check if date is booked or manually blocked
  const isDateBlocked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Check manual host blocks
    const villaBlocks = blockedDates[selectedVillaId] || [];
    if (villaBlocks.includes(dateString)) return true;

    // Check active bookings
    const activeBookings = bookings.filter(b => b.villaId === selectedVillaId && b.status === 'Confirmed');
    for (const booking of activeBookings) {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      // Confirmed bookings cover start to end (excluding end date, as check-out day is free for next check-in)
      if (date >= start && date < end) {
        return true;
      }
    }

    // Prevent past dates
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date < today) return true;

    return false;
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(day.date);
    clickedDate.setHours(0,0,0,0);

    // If date is blocked, do nothing
    if (isDateBlocked(clickedDate)) return;

    if (!selectedInDate || (selectedInDate && selectedOutDate)) {
      // Step 1: Set check-in date
      setSelectedInDate(clickedDate);
      setSelectedOutDate(null);
      setError('');
    } else {
      // Step 2: Set check-out date
      if (clickedDate <= selectedInDate) {
        // If clicked date is before or same as check-in, reset check-in to this date
        setSelectedInDate(clickedDate);
      } else {
        // Validate if there are any blocked dates in between
        const isRangeAvail = isDateRangeAvailable(
          selectedVillaId, 
          selectedInDate.toISOString().split('T')[0], 
          clickedDate.toISOString().split('T')[0]
        );

        if (isRangeAvail) {
          setSelectedOutDate(clickedDate);
          setError('');
        } else {
          setError('Selected range contains dates that are blocked or booked.');
          setSelectedInDate(clickedDate);
        }
      }
    }
  };

  // Helpers for calendar styling
  const isDateSelectedIn = (date) => {
    if (!selectedInDate) return false;
    return date.getTime() === selectedInDate.getTime();
  };

  const isDateSelectedOut = (date) => {
    if (!selectedOutDate) return false;
    return date.getTime() === selectedOutDate.getTime();
  };

  const isDateInRange = (date) => {
    if (!selectedInDate || !selectedOutDate) return false;
    return date > selectedInDate && date < selectedOutDate;
  };

  const handleProceedToPayment = () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates on the calendar.');
      return;
    }

    if (!currentUser) {
      setError('Please sign in or create an account to proceed.');
      onOpenAuth();
      return;
    }

    // Save reservation summary in context
    const reservation = {
      villaId: selectedVillaId,
      villaName,
      checkIn,
      checkOut,
      guests,
      nights,
      accommodationTotal,
      cleaningFee,
      serviceTax,
      grandTotal,
      userEmail: currentUser.email
    };

    setCurrentReservation(reservation);
    setCurrentView(`checkout-${selectedVillaId}`);
  };

  const days = getDaysInMonth();
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 100px' }}>
      
      {/* Back Nav */}
      <button 
        onClick={() => setCurrentView(`details-${selectedVillaId}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--primary)',
          fontWeight: '600',
          marginBottom: '30px',
          fontSize: '15px'
        }}
      >
        <ChevronLeft size={20} /> Back to Villa Details
      </button>

      <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Book {villaName}</h2>
      <p style={{ color: 'var(--gray-500)', fontSize: '15px', marginBottom: '40px' }}>
        Select your travel dates on the calendar and complete your details to secure your luxurious Bali escape.
      </p>

      {error && (
        <div style={{
          backgroundColor: 'rgba(231, 111, 81, 0.1)',
          borderLeft: '4px solid var(--accent)',
          color: 'var(--accent)',
          padding: '16px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '15px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          <Info size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4" style={{ alignItems: 'start' }}>
        
        {/* Left Side: Calendar & Guests Selection */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Custom Calendar Card */}
          <div className="card" style={{ padding: '32px' }}>
            <div className="flex align-center justify-between" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={20} style={{ color: 'var(--secondary)' }} />
                <span>Select Dates</span>
              </h3>
              
              <div className="flex align-center gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="btn btn-secondary" 
                  style={{ padding: '6px 10px', borderRadius: '8px' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <strong style={{ minWidth: '130px', textAlign: 'center', fontSize: '16px' }}>
                  {monthNames[currentMonth]} {currentYear}
                </strong>
                <button 
                  onClick={handleNextMonth}
                  className="btn btn-secondary" 
                  style={{ padding: '6px 10px', borderRadius: '8px' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Weekdays header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'var(--gray-500)',
              fontSize: '13px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>

            {/* Days grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '6px',
              textAlign: 'center'
            }}>
              {days.map((day, idx) => {
                const dateKey = day.date.getTime();
                const isBlocked = isDateBlocked(day.date);
                const isSelectedIn = isDateSelectedIn(day.date);
                const isSelectedOut = isDateSelectedOut(day.date);
                const isInRange = isDateInRange(day.date);

                let bg = 'transparent';
                let color = 'var(--neutral-dark)';
                let border = '1px solid transparent';
                let borderRadius = 'var(--border-radius-sm)';

                if (!day.isCurrentMonth) {
                  color = 'var(--gray-300)';
                }

                if (isBlocked) {
                  bg = 'rgba(233, 230, 223, 0.4)';
                  color = 'var(--gray-300)';
                  border = '1px dashed var(--gray-200)';
                  borderRadius = 'var(--border-radius-sm)';
                }

                if (isSelectedIn) {
                  bg = 'var(--primary)';
                  color = 'var(--neutral-white)';
                  borderRadius = 'var(--border-radius-sm) 0 0 var(--border-radius-sm)';
                } else if (isSelectedOut) {
                  bg = 'var(--primary)';
                  color = 'var(--neutral-white)';
                  borderRadius = '0 var(--border-radius-sm) var(--border-radius-sm) 0';
                } else if (isInRange) {
                  bg = 'rgba(212, 163, 115, 0.15)';
                  color = 'var(--primary)';
                  borderRadius = '0';
                }

                return (
                  <button
                    key={idx}
                    disabled={isBlocked && !isSelectedIn && !isSelectedOut}
                    onClick={() => handleDateClick(day)}
                    style={{
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: bg,
                      color: color,
                      border: border,
                      borderRadius: borderRadius,
                      fontWeight: (isSelectedIn || isSelectedOut || isInRange) ? 'bold' : 'normal',
                      fontSize: '14.5px',
                      cursor: isBlocked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    className={`calendar-day-btn ${isBlocked ? '' : 'avail'}`}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '24px',
              fontSize: '12px',
              color: 'var(--gray-800)',
              justifyContent: 'center',
              borderTop: '1px solid var(--gray-200)',
              paddingTop: '16px'
            }}>
              <span className="flex align-center gap-1">
                <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--neutral-white)', border: '1px solid var(--gray-300)', borderRadius: '3px' }} /> Available
              </span>
              <span className="flex align-center gap-1">
                <span style={{ width: '12px', height: '12px', backgroundColor: 'rgba(233, 230, 223, 0.5)', border: '1px dashed var(--gray-200)', borderRadius: '3px' }} /> Unavailable/Booked
              </span>
              <span className="flex align-center gap-1">
                <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--primary)', borderRadius: '3px' }} /> Selected
              </span>
            </div>
          </div>

          {/* Guest Count Card */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Users size={20} style={{ color: 'var(--secondary)' }} />
              <span>Number of Guests</span>
            </h3>
            
            <div className="flex align-center justify-between">
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>Guests</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--gray-500)' }}>Maximum 4 guests capacity for twin villas.</span>
              </div>

              <div className="flex align-center gap-2">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="btn btn-secondary"
                  style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', fontSize: '18px' }}
                >
                  -
                </button>
                <strong style={{ fontSize: '18px', width: '30px', textAlign: 'center' }}>{guests}</strong>
                <button 
                  onClick={() => setGuests(Math.min(4, guests + 1))}
                  className="btn btn-secondary"
                  style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', fontSize: '18px' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Reservation Price Breakdown Card */}
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>Reservation Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px', color: 'var(--gray-800)' }}>
            
            <div className="flex justify-between">
              <span>Villa</span>
              <strong style={{ color: 'var(--primary)' }}>{villaName}</strong>
            </div>

            <div className="flex justify-between">
              <span>Check-In</span>
              <strong style={{ color: 'var(--primary)' }}>{checkIn || '--'}</strong>
            </div>

            <div className="flex justify-between">
              <span>Check-Out</span>
              <strong style={{ color: 'var(--primary)' }}>{checkOut || '--'}</strong>
            </div>

            <div className="flex justify-between">
              <span>Guests</span>
              <strong style={{ color: 'var(--primary)' }}>{guests} Guests</strong>
            </div>

            {nights > 0 && (
              <>
                <div style={{ borderTop: '1px solid var(--gray-200)', margin: '10px 0' }} />
                
                <div className="flex justify-between">
                  <span>${basePrice} x {nights} nights</span>
                  <span>${accommodationTotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & service fee (12%)</span>
                  <span>${serviceTax}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--gray-200)', margin: '10px 0' }} />

                <div className="flex justify-between" style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                  <span>Total (USD)</span>
                  <span>${grandTotal}</span>
                </div>
              </>
            )}

          </div>

          <button 
            onClick={handleProceedToPayment}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', padding: '14px 0' }}
          >
            {currentUser ? 'Proceed to Payment' : 'Sign In to Book'}
          </button>
        </div>

      </div>

      <style>{`
        .calendar-day-btn.avail:hover {
          background-color: var(--secondary-light) !important;
          color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}
