import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './views/Home';
import VillaDetails from './views/VillaDetails';
import BookingEngine from './views/BookingEngine';
import PaymentGateway from './views/PaymentGateway';
import GuestDashboard from './views/GuestDashboard';
import HostDashboard from './views/HostDashboard';

function AppContent() {
  const { currentView } = useContext(AppContext);
  const [authOpen, setAuthOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onOpenAuth={() => setAuthOpen(true)} />;
      case 'details-sunrise':
      case 'details-sunset':
        return <VillaDetails />;
      case 'booking-sunrise':
      case 'booking-sunset':
        return <BookingEngine onOpenAuth={() => setAuthOpen(true)} />;
      case 'checkout-sunrise':
      case 'checkout-sunset':
        return <PaymentGateway />;
      case 'guest-dashboard':
        return <GuestDashboard />;
      case 'host-dashboard':
        return <HostDashboard />;
      default:
        return <Home onOpenAuth={() => setAuthOpen(true)} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--neutral-light)' }}>
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main style={{ flex: 1 }}>
        {renderView()}
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
