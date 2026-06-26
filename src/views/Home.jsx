import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { getVillaImage } from '../utils/villaHelpers';
import { Calendar, Users, Star, Sparkles, Compass, Shield, Wind } from 'lucide-react';

const VILLA_IDS = ['sunrise', 'sunset'];
const FALLBACK_HUES = { sunrise: 140, sunset: 200 };

export default function Home({ onOpenAuth }) {
  const { setCurrentView, setSelectedVillaId, isDateRangeAvailable, villaConfigs, reviews } = useContext(AppContext);
  
  // Search Widget State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [searchError, setSearchError] = useState('');

  const handleExploreVilla = (villaId) => {
    setSelectedVillaId(villaId);
    setCurrentView(`details-${villaId}`);
  };

  const handleBookVillaDirectly = (villaId) => {
    setSelectedVillaId(villaId);
    setCurrentView(`booking-${villaId}`);
  };

  const handleSearchAvailability = (e) => {
    e.preventDefault();
    setSearchError('');

    if (!checkIn || !checkOut) {
      setSearchError('Please select both Check-In and Check-Out dates.');
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (start < today) {
      setSearchError('Check-in date cannot be in the past.');
      return;
    }

    if (start >= end) {
      setSearchError('Check-out date must be after check-in.');
      return;
    }

    // Check which villas are available
    const sunriseAvail = isDateRangeAvailable('sunrise', checkIn, checkOut);
    const sunsetAvail = isDateRangeAvailable('sunset', checkIn, checkOut);

    if (!sunriseAvail && !sunsetAvail) {
      setSearchError('Sorry, neither villa is available for those dates. Try other dates.');
    } else {
      // Highlight villas or scroll to section
      const element = document.getElementById('our-villas-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const heroImg = getVillaImage(villaConfigs.sunrise, 130);

  const getReviewStats = (villaId) => {
    const villaReviews = reviews.filter(r => r.villaId === villaId);
    if (!villaReviews.length) return { avg: '5.0', count: 0 };
    const avg = (villaReviews.reduce((s, r) => s + r.rating, 0) / villaReviews.length).toFixed(1);
    return { avg, count: villaReviews.length };
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '100px' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '85vh',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(19, 46, 39, 0.45), rgba(19, 46, 39, 0.75)), url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', color: '#fff', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', backgroundColor: 'rgba(212, 163, 115, 0.25)', border: '1px solid var(--secondary)' }}>
            <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--secondary-light)' }}>Luxury Twin Sanctuary</span>
          </div>
          
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'var(--font-serif)', fontWeight: '700', lineHeight: '1.1' }}>
            Reconnect in the Heart of Bali
          </h1>
          
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--gray-200)', fontWeight: '400', maxWidth: '650px', margin: '0 auto' }}>
            Escape to Sentilow—two gorgeous twin villas in Uluwatu, Bali. Enjoy private pools, curated Balinese hospitality, and breathtaking cliffside views.
          </p>

          {/* Quick Search Widget */}
          <form className="glass" onSubmit={handleSearchAvailability} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 120px auto',
            gap: '16px',
            padding: '24px',
            borderRadius: 'var(--border-radius-lg)',
            marginTop: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
              <label style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '11px' }}>Check In</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  type="date" 
                  className="form-control" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px', backgroundColor: 'transparent', border: '1px solid var(--gray-300)' }} 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
              <label style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '11px' }}>Check Out</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  type="date" 
                  className="form-control" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px', backgroundColor: 'transparent', border: '1px solid var(--gray-300)' }} 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
              <label style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '11px' }}>Guests</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <select 
                  className="form-control" 
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  style={{ width: '100%', paddingLeft: '38px', backgroundColor: 'transparent', border: '1px solid var(--gray-300)', appearance: 'none' }}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0 28px', height: '46px', alignSelf: 'end' }}>
              Check
            </button>
          </form>
          {searchError && (
            <div style={{
              backgroundColor: 'rgba(231, 111, 81, 0.9)',
              color: '#white',
              padding: '10px 16px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '14px',
              alignSelf: 'center',
              fontWeight: '600',
              boxShadow: 'var(--shadow-md)'
            }}>
              {searchError}
            </div>
          )}
        </div>
      </section>

      {/* Overview / Introduction */}
      <section className="container grid grid-cols-2 gap-4 align-center">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span style={{ color: 'var(--secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px' }}>The Twin Experience</span>
          <h2 style={{ fontSize: '36px', lineHeight: '1.2' }}>Sentilow Luxury Twin Villas</h2>
          <p style={{ color: 'var(--gray-800)', fontSize: '16px' }}>
            Built side-by-side in Uluwatu, our matching twin villas combine modern comfort with deep respect for Balinese architecture. They can be rented individually for romantic getaways and small families, or booked together to host up to 8 guests.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass style={{ color: 'var(--secondary)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Uluwatu Location</strong>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Near iconic beaches</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wind style={{ color: 'var(--secondary)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Sea Breeze</strong>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Cliffside elevation</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', height: '400px' }}>
          <img src={heroImg} alt="Bali villa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h4 style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '4px' }}>Uluwatu, Bali</h4>
            <p style={{ fontSize: '13px', color: 'var(--gray-800)' }}>Located just 5 minutes away from Suluban Beach and the magnificent Uluwatu Cliff Temple.</p>
          </div>
        </div>
      </section>

      {/* Villa Showcase Section */}
      <section id="our-villas-section" className="container">
        <h2 className="section-title">Select Your Sanctuary</h2>
        <p className="section-subtitle">Choose from our two exquisite twin villas</p>

        <div className="grid grid-cols-2 gap-4" style={{ marginTop: '40px' }}>
          {VILLA_IDS.map((villaId) => {
            const config = villaConfigs[villaId];
            const stats = getReviewStats(villaId);
            const img = getVillaImage(config, FALLBACK_HUES[villaId]);

            return (
              <div key={villaId} className="card card-hover flex flex-col" style={{ padding: 0 }}>
                <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                  <img src={img} alt={config.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }} className="villa-img-hover" />
                  <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '6px 14px', backgroundColor: 'var(--primary)', color: 'var(--neutral-white)', borderRadius: '30px', fontSize: '12px', fontWeight: '600' }}>
                    {config.tagline}
                  </div>
                </div>

                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                  <div className="flex align-center justify-between">
                    <h3 style={{ fontSize: '24px' }}>{config.name}</h3>
                    <div className="flex align-center gap-1" style={{ color: 'var(--secondary)' }}>
                      <Star size={16} fill="var(--secondary)" />
                      <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary)' }}>{stats.avg}</span>
                      <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>({stats.count} reviews)</span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--gray-800)', fontSize: '14px' }}>
                    {config.shortDescription}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)', padding: '16px 0', fontSize: '13px', color: 'var(--gray-800)' }}>
                    <div><strong>{config.capacity}</strong> Guests max</div>
                    <div style={{ width: '1px', backgroundColor: 'var(--gray-200)' }}></div>
                    <div><strong>{config.bedrooms}</strong> Bedrooms</div>
                    <div style={{ width: '1px', backgroundColor: 'var(--gray-200)' }}></div>
                    <div><strong>{config.baths}</strong> Baths</div>
                    <div style={{ width: '1px', backgroundColor: 'var(--gray-200)' }}></div>
                    <div><strong>{config.poolType?.split(' ')[0]}</strong> Pool</div>
                  </div>

                  <div className="flex align-center justify-between" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>${config.price}</span>
                      <span style={{ fontSize: '14px', color: 'var(--gray-500)' }}> / night</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary" onClick={() => handleExploreVilla(villaId)} style={{ padding: '10px 18px', fontSize: '14px' }}>
                        View Details
                      </button>
                      <button className="btn btn-primary" onClick={() => handleBookVillaDirectly(villaId)} style={{ padding: '10px 18px', fontSize: '14px' }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brand values / Benefits */}
      <section style={{ backgroundColor: 'var(--gray-100)', padding: '80px 0' }}>
        <div className="container">
          <h2 className="section-title">The Sentilow Standard</h2>
          <p className="section-subtitle">Every booking includes world-class amenities and services</p>
          
          <div className="grid grid-cols-3 gap-3" style={{ marginTop: '40px' }}>
            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ color: 'var(--secondary)', backgroundColor: 'rgba(212, 163, 115, 0.1)', padding: '16px', borderRadius: '50%' }}>
                <Star size={28} />
              </div>
              <h4 style={{ fontSize: '20px' }}>Personal Host</h4>
              <p style={{ fontSize: '14px', color: 'var(--gray-800)' }}>Dedicated local manager to arrange transport, tours, dining, and spa services.</p>
            </div>

            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ color: 'var(--secondary)', backgroundColor: 'rgba(212, 163, 115, 0.1)', padding: '16px', borderRadius: '50%' }}>
                <Shield size={28} />
              </div>
              <h4 style={{ fontSize: '20px' }}>24/7 Security</h4>
              <p style={{ fontSize: '14px', color: 'var(--gray-800)' }}>Secure private gated estate with CCTV, security guard, and smart locks.</p>
            </div>

            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <div style={{ color: 'var(--secondary)', backgroundColor: 'rgba(212, 163, 115, 0.1)', padding: '16px', borderRadius: '50%' }}>
                <Sparkles size={28} />
              </div>
              <h4 style={{ fontSize: '20px' }}>Daily Housekeeping</h4>
              <p style={{ fontSize: '14px', color: 'var(--gray-800)' }}>Complimentary cleaning and turndown service to keep your oasis perfect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Embed local style for zoom on hover */}
      <style>{`
        .villa-img-hover:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
