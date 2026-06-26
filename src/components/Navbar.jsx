import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Menu, X, User, LogOut, Calendar, Sliders, ChevronDown, Award } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { currentView, setCurrentView, currentUser, logout } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNav = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-sticky glass" style={{
      borderBottom: '1px solid var(--gray-200)',
      background: 'rgba(250, 248, 245, 0.85)',
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container flex align-center justify-between" style={{ height: '80px' }}>
        {/* Logo */}
        <div 
          onClick={() => handleNav('home')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--secondary)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            S
          </div>
          <div>
            <span style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '22px', 
              fontWeight: '700', 
              letterSpacing: '1px',
              color: 'var(--primary)',
              display: 'block',
              lineHeight: '1'
            }}>
              SENTILOW
            </span>
            <span style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--secondary)',
              fontWeight: '700',
              display: 'block',
              marginTop: '2px'
            }}>
              Bali Twin Villas
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="flex align-center gap-3" style={{ display: 'flex' }}>
          <button 
            className={`btn-text ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
            style={{ color: currentView === 'home' ? 'var(--secondary)' : 'var(--primary)' }}
          >
            Home
          </button>
          
          <button 
            className="btn-text"
            onClick={() => {
              handleNav('home');
              setTimeout(() => {
                const element = document.getElementById('our-villas-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Villas
          </button>

          {/* If user is Host, show Host Dashboard link */}
          {currentUser && currentUser.role === 'host' && (
            <button 
              className={`btn btn-secondary ${currentView === 'host-dashboard' ? 'active' : ''}`}
              onClick={() => handleNav('host-dashboard')}
              style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sliders size={14} /> 관리자
            </button>
          )}

          {/* User Account Controls */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ 
                  padding: '10px 18px', 
                  fontSize: '14px',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  borderRadius: 'var(--border-radius-md)'
                }}
              >
                <User size={16} />
                <span>{currentUser.name}</span>
                <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
              </button>

              {dropdownOpen && (
                <div className="glass animate-fade-in" style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: '0',
                  width: '220px',
                  backgroundColor: 'var(--neutral-white)',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--gray-200)',
                  overflow: 'hidden',
                  zIndex: '150'
                }}>
                  {currentUser.role === 'host' ? (
                    <button 
                      onClick={() => handleNav('host-dashboard')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        borderBottom: '1px solid var(--gray-100)',
                        color: 'var(--primary)'
                      }}
                      className="nav-dropdown-item"
                    >
                      <Sliders size={16} /> 관리자 패널
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleNav('guest-dashboard')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        borderBottom: '1px solid var(--gray-100)',
                        color: 'var(--primary)'
                      }}
                      className="nav-dropdown-item"
                    >
                      <Calendar size={16} /> My Reservations
                    </button>
                  )}

                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: 'var(--accent)'
                    }}
                    className="nav-dropdown-item"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={onOpenAuth}
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button 
          style={{ display: 'none' }} // Checked in media query later, style inline for responsiveness
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="glass flex flex-col gap-2" style={{
          position: 'absolute',
          top: '80px',
          left: '0',
          width: '100%',
          padding: '24px',
          borderBottom: '1px solid var(--gray-200)',
          zIndex: '99',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--neutral-light)'
        }}>
          <button className="btn-text" style={{ textAlign: 'left', padding: '12px 0' }} onClick={() => handleNav('home')}>Home</button>
          <button className="btn-text" style={{ textAlign: 'left', padding: '12px 0' }} onClick={() => { handleNav('home'); setTimeout(() => document.getElementById('our-villas-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Villas</button>
          
          {currentUser ? (
            <>
              {currentUser.role === 'host' ? (
                <button className="btn-text" style={{ textAlign: 'left', padding: '12px 0' }} onClick={() => handleNav('host-dashboard')}>관리자 패널</button>
              ) : (
                <button className="btn-text" style={{ textAlign: 'left', padding: '12px 0' }} onClick={() => handleNav('guest-dashboard')}>My Reservations</button>
              )}
              <div style={{ height: '1px', backgroundColor: 'var(--gray-200)', margin: '12px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <User size={16} /> <strong>{currentUser.name}</strong> ({currentUser.role})
              </div>
              <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}>Sign In</button>
          )}
        </div>
      )}

      {/* Embed responsive css helper for mobile nav */}
      <style>{`
        .nav-dropdown-item:hover {
          background-color: var(--gray-100);
        }
        @media (max-width: 768px) {
          .flex.align-center.gap-3 {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
            color: var(--primary);
          }
        }
      `}</style>
    </nav>
  );
}
