import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import AdminContent from './AdminContent';
import { TrendingUp, DollarSign, Calendar, Sliders, Ban, LayoutDashboard, Edit3 } from 'lucide-react';

export default function HostDashboard() {
  const { 
    currentUser, 
    bookings, 
    blockedDates, 
    toggleDateBlock, 
    cancelBooking 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeVillaTab, setActiveVillaTab] = useState('sunrise');
  
  // Date blocker states
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 6, 1)); // July 2026 for consistency
  const month = calendarDate.getMonth();
  const year = calendarDate.getFullYear();

  if (!currentUser || currentUser.role !== 'host') {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>접근 권한 없음</h2>
        <p>관리자 계정으로 로그인해 주세요.</p>
        <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '12px' }}>
          데모: host@sentilow.com / hostpassword
        </p>
      </div>
    );
  }

  // Analytics
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalEarnings = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalBookingsCount = confirmedBookings.length;
  
  // Custom calendar days generation
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = () => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Pad previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Pad next month
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handleDateClick = (day) => {
    const dateString = day.date.toISOString().split('T')[0];
    toggleDateBlock(activeVillaTab, dateString);
  };

  const isBlocked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const villaBlocks = blockedDates[activeVillaTab] || [];
    return villaBlocks.includes(dateString);
  };

  const isBooked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const villaBookings = bookings.filter(b => b.villaId === activeVillaTab && b.status === 'Confirmed');
    
    return villaBookings.some(b => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      return date >= start && date < end;
    });
  };

  const days = getDaysInMonth();

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 100px' }}>
      
      {/* Title */}
      <div className="flex align-center gap-2" style={{ marginBottom: '12px' }}>
        <span style={{ color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px' }}>관리자 패널</span>
      </div>
      <h2 style={{ fontSize: '36px', marginBottom: '24px' }}>Sentilow 관리</h2>

      {/* Tab Navigation */}
      <div className="flex gap-2" style={{ marginBottom: '32px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', fontSize: '14px', fontWeight: '600',
            borderBottom: activeTab === 'dashboard' ? '3px solid var(--secondary)' : '3px solid transparent',
            color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--gray-500)',
            background: 'none', cursor: 'pointer', marginBottom: '-1px'
          }}
        >
          <LayoutDashboard size={16} /> 예약 & 대시보드
        </button>
        <button
          onClick={() => setActiveTab('content')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', fontSize: '14px', fontWeight: '600',
            borderBottom: activeTab === 'content' ? '3px solid var(--secondary)' : '3px solid transparent',
            color: activeTab === 'content' ? 'var(--primary)' : 'var(--gray-500)',
            background: 'none', cursor: 'pointer', marginBottom: '-1px'
          }}
        >
          <Edit3 size={16} /> 숙소 콘텐츠 관리
        </button>
      </div>

      {activeTab === 'content' ? (
        <AdminContent />
      ) : (
      <>
      {/* Analytics Grid */}
      <div className="grid grid-cols-3 gap-3" style={{ marginBottom: '40px' }}>
        
        {/* Earnings Card */}
        <div className="card flex align-center justify-between" style={{ padding: '24px 30px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Gross Revenue</span>
            <strong style={{ fontSize: '32px', color: 'var(--primary)' }}>${totalEarnings}</strong>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>Simulated Stripe Transactions</span>
          </div>
          <div style={{ color: 'var(--primary)', backgroundColor: 'var(--gray-100)', padding: '16px', borderRadius: '50%' }}>
            <DollarSign size={28} />
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="card flex align-center justify-between" style={{ padding: '24px 30px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Occupancy Rate</span>
            <strong style={{ fontSize: '32px', color: 'var(--primary)' }}>58%</strong>
            {/* Visual Mini Progress Bar */}
            <div style={{ width: '150px', height: '6px', backgroundColor: 'var(--gray-200)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: '58%', height: '100%', backgroundColor: 'var(--secondary)' }}></div>
            </div>
          </div>
          <div style={{ color: 'var(--primary)', backgroundColor: 'var(--gray-100)', padding: '16px', borderRadius: '50%' }}>
            <TrendingUp size={28} />
          </div>
        </div>

        {/* Bookings Count Card */}
        <div className="card flex align-center justify-between" style={{ padding: '24px 30px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '13px', textTransform: 'uppercase', color: 'var(--gray-500)' }}>Active Bookings</span>
            <strong style={{ fontSize: '32px', color: 'var(--primary)' }}>{totalBookingsCount} Confirmed</strong>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>Guest bookings active</span>
          </div>
          <div style={{ color: 'var(--primary)', backgroundColor: 'var(--gray-100)', padding: '16px', borderRadius: '50%' }}>
            <Calendar size={28} />
          </div>
        </div>

      </div>

      {/* Main Grid: Date Blocker Tool & Reservations List */}
      <div className="grid grid-cols-3 gap-4" style={{ alignItems: 'start' }}>
        
        {/* Date Blocker Tool */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} style={{ color: 'var(--secondary)' }} />
            <span>Block Dates</span>
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '20px' }}>
            Select a villa and click on any available dates to block them for maintenance or personal use.
          </p>

          {/* Villa Selector Tabs */}
          <div className="flex gap-1" style={{ marginBottom: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveVillaTab('sunrise')}
              style={{
                flex: 1, 
                fontSize: '13px', 
                padding: '8px 12px', 
                backgroundColor: activeVillaTab === 'sunrise' ? 'var(--primary)' : 'transparent',
                color: activeVillaTab === 'sunrise' ? '#fff' : 'var(--primary)',
                borderColor: 'var(--primary)'
              }}
            >
              Sunrise Villa
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveVillaTab('sunset')}
              style={{
                flex: 1, 
                fontSize: '13px', 
                padding: '8px 12px', 
                backgroundColor: activeVillaTab === 'sunset' ? 'var(--primary)' : 'transparent',
                color: activeVillaTab === 'sunset' ? '#fff' : 'var(--primary)',
                borderColor: 'var(--primary)'
              }}
            >
              Sunset Villa
            </button>
          </div>

          {/* Calendar Display Month Nav */}
          <div className="flex align-center justify-between" style={{ marginBottom: '16px' }}>
            <button 
              onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
              className="btn btn-secondary" 
              style={{ padding: '4px 8px', borderRadius: '6px' }}
            >
              &larr;
            </button>
            <strong style={{ fontSize: '14.5px' }}>{monthNames[month]} {year}</strong>
            <button 
              onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
              className="btn btn-secondary" 
              style={{ padding: '4px 8px', borderRadius: '6px' }}
            >
              &rarr;
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'var(--gray-500)',
            fontSize: '11px',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            {weekdays.map(d => <div key={d}>{d}</div>)}
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            textAlign: 'center'
          }}>
            {days.map((day, idx) => {
              const booked = isBooked(day.date);
              const blocked = isBlocked(day.date);

              let bg = 'transparent';
              let color = 'var(--neutral-dark)';
              let border = '1px solid transparent';

              if (!day.isCurrentMonth) {
                color = 'var(--gray-300)';
              }

              if (booked) {
                bg = 'rgba(231, 111, 81, 0.15)';
                color = 'var(--accent)';
                border = '1px solid var(--accent)';
              } else if (blocked) {
                bg = 'var(--primary)';
                color = 'var(--neutral-white)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !booked && handleDateClick(day)}
                  disabled={booked}
                  style={{
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bg,
                    color: color,
                    border: border,
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '13px',
                    cursor: booked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className={`host-calendar-day ${booked ? 'booked' : 'avail'}`}
                  title={booked ? 'Booked by Guest' : blocked ? 'Blocked for Maintenance (Click to Unblock)' : 'Click to Block Date'}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
            fontSize: '11px',
            color: 'var(--gray-800)',
            justifyContent: 'center',
            borderTop: '1px solid var(--gray-200)',
            paddingTop: '12px'
          }}>
            <span className="flex align-center gap-1">
              <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--primary)', borderRadius: '2px' }} /> Blocked
            </span>
            <span className="flex align-center gap-1">
              <span style={{ width: '10px', height: '10px', backgroundColor: 'rgba(231, 111, 81, 0.15)', border: '1px solid var(--accent)', borderRadius: '2px' }} /> Guest Booked
            </span>
            <span className="flex align-center gap-1">
              <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--neutral-white)', border: '1px solid var(--gray-300)', borderRadius: '2px' }} /> Open
            </span>
          </div>
        </div>

        {/* Guest Reservations List */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>All Platform Bookings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '20px' }}>No bookings on the platform.</p>
            ) : (
              bookings.map((booking) => {
                const isConfirmed = booking.status === 'Confirmed';
                
                return (
                  <div key={booking.id} style={{
                    padding: '16px 20px',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: 'var(--neutral-white)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div className="flex align-center gap-2" style={{ marginBottom: '6px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10.5px',
                          fontWeight: 'bold',
                          backgroundColor: isConfirmed ? 'rgba(19, 46, 39, 0.1)' : 'rgba(231, 111, 81, 0.1)',
                          color: isConfirmed ? 'var(--primary)' : 'var(--accent)'
                        }}>
                          {booking.status}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Ref: {booking.id}</span>
                      </div>
                      
                      <strong style={{ fontSize: '16px', color: 'var(--primary)', display: 'block' }}>
                        {booking.villaName}
                      </strong>

                      <div style={{ fontSize: '13px', color: 'var(--gray-800)', marginTop: '4px' }}>
                        Guest Email: <strong>{booking.userEmail}</strong>
                      </div>
                      
                      <div style={{ fontSize: '12.5px', color: 'var(--gray-500)', marginTop: '2px' }}>
                        Dates: {booking.checkIn} to {booking.checkOut}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--gray-500)', display: 'block' }}>REVENUE</span>
                        <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>${booking.totalPrice}</strong>
                      </div>

                      {isConfirmed && (
                        <button 
                          className="btn btn-danger"
                          onClick={() => cancelBooking(booking.id)}
                          style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px' }}
                        >
                          <Ban size={12} /> Cancel Booking
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      </>
      )}

    </div>
  );
}
