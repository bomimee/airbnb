import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { setCurrentView, contactEmail } = useContext(AppContext);

  return (
    <footer style={{
      backgroundColor: 'var(--primary)',
      color: 'var(--gray-300)',
      padding: '80px 0 40px',
      marginTop: 'auto',
      borderTop: '1px solid var(--primary-light)'
    }}>
      <div className="container grid grid-cols-4 gap-4" style={{ marginBottom: '60px' }}>
        
        {/* Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              backgroundColor: 'var(--neutral-white)',
              color: 'var(--primary)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '15px'
            }}>
              S
            </div>
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '20px', 
              fontWeight: '700', 
              letterSpacing: '1px',
              color: 'var(--neutral-white)'
            }}>
              SENTILOW
            </span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--gray-300)' }}>
            Experience ultra-luxury twin villas in the heart of Bali. Reconnect with nature in our modern sanctuaries designed for peace, privacy, and ocean breeze.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <a href="#instagram" style={{ color: 'var(--secondary)', transition: 'color var(--transition-fast)', display: 'inline-flex' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#facebook" style={{ color: 'var(--secondary)', transition: 'color var(--transition-fast)', display: 'inline-flex' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--neutral-white)', fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '500' }}>Explore</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <li>
              <button 
                onClick={() => setCurrentView('home')} 
                style={{ color: 'var(--gray-300)', textDecoration: 'none', transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0' }}
                onMouseOver={(e) => e.target.style.color = 'var(--secondary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
              >
                Home Page
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setCurrentView('home');
                  setTimeout(() => document.getElementById('our-villas-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                style={{ color: 'var(--gray-300)', textDecoration: 'none', transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0' }}
                onMouseOver={(e) => e.target.style.color = 'var(--secondary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
              >
                Sentilow Sunrise
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setCurrentView('home');
                  setTimeout(() => document.getElementById('our-villas-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }} 
                style={{ color: 'var(--gray-300)', textDecoration: 'none', transition: 'color 0.2s', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0' }}
                onMouseOver={(e) => e.target.style.color = 'var(--secondary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--gray-300)'}
              >
                Sentilow Sunset
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--neutral-white)', fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '500' }}>Contact</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
              <span>Jalan Pantai Suluban, Uluwatu, Pecatu, Bali 80361, Indonesia</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} style={{ color: 'var(--secondary)' }} />
              <span>+62 361 789 2234</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} style={{ color: 'var(--secondary)' }} />
              <span>{contactEmail}</span>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--neutral-white)', fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '500' }}>Policies</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--gray-500)' }}>
            <li>Check-in: 3:00 PM</li>
            <li>Check-out: 11:00 AM</li>
            <li>Cancellation: Free up to 14 days before arrival</li>
            <li>No smoking inside villas</li>
          </ul>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--gray-800)', paddingTop: '30px' }}>
        <div className="container flex align-center justify-between" style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
          <p>&copy; {new Date().getFullYear()} Sentilow Bali. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
