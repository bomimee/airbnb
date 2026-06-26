import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar, User, Mail, CreditCard, ChevronRight, Ban, CheckCircle, Info } from 'lucide-react';

export default function GuestDashboard() {
  const { currentUser, bookings, cancelBooking } = useContext(AppContext);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please sign in to view your guest dashboard.</p>
      </div>
    );
  }

  // Filter bookings for this guest
  const guestBookings = bookings.filter(b => b.userEmail === currentUser.email);

  const handleCancelClick = (bookingId) => {
    setCancellingId(bookingId);
  };

  const confirmCancel = () => {
    cancelBooking(cancellingId);
    setCancellingId(null);
    setSuccessMsg('Your reservation has been successfully cancelled.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px 100px' }}>
      
      <div className="flex align-center gap-2" style={{ marginBottom: '12px' }}>
        <span style={{ color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px' }}>My Account</span>
      </div>
      <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Guest Dashboard</h2>

      {successMsg && (
        <div style={{
          backgroundColor: 'rgba(231, 111, 81, 0.1)',
          borderLeft: '4px solid var(--accent)',
          color: 'var(--accent)',
          padding: '16px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '15px',
          marginBottom: '30px',
          fontWeight: '600'
        }}>
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4" style={{ alignItems: 'start' }}>
        
        {/* Left Side: Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '20px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>Profile Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-md)'
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '18px', textAlign: 'center' }}>{currentUser.name}</strong>
              <span style={{ fontSize: '13px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', textAlign: 'center' }}>{currentUser.role} Account</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px', color: 'var(--gray-800)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Full Name</span>
                <strong>{currentUser.name}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>Email Address</span>
                <strong>{currentUser.email}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Bookings History */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '20px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px' }}>Your Reservations</h3>

            {guestBookings.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--gray-500)' }}>
                <p style={{ marginBottom: '16px' }}>You don't have any bookings yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {guestBookings.map(booking => {
                  const isConfirmed = booking.status === 'Confirmed';
                  
                  return (
                    <div key={booking.id} style={{
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--border-radius-md)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--neutral-white)'
                    }}>
                      
                      {/* Top bar with booking reference & status */}
                      <div className="flex justify-between align-center" style={{
                        padding: '12px 20px',
                        backgroundColor: 'var(--gray-100)',
                        borderBottom: '1px solid var(--gray-200)'
                      }}>
                        <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                          Reference: <strong>{booking.id}</strong>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: isConfirmed ? 'rgba(19, 46, 39, 0.1)' : 'rgba(231, 111, 81, 0.1)',
                          color: isConfirmed ? 'var(--primary)' : 'var(--accent)'
                        }}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Content details */}
                      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '16px', color: 'var(--primary)' }}>{booking.villaName}</strong>
                          <span style={{ fontSize: '12.5px', color: 'var(--gray-500)', display: 'block', marginTop: '2px' }}>Uluwatu, Bali</span>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>DATES</div>
                          <strong style={{ fontSize: '14px', color: 'var(--gray-800)' }}>{booking.checkIn} → {booking.checkOut}</strong>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>TOTAL PRICE</div>
                          <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>${booking.totalPrice}</strong>
                        </div>
                      </div>

                      {/* Bottom actions */}
                      {isConfirmed && (
                        <div style={{
                          padding: '12px 20px',
                          borderTop: '1px solid var(--gray-100)',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          backgroundColor: 'var(--neutral-white)'
                        }}>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleCancelClick(booking.id)}
                            style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Ban size={14} /> Cancel Reservation
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Cancel */}
      {cancellingId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(19, 46, 39, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
            <h4 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '12px' }}>Cancel Reservation?</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '14.5px', marginBottom: '24px' }}>
              Are you sure you want to cancel booking <strong>{cancellingId}</strong>? This action is permanent and will issue a mock refund to your card.
            </p>
            <div className="flex gap-2" style={{ width: '100%' }}>
              <button className="btn btn-secondary" onClick={() => setCancellingId(null)} style={{ flex: 1 }}>No, Keep It</button>
              <button className="btn btn-danger" onClick={confirmCancel} style={{ flex: 1 }}>Yes, Cancel Booking</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
